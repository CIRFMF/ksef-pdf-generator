import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSection,
  generateTwoColumns,
  getDifferentColumnsValue,
  getTable,
  getValue,
  hasValue,
} from '../../../shared/PDF-functions';
import { FakturaRR as Fa } from '../../types/FaRR.types';
import FormatTyp from '../../../shared/enums/common.enum';
import i18n from 'i18next';

export function generateSzczegoly(fa: Fa): Content[] {
  const faWiersze = getTable(fa.FakturaRRWiersz);

  const kursWalutyLabel: Content[] = [];

  if (hasValue(fa.KodWaluty) && getValue(fa.KodWaluty) != 'PLN') {
    const Common_KursWaluty = getDifferentColumnsValue('KursWaluty', faWiersze);

    if (Common_KursWaluty.length === 1) {
      kursWalutyLabel.push(
        createLabelText(
          i18n.t('invoice.details.currencyRate'),
          Common_KursWaluty[0].value,
          FormatTyp.Currency6
        )
      );
    }
  }

  const columns1: Content[] = [
    createLabelText(i18n.t('invoice.details.invoiceDateShort'), fa.P_4B, FormatTyp.Date),
    createLabelText(i18n.t('invoice.details.getDate'), fa.P_4A, FormatTyp.Date),
    kursWalutyLabel,
  ].filter((el) => el.length > 0);
  const columns2: Content[] = [createLabelText(i18n.t('invoice.details.place'), fa.P_1M)].filter(
    (el) => el.length > 0
  );

  const table: Content[] = [
    ...createHeader(i18n.t('invoice.details.header')),
    generateTwoColumns(columns1, columns2),
  ];

  return createSection(table, true);
}
