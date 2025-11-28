const pm2 = require('pm2');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const serverPath = path.join(rootDir, 'dist', 'api', 'server.cjs');

if (!fs.existsSync(serverPath)) {
  console.error('✗ Nie znaleziono pliku dist/api/server.cjs. Uruchom najpierw "npm run build".');
  process.exit(1);
}

const instances = [
  { name: 'daleto-ksef-pdf-generator-api-1', port: 5052, logDir: path.join(rootDir, 'logs', 'pm2-instance-1') },
  { name: 'daleto-ksef-pdf-generator-api-2', port: 5053, logDir: path.join(rootDir, 'logs', 'pm2-instance-2') },
];

instances.forEach((instance) => {
  fs.mkdirSync(instance.logDir, { recursive: true });
});

pm2.connect((error) => {
  if (error) {
    console.error('✗ Nie udało się połączyć z PM2:', error.message);
    process.exit(2);
  }

  let remaining = instances.length;
  let hasError = false;

  instances.forEach((instance) => {
    pm2.start(
      {
        name: instance.name,
        script: serverPath,
        interpreter: process.execPath,
        interpreterArgs: ['--max-old-space-size=3072'],
        cwd: rootDir,
        env: {
          NODE_ENV: 'production',
          PORT: instance.port.toString(),
          LOG_DIR: instance.logDir,
        },
        out_file: path.join(instance.logDir, 'out.log'),
        error_file: path.join(instance.logDir, 'error.log'),
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        autorestart: true,
        max_memory_restart: '2800M',
      },
      (startErr) => {
        if (startErr) {
          hasError = true;
          console.error(`✗ Błąd przy uruchamianiu ${instance.name}:`, startErr.message);
        } else {
          console.log(`✓ Uruchomiono ${instance.name} na porcie ${instance.port}`);
        }

        remaining -= 1;

        if (remaining === 0) {
          pm2.disconnect();
          if (hasError) {
            process.exit(1);
          } else {
            console.log('\nPM2 status: npx pm2 status');
          }
        }
      }
    );
  });
});
