import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Upo } from './types/upo-v4_2.types';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle } from '../shared/PDF-functions';
import { Position } from '../shared/enums/common.enum';
import { generateDokumentUPO } from './generators/UPO4_3/Dokumenty';
import { generateNaglowekUPO } from './generators/UPO4_3/Naglowek';
import { PdfmakeHtmlRenderer } from 'pdfmake-html-renderer/server';
import { PdfmakeHtmlRendererProps } from 'pdfmake-html-renderer';
import * as baseCss from 'pdfmake-html-renderer/dist/index.css';

pdfMake.vfs = pdfFonts.vfs;

export async function generateUPO(xml: unknown, formatType: 'blob'): Promise<Blob>;
export async function generateUPO(xml: unknown, formatType: 'base64'): Promise<string>;
export async function generateUPO(xml: unknown, formatType: 'html'): Promise<Blob>;
export async function generateUPO(
  xmlstring: unknown,
  formatType: FormatType = 'blob'
): Promise<FormatTypeResult> {
  const upo = xmlstring as Upo;
  const doc: TDocumentDefinitions = {
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

  return new Promise((resolve): void => {
    switch (formatType) {
      case 'html':
        {
          const htmlprops: PdfmakeHtmlRendererProps = {
            document: doc,
            pageShadow: false,
            mode: 'natural',
          };
          const htmlResult = PdfmakeHtmlRenderer.render(htmlprops);
          const body = htmlResult.html;
          const componentCss = htmlResult.css;
          const result =
            '<!DOCTYPE html><html lang="pl">' +
            '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
            '<title>Faktura</title><style>' +
            baseCss +
            '\n' +
            componentCss.code +
            '</style></head><body>' +
            body +
            '</body></html>';

          resolve(new Blob([result], { type: 'text/html' }));
        }
        break;
      case 'blob':
        pdfMake.createPdf(doc).getBlob((blob: Blob): void => {
          resolve(blob);
        });
        break;
      case 'base64':
      default:
        pdfMake.createPdf(doc).getBase64((base64: string): void => {
          resolve(base64);
        });
    }
  });
}

type FormatType = 'blob' | 'base64' | 'html';
type FormatTypeResult = Blob | string;
