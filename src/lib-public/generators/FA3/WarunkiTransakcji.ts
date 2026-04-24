import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSection,
  createSubHeader,
  formatText,
  generateTwoColumns,
  getContentTable,
  getTable,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { FP, Umowy, WarunkiTransakcji, Zamowienia } from '../../types/fa3.types';
import { generateTransport } from './Transport';
import FormatTyp from '../../../shared/enums/common.enum';
import i18n from 'i18next';

export function generateWarunkiTransakcji(warunkiTransakcji: WarunkiTransakcji | undefined): Content {
  if (!warunkiTransakcji) {
    return [];
  }
  const table: Content[] = [];
  const Kolumny = { umowy: [] as Content[], zamowienia: [] as Content[] };
  const umowy: Umowy[] = getTable(warunkiTransakcji?.Umowy);
  const zamowienia: Zamowienia[] = getTable(warunkiTransakcji?.Zamowienia);
  const partiaTowaru: FP[] = getTable(warunkiTransakcji?.NrPartiiTowaru);
  const definedHeaderUmowy: HeaderDefine[] = [
    { name: 'DataUmowy', title: i18n.t('invoice.transaction.contractDate'), format: FormatTyp.Date },
    { name: 'NrUmowy', title: i18n.t('invoice.transaction.contractNumber'), format: FormatTyp.Default },
  ];
  const definedHeaderZamowienia: HeaderDefine[] = [
    { name: 'DataZamowienia', title: i18n.t('invoice.transaction.orderDate'), format: FormatTyp.Date },
    { name: 'NrZamowienia', title: i18n.t('invoice.transaction.orderNumber'), format: FormatTyp.Default },
  ];
  const definedHeaderPartiaTowaru: HeaderDefine[] = [
    { name: '', title: i18n.t('invoice.transaction.batchNumber'), format: FormatTyp.Default },
  ];

  table.push(createHeader(i18n.t('invoice.transaction.header'), [0, 8, 0, 4]));

  if (umowy.length > 0) {
    const tabUmowy = getContentTable<(typeof umowy)[0]>(definedHeaderUmowy, umowy, '*', undefined, 20);

    if (tabUmowy.content) {
      Kolumny.umowy = [createSubHeader(i18n.t('invoice.transaction.contract')), tabUmowy.content];
    }
  }
  if (zamowienia.length > 0) {
    const tabZamowienia = getContentTable<(typeof zamowienia)[0]>(
      definedHeaderZamowienia,
      zamowienia,
      '*',
      undefined,
      20
    );

    if (tabZamowienia.content && tabZamowienia.fieldsWithValue.length > 0) {
      Kolumny.zamowienia = [createSubHeader(i18n.t('invoice.transaction.order')), tabZamowienia.content];
    }
  }

  if (Kolumny.zamowienia.length > 0 || Kolumny.umowy.length > 0) {
    table.push(generateTwoColumns(Kolumny.umowy, Kolumny.zamowienia, 0, false));
  }
  if (warunkiTransakcji.WalutaUmowna?._text || warunkiTransakcji.KursUmowny?._text) {
    table.push(createHeader(i18n.t('invoice.transaction.currencyAndRate'), [0, 8, 0, 4]));

    table.push(createLabelText(i18n.t('invoice.transaction.currency'), warunkiTransakcji.WalutaUmowna));
    table.push(createLabelText(i18n.t('invoice.transaction.rate'), warunkiTransakcji.KursUmowny));
  }

  if (partiaTowaru.length > 0) {
    const tabPartiaTowaru = getContentTable<(typeof partiaTowaru)[0]>(
      definedHeaderPartiaTowaru,
      partiaTowaru,
      '*',
      [0, 4]
    );

    if (tabPartiaTowaru.content) {
      table.push(generateTwoColumns(tabPartiaTowaru.content, '', 0, false));
    }
  }

  table.push(
    createLabelText(
      i18n.t('invoice.transaction.deliveryTerms'),
      warunkiTransakcji.WarunkiDostawy,
      FormatTyp.MarginTop4
    )
  );

  if (warunkiTransakcji.PodmiotPosredniczacy?._text === '1') {
    table.push(
      formatText(i18n.t('invoice.transaction.intermediaryDelivery'), [FormatTyp.Label, FormatTyp.MarginTop4])
    );
  }

  if (warunkiTransakcji.Transport) {
    getTable(warunkiTransakcji.Transport).forEach((transport, index) => {
      table.push(
        generateTransport(transport, getTable(warunkiTransakcji.Transport).length !== 0 ? index + 1 : null)
      );
    });
  }

  return createSection(table, true);
}
