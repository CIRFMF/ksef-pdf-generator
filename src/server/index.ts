import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { generateInvoice } from '../lib-public/generate-invoice';
import { generatePDFUPO } from '../lib-public/UPO-4_2-generators';
import { AdditionalDataTypes } from '../lib-public/types/common.types';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const uploadDir = path.resolve(__dirname, '../../tmp/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
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
 *                 format: binary
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
app.post('/api/generate-invoice', upload.fields([
  { name: 'metadata', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const metadataFile = files['metadata']?.[0];
  const xmlFile = files['file']?.[0];
  try {
    if (!metadataFile || !xmlFile) {
      return res.status(400).json({ error: 'Missing metadata or file' });
    }

    const additionalData: AdditionalDataTypes = JSON.parse(fs.readFileSync(metadataFile.path, 'utf-8'));
    const xmlContent = fs.readFileSync(xmlFile.path, 'utf-8');

    const pdfBuffer = await generateInvoice(xmlContent, additionalData, 'buffer');

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  } finally {
    if (metadataFile) fs.unlinkSync(metadataFile.path);
    if (xmlFile) fs.unlinkSync(xmlFile.path);
  }
});

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
app.post('/api/generate-upo', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
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
    if (xmlFile) fs.unlinkSync(xmlFile.path);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
