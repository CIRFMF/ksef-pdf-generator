import { describe, it, expect } from 'vitest';
import { WorkerPool } from './worker-pool';
import path from 'path';

describe('WorkerPool', () => {
  describe('initialization', () => {
    it('should create pool with default options', () => {
      const pool = new WorkerPool(path.resolve(__dirname, 'worker-bootstrap.cjs'), {});

      expect(pool).toBeInstanceOf(WorkerPool);
    });

    it('should accept custom maxWorkers option', () => {
      const pool = new WorkerPool(path.resolve(__dirname, 'worker-bootstrap.cjs'), { maxWorkers: 2 });

      expect(pool.maxThreads).toBe(2);
    });
  });

  describe('shutdown', () => {
    it('should reject tasks when shutting down', async () => {
      const pool = new WorkerPool(path.resolve(__dirname, 'worker-bootstrap.cjs'), { maxWorkers: 1 });

      // Start shutdown
      const shutdownPromise = pool.shutdown();

      // Try to run a task - should be rejected
      await expect(pool.runTask({ test: 'data' })).rejects.toThrow('shutting down');

      await shutdownPromise;
    });
  });
});
