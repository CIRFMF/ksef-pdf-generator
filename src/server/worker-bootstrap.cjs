// Worker bootstrap that uses jiti to load TypeScript
// This is necessary because worker_threads doesn't natively support TypeScript

const { workerData } = require('worker_threads');

// Initialize jiti for TypeScript support in worker
const { createJiti } = require('jiti');
const jiti = createJiti(__filename, {
    interopDefault: true,
    esmResolve: true,
});

// Load the actual worker script using jiti
const workerPath = workerData?.workerScript || require('path').join(__dirname, 'pdf-worker.ts');
module.exports = jiti(workerPath);
