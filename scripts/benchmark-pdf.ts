import { WorkerPool } from '../src/server/worker-pool';
import type { PdfTaskData } from '../src/server/pdf-worker';
import { generateInvoice } from '../src';
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import type { AdditionalDataTypes } from '../src/lib-public/types/common.types';

const ITERATIONS = 10;
const XML_PATH = path.resolve(__dirname, '../assets/invoice.xml');

// Mock metadata
const metadata: AdditionalDataTypes = {
  nrKSeF: '1234567890',
  qrCode: 'benchmark-qr-code',
  isMobile: false,
};

async function benchmarkNative(xmlContent: string): Promise<number[]> {
  console.log('Starting Native Benchmark (Sequential)...');
  const times: number[] = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();

    await generateInvoice(xmlContent, metadata, 'buffer');
    const end = performance.now();

    times.push(end - start);
    process.stdout.write('.');
  }
  console.log('\nNative Benchmark Finished.');
  return times;
}

async function benchmarkWorkerSequential(xmlContent: string): Promise<number[]> {
  console.log('Starting Worker Benchmark (Sequential)...');

  const workerPool = new WorkerPool<PdfTaskData, Buffer>(
    path.resolve(__dirname, '../src/server/worker-bootstrap.cjs'),
    { maxWorkers: 4 }
  );

  const times: number[] = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();

    await workerPool.runTask({
      type: 'invoice',
      xmlContent,
      additionalData: metadata,
    });
    const end = performance.now();

    times.push(end - start);
    process.stdout.write('.');
  }

  await workerPool.shutdown();
  console.log('\nWorker Benchmark Finished.');
  return times;
}

async function benchmarkWorkerConcurrent(xmlContent: string): Promise<number> {
  console.log(`\nStarting Worker Benchmark (Concurrent - ${ITERATIONS} tasks)...`);

  const workerPool = new WorkerPool<PdfTaskData, Buffer>(
    path.resolve(__dirname, '../src/server/worker-bootstrap.cjs'),
    { maxWorkers: 4 }
  );

  const start = performance.now();
  const promises = [];

  for (let i = 0; i < ITERATIONS; i++) {
    promises.push(
      workerPool.runTask({
        type: 'invoice',
        xmlContent,
        additionalData: metadata,
      })
    );
  }
  await Promise.all(promises);
  const end = performance.now();

  await workerPool.shutdown();
  return end - start;
}

function calculateStats(times: number[]): { avg: number; min: number; max: number; total: number } {
  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { avg, min, max, total: sum };
}

async function main(): Promise<void> {
  try {
    if (!fs.existsSync(XML_PATH)) {
      throw new Error(`XML file not found at ${XML_PATH}`);
    }
    const xmlContent = fs.readFileSync(XML_PATH, 'utf-8');

    console.log(`Loaded XML file (${xmlContent.length} bytes)`);

    const nativeTimes = await benchmarkNative(xmlContent);
    const workerTimes = await benchmarkWorkerSequential(xmlContent);
    const workerConcurrentTotal = await benchmarkWorkerConcurrent(xmlContent);

    const nativeStats = calculateStats(nativeTimes);
    const workerStats = calculateStats(workerTimes);

    console.log('\n--- Results (Sequential) ---');
    console.log(`Iterations: ${ITERATIONS}`);
    console.log('\nNative Implementation:');
    console.log(`  Average: ${nativeStats.avg.toFixed(2)}ms`);
    console.log(`  Min: ${nativeStats.min.toFixed(2)}ms`);
    console.log(`  Max: ${nativeStats.max.toFixed(2)}ms`);
    console.log(`  Total: ${nativeStats.total.toFixed(2)}ms`);

    console.log('\nWorker Implementation (Sequential):');
    console.log(`  Average: ${workerStats.avg.toFixed(2)}ms`);
    console.log(`  Min: ${workerStats.min.toFixed(2)}ms`);
    console.log(`  Max: ${workerStats.max.toFixed(2)}ms`);
    console.log(`  Total: ${workerStats.total.toFixed(2)}ms`);

    console.log('\n--- Concurrent Performance ---');
    console.log(`Worker Concurrent Total Time (${ITERATIONS} tasks): ${workerConcurrentTotal.toFixed(2)}ms`);
    console.log(`Effective Average per task: ${(workerConcurrentTotal / ITERATIONS).toFixed(2)}ms`);

    // Comparison
    console.log('\n--- comparison ---');
    console.log(`Native Total Time: ${nativeStats.total.toFixed(2)}ms`);
    console.log(`Worker Concurrent Total Time: ${workerConcurrentTotal.toFixed(2)}ms`);

    const speedup = nativeStats.total / workerConcurrentTotal;

    console.log(`Concurrent Speedup: ${speedup.toFixed(2)}x`);
  } catch (error) {
    console.error('Benchmark failed:', error);
    process.exit(1);
  }
}

main();
