import { Content, ContentTable, ContentText, TableCell } from 'pdfmake/interfaces';
import {
  createHeader,
  createSection,
  formatText,
  getNumberRounded,
  getValue,
  hasValue,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Fa, Faktura } from '../../types/fa1.types';
import { TaxSummaryTypes } from '../../types/tax-summary.types';
import { DEFAULT_TABLE_LAYOUT } from '../../../shared/consts/FA.const';
import i18n from 'i18next';

export function generatePodsumowanieStawekPodatkuVat(faktura: Faktura): Content[] {
  const AnyP13P14_5: boolean =
    hasValue(faktura.Fa?.P_13_1, false) ||
    hasValue(faktura.Fa?.P_13_2, false) ||
    hasValue(faktura.Fa?.P_13_3, false) ||
    hasValue(faktura.Fa?.P_13_4, false) ||
    (hasValue(faktura.Fa?.P_13_5, false) && !hasValue(faktura.Fa?.P_14_5, false)) ||
    hasValue(faktura.Fa?.P_13_6, false) ||
    hasValue(faktura.Fa?.P_13_7, false);
  const AnyP13: boolean =
    hasValue(faktura.Fa?.P_13_1, false) ||
    hasValue(faktura.Fa?.P_13_2, false) ||
    hasValue(faktura.Fa?.P_13_3, false) ||
    hasValue(faktura.Fa?.P_13_4, false) ||
    hasValue(faktura.Fa?.P_13_5, false) ||
    hasValue(faktura.Fa?.P_13_7, false);
  const AnyP_14xW: boolean =
    hasValue(faktura.Fa?.P_14_1W, false) ||
    hasValue(faktura.Fa?.P_14_2W, false) ||
    hasValue(faktura.Fa?.P_14_3W, false) ||
    hasValue(faktura.Fa?.P_14_4W, false);

  let tableBody: TableCell[] = [];
  const table: ContentTable = {
    table: {
      headerRows: 1,
      widths: [],
      body: [] as TableCell[][],
    },
    layout: DEFAULT_TABLE_LAYOUT,
  };

  const definedHeader: Content[] = [
    ...[{ text: i18n.t('invoice.summary.lp'), style: FormatTyp.GrayBoldTitle }],
    ...(AnyP13P14_5 || hasValue(faktura.Fa?.P_14_5, false)
      ? [
          {
            text: i18n.t('invoice.summary.taxRate'),
            style: FormatTyp.GrayBoldTitle,
          },
        ]
      : []),
    ...(AnyP13 ? [{ text: i18n.t('invoice.summary.netAmount'), style: FormatTyp.GrayBoldTitle }] : []),
    ...(AnyP13P14_5 || hasValue(faktura.Fa?.P_14_5, false)
      ? [
          {
            text: i18n.t('invoice.summary.taxAmount'),
            style: FormatTyp.GrayBoldTitle,
          },
        ]
      : []),
    ...(AnyP13 ? [{ text: i18n.t('invoice.summary.grossAmount'), style: FormatTyp.GrayBoldTitle }] : []),
    ...(AnyP_14xW ? [{ text: i18n.t('invoice.summary.taxAmountPLN'), style: FormatTyp.GrayBoldTitle }] : []),
  ];

  const widths: Content[] = [
    ...['auto'],
    ...(AnyP13P14_5 || hasValue(faktura.Fa?.P_14_5, false) ? ['*'] : []),
    ...(AnyP13 ? ['*'] : []),
    ...(AnyP13P14_5 || hasValue(faktura.Fa?.P_14_5, false) ? ['*'] : []),
    ...(AnyP13 ? ['*'] : []),
    ...(AnyP_14xW ? ['*'] : []),
  ];

  if (faktura?.Fa) {
    const summary: TaxSummaryTypes[] = getSummaryTaxRate(faktura.Fa);

    tableBody = summary.map((item: TaxSummaryTypes): (string | number | ContentText)[] => {
      const data: (string | number | ContentText)[] = [];

      data.push(item.no ?? '');
      if (AnyP13P14_5) {
        if (item.taxRateString) {
          data.push(item.taxRateString);
        } else if (getValue(faktura.Fa?.P_13_5)) {
          data.push(i18n.t('invoice.summary.oss'));
        } else {
          data.push('');
        }
      } else if (hasValue(faktura.Fa?.P_14_5, false)) {
        data.push(i18n.t('invoice.summary.oss'));
      }
      if (AnyP13) {
        data.push(formatText(item.net, FormatTyp.Currency));
      }
      if (AnyP13P14_5) {
        data.push(formatText(item.tax, FormatTyp.Currency));
      } else if (hasValue(faktura.Fa?.P_14_5, false)) {
        data.push(getValue(faktura.Fa?.P_14_5) ?? '');
      }
      if (AnyP13) {
        data.push(formatText(item.gross, FormatTyp.Currency));
      }
      if (AnyP_14xW) {
        data.push(formatText(item.taxPLN, FormatTyp.Currency));
      }
      return data;
    });
  }
  table.table.body = [[...definedHeader], ...tableBody] as TableCell[][];
  table.table.widths = [...widths] as never[];

  return tableBody.length
    ? createSection([...createHeader(i18n.t('invoice.summary.sectionHeader'), [0, 0, 0, 8]), table], false)
    : [];
}

