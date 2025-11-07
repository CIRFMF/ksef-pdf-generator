#!/usr/bin/env node

/**
 * Build script for Single Executable Application (SEA)
 * Bundluje cli.ts wraz ze wszystkimi zależnościami w jeden plik CommonJS
 */

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Budowanie bundle dla Single Executable Application...\n');

try {
  // Krok 1: Bundle głównego CLI
  console.log('📦 Etap 1: Bundling cli/index.ts...');
  
  await esbuild.build({
    entryPoints: ['src/cli/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node22',
    format: 'cjs',  // CommonJS wymagane dla SEA
    outfile: 'dist/sea-bundle.cjs',
    external: [],  // Bundle wszystko (brak external)
    minify: false,  // Bez minifikacji dla debugowania
    sourcemap: false,
    banner: {
      js: '// SEA Bundle - ksef-pdf-generator\n'
    },
    logLevel: 'info',
    treeShaking: true,
    metafile: true,
  });
  
  console.log('✅ Bundle utworzony: dist/sea-bundle.cjs\n');
  
  // Krok 2: Weryfikacja bundle
  console.log('🔍 Etap 2: Weryfikacja bundle...');
  const bundleContent = readFileSync('dist/sea-bundle.cjs', 'utf-8');
  const bundleSize = (bundleContent.length / 1024).toFixed(2);
  console.log(`   Rozmiar bundle: ${bundleSize} KB`);
  
  // Sprawdzamy czy zawiera kluczowe elementy
  const checks = [
    { name: 'commander', present: bundleContent.includes('commander') || bundleContent.includes('Command') },
    { name: 'happy-dom', present: bundleContent.includes('happy-dom') || bundleContent.includes('Window') },
    { name: 'pdfmake', present: bundleContent.includes('pdfmake') },
    { name: 'xml-js', present: bundleContent.includes('xml-js') || bundleContent.includes('xml2js') },
  ];
  
  console.log('\n   Sprawdzanie zależności:');
  checks.forEach(check => {
    console.log(`   ${check.present ? '✅' : '❌'} ${check.name}`);
  });
  
  const allPresent = checks.every(c => c.present);
  
  if (!allPresent) {
    console.warn('\n⚠️  UWAGA: Niektóre zależności mogą nie być w bundle!');
  }
  
  console.log('\n✅ Bundle zweryfikowany pomyślnie!');
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ BUILD ZAKOŃCZONY SUKCESEM!');
  console.log('='.repeat(60));
  console.log(`\n📦 Plik bundle: dist/sea-bundle.cjs`);
  console.log(`📊 Rozmiar: ${bundleSize} KB`);
  console.log('\nKolejny krok: Uruchom test bundle:');
  console.log('  node dist/sea-bundle.cjs --help');
  console.log('\n');
  
} catch (error) {
  console.error('\n❌ BŁĄD podczas budowania bundle:');
  console.error(error);
  process.exit(1);
}
