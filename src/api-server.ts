import express, { Request, Response } from 'express';
import { generateFA1 } from './lib-public/FA1-generator';
import { generateFA2 } from './lib-public/FA2-generator';
import { generateFA3 } from './lib-public/FA3-generator';
import { Faktura as Faktura1 } from './lib-public/types/fa1.types';
import { Faktura as Faktura2 } from './lib-public/types/fa2.types';
import { Faktura as Faktura3 } from './lib-public/types/fa3.types';
import { parseXMLFromString } from './shared/XML-parser-node';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { AdditionalDataTypes } from './lib-public/types/common.types';
import pdfMake from 'pdfmake/build/pdfmake';
import { Upo } from './lib-public/types/upo-v4_2.types';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle } from './shared/PDF-functions';
import { generateNaglowekUPO } from './lib-public/generators/UPO4_2/Naglowek';
import { generateDokumnetUPO } from './lib-public/generators/UPO4_2/Dokumenty';
import { Position } from './shared/enums/common.enum';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.text({ type: 'application/xml', limit: '50mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Invoice PDF generation endpoint
app.post('/api/invoice/pdf', async (req: Request, res: Response) => {
  try {
    const { xml, additionalData } = req.body;

    if (!xml) {
      return res.status(400).json({ error: 'XML content is required' });
    }

    const parsedXML: any = parseXMLFromString(xml);
    const wersja = parsedXML?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

    let pdf: TCreatedPdf;

    switch (wersja) {
      case 'FA (1)':
        pdf = generateFA1(parsedXML.Faktura as Faktura1, additionalData as AdditionalDataTypes);
        break;
      case 'FA (2)':
        pdf = generateFA2(parsedXML.Faktura as Faktura2, additionalData as AdditionalDataTypes);
        break;
      case 'FA (3)':
        pdf = generateFA3(parsedXML.Faktura as Faktura3, additionalData as AdditionalDataTypes);
        break;
      default:
        return res.status(400).json({ error: `Unsupported invoice version: ${wersja}` });
    }

    pdf.getBuffer((buffer: Buffer) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
      res.send(buffer);
    });
  } catch (error: any) {
    console.error('Error generating invoice PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF', message: error.message });
  }
});

// UPO PDF generation endpoint
app.post('/api/upo/pdf', async (req: Request, res: Response) => {
  try {
    const { xml } = req.body;

    if (!xml) {
      return res.status(400).json({ error: 'XML content is required' });
    }

    const upo = parseXMLFromString(xml) as Upo;
    const docDefinition: TDocumentDefinitions = {
      content: [generateNaglowekUPO(upo.Potwierdzenie!), generateDokumnetUPO(upo.Potwierdzenie!)],
      ...generateStyle(),
      pageSize: 'A4',
      pageOrientation: 'landscape',
      footer: function (currentPage: number, pageCount: number) {
        return {
          text: currentPage.toString() + ' z ' + pageCount,
          alignment: Position.RIGHT,
          margin: [0, 0, 20, 0],
        };
      },
    };

    pdfMake.createPdf(docDefinition).getBuffer((buffer: Buffer) => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=upo.pdf');
      res.send(buffer);
    });
  } catch (error: any) {
    console.error('Error generating UPO PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF', message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`PDF Generator API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Invoice PDF: POST http://localhost:${PORT}/api/invoice/pdf`);
  console.log(`UPO PDF: POST http://localhost:${PORT}/api/upo/pdf`);
});
