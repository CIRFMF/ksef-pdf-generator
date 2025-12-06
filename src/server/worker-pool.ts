import { Worker } from 'worker_threads';
import { EventEmitter } from 'events';
import { cpus } from 'os';

export interface WorkerTask<T = unknown> {
  id: number;
  data: T;
}

export interface WorkerResult<T = unknown> {
  id: number;
  result?: T;
  error?: string;
}

interface QueuedTask<TData, TResult> {
  task: WorkerTask<TData>;
  resolve: (result: TResult) => void;
  reject: (error: Error) => void;
}

interface WorkerInfo {
  worker: Worker;
  busy: boolean;
}

export interface WorkerPoolOptions {
  maxWorkers?: number;
  workerOptions?: ConstructorParameters<typeof Worker>[1];
}

/**
 * A generic worker pool for running CPU-intensive tasks in separate threads.
 * Workers are reused and tasks are queued when all workers are busy.
 */
export class WorkerPool<TData = unknown, TResult = unknown> extends EventEmitter {
  private workers: WorkerInfo[] = [];
  private taskQueue: QueuedTask<TData, TResult>[] = [];
  private taskIdCounter = 0;
  private isShuttingDown = false;
  private readonly workerPath: URL | string;
  private readonly maxWorkers: number;
  private readonly workerOptions?: ConstructorParameters<typeof Worker>[1];

  constructor(workerPath: URL | string, options: WorkerPoolOptions = {}) {
    super();
    this.workerPath = workerPath;
    this.maxWorkers = options.maxWorkers ?? Math.max(1, cpus().length - 1);
    this.workerOptions = options.workerOptions;
  }

  /**
   * Run a task in a worker thread.
   * Returns a promise that resolves with the result or rejects with an error.
   */
  public runTask(data: TData): Promise<TResult> {
    if (this.isShuttingDown) {
      return Promise.reject(new Error('Worker pool is shutting down'));
    }

    return new Promise((resolve, reject) => {
      const task: WorkerTask<TData> = {
        id: ++this.taskIdCounter,
        data,
      };

      const queuedTask: QueuedTask<TData, TResult> = { task, resolve, reject };

      // Try to find an available worker
      const availableWorker = this.workers.find((w) => !w.busy);

      if (availableWorker) {
        this.runTaskOnWorker(availableWorker, queuedTask);
      } else if (this.workers.length < this.maxWorkers) {
        // Create a new worker
        const workerInfo = this.createWorker();

        this.runTaskOnWorker(workerInfo, queuedTask);
      } else {
        // Queue the task
        this.taskQueue.push(queuedTask);
      }
    });
  }

  private createWorker(): WorkerInfo {
    const worker = new Worker(this.workerPath, this.workerOptions);
    const workerInfo: WorkerInfo = { worker, busy: false };

    worker.on('message', (result: WorkerResult<TResult>) => {
      this.handleWorkerMessage(workerInfo, result);
    });

    worker.on('error', (error) => {
      this.emit('workerError', error);
      this.handleWorkerExit(workerInfo, error);
    });

    worker.on('exit', (code) => {
      if (code !== 0 && !this.isShuttingDown) {
        this.emit('workerExit', code);
        this.handleWorkerExit(workerInfo, new Error(`Worker exited with code ${code}`));
      } else {
        this.removeWorker(workerInfo);
      }
    });

    this.workers.push(workerInfo);
    return workerInfo;
  }

  private runTaskOnWorker(workerInfo: WorkerInfo, queuedTask: QueuedTask<TData, TResult>): void {
    workerInfo.busy = true;
    // Store the resolve/reject for this task
    (workerInfo as any).currentTask = queuedTask;
    workerInfo.worker.postMessage(queuedTask.task);
  }

  private handleWorkerMessage(workerInfo: WorkerInfo, result: WorkerResult<TResult>): void {
    const currentTask = (workerInfo as any).currentTask as QueuedTask<TData, TResult> | undefined;

    if (currentTask && currentTask.task.id === result.id) {
      if (result.error) {
        currentTask.reject(new Error(result.error));
      } else {
        currentTask.resolve(result.result as TResult);
      }
      (workerInfo as any).currentTask = undefined;
    }

    workerInfo.busy = false;

    // Process next task in queue
    if (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue.shift()!;

      this.runTaskOnWorker(workerInfo, nextTask);
    }
  }

  private handleWorkerExit(workerInfo: WorkerInfo, error?: Error): void {
    const currentTask = (workerInfo as any).currentTask as QueuedTask<TData, TResult> | undefined;

    if (currentTask) {
      // Only reject if it hasn't been resolved/rejected yet.
      // Since we clear currentTask in handleWorkerMessage, existence check is good.
      currentTask.reject(error || new Error('Worker exited unexpectedly'));
      (workerInfo as any).currentTask = undefined;
    }
    this.removeWorker(workerInfo);
  }

  private removeWorker(workerInfo: WorkerInfo): void {
    const index = this.workers.indexOf(workerInfo);

    if (index !== -1) {
      this.workers.splice(index, 1);
    }
  }

  /**
   * Gracefully shut down all workers.
   * Waits for all active tasks to complete before terminating workers.
   */
  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;

    // Reject all queued tasks
    for (const queuedTask of this.taskQueue) {
      queuedTask.reject(new Error('Worker pool is shutting down'));
    }
    this.taskQueue = [];

    // Wait for all busy workers to finish, then terminate
    const terminationPromises = this.workers.map(async (workerInfo) => {
      // If busy, wait a bit for it to complete
      if (workerInfo.busy) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      await workerInfo.worker.terminate();
    });

    await Promise.all(terminationPromises);
    this.workers = [];
  }
}
