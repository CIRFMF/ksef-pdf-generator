import { generateFA1 } from './FA1-generator';
import { Faktura as Faktura1 } from './types/fa1.types';
import { generateFA2 } from './FA2-generator';
import { Faktura as Faktura2 } from './types/fa2.types';
import { generateFA3 } from './FA3-generator';
import { Faktura as Faktura3 } from './types/fa3.types';
import { parseXML, parseXMLFromString } from '../shared/XML-parser';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { AdditionalDataTypes } from './types/common.types';

export async function generateInvoice(
  xmlFile: File | string,
  additionalData: AdditionalDataTypes,
  formatType: 'blob'
): Promise<Blob>;
export async function generateInvoice(
  xmlFile: File | string,
  additionalData: AdditionalDataTypes,
  formatType: 'base64'
): Promise<string>;
export async function generateInvoice(
  xmlFile: File | string,
  additionalData: AdditionalDataTypes,
  formatType: 'buffer'
): Promise<Buffer>;
export async function generateInvoice(
  xmlFile: File | string,
  additionalData: AdditionalDataTypes,
  formatType: FormatType = 'blob'
): Promise<FormatTypeResult> {
  let xml: unknown;

  if (typeof xmlFile === 'string') {
    xml = parseXMLFromString(xmlFile);
  } else {
    xml = await parseXML(xmlFile);
  }
  const wersja: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

  let pdf: TCreatedPdf;

  return new Promise((resolve): void => {
    switch (wersja) {
      case 'FA (1)':
        pdf = generateFA1((xml as any).Faktura as Faktura1, additionalData);
        break;
      case 'FA (2)':
        pdf = generateFA2((xml as any).Faktura as Faktura2, additionalData);
        break;
      case 'FA (3)':
        pdf = generateFA3((xml as any).Faktura as Faktura3, additionalData);
        break;
    }
    switch (formatType) {
      case 'blob':
        pdf.getBlob((blob: Blob): void => {
          resolve(blob);
        });
        break;
      case 'buffer':
        pdf.getBuffer((buffer: Buffer): void => {
          resolve(buffer);
        });
        break;
      case 'base64':
      default:
        pdf.getBase64((base64: string): void => {
          resolve(base64);
        });
    }
  });
}

type FormatType = 'blob' | 'base64' | 'buffer';
type FormatTypeResult = Blob | string | Buffer;
