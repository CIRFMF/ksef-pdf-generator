import pdfMake from 'pdfmake/build/pdfmake';
import { Upo } from './types/upo-v4_2.types';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle } from '../shared/PDF-functions';
import { generateNaglowekUPO } from './generators/UPO4_2/Naglowek';
import { generateDokumnetUPO } from './generators/UPO4_2/Dokumenty';
import { parseXMLFromString, parseXML } from '../shared/XML-parser';

export async function generatePDFUPO(
  xmlFile: File | string,
  formatType: 'blob'
): Promise<Blob>;
export async function generatePDFUPO(
  xmlFile: File | string,
  formatType: 'buffer'
): Promise<Buffer>;
export async function generatePDFUPO(
  xmlFile: File | string,
  formatType: 'blob' | 'buffer' = 'blob'
): Promise<Blob | Buffer> {
  let upo: Upo;

  if (typeof xmlFile === 'string') {
    upo = parseXMLFromString(xmlFile) as Upo;
  } else {
    upo = (await parseXML(xmlFile)) as Upo;
  }
  const docDefinition: TDocumentDefinitions = {
    content: [
      generateNaglowekUPO(upo.Potwierdzenie!),
      generateDokumnetUPO(upo.Potwierdzenie!),
    ],
    ...generateStyle(),
    pageSize: 'A4',
    pageOrientation: 'landscape',
    footer: function (currentPage: number, pageCount: number) {
      return {
        text: currentPage.toString() + ' z ' + pageCount,
        alignment: 'right',
        margin: [0, 0, 20, 0],
      };
    },
  };

  return new Promise((resolve, reject): void => {
    const pdf = pdfMake.createPdf(docDefinition);
    switch (formatType) {
      case 'blob':
        pdf.getBlob((blob: Blob): void => {
          if (blob) {
            resolve(blob);
          } else {
            reject('Error');
          }
        });
        break;
      case 'buffer':
        pdf.getBuffer((buffer: Buffer): void => {
          if (buffer) {
            resolve(buffer);
          } else {
            reject('Error');
          }
        });
        break;
    }
  });
}
