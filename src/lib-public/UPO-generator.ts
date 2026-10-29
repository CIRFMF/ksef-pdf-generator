import pdfMake from 'pdfmake/build/pdfmake';
import { Upo } from './types/upo-v4_2.types';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle } from '@shared/PDF-functions';
import { generateDokumentUPO } from './generators/UPO4_3/Dokumenty';
import { generateNaglowekUPO } from './generators/UPO4_3/Naglowek';
import { parseXML } from '@shared/XML-parser';
import { Position } from '@shared/enums/common.enum';
import i18n from 'i18next';
import { i18nReady } from './i18n/i18n-init';
import { AdditionalDataTypes } from './types/common.types';
import { generateWatermark } from '@shared/consts/watermark';
import { generateInfo } from '@shared/utils/generate-info';

export async function generatePDFUPO(
  file: File,
  additionalData?: Pick<AdditionalDataTypes, 'watermark' | 'creator'>
): Promise<Blob> {
  const upo = (await parseXML(file)) as Upo;

  await i18nReady;

  const docDefinition: TDocumentDefinitions = {
    info: generateInfo(additionalData?.creator),
    ...generateWatermark(additionalData?.watermark),
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

  return pdfMake.createPdf(docDefinition).getBlob();
}
