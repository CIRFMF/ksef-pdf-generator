const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const serverEntry = path.join(rootDir, 'dist', 'api', 'server.cjs');
const daemonDir = path.join(rootDir, 'dist', 'api', 'daemon');
const outputExe = path.join(daemonDir, 'ksefpdfgeneratorapi.exe');
const pkgCli = require.resolve('pkg/lib-es5/bin.js');

if (!fs.existsSync(serverEntry)) {
  console.error('✗ Nie znaleziono pliku dist/api/server.cjs. Najpierw uruchom npm run build lub npm run build:server.');
  process.exit(1);
}

fs.mkdirSync(daemonDir, { recursive: true });

try {
  execFileSync(process.execPath, [pkgCli, serverEntry, '--targets', 'node18-win-x64', '--output', outputExe], {
    stdio: 'inherit',
  });
  console.log(`✓ Wygenerowano ${outputExe}`);
} catch (error) {
  console.error('✗ Nie udało się zbudować pliku EXE:', error.message);
  process.exit(1);
}
