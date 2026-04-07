import { generateInvoice, generatePDFUPO } from '../lib-public';
import type { AdditionalDataTypes } from '../lib-public/types/common.types';

export interface InvoiceTaskData {
  type: 'invoice';
  xmlContent: string;
  additionalData: AdditionalDataTypes;
}

export interface UpoTaskData {
  type: 'upo';
  xmlContent: string;
}

export type PdfTaskData = InvoiceTaskData | UpoTaskData;

async function blobToBuffer(blob: Blob): Promise<Buffer> {
  return Buffer.from(await blob.arrayBuffer());
}

export default async function (task: PdfTaskData): Promise<Buffer> {
  try {
    if (task.type === 'invoice') {
      const file = new File([task.xmlContent], 'invoice.xml', { type: 'text/xml' });
      const pdfBlob = await generateInvoice(file, task.additionalData, 'blob');
      return blobToBuffer(pdfBlob);
    } else if (task.type === 'upo') {
      const file = new File([task.xmlContent], 'upo.xml', { type: 'text/xml' });
      const pdfBlob = await generatePDFUPO(file);
      return blobToBuffer(pdfBlob);
    }
    throw new Error('Unknown task type');
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