export function getSummaryTaxRate(fa: Fa): TaxSummaryTypes[] {
  const summary: TaxSummaryTypes[] = [];

  const AnyP13_1P14_1P14_1W =
    hasValue(fa?.P_13_1, false) || hasValue(fa?.P_14_1, false) || hasValue(fa?.P_14_1W, false);
  const AnyP13_2P14_2P14_2W =
    hasValue(fa?.P_13_2, false) || hasValue(fa?.P_14_2, false) || hasValue(fa?.P_14_2W, false);
  const AnyP13_3P14_3P14_3W =
    hasValue(fa?.P_13_3, false) || hasValue(fa?.P_14_3, false) || hasValue(fa?.P_14_3W, false);
  const AnyP13_4P14_4P14_4W =
    hasValue(fa?.P_13_4, false) || hasValue(fa?.P_14_4, false) || hasValue(fa?.P_14_4W, false);
  const AnyP13_5P14_5 = hasValue(fa?.P_13_5, false) || hasValue(fa?.P_14_5, false);
  const AnyP13_7 = hasValue(fa?.P_13_7, false);
  let no = 1;

  if (AnyP13_1P14_1P14_1W) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_1).toFixed(2),
      gross: (getNumberRounded(fa.P_13_1) + getNumberRounded(fa.P_14_1)).toFixed(2),
      tax: getNumberRounded(fa.P_14_1).toFixed(2),
      taxPLN: getNumberRounded(fa.P_14_1W).toFixed(2),
      taxRateString: i18n.t('invoice.summary.23or22'),
    });
    no++;
  }

  if (AnyP13_2P14_2P14_2W) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_2).toFixed(2),
      gross: (getNumberRounded(fa.P_13_2) + getNumberRounded(fa.P_14_2)).toFixed(2),
      tax: getNumberRounded(fa.P_14_2).toFixed(2),
      taxPLN: getNumberRounded(fa.P_14_2W).toFixed(2),
      taxRateString: i18n.t('invoice.summary.8or7'),
    });
    no++;
  }

  if (AnyP13_3P14_3P14_3W) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_3).toFixed(2),
      gross: (getNumberRounded(fa.P_13_3) + getNumberRounded(fa.P_14_3)).toFixed(2),
      tax: getNumberRounded(fa.P_14_3).toFixed(2),
      taxPLN: getNumberRounded(fa.P_14_3W).toFixed(2),
      taxRateString: i18n.t('invoice.summary.5'),
    });
    no++;
  }

  if (AnyP13_4P14_4P14_4W) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_4).toFixed(2),
      gross: (getNumberRounded(fa.P_13_4) + getNumberRounded(fa.P_14_4)).toFixed(2),
      tax: getNumberRounded(fa.P_14_4).toFixed(2),
      taxPLN: getNumberRounded(fa.P_14_4W).toFixed(2),
      taxRateString: i18n.t('invoice.summary.4or3'),
    });
    no++;
  }

  if (AnyP13_5P14_5) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_5).toFixed(2),
      gross: (getNumberRounded(fa.P_13_5) + getNumberRounded(fa.P_14_5)).toFixed(2),
      tax: getNumberRounded(fa.P_14_5).toFixed(2),
      taxPLN: '',
      taxRateString: getValue(fa.P_14_5) != 0 ? i18n.t('invoice.summary.oss') : '',
    });
    no++;
  }

  if (AnyP13_7) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_7).toFixed(2),
      gross: getNumberRounded(fa.P_13_7).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.taxFree'),
    });
    no++;
  }
  return summary;
}
