import { Content, ContentTable, TableCell } from 'pdfmake/interfaces';
import {
  createHeader,
  createSection,
  formatText,
  getNumberRounded,
  getValue,
  hasValue,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Fa, Faktura, FP } from '../../types/fa3.types';
import { TaxSummaryTypes } from '../../types/tax-summary.types';
import i18n from 'i18next';

export function generatePodsumowanieStawekPodatkuVat(faktura: Faktura): Content[] {
  const AnyP13P14_5Diff0 =
    hasValue(faktura.Fa?.P_13_1) ||
    hasValue(faktura.Fa?.P_13_2) ||
    hasValue(faktura.Fa?.P_13_3) ||
    hasValue(faktura.Fa?.P_13_4) ||
    (hasValue(faktura.Fa?.P_13_5) && (!hasValue(faktura.Fa?.P_14_5) || getValue(faktura.Fa?.P_14_5) == 0)) ||
    hasValue(faktura.Fa?.P_13_6_1) ||
    hasValue(faktura.Fa?.P_13_6_2) ||
    hasValue(faktura.Fa?.P_13_6_3) ||
    hasValue(faktura.Fa?.P_13_7) ||
    hasValue(faktura.Fa?.P_13_8) ||
    hasValue(faktura.Fa?.P_13_9) ||
    hasValue(faktura.Fa?.P_13_10) ||
    hasValue(faktura.Fa?.P_13_11);
  const AnyP13 =
    hasValue(faktura.Fa?.P_13_1) ||
    hasValue(faktura.Fa?.P_13_2) ||
    hasValue(faktura.Fa?.P_13_3) ||
    hasValue(faktura.Fa?.P_13_4) ||
    hasValue(faktura.Fa?.P_13_5) ||
    hasValue(faktura.Fa?.P_13_6_1) ||
    hasValue(faktura.Fa?.P_13_6_2) ||
    hasValue(faktura.Fa?.P_13_6_3) ||
    hasValue(faktura.Fa?.P_13_7) ||
    hasValue(faktura.Fa?.P_13_8) ||
    hasValue(faktura.Fa?.P_13_9) ||
    hasValue(faktura.Fa?.P_13_10) ||
    hasValue(faktura.Fa?.P_13_11);
  const AnyP_14xW =
    hasValue(faktura.Fa?.P_14_1W) ||
    hasValue(faktura.Fa?.P_14_2W) ||
    hasValue(faktura.Fa?.P_14_3W) ||
    hasValue(faktura.Fa?.P_14_4W);

  let tableBody: TableCell[] = [];
  const table: ContentTable = {
    table: {
      headerRows: 1,
      widths: [],
      body: [] as TableCell[][],
    },
    layout: {
      hLineWidth: () => 1,
      hLineColor: () => '#BABABA',
      vLineWidth: () => 1,
      vLineColor: () => '#BABABA',
    },
  };

  const definedHeader: Content[] = [
    ...[{ text: i18n.t('invoice.summary.lp'), style: FormatTyp.GrayBoldTitle }],
    ...(AnyP13P14_5Diff0 || hasValue(faktura.Fa?.P_14_5)
      ? [
          {
            text: i18n.t('invoice.summary.taxRate'),
            style: FormatTyp.GrayBoldTitle,
          },
        ]
      : []),
    ...(AnyP13 ? [{ text: i18n.t('invoice.summary.netAmount'), style: FormatTyp.GrayBoldTitle }] : []),
    ...(AnyP13P14_5Diff0 || hasValue(faktura.Fa?.P_14_5)
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
    ...(AnyP13P14_5Diff0 || hasValue(faktura.Fa?.P_14_5) ? ['*'] : []),
    ...(AnyP13 ? ['*'] : []),
    ...(AnyP13P14_5Diff0 || hasValue(faktura.Fa?.P_14_5) ? ['*'] : []),
    ...(AnyP13 ? ['*'] : []),
    ...(AnyP_14xW ? ['*'] : []),
  ];

  if (faktura?.Fa) {
    const summary = getSummaryTaxRate(faktura.Fa);

    tableBody = summary.map((item) => {
      const data = [];

      data.push(item.no);
      if (AnyP13P14_5Diff0) {
        if (item.taxRateString) {
          data.push(item.taxRateString);
        } else if (getValue(faktura.Fa?.P_13_5)) {
          data.push(i18n.t('invoice.summary.oss'));
        } else {
          data.push('');
        }
      } else if (hasValue(faktura.Fa?.P_14_5)) {
        data.push(i18n.t('invoice.summary.oss'));
      }
      if (AnyP13) {
        data.push(formatText(item.net, FormatTyp.Currency));
      }
      if (AnyP13P14_5Diff0) {
        data.push(formatText(item.tax, FormatTyp.Currency));
      } else if (hasValue(faktura.Fa?.P_14_5)) {
        data.push(getValue(faktura.Fa?.P_14_5));
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

  const AnyP13_1P14_1P14_1WDiff0 =
    hasValueAndDiff0(fa?.P_13_1) || hasValueAndDiff0(fa?.P_14_1) || hasValueAndDiff0(fa?.P_14_1W);
  const AnyP13_2P14_2P14_2WDiff0 =
    hasValueAndDiff0(fa?.P_13_2) || hasValueAndDiff0(fa?.P_14_2) || hasValueAndDiff0(fa?.P_14_2W);
  const AnyP13_3P14_3P14_3WDiff0 =
    hasValueAndDiff0(fa?.P_13_3) || hasValueAndDiff0(fa?.P_14_3) || hasValueAndDiff0(fa?.P_14_3W);
  const AnyP13_4P14_4P14_4WDiff0 =
    hasValueAndDiff0(fa?.P_13_4) || hasValueAndDiff0(fa?.P_14_4) || hasValueAndDiff0(fa?.P_14_4W);
  const AnyP13_5P14_5Diff0 = hasValueAndDiff0(fa?.P_13_5) || hasValueAndDiff0(fa?.P_14_5);
  const AnyP13_6_1Diff0 = hasValueAndDiff0(fa?.P_13_6_1);
  const AnyP13_6_2Diff0 = hasValueAndDiff0(fa?.P_13_6_2);
  const AnyP13_6_3Diff0 = hasValueAndDiff0(fa?.P_13_6_3);
  const AnyP13_7Diff0 = hasValueAndDiff0(fa?.P_13_7);
  const AnyP13_8Diff0 = hasValueAndDiff0(fa?.P_13_8);
  const AnyP13_9Diff0 = hasValueAndDiff0(fa?.P_13_9);
  const AnyP13_10Diff0 = hasValueAndDiff0(fa?.P_13_10);
  const AnyP13_11Diff0 = hasValueAndDiff0(fa?.P_13_11);
  let no = 1;

  if (AnyP13_1P14_1P14_1WDiff0) {
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

  if (AnyP13_2P14_2P14_2WDiff0) {
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

  if (AnyP13_3P14_3P14_3WDiff0) {
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

  if (AnyP13_4P14_4P14_4WDiff0) {
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

  if (AnyP13_5P14_5Diff0) {
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

  if (AnyP13_6_1Diff0) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_6_1).toFixed(2),
      gross: getNumberRounded(fa.P_13_6_1).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.0long'),
    });
    no++;
  }

  if (AnyP13_6_2Diff0) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_6_2).toFixed(2),
      gross: getNumberRounded(fa.P_13_6_2).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.0mid'),
    });
    no++;
  }

  if (AnyP13_6_3Diff0) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_6_3).toFixed(2),
      gross: getNumberRounded(fa.P_13_6_3).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.0short'),
    });
    no++;
  }

  if (AnyP13_7Diff0) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_7).toFixed(2),
      gross: getNumberRounded(fa.P_13_7).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.noTax'),
    });
    no++;
  }

  if (AnyP13_8Diff0) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_8).toFixed(2),
      gross: getNumberRounded(fa.P_13_8).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.npExcludingArt100'),
    });
    no++;
  }

  if (AnyP13_9Diff0) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_9).toFixed(2),
      gross: getNumberRounded(fa.P_13_9).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.npBasedArt100'),
    });
    no++;
  }

  if (AnyP13_10Diff0) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_10).toFixed(2),
      gross: getNumberRounded(fa.P_13_10).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.reverseTax'),
    });
    no++;
  }

  if (AnyP13_11Diff0) {
    summary.push({
      no,
      net: getNumberRounded(fa.P_13_11).toFixed(2),
      gross: getNumberRounded(fa.P_13_11).toFixed(2),
      tax: '0.00',
      taxPLN: '',
      taxRateString: i18n.t('invoice.summary.margin'),
    });
    no++;
  }

  return summary;
}

function hasValueAndDiff0(value: FP | string | number | undefined): boolean {
  return hasValue(value) && getValue(value) != 0;
}
