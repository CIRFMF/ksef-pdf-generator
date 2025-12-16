import { EventEmitter } from 'events';
import Piscina from 'piscina';
import path from 'node:path';

export interface WorkerPoolOptions {
  maxWorkers?: number;
  workerOptions?: Record<string, any>;
}

/**
 * A wrapper around Piscina to provide a similar interface to the previous custom WorkerPool.
 */
export class WorkerPool<TData = unknown, TResult = unknown> extends EventEmitter {
  private pool: Piscina;
  private isShuttingDown = false;

  constructor(workerPath: string, options: WorkerPoolOptions = {}) {
    super();

    const bootstrapPath = path.resolve(__dirname, 'worker-bootstrap.cjs');

    this.pool = new Piscina({
      filename: bootstrapPath,
      maxThreads: options.maxWorkers,
      workerData: {
        workerScript: workerPath,
      },
      ...options.workerOptions,
    });
  }

  /**
   * Run a task in a worker thread.
   * Returns a promise that resolves with the result or rejects with an error.
   */
  public async runTask(data: TData): Promise<TResult> {
    if (this.isShuttingDown) {
      throw new Error('Worker pool is shutting down');
    }

    try {
      return await this.pool.run(data);
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Gracefully shut down all workers.
   */
  public async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    await this.pool.destroy();
  }

  public get maxThreads(): number {
    return this.pool.options.maxThreads;
  }
}
