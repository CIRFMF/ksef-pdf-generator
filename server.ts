import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Request, Response } from 'express';
import { generateInvoicePdf, generateUpoPdf, closeBrowser } from './src/server/pdfService.js';

const app = express();

// ESM __dirname
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//const __dirname = __dirname;  // CommonJS ma to globalnie


// Body parser - accept XML as text
app.use(bodyParser.text({ type: '*/*', limit: '5mb' }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Invoice PDF generation
app.post('/invoice', async (req: Request, res: Response) => {
  try {
    const xml = req.body as string;
    if (!xml || xml.trim().length === 0) {
      res.status(400).json({ error: 'Empty XML body' });
      return;
    }
	
	// Możesz przekazać nrKSeF przez header
    const additionalData = {
      nrKSeF: req.headers['x-ksef-number'] as string,
      qrCode: req.headers['x-ksef-qrcode'] as string
    };
	
    console.log(`[${new Date().toISOString()}] Generating invoice PDF from XML (${xml.length} bytes)`);
    const pdfBuffer = await generateInvoicePdf(xml, additionalData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(Buffer.from(pdfBuffer));

    console.log(`[${new Date().toISOString()}] Invoice PDF sent (${pdfBuffer.length} bytes)`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Invoice PDF error:`, err);
    res.status(500).json({
      error: 'Invoice PDF generation failed',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

// UPO PDF generation
app.post('/upo', async (req: Request, res: Response) => {
  try {
    const xml = req.body as string;
    if (!xml || xml.trim().length === 0) {
      res.status(400).json({ error: 'Empty XML body' });
      return;
    }

    console.log(`[${new Date().toISOString()}] Generating UPO PDF from XML (${xml.length} bytes)`);
    const pdfBuffer = await generateUpoPdf(xml);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="upo.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(Buffer.from(pdfBuffer));

    console.log(`[${new Date().toISOString()}] UPO PDF sent (${pdfBuffer.length} bytes)`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] UPO PDF error:`, err);
    res.status(500).json({
      error: 'UPO PDF generation failed',
      details: err instanceof Error ? err.message : String(err)
    });
  }
});

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║ KSeF PDF Service started successfully                      ║
║ Listening on http://localhost:${port}                      ║
╠════════════════════════════════════════════════════════════╣
║ Endpoints:                                                 ║
║ - GET  /health      Health check                           ║
║ - POST /invoice     Generate invoice PDF                   ║
║ - POST /upo         Generate UPO PDF                       ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  await closeBrowser();
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  await closeBrowser();
});
