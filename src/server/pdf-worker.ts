import { isMainThread, parentPort } from 'worker_threads';
import type { WorkerResult, WorkerTask } from './worker-pool';
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

if (!isMainThread && parentPort) {
  parentPort.on('message', async (task: WorkerTask<PdfTaskData>) => {
    const result: WorkerResult<Buffer> = { id: task.id };

    try {
      if (task.data.type === 'invoice') {
        result.result = await generateInvoice(task.data.xmlContent, task.data.additionalData, 'buffer');
      } else if (task.data.type === 'upo') {
        const pdfBlob = await generatePDFUPO(task.data.xmlContent);
        // Convert Blob to Buffer for serialization
        const arrayBuffer = await pdfBlob.arrayBuffer();

        result.result = Buffer.from(arrayBuffer);
      }
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
    }

    parentPort!.postMessage(result);
  });
}
