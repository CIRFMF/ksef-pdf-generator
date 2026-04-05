import path from 'path';
import { chmodSync, readFileSync, writeFileSync } from 'fs';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

function addShebang(): Plugin {
  return {
    name: 'add-shebang',
    writeBundle({ dir }, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          const filePath = path.join(dir!, fileName);
          const content = readFileSync(filePath, 'utf-8');
          writeFileSync(filePath, '#!/usr/bin/env node\n' + content);
          chmodSync(filePath, '755');
        }
      }
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/cli/index.ts'),
      formats: ['es'],
      fileName: () => 'ksef-pdf.js',
    },
    outDir: path.resolve(__dirname, 'dist-cli'),
    emptyOutDir: true,
    rollupOptions: {
      external: (id: string) =>
        id.startsWith('node:') || builtinModules.includes(id),
    },
  },
  plugins: [addShebang()],
});
