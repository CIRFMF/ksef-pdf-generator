import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { cpus } from 'os';
import path from 'path';
import { AdditionalDataTypes } from '../lib-public/types/common.types';
import { AdditionalDataSchema } from './validation';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { WorkerPool } from './worker-pool';
import type { PdfTaskData } from './pdf-worker';

const pdfWorkerPool = new WorkerPool<PdfTaskData, Buffer>(path.resolve(__dirname, 'worker-bootstrap.cjs'), {
  maxWorkers: Math.max(1, cpus().length - 1),
});

export const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    // Basic MIME type check (not bulletproof, but a good first line of defense)
    if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only XML is allowed.'));
    }
  },
});

/**
 * @swagger
 * /api/generate-invoice:
 *   post:
 *     summary: Generate an invoice PDF from an XML file and metadata
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               metadata:
 *                 type: string
 *                 description: JSON string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The generated PDF invoice
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Missing metadata or file
 *       500:
 *         description: Something went wrong
 */
app.post(
  '/api/generate-invoice',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Missing XML file' });
      }
      if (!req.body.metadata) {
        return res.status(400).json({ error: 'Missing metadata' });
      }

      let additionalData: AdditionalDataTypes;

      try {
        const parsed = JSON.parse(req.body.metadata);

        additionalData = AdditionalDataSchema.parse(parsed);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            error:
              'Validation error: ' + error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
          });
        }
        return res.status(400).json({ error: 'Invalid JSON format in metadata ' + error });
      }

      const xmlContent = req.file.buffer.toString('utf-8');
      const result = await pdfWorkerPool.runTask({
        type: 'invoice',
        xmlContent,
        additionalData,
      });
      const pdfBuffer = Buffer.from(result);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="' + additionalData.nrKSeF + '.pdf"');
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/generate-upo:
 *   post:
 *     summary: Generate a UPO PDF from an XML file
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
 *     responses:
 *       200:
 *         description: The generated PDF UPO
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Missing file
 *       500:
 *         description: Something went wrong
 */
app.post(
  '/api/generate-upo',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Missing XML file' });
      }

      const xmlContent = req.file.buffer.toString('utf-8');
      const result = await pdfWorkerPool.runTask({
        type: 'upo',
        xmlContent,
      });

      const pdfBuffer = Buffer.from(result);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=upo.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err.message === 'Invalid file type. Only XML is allowed.') {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module || process.env.npm_lifecycle_event === 'start:server') {
  const port = process.env.PORT || 3000; // Use env var for port

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received, shutting down gracefully...`);

    // Shutdown worker pool first
    try {
      await pdfWorkerPool.shutdown();
      console.log('Worker pool shut down');
    } catch (error) {
      console.error('Error shutting down worker pool:', error);
    }

    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
