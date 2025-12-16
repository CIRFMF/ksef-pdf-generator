const { workerData } = require('node:worker_threads');

const workerPath = workerData?.workerScript;
if (!workerPath) {
  throw new Error('Missing workerData.workerScript');
}

if (workerPath.endsWith('.ts')) {
  const { createJiti } = require('jiti');
  const jiti = createJiti(__filename, { interopDefault: true, esmResolve: true });
  module.exports = jiti(workerPath);
} else {
  module.exports = require(workerPath);
}