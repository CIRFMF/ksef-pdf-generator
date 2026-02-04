import pdfMake from 'pdfmake/build/pdfmake';
import { Upo } from '../lib-public/types/upo-v4_2.types';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle } from '../shared/PDF-functions';
import { parseXMLFromFile } from './xml-parser-fs';
import { Position } from '../shared/enums/common.enum';
import { generateDokumentUPO } from '../lib-public/generators/UPO4_3/Dokumenty';
import { generateNaglowekUPO } from '../lib-public/generators/UPO4_3/Naglowek';
import { writeFileSync } from 'fs';

export async function generateUPOFromFile(
  xmlFilePath: string,
  outputPath?: string
): Promise<string> {
  const upo = parseXMLFromFile(xmlFilePath) as Upo;
  const docDefinition: TDocumentDefinitions = {
    content: [generateNaglowekUPO(upo.Potwierdzenie!), generateDokumentUPO(upo.Potwierdzenie!)],
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
      try {
        const finalOutputPath =
          outputPath || xmlFilePath.replace(/\.xml$/i, '.pdf');
        writeFileSync(finalOutputPath, buffer);
        resolve(finalOutputPath);
      } catch (error) {
        reject(error);
      }
    });
  });
}
