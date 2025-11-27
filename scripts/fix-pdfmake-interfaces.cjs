const fs = require('fs').promises;
const path = require('path');

async function findFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await findFiles(full);
    else if (entry.isFile() && full.endsWith('.ts')) await fixFile(full);
  }
}

async function fixFile(file) {
  let s = await fs.readFile(file, 'utf8');
  const orig = s;
  s = s.replace(/import\s+\{([^}]+)\}\s+from\s+['"]pdfmake\/interfaces['"];?/g, (m, p1) => {
    return `import type {${p1}} from 'pdfmake/interfaces';`;
  });
  s = s.replace(/import\s+\{([^}]+)\}\s+from\s+"pdfmake\/interfaces";?/g, (m, p1) => {
    return `import type {${p1}} from \"pdfmake/interfaces\";`;
  });
  if (s !== orig) {
    await fs.writeFile(file, s, 'utf8');
    console.log('Patched types import in', file);
  }
}

(async () => {
  try {
    await findFiles(path.join(__dirname, '..', 'src'));
    console.log('Done');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
