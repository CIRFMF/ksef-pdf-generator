import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { generateInvoice } from '../lib-public/generate-invoice';
import { generatePDFUPO } from '../lib-public/UPO-4_2-generators';
import { AdditionalDataTypes } from '../lib-public/types/common.types';

const app = express();
const upload = multer();

app.post('/api/generate-invoice', upload.fields([
  { name: 'metadata', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const metadataFile = files['metadata']?.[0];
    const xmlFile = files['file']?.[0];

    if (!metadataFile || !xmlFile) {
      return res.status(400).json({ error: 'Missing metadata or file' });
    }

    const additionalData: AdditionalDataTypes = JSON.parse(metadataFile.buffer.toString());
    const xmlContent = xmlFile.buffer.toString();

    const pdfBuffer = await generateInvoice(xmlContent, additionalData, 'buffer');

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

app.post('/api/generate-upo', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const xmlFile = req.file;

    if (!xmlFile) {
      return res.status(400).json({ error: 'Missing file' });
    }

    const xmlContent = xmlFile.buffer.toString();
    const pdfBuffer = await generatePDFUPO(xmlContent, 'buffer');

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
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
