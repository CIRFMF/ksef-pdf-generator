import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { PdfmakeHtmlRenderer } from 'pdfmake-html-renderer/server';

const require = createRequire(import.meta.url);
const cssPath = require.resolve('pdfmake-html-renderer/dist/index.css');
const baseCss = readFileSync(cssPath, 'utf-8');

export function renderDocDefinitionToHtml(docDefinition) {
  const { html: body, css: componentCss } = PdfmakeHtmlRenderer.render({
    document: docDefinition,
    pageShadow: false,
    mode: 'natural',
  });

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Faktura</title>
<style>${baseCss}\n${componentCss.code}</style>
</head>
<body>${body}</body>
</html>`;
}
