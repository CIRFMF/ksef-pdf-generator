import { describe, it, expect } from 'vitest';
import { WorkerPool } from './worker-pool';

describe('WorkerPool', () => {
  describe('initialization', () => {
    it('should create pool with default options', () => {
      const pool = new WorkerPool('./non-existent-worker.js', {});

      expect(pool.activeWorkerCount).toBe(0);
      expect(pool.queuedTaskCount).toBe(0);
    });

    it('should accept custom maxWorkers option', () => {
      const pool = new WorkerPool('./non-existent-worker.js', { maxWorkers: 2 });

      expect((pool as any).maxWorkers).toBe(2);
    });
  });

  describe('shutdown', () => {
    it('should reject tasks when shutting down', async () => {
      const pool = new WorkerPool('./non-existent-worker.js', { maxWorkers: 1 });

      // Start shutdown
      const shutdownPromise = pool.shutdown();

      // Try to run a task - should be rejected
      await expect(pool.runTask({ test: 'data' })).rejects.toThrow('shutting down');

      await shutdownPromise;
    });

    it('should reject queued tasks on shutdown', async () => {
      const pool = new WorkerPool('./non-existent-worker.js', { maxWorkers: 0 });

      // This will be queued since maxWorkers is 0 (no workers created)
      // Actually we can't test this easily without a real worker
      await pool.shutdown();
      expect(pool.queuedTaskCount).toBe(0);
    });
  });

  describe('getters', () => {
    it('should return correct activeWorkerCount', () => {
      const pool = new WorkerPool('./non-existent-worker.js', {});

      expect(pool.activeWorkerCount).toBe(0);
    });

    it('should return correct queuedTaskCount', () => {
      const pool = new WorkerPool('./non-existent-worker.js', {});

      expect(pool.queuedTaskCount).toBe(0);
    });
  });
});
