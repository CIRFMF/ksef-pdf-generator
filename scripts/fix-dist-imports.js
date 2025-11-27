const fs = require('fs').promises;
const path = require('path');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && full.endsWith('.js')) await fixFile(full);
  }
}

async function fixFile(file) {
  let s = await fs.readFile(file, 'utf8');
  const orig = s;
  // replace import/export from './module' or '../module' etc that don't end with .js or .json
  s = s.replace(/(from\s+['"])(\.\.?\/[^'";]+?)(['"];?)/g, (m, p1, p2, p3) => {
    // if already has extension, skip
    if (/\.(js|json|css|node)$/.test(p2)) return p1 + p2 + p3;
    return p1 + p2 + '.js' + p3;
  });
  // also handle dynamic import("./foo")
  s = s.replace(/(import\(\s*['"])(\.\.?\/[^'"\)]+?)(['"]\s*\))/g, (m, p1, p2, p3) => {
    if (/\.(js|json|css|node)$/.test(p2)) return p1 + p2 + p3;
    return p1 + p2 + '.js' + p3;
  });
  if (s !== orig) {
    await fs.writeFile(file, s, 'utf8');
    console.log('Patched', file);
  }
}

(async () => {
  const root = path.join(__dirname, '..', 'dist');
  try {
    await walk(root);
    console.log('Done');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
