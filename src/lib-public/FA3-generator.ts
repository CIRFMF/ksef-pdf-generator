import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateStyle, hasValue } from '../shared/PDF-functions.js';
import { TRodzajFaktury } from '../shared/consts/const.js';
import { generateAdnotacje } from './generators/FA3/Adnotacje.js';
import { generateDodatkoweInformacje } from './generators/FA3/DodatkoweInformacje.js';
import { generatePlatnosc } from './generators/FA3/Platnosc.js';
import { generatePodmioty } from './generators/FA3/Podmioty.js';
import { generatePodsumowanieStawekPodatkuVat } from './generators/FA3/PodsumowanieStawekPodatkuVat.js';
import { generateRabat } from './generators/FA3/Rabat.js';
import { generateSzczegoly } from './generators/FA3/Szczegoly.js';
import { generateWarunkiTransakcji } from './generators/FA3/WarunkiTransakcji.js';
import { generateWiersze } from './generators/FA3/Wiersze.js';
import { generateZamowienie } from './generators/FA3/Zamowienie.js';
import { generateDaneFaKorygowanej } from './generators/common/DaneFaKorygowanej.js';
import { generateNaglowek } from './generators/common/Naglowek.js';
import { generateRozliczenie } from './generators/common/Rozliczenie.js';
import { generateStopka } from './generators/common/Stopka.js';
import { Faktura } from './types/fa3.types';
import { ZamowienieKorekta } from './enums/invoice.enums.js';
import { AdditionalDataTypes } from './types/common.types';

pdfMake.vfs = pdfFonts.vfs;

export function generateFA3(invoice: Faktura, additionalData: AdditionalDataTypes): TCreatedPdf {
  const isKOR_RABAT: boolean =
    invoice.Fa?.RodzajFaktury?._text == TRodzajFaktury.KOR && hasValue(invoice.Fa?.OkresFaKorygowanej);
  const rabatOrRowsInvoice: Content = isKOR_RABAT ? generateRabat(invoice.Fa!) : generateWiersze(invoice.Fa!);
  const docDefinition: TDocumentDefinitions = {
    content: [
      ...generateNaglowek(invoice.Fa, additionalData, invoice.Zalacznik),
      generateDaneFaKorygowanej(invoice.Fa),
      ...generatePodmioty(invoice),
      generateSzczegoly(invoice.Fa!),
      rabatOrRowsInvoice,
      generateZamowienie(
        invoice.Fa?.Zamowienie,
        ZamowienieKorekta.Order,
        invoice.Fa?.P_15?._text ?? '',
        invoice.Fa?.RodzajFaktury?._text ?? '',
        invoice.Fa?.KodWaluty?._text ?? ''
      ),
      generatePodsumowanieStawekPodatkuVat(invoice),
      generateAdnotacje(invoice.Fa?.Adnotacje),
      generateDodatkoweInformacje(invoice.Fa!),
      generateRozliczenie(invoice.Fa?.Rozliczenie, invoice.Fa?.KodWaluty?._text ?? ''),
      generatePlatnosc(invoice.Fa?.Platnosc),
      generateWarunkiTransakcji(invoice.Fa?.WarunkiTransakcji),
      ...generateStopka(additionalData, invoice.Stopka, invoice.Naglowek, invoice.Fa?.WZ, invoice.Zalacznik),
    ],
    ...generateStyle(),
  };

  return pdfMake.createPdf(docDefinition);
}
