import { JSDOM } from 'jsdom';

// pdfmake expects browser globals (window, document, navigator) at module load time.
// Provide them via jsdom before importing the library.
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
// navigator is read-only on globalThis in Node 20+; override via property descriptor
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true,
});
globalThis.FileReader = dom.window.FileReader;
// Use jsdom's File/Blob so FileReader.readAsText can consume them
globalThis.File = dom.window.File;
globalThis.Blob = dom.window.Blob;

import { createServer } from 'node:http';
import { generateInvoice } from '../dist/ksef-fe-invoice-converter.js';

const PORT = Number(process.env.PORT) || 3001;

function collectBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  const start = Date.now();
  let status = 200;

  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } else if (req.method === 'POST' && req.url === '/generate') {
      const body = await collectBody(req);

      if (!body.length) {
        status = 400;
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Empty request body' }));
      } else {
        const nrKSeF = req.headers['x-ksef-number'] || '';
        const qrCode = req.headers['x-ksef-qrcode'] || undefined;
        const file = new File([body], 'invoice.xml', { type: 'text/xml' });
        const base64 = await generateInvoice(file, { nrKSeF, qrCode }, 'base64');
        const buffer = Buffer.from(base64, 'base64');

        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': buffer.length,
        });
        res.end(buffer);
      }
    } else {
      status = 404;
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (err) {
    status = 500;
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
  }

  const duration = Date.now() - start;
  console.log(`${req.method} ${req.url} ${status} ${duration}ms`);
});

server.listen(PORT, () => {
  console.log(`ksef-pdf-generator listening on port ${PORT}`);
});
