import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Attachment } from 'pdfmake/interfaces';
import { generateStyle } from '../shared/PDF-functions';
import { AdditionalDataTypes } from './types/common.types';
import { FaRR } from './types/FaRR.types';
import { generateNaglowek } from './generators/FA_RR/Naglowek';
import { generatePodmioty } from './generators/FA_RR/Podmioty';
import { generateDaneFaKorygowanej } from './generators/common/DaneFaKorygowanej';
import { generateSzczegoly } from './generators/FA_RR/Szczegoly';
import { generateWiersze } from './generators/FA_RR/Wiersze';
import { generateDodatkoweInformacje } from './generators/FA_RR/DodatkoweInformacje';
import { generateRozliczenie } from './generators/common/Rozliczenie';
import { generatePlatnosc } from './generators/FA_RR/Platnosc';
import { generateStopka } from './generators/common/Stopka';
import { Position } from '../shared/enums/common.enum';

pdfMake.addVirtualFileSystem(pdfFonts);

export function generateFARR(invoice: FaRR, additionalData: AdditionalDataTypes, dataUri?: string, filename?: string, date?: number): TCreatedPdf {
  const docDefinition: TDocumentDefinitions = {
    version: '1.7',
    subset: 'PDF/A-3',
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
    ...(dataUri && { files: { xml: { src: dataUri, name: filename, relationship: 'Data', creationDate: date, modifiedDate: date } as Attachment } })
  };

  return pdfMake.createPdf(docDefinition);
}
