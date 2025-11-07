// Deklaracja typów dla ksef-pdf-generator.es.js

export function generateInvoice(
  file: File,
  additionalData?: any,
  outputType?: string
): Promise<Blob>;

export function generatePDFUPO(file: File): Promise<Blob>;

export function parseXML(xmlString: string): any;
