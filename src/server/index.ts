import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { generateInvoice } from '../lib-public/generate-invoice';
import { generatePDFUPO } from '../lib-public/UPO-4_2-generators';
import { AdditionalDataTypes } from '../lib-public/types/common.types';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

export const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const uploadDir = path.resolve(__dirname, '../../tmp/uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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
    const xmlFile = req.file;
    const metadataStr = req.body.metadata;

    try {
      if (!metadataStr || !xmlFile) {
        return res.status(400).json({ error: 'Missing metadata or file' });
      }

      let additionalData: AdditionalDataTypes;

      try {
        additionalData = JSON.parse(metadataStr);
      } catch (error) {
        return res.status(400).json({ error: 'Json format error: ' + error });
      }
      const xmlContent = fs.readFileSync(xmlFile.path, 'utf-8');

      const result = await generateInvoice(xmlContent, additionalData, 'buffer');
      const finalPdfBuffer = Buffer.isBuffer(result) ? result : Buffer.from((result as any).data || result);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
      res.send(finalPdfBuffer);
    } catch (error) {
      next(error);
    } finally {
      if (xmlFile) {
        fs.unlinkSync(xmlFile.path);
      }
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
    const xmlFile = req.file;

    try {
      if (!xmlFile) {
        return res.status(400).json({ error: 'Missing file' });
      }

      const xmlContent = fs.readFileSync(xmlFile.path, 'utf-8');
      const pdfBuffer = await generatePDFUPO(xmlContent, 'buffer');

      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    } finally {
      if (xmlFile) {
        fs.unlinkSync(xmlFile.path);
      }
    }
  }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

if (require.main === module) {
  const port = 3000;

  const server = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

  // Graceful shutdown on SIGTERM and SIGINT
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
