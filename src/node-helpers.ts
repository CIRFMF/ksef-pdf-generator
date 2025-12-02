import { xml2js } from 'xml-js';
import { generateFA1 } from './lib-public/FA1-generator';
import { Faktura as Faktura1 } from './lib-public/types/fa1.types';
import { generateFA2 } from './lib-public/FA2-generator';
import { Faktura as Faktura2 } from './lib-public/types/fa2.types';
import { generateFA3 } from './lib-public/FA3-generator';
import { Faktura as Faktura3 } from './lib-public/types/fa3.types';
import { stripPrefixes } from './shared/XML-parser';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { AdditionalDataTypes } from './lib-public/types/common.types';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Upo } from './lib-public/types/upo-v4_2.types';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle } from './shared/PDF-functions';
import { generateNaglowekUPO } from './lib-public/generators/UPO4_2/Naglowek';
import { generateDokumnetUPO } from './lib-public/generators/UPO4_2/Dokumenty';
import { Position } from './shared/enums/common.enum';

// Inicjalizacja pdfmake z czcionkami (wymagane dla Node.js)
pdfMake.vfs = pdfFonts.vfs;

/**
 * Parsuje XML z ciągu znaków (dla Node.js)
 */
export function parseXMLString(xmlString: string): unknown {
  try {
    const jsonDoc = stripPrefixes(xml2js(xmlString, { compact: true }));
    return jsonDoc;
  } catch (error) {
    throw new Error(`Błąd parsowania XML: ${error}`);
  }
}

/**
 * Generuje PDF faktury z ciągu XML (dla Node.js)
 */
export async function generateInvoiceNode(
  xmlString: string,
  additionalData: AdditionalDataTypes
): Promise<Buffer> {
  const xml = parseXMLString(xmlString);
  const wersja: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;

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
    default:
      throw new Error(`Nieobsługiwana wersja faktury: ${wersja}`);
  }

  return new Promise((resolve, reject): void => {
    pdf.getBuffer((buffer: Buffer): void => {
      if (buffer) {
        resolve(buffer);
      } else {
        reject(new Error('Błąd podczas generowania PDF'));
      }
    });
  });
}

/**
 * Generuje PDF UPO z ciągu XML (dla Node.js)
 */
export async function generatePDFUPONode(xmlString: string): Promise<Buffer> {
  const upo = parseXMLString(xmlString) as Upo;
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

  return new Promise((resolve, reject): void => {
    pdfMake.createPdf(docDefinition).getBuffer((buffer: Buffer): void => {
      if (buffer) {
        resolve(buffer);
      } else {
        reject(new Error('Błąd podczas generowania PDF'));
      }
    });
  });
}

