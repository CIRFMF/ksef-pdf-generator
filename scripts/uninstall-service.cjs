const Service = require('node-windows').Service;
const path = require('path');

console.log('\n⚠️  Odinstalowywanie Windows Service...\n');

// Konfiguracja serwisu do odinstalowania
const svc = new Service({
  name: 'KsefPdfGeneratorAPI',
  description: 'KSEF PDF Generator API Service',
  script: path.join(__dirname, '../dist/api/server.cjs')
});

// Obsługa zdarzeń odinstalowania
svc.on('uninstall', function() {
  console.log('✓ Serwis KsefPdfGeneratorAPI został odinstalowany');
  console.log('✓ Możesz teraz usunąć katalog aplikacji\n');
  process.exit(0);
});

svc.on('error', function(err) {
  console.error('✗ Błąd podczas odinstalowania:', err.message);
  process.exit(1);
});

// Najpierw zatrzymaj serwis, następnie odinstaluj
console.log('Zatrzymywanie serwisu...');
svc.stop();

// Daj chwilę na zatrzymanie się serwisu
setTimeout(function() {
  console.log('Odinstalowywanie serwisu...');
  svc.uninstall();
}, 2000);
