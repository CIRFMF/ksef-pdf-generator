"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pdfService_js_1 = require("./src/server/pdfService.js");
const app = (0, express_1.default)();
// ESM __dirname
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
//const __dirname = __dirname;  // CommonJS ma to globalnie
// Body parser - accept XML as text
app.use(body_parser_1.default.text({ type: '*/*', limit: '5mb' }));
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Invoice PDF generation
app.post('/invoice', async (req, res) => {
    try {
        const xml = req.body;
        if (!xml || xml.trim().length === 0) {
            res.status(400).json({ error: 'Empty XML body' });
            return;
        }
        // Możesz przekazać nrKSeF przez header
        const additionalData = {
            nrKSeF: req.headers['x-ksef-number'],
            qrCode: req.headers['x-ksef-qrcode']
        };
        console.log(`[${new Date().toISOString()}] Generating invoice PDF from XML (${xml.length} bytes)`);
        const pdfBuffer = await (0, pdfService_js_1.generateInvoicePdf)(xml, additionalData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(Buffer.from(pdfBuffer));
        console.log(`[${new Date().toISOString()}] Invoice PDF sent (${pdfBuffer.length} bytes)`);
    }
    catch (err) {
        console.error(`[${new Date().toISOString()}] Invoice PDF error:`, err);
        res.status(500).json({
            error: 'Invoice PDF generation failed',
            details: err instanceof Error ? err.message : String(err)
        });
    }
});
// UPO PDF generation
app.post('/upo', async (req, res) => {
    try {
        const xml = req.body;
        if (!xml || xml.trim().length === 0) {
            res.status(400).json({ error: 'Empty XML body' });
            return;
        }
        console.log(`[${new Date().toISOString()}] Generating UPO PDF from XML (${xml.length} bytes)`);
        const pdfBuffer = await (0, pdfService_js_1.generateUpoPdf)(xml);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="upo.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.send(Buffer.from(pdfBuffer));
        console.log(`[${new Date().toISOString()}] UPO PDF sent (${pdfBuffer.length} bytes)`);
    }
    catch (err) {
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
    await (0, pdfService_js_1.closeBrowser)();
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, closing server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    await (0, pdfService_js_1.closeBrowser)();
});
