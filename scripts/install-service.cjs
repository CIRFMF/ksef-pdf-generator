const Service = require('node-windows').Service;
const path = require('path');
const fs = require('fs');

// Pobierz argumenty z linii poleceń
const args = process.argv.slice(2);
const portArg = args.find(arg => arg.startsWith('--port='));
const logDirArg = args.find(arg => arg.startsWith('--log-dir='));

// Konfiguracja domyślna
const port = portArg ? portArg.split('=')[1] : '5051';
const appDir = path.join(__dirname, '..');
const defaultLogDir = path.join(appDir, 'logs');
const logDir = logDirArg ? logDirArg.split('=')[1] : defaultLogDir;

// Wyświetl konfigurację
console.log('\n📋 Konfiguracja Windows Service:');
console.log(`  Nazwa serwisu: KsefPdfGeneratorAPI`);
console.log(`  Port: ${port}`);
console.log(`  Katalog logów: ${logDir}`);
console.log(`  Katalog aplikacji: ${appDir}\n`);

// Upewnij się, że katalog logów istnieje
if (!fs.existsSync(logDir)) {
  console.log(`📁 Tworzę katalog logów: ${logDir}`);
  fs.mkdirSync(logDir, { recursive: true });
}

// Konfiguracja serwisu
const svc = new Service({
  name: 'KsefPdfGeneratorAPI',
  description: 'KSEF PDF Generator API Service',
  script: path.join(__dirname, '../dist/api/server.cjs'),
  nodeOptions: '--max-old-space-size=2048',
  // Zmienne środowiskowe
  envs: [
    {
      name: 'NODE_ENV',
      value: 'production'
    },
    {
      name: 'PORT',
      value: port
    },
    {
      name: 'LOG_DIR',
      value: logDir
    }
  ]
});

// Obsługa zdarzeń instalacji
svc.on('install', function() {
  console.log('✓ Serwis KsefPdfGeneratorAPI został zainstalowany');
  console.log('✓ Uruchamianie serwisu...');
  svc.start();
});

svc.on('alreadyinstalled', function() {
  console.log('ℹ Serwis jest już zainstalowany');
  process.exit(0);
});

svc.on('start', function() {
  console.log('✓ Serwis KsefPdfGeneratorAPI został uruchomiony');
  console.log(`✓ API dostępne na: http://localhost:${port}`);
  console.log(`✓ Health check: http://localhost:${port}/health`);
  console.log(`✓ Logi znajdują się w: ${logDir}`);
});

svc.on('error', function(err) {
  console.error('✗ Błąd podczas instalacji:', err.message);
  process.exit(1);
});

// Zainstaluj serwis
svc.install();
