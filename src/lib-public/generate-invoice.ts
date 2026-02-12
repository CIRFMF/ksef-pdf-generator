import { buildFA1DocDefinition, generateFA1 } from './FA1-generator';
import { Faktura as Faktura1 } from './types/fa1.types';
import { buildFA2DocDefinition, generateFA2 } from './FA2-generator';
import { Faktura as Faktura2 } from './types/fa2.types';
import { buildFA3DocDefinition, generateFA3 } from './FA3-generator';
import { Faktura as Faktura3 } from './types/fa3.types';
import { parseXML } from '../shared/XML-parser';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { AdditionalDataTypes } from './types/common.types';
import { renderDocDefinitionToHtml } from './render-html';

export async function generateInvoice(
  file: File,
  additionalData: AdditionalDataTypes,
  formatType: 'blob'
): Promise<Blob>;
export async function generateInvoice(
  file: File,
  additionalData: AdditionalDataTypes,
  formatType: 'base64'
): Promise<string>;
export async function generateInvoice(
  file: File,
  additionalData: AdditionalDataTypes,
  formatType: 'html'
): Promise<string>;
export async function generateInvoice(
  file: File,
  additionalData: AdditionalDataTypes,
  formatType: FormatType = 'blob'
): Promise<FormatTypeResult> {
  const xml: unknown = await parseXML(file);
  const wersja: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

  if (formatType === 'html') {
    let docDefinition: TDocumentDefinitions;

    switch (wersja) {
      case 'FA (1)':
        docDefinition = buildFA1DocDefinition((xml as any).Faktura as Faktura1, additionalData);
        break;
      case 'FA (2)':
        docDefinition = buildFA2DocDefinition((xml as any).Faktura as Faktura2, additionalData);
        break;
      case 'FA (3)':
        docDefinition = buildFA3DocDefinition((xml as any).Faktura as Faktura3, additionalData);
        break;
      default:
        throw new Error(`Unsupported invoice version: ${wersja}`);
    }

    return renderDocDefinitionToHtml(docDefinition);
  }

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
      case 'base64':
      default:
        pdf.getBase64((base64: string): void => {
          resolve(base64);
        });
    }
  });
}

type FormatType = 'blob' | 'base64' | 'html';
type FormatTypeResult = Blob | string;
