import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { generateFA1 } from '../lib-public/FA1-generator';
import { generateFA2 } from '../lib-public/FA2-generator';
import { generateFA3 } from '../lib-public/FA3-generator';
import { generateFARR } from '../lib-public/FARR-generator';
import { AdditionalDataTypes } from '../lib-public/types/common.types';
import { Faktura as Faktura1 } from '../lib-public/types/fa1.types';
import { Faktura as Faktura2 } from '../lib-public/types/fa2.types';
import { Faktura as Faktura3 } from '../lib-public/types/fa3.types';
import { FaRR } from '../lib-public/types/FaRR.types';
import { parseXMLFromPath } from './xml-parser';
import { writePDF } from './pdf-writer';

export async function generateInvoiceCLI(
  inputPath: string,
  outputPath: string,
  additionalData: AdditionalDataTypes
): Promise<void> {
  const xml: unknown = parseXMLFromPath(inputPath);
  const wersja: string = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

  let pdf: TCreatedPdf;

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
    default:
      throw new Error(`Unsupported invoice format: "${wersja}"`);
  }

  await writePDF(pdf, outputPath);
}
