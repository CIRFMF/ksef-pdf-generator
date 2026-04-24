import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Position } from '../shared/enums/common.enum';
import { generateStyle } from '../shared/PDF-functions';
import { generateDaneFaKorygowanej } from './generators/common/DaneFaKorygowanej';
import { generateRozliczenie } from './generators/common/Rozliczenie';
import { generateStopka } from './generators/common/Stopka';
import { generateDodatkoweInformacje } from './generators/FA_RR/DodatkoweInformacje';
import { generateNaglowek } from './generators/FA_RR/Naglowek';
import { generatePlatnosc } from './generators/FA_RR/Platnosc';
import { generatePodmioty } from './generators/FA_RR/Podmioty';
import { generateSzczegoly } from './generators/FA_RR/Szczegoly';
import { generateWiersze } from './generators/FA_RR/Wiersze';
import { AdditionalDataTypes } from './types/common.types';
import { FaRR } from './types/FaRR.types';
import { generateWatermark } from '@shared/consts/watermark';

pdfMake.vfs = pdfFonts.vfs;

export function generateFARR(invoice: FaRR, additionalData: AdditionalDataTypes): TCreatedPdf {
  const docDefinition: TDocumentDefinitions = {
    ...generateWatermark(additionalData?.watermark),
    content: [
      ...generateNaglowek(invoice.FakturaRR, additionalData),
      generateDaneFaKorygowanej(invoice.FakturaRR),
      ...generatePodmioty(invoice),
      generateSzczegoly(invoice.FakturaRR!),
      generateWiersze(invoice.FakturaRR!),
      generateDodatkoweInformacje(invoice.FakturaRR!),
      generateRozliczenie(invoice.FakturaRR?.Rozliczenie, invoice.FakturaRR?.KodWaluty?._text ?? ''),
      generatePlatnosc(invoice.FakturaRR?.Platnosc),
      ...generateStopka(additionalData, invoice.Stopka, invoice.Naglowek),
    ],
    footer: (currentPage, pageCount) => {
      return {
        text: currentPage.toString() + ' z ' + pageCount,
        alignment: Position.RIGHT,
        margin: [0, 0, 40, 0],
      };
    },
    ...generateStyle(),
  };

  return pdfMake.createPdf(docDefinition);
}
