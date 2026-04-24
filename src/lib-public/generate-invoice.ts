import { generateFA1 } from './FA1-generator';
import { Faktura as Faktura1 } from './types/fa1.types';
import { generateFA2 } from './FA2-generator';
import { Faktura as Faktura2 } from './types/fa2.types';
import { generateFA3 } from './FA3-generator';
import { Faktura as Faktura3 } from './types/fa3.types';
import { parseXML } from '../shared/XML-parser';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { AdditionalDataTypes } from './types/common.types';
import { generateFARR } from './FARR-generator';
import { FaRR } from './types/FaRR.types';
import { initI18next } from "./i18n/i18n-init";

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
  formatType: FormatType = 'blob'
): Promise<FormatTypeResult> {
  const xml: unknown = await parseXML(file);
  const wersja: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

  let pdf: TCreatedPdf;

  await initI18next();

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
      case 'FA_RR (1)':
      case 'FA_RR(1)':
        pdf = generateFARR((xml as any).Faktura as FaRR, additionalData);
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

type FormatType = 'blob' | 'base64';
type FormatTypeResult = Blob | string;
