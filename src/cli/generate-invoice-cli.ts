import { generateFA1 } from '../lib-public/FA1-generator';
import { Faktura as Faktura1 } from '../lib-public/types/fa1.types';
import { generateFA2 } from '../lib-public/FA2-generator';
import { Faktura as Faktura2 } from '../lib-public/types/fa2.types';
import { generateFA3 } from '../lib-public/FA3-generator';
import { Faktura as Faktura3 } from '../lib-public/types/fa3.types';
import { parseXMLFromFile } from './xml-parser-fs';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { AdditionalDataTypes } from '../lib-public/types/common.types';
import { writeFileSync } from 'fs';
import { resolve, dirname, basename } from 'path';

export async function generateInvoiceFromFile(
  xmlFilePath: string,
  additionalData: AdditionalDataTypes,
  outputPath?: string
): Promise<string> {
  const xml: unknown = parseXMLFromFile(xmlFilePath);
  const wersja: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

  let pdf: TCreatedPdf;

  return new Promise((resolvePath, rejectPath): void => {
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
      default:
        rejectPath(new Error(`Nieobsługiwana wersja faktury: ${wersja}`));
        return;
    }

    pdf.getBuffer((buffer: Buffer): void => {
      try {
        const finalOutputPath =
          outputPath || xmlFilePath.replace(/\.xml$/i, '.pdf');
        writeFileSync(finalOutputPath, buffer);
        resolvePath(finalOutputPath);
      } catch (error) {
        rejectPath(error);
      }
    });
  });
}
