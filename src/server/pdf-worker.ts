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

export default async function (task: PdfTaskData): Promise<Buffer> {
  try {
    if (task.type === 'invoice') {
      return await generateInvoice(task.xmlContent, task.additionalData, 'buffer');
    } else if (task.type === 'upo') {
      const file = new File([task.xmlContent], 'upo.xml', { type: 'text/xml' });
      const pdfBlob = await generatePDFUPO(file);
      // Convert Blob to Buffer for serialization
      const arrayBuffer = await pdfBlob.arrayBuffer();

      return Buffer.from(arrayBuffer);
    }
    throw new Error('Unknown task type');
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
}
