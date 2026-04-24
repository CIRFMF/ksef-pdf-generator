import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelTextArray,
  createSection,
  getContentTable,
  getDifferentColumnsValue,
  getTable,
  getTStawkaPodatku,
  getValue,
  normalizeCurrencySeparator,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { FakturaRR as Fa, FP } from '../../types/FaRR.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import i18n from 'i18next';

export function generateWiersze(fa: Fa): Content {
  const table: Content[] = [];
  const faWiersze: Record<string, FP>[] = getTable(fa.FakturaRRWiersz).map(
    (wiersz: Record<string, FP>): Record<string, FP> => {
      if (getValue(wiersz.P_9)) {
        wiersz.P_9._text = i18n.t(getTStawkaPodatku(getValue(wiersz.P_9) as string, 'RR'));
      }
      return { ...wiersz };
    }
  );
  const definedHeaderLp: HeaderDefine[] = [
    {
      name: 'NrWierszaFa',
      title: i18n.t('invoice.additionalInformation.ordinalNumber'),
      format: FormatTyp.Default,
      width: 'auto',
    },
  ];
  const definedHeader1: HeaderDefine[] = [
    { name: 'P_5', title: i18n.t('invoice.rows.name'), format: FormatTyp.Default, width: '*' },
    { name: 'P_6A', title: i18n.t('invoice.rows.unit'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_6B', title: i18n.t('invoice.rows.amount'), format: FormatTyp.Number, width: 'auto' },
    { name: 'P_6C', title: i18n.t('invoice.rows.qualityDesc'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_7', title: i18n.t('invoice.rows.unitPrice'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_8', title: i18n.t('invoice.rows.priceNoZZP'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_9', title: i18n.t('invoice.rows.wageZZP'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_10', title: i18n.t('invoice.rows.costZZP'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_11', title: i18n.t('invoice.rows.valueZZP'), format: FormatTyp.Currency, width: 'auto' },
  ];

  if (getDifferentColumnsValue('KursWaluty', faWiersze).length !== 1) {
    definedHeader1.push({
      name: 'KursWaluty',
      title: i18n.t('invoice.rows.currencyRate'),
      format: FormatTyp.Currency6,
      width: 'auto',
    });
  }
  definedHeader1.push({
    name: 'StanPrzed',
    title: i18n.t('invoice.rows.stateBefore'),
    format: FormatTyp.Boolean,
    width: 'auto',
  });
  const definedHeader2: HeaderDefine[] = [
    { name: 'P_4AA', title: i18n.t('invoice.rows.getDate'), format: FormatTyp.Date, width: 'auto' },
    { name: 'GTIN', title: i18n.t('invoice.rows.gtin'), format: FormatTyp.Default, width: 'auto' },
    { name: 'PKWiU', title: i18n.t('invoice.rows.pkwiu'), format: FormatTyp.Default, width: 'auto' },
    { name: 'CN', title: i18n.t('invoice.rows.cn'), format: FormatTyp.Default, width: 'auto' },
  ];
  let content = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeaderLp, ...definedHeader1, ...definedHeader2],
    faWiersze,
    'auto'
  );

  const opis: Content = {
    stack: [
      {
        stack: [
          createLabelTextArray([
            {
              value: i18n.t('invoice.rows.farmProductCost'),
            },
            {
              value: getValue(fa.P_11_1),
              formatTyp: [FormatTyp.Currency, FormatTyp.Value],
              currency: getValue(fa.KodWaluty)?.toString() ?? '',
            },
            getValue(fa.KodWaluty)?.toString() === 'PLN'
              ? { value: '' }
              : {
                  value: ` (${normalizeCurrencySeparator(getValue(fa.P_11_1W))} PLN)`,
                  formatTyp: [FormatTyp.Currency, FormatTyp.Value, FormatTyp.LabelMargin],
                  currency: getValue(fa.KodWaluty)?.toString() ?? '',
                },
          ]),
        ],
        margin: [0, 0, 0, 8],
      },
      {
        stack: [
          createLabelTextArray([
            {
              value: i18n.t('invoice.rows.lumpSumTaxRefund'),
              formatTyp: [FormatTyp.LabelMargin, FormatTyp.Label],
            },
            {
              value: getValue(fa.P_11_2),
              formatTyp: [FormatTyp.Currency, FormatTyp.Value, FormatTyp.LabelMargin],
              currency: getValue(fa.KodWaluty)?.toString() ?? '',
            },
            getValue(fa.KodWaluty)?.toString() === 'PLN'
              ? { value: '' }
              : {
                  value: ` (${normalizeCurrencySeparator(getValue(fa.P_11_2W))} PLN)`,
                  formatTyp: [FormatTyp.Currency, FormatTyp.Value, FormatTyp.LabelMargin],
                  currency: getValue(fa.KodWaluty)?.toString() ?? '',
                },
          ]),
        ],
        margin: [0, 0, 0, 8],
      },
      {
        stack: [
          createLabelTextArray([
            {
              value: i18n.t('invoice.rows.overallCost'),
              formatTyp: [FormatTyp.LabelGreater, FormatTyp.LabelMargin],
            },
            {
              value: getValue(fa.P_12_1),
              formatTyp: [FormatTyp.Currency, FormatTyp.ValueMedium, FormatTyp.LabelMargin],
              currency: getValue(fa.KodWaluty)?.toString() ?? '',
            },
            getValue(fa.KodWaluty)?.toString() === 'PLN'
              ? { value: '' }
              : {
                  value: ` (${normalizeCurrencySeparator(getValue(fa.P_12_1W))} PLN)`,
                  formatTyp: [FormatTyp.Currency, FormatTyp.ValueMedium, FormatTyp.LabelMargin],
                },
          ]),
        ],
        margin: [0, 0, 0, 8],
      },
      createLabelTextArray([
        { value: i18n.t('invoice.rows.inWords'), formatTyp: [FormatTyp.LabelMargin, FormatTyp.Label] },
        {
          value: getValue(fa.P_12_2),
          formatTyp: [FormatTyp.Value],
        },
      ]),
    ],
    alignment: Position.RIGHT,
    margin: [0, 8, 0, 0],
  };

  if (content.fieldsWithValue.length <= 8 && content.content) {
    table.push(content.content);
  } else {
    content = getContentTable<(typeof faWiersze)[0]>([...definedHeaderLp, ...definedHeader1], faWiersze, '*');
    if (content.content) {
      table.push(content.content);
    }
    content = getContentTable<(typeof faWiersze)[0]>([...definedHeaderLp, ...definedHeader2], faWiersze, '*');
    if (content.content && content.fieldsWithValue.length > 1) {
      table.push('\n');
      table.push(content.content);
    }
  }
  if (table.length < 1) {
    return [];
  }
  return createSection([...createHeader(i18n.t('invoice.rows.header')), ...table, opis], true);
}
