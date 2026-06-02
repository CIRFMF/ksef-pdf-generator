import pdfMake from 'pdfmake/build/pdfmake';
import { Upo } from './types/upo-v4_2.types';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle } from '@shared/PDF-functions';
import { generateDokumentUPO } from './generators/UPO4_3/Dokumenty';
import { generateNaglowekUPO } from './generators/UPO4_3/Naglowek';
import { Position } from '@shared/enums/common.enum';
import i18n from 'i18next';
import { i18nReady } from './i18n/i18n-init';
import { render, PdfmakeHtmlRenderer } from 'pdfmake-html-renderer/server';
import { PdfmakeHtmlRendererProps } from 'pdfmake-html-renderer';

export async function generateUPO(xml: unknown, formatType: 'blob'): Promise<Blob>;
export async function generateUPO(xml: unknown, formatType: 'base64'): Promise<string>;
export async function generateUPO(xml: unknown, formatType: 'html'): Promise<Blob>;
export async function generateUPO(
  xmlstring: unknown,
  formatType: FormatType = 'blob'
): Promise<FormatTypeResult> {
  const upo = xmlstring as Upo;

  await i18nReady;

  const doc: TDocumentDefinitions = {
    content: [generateNaglowekUPO(upo.Potwierdzenie!), generateDokumentUPO(upo.Potwierdzenie!)],
    ...generateStyle(),
    pageSize: 'A4',
    pageOrientation: 'landscape',
    footer: function (currentPage: number, pageCount: number) {
      return {
        text: `${currentPage.toString()} ${i18n.t('invoice.footer.pagesTotal')} ${pageCount}`,
        alignment: Position.RIGHT,
        margin: [0, 0, 20, 0],
      };
    },
  };

  switch (formatType) {
    case 'html':
      {
        const htmlprops: PdfmakeHtmlRendererProps = {
          document: doc,
          pageShadow: false,
          mode: 'natural',
        };
        const { body, head } = render(PdfmakeHtmlRenderer, { props: htmlprops });
        const result =
          '<!DOCTYPE html><html lang="pl">' +
          '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
          '<title>UPO</title>' +
          head +
          '</head><body>' +
          body +
          '</body></html>';

        return new Blob([result], { type: 'text/html' });
      }
      break;
    case 'blob':
      return pdfMake.createPdf(doc).getBlob();
      break;
    case 'base64':
    default:
      return pdfMake.createPdf(doc).getBase64();
      break;
  }
}
type FormatType = 'blob' | 'base64' | 'html';
type FormatTypeResult = Blob | string;
  