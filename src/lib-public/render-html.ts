import { TDocumentDefinitions } from 'pdfmake/interfaces';

export async function renderDocDefinitionToHtml(docDefinition: TDocumentDefinitions): Promise<string> {
  const { PdfmakeHtmlRenderer } = await import('pdfmake-html-renderer/server');
  const fs = await import('node:fs');
  const nodeModule = await import('node:module');

  // @ts-expect-error -- import.meta.url is available at runtime in Node ESM; TS lib config does not cover it
  const require = nodeModule.createRequire(import.meta.url);
  const cssPath = require.resolve('pdfmake-html-renderer/dist/index.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

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
<style>${css}\n${componentCss.code}</style>
</head>
<body>${body}</body>
</html>`;
}
