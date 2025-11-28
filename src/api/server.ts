import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { generateInvoice } from '../lib-public/generate-invoice.ts';
import { AdditionalDataTypes } from '../lib-public/types/common.types.ts';
import { logger } from './logger.ts';
import { requestLogger, errorHandler, notFoundHandler, RequestWithId } from './middleware.ts';
import { specs } from './swagger.ts';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(requestLogger);

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { swaggerOptions: { url: '/api-docs' } }));
app.get('/api-docs', (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Sprawdzenie, czy API jest aktywne
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: API jest uruchomiony
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req: any, res: any) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Pobierz ostatnie logi
 *     description: Zwraca ostatnie logi API w formacie JSON
 *     tags:
 *       - Logging
 *     parameters:
 *       - name: lines
 *         in: query
 *         description: Liczba ostatnich linii do zwrócenia (default 50)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 50
 *           example: 100
 *     responses:
 *       200:
 *         description: Ostatnie logi API
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogResponse'
 *       404:
 *         description: Plik logów nie istnieje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No logs found"
 *       500:
 *         description: Błąd podczas czytania logów
 */
app.get('/logs', (req: any, res: any) => {
  try {
    const lines = req.query.lines ? parseInt(req.query.lines as string) : 50;
    const logFile = logger.getLogFile();

    if (!fs.existsSync(logFile)) {
      return res.status(404).json({
        error: 'No logs found',
        logFile
      });
    }

    const content = fs.readFileSync(logFile, 'utf-8');
    const logLines = content.split('\n').filter(line => line.trim());
    const lastLines = logLines.slice(Math.max(0, logLines.length - lines));

    res.status(200).json({
      timestamp: new Date().toISOString(),
      logFile,
      totalLines: logLines.length,
      displayedLines: lastLines.length,
      logs: lastLines
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to read logs',
      details: String(err)
    });
  }
});


/**
 * @swagger
 * /generate-invoice:
 *   post:
 *     summary: Generuj fakturę PDF
 *     description: Generuje plik PDF z faktury na podstawie danych XML
 *     tags:
 *       - Invoice
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Plik XML z danymi faktury
 *               additionalData:
 *                 type: string
 *                 description: Dodatkowe dane w formacie JSON (np. {"nrKSeF":"123456789012345678","companyLogoBase64":"data:image/png;base64,...."})
 *                 example: '{"nrKSeF":"123456789012345678","companyLogoBase64":"data:image/png;base64,BASE64_LOGO"}'
 *             required:
 *               - file
 *               - additionalData
 *     responses:
 *       200:
 *         description: Plik PDF faktury
 *         content:
 *           application/pdf: {}
 *       400:
 *         description: Błąd w parametrach żądania
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Błąd podczas generowania faktury
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/generate-invoice', upload.single('file'), async (req: any, res: any) => {
  const requestId = req.id;

  try {
    if (!req.file) {
      logger.warn('Request missing file', { requestId });
      return res.status(400).json({ error: 'file is required' });
    }

    logger.debug('Processing invoice generation', {
      requestId,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });

    let additionalData: AdditionalDataTypes = { nrKSeF: '' };
    if (req.body.additionalData) {
      try {
        const parsed = JSON.parse(req.body.additionalData);
        additionalData = { ...additionalData, ...parsed } as AdditionalDataTypes;
      } catch (e) {
        logger.warn('Invalid additionalData JSON', { requestId, error: String(e) });
        return res.status(400).json({ error: 'additionalData must be valid JSON' });
      }
    }

    if (!additionalData.nrKSeF || additionalData.nrKSeF.trim() === '') {
      logger.warn('Missing nrKSeF in additionalData', { requestId });
      return res.status(400).json({ error: 'additionalData.nrKSeF is required and cannot be empty' });
    }

    const buffer: Buffer = req.file.buffer;
    logger.debug('Calling generateInvoice', { requestId, nrKSeF: additionalData.nrKSeF });

    const startTime = Date.now();
    const resultBase64 = (await generateInvoice(buffer as any, additionalData, 'base64')) as string;
    const duration = Date.now() - startTime;

    logger.info('Invoice generated successfully', {
      requestId,
      duration: `${duration}ms`,
      fileName: req.file.originalname,
      nrKSeF: additionalData.nrKSeF
    });

    const pdfBuffer = Buffer.from(resultBase64, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    const rawName = req.file?.originalname || 'invoice';
    const safeName = rawName.replace(/[^0-9A-Za-z._-]/g, '_').slice(0, 120) || 'invoice';
    res.setHeader('Content-Disposition', `attachment; filename=${safeName}.pdf`);
    res.setHeader('Content-Length', String(pdfBuffer.length));
    res.send(pdfBuffer);
  } catch (err) {
    logger.error('Error in /generate-invoice', {
      requestId,
      error: String(err),
      stack: err instanceof Error ? err.stack : undefined
    });
    res.status(500).json({
      error: String(err),
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

const port = process.env.PORT || 3001;

// Obsługa tras które nie istnieją (404)
app.use(notFoundHandler);

// Middleware do obsługi globalnych wyjątków
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`API server started on http://localhost:${port}`);
});

export default app;
