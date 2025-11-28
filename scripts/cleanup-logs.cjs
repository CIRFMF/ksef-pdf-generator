const fs = require('fs');
const path = require('path');

/**
 * Skrypt do czyszczenia starych logów
 * Usuwa logi starsze niż 30 dni
 * 
 * Użycie:
 * node scripts/cleanup-logs.cjs
 * node scripts/cleanup-logs.cjs D:\custom\logs\path
 */

const logDir = process.argv[2] || path.join(__dirname, '..', 'logs');
const daysToKeep = 30;

console.log(`\n🧹 Czyszczenie logów starszych niż ${daysToKeep} dni`);
console.log(`📂 Katalog: ${logDir}\n`);

if (!fs.existsSync(logDir)) {
  console.log('⚠️  Katalog logów nie istnieje. Nic do czyszczenia.');
  process.exit(0);
}

try {
  const files = fs.readdirSync(logDir);
  const logFiles = files.filter(file => file.startsWith('api-') && file.endsWith('.log'));

  if (logFiles.length === 0) {
    console.log('ℹ️  Brak plików logów do czyszczenia.');
    process.exit(0);
  }

  console.log(`📊 Znaleziono ${logFiles.length} plików logów\n`);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  let deletedCount = 0;
  let totalSize = 0;

  logFiles.forEach(file => {
    const filePath = path.join(logDir, file);
    const stats = fs.statSync(filePath);
    const fileDate = new Date(stats.mtime);

    if (fileDate < cutoffDate) {
      const fileSize = (stats.size / 1024).toFixed(2); // KB
      totalSize += stats.size;

      try {
        fs.unlinkSync(filePath);
        console.log(`✓ Usunięto: ${file} (${fileSize} KB, data: ${fileDate.toISOString().split('T')[0]})`);
        deletedCount++;
      } catch (err) {
        console.error(`✗ Błąd przy usuwaniu ${file}: ${err.message}`);
      }
    }
  });

  console.log(`\n✅ Proces czyszczenia ukończony`);
  console.log(`📊 Usunięto ${deletedCount} plików (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`📁 Pozostało ${logFiles.length - deletedCount} plików\n`);

  process.exit(0);
} catch (err) {
  console.error(`✗ Błąd: ${err.message}`);
  process.exit(1);
}
