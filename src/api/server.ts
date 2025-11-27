import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { generateInvoice } from '../lib-public/generate-invoice';
import { AdditionalDataTypes } from '../lib-public/types/common.types';



const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());

app.post('/generate-invoice', upload.single('file'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'file is required' });
    }

    let additionalData: AdditionalDataTypes = { nrKSeF: '' };
    if (req.body.additionalData) {
      try {
        const parsed = JSON.parse(req.body.additionalData);
        additionalData = { ...additionalData, ...parsed } as AdditionalDataTypes;
      } catch (e) {
        return res.status(400).json({ error: 'additionalData must be valid JSON' });
      }
    }

    if (!additionalData.nrKSeF || additionalData.nrKSeF.trim() === '') {
      return res.status(400).json({ error: 'additionalData.nrKSeF is required and cannot be empty' });
    }

    const buffer: Buffer = req.file.buffer;
    // Always request base64 from generateInvoice and return as PDF binary
    const resultBase64 = (await generateInvoice(buffer as any, additionalData, 'base64')) as string;
    const pdfBuffer = Buffer.from(resultBase64, 'base64');
    res.setHeader('Content-Type', 'application/pdf');
    const rawName = req.file?.originalname || 'invoice';
    const safeName = rawName.replace(/[^0-9A-Za-z._-]/g, '_').slice(0, 120) || 'invoice';
    res.setHeader('Content-Disposition', `attachment; filename=${safeName}.pdf`);
    res.setHeader('Content-Length', String(pdfBuffer.length));
    res.send(pdfBuffer);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`);
});

export default app;
