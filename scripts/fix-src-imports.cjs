const fs = require('fs').promises;
const path = require('path');

async function walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory() && !full.includes('node_modules')) await walk(full);
		else if (entry.isFile() && full.endsWith('.ts') && !full.endsWith('.d.ts')) await fixFile(full);
	}
}

async function fixFile(file) {
	let s = await fs.readFile(file, 'utf8');
	const orig = s;
	s = s.replace(/(from\s+['"])(\.\.?\/[^'";]+?)(['"];?)/g, (m, p1, p2, p3) => {
		if (/\.(ts|js|json|css|node)$/.test(p2)) return p1 + p2 + p3;
		return p1 + p2 + '.ts' + p3;
	});
	s = s.replace(/(import\(\s*['"])(\.\.?\/[^'"\)]+?)(['"]\s*\))/g, (m, p1, p2, p3) => {
		if (/\.(ts|js|json|css|node)$/.test(p2)) return p1 + p2 + p3;
		return p1 + p2 + '.ts' + p3;
	});
	if (s !== orig) {
		await fs.writeFile(file, s, 'utf8');
		console.log('Patched', file);
	}
}

(async () => {
	const root = path.join(__dirname, '..', 'src');
	try {
		await walk(root);
		console.log('Done');
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();
