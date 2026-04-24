import { Content, ContentStack, ContentText } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelTextArray,
  createSection,
  formatText,
  getContentTable,
  getDifferentColumnsValue,
  getTable,
  getTStawkaPodatku,
  getValue,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { Procedura, TRodzajFaktury } from '../../../shared/consts/FA.const';
import { Fa, FP } from '../../types/fa1.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { FormContentState } from '../../../shared/types/additional-data.types';
import { addMarza } from '../common/Wiersze';
import i18n from 'i18next';

export function generateWiersze(faVat: Fa): Content {
  const table: Content[] = [];
  const rodzajFaktury: string | number | undefined = getValue(faVat.RodzajFaktury);
  const isP_PMarzy = Boolean(Number(getValue(faVat.Adnotacje?.P_PMarzy)));
  const faWiersze: Record<string, FP>[] = getTable(faVat.FaWiersze?.FaWiersz).map(
    (wiersz: Record<string, FP>): Record<string, FP> => {
      const marza: Record<string, FP> = addMarza(rodzajFaktury, isP_PMarzy, wiersz)!;

      if (getValue(wiersz.P_12)) {
        wiersz.P_12._text = getTStawkaPodatku(getValue(wiersz.P_12) as string, 1);
      }
      return { ...wiersz, ...marza };
    }
  );
  const definedHeaderLp: HeaderDefine[] = [
    { name: 'NrWierszaFa', title: i18n.t('invoice.rows.lp'), format: FormatTyp.Default, width: 'auto' },
  ];
  const definedHeader1: HeaderDefine[] = [
    {
      name: 'UU_ID',
      title: i18n.t('invoice.rows.uniqueRowNumber'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    { name: 'P_7', title: i18n.t('invoice.rows.productName'), format: FormatTyp.Default, width: '*' },
    { name: 'P_9A', title: i18n.t('invoice.rows.netUnitPrice'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_9B', title: i18n.t('invoice.rows.grossUnitPrice'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_8B', title: i18n.t('invoice.rows.quantity'), format: FormatTyp.Number, width: 'auto' },
    { name: 'P_8A', title: i18n.t('invoice.rows.unit'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_10', title: i18n.t('invoice.rows.discount'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_12', title: i18n.t('invoice.rows.taxRate'), format: FormatTyp.Default, width: 'auto' },
    {
      name: 'P_12_XII',
      title: i18n.t('invoice.rows.ossTaxRate'),
      format: FormatTyp.Percentage,
      width: 'auto',
    },
    { name: 'P_11', title: i18n.t('invoice.rows.netSalesValue'), format: FormatTyp.Currency, width: 'auto' },
    {
      name: 'P_11A',
      title: i18n.t('invoice.rows.grossSalesValue'),
      format: FormatTyp.Currency,
      width: 'auto',
    },
  ];

  if (getDifferentColumnsValue('KursWaluty', faWiersze).length !== 1) {
    definedHeader1.push({
      name: 'KursWaluty',
      title: i18n.t('invoice.rows.currencyRate'),
      format: FormatTyp.Currency6,
      width: 'auto',
    });
  }
  const definedHeader2: HeaderDefine[] = [
    { name: 'GTIN', title: i18n.t('invoice.rows.gtin'), format: FormatTyp.Default, width: 'auto' },
    { name: 'PKWiU', title: i18n.t('invoice.rows.pkwiu'), format: FormatTyp.Default, width: 'auto' },
    { name: 'CN', title: i18n.t('invoice.rows.cn'), format: FormatTyp.Default, width: 'auto' },
    { name: 'PKOB', title: i18n.t('invoice.rows.pkob'), format: FormatTyp.Default, width: 'auto' },
    {
      name: 'DodatkoweInfo',
      title: i18n.t('invoice.rows.additionalInfo'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'P_12_Procedura',
      title: i18n.t('invoice.rows.procedure'),
      format: FormatTyp.Default,
      mappingData: Procedura,
      width: '*',
    },
    {
      name: 'KwotaAkcyzy',
      title: i18n.t('invoice.rows.exciseTaxAmount'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    { name: 'GTU', title: i18n.t('invoice.rows.gtu'), format: FormatTyp.Default, width: 'auto' },
    {
      name: 'Procedura',
      title: i18n.t('invoice.rows.procedureMarkings'),
      format: FormatTyp.Default,
      width: '*',
    },
    { name: 'P_6A', title: i18n.t('invoice.rows.deliveryDate'), format: FormatTyp.Default, width: 'auto' },
  ];
  let content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeaderLp, ...definedHeader1, ...definedHeader2],
    faWiersze,
    '*'
  );
  const ceny: string | ContentText = formatText(
    i18n.t('invoice.rows.issuedInCurrency', {
      currency: faVat.KodWaluty?._text,
    }),
    [FormatTyp.Label, FormatTyp.MarginBottom8]
  );

  const p_15: string | number | undefined = getValue(faVat.P_15);
  let opis: ContentStack[] = [];

  if (rodzajFaktury == TRodzajFaktury.ROZ && Number(p_15) !== 0) {
    opis = [
      {
        stack: createLabelTextArray([
          { value: i18n.t('invoice.rows.remainingAmount'), formatTyp: FormatTyp.LabelGreater },
          {
            value: p_15,
            formatTyp: FormatTyp.CurrencyGreater,
            currency: getValue(faVat.KodWaluty)?.toString() ?? '',
          },
        ]),
        alignment: Position.RIGHT,
        margin: [0, 8, 0, 0],
      },
    ];
  } else if (
    (rodzajFaktury == TRodzajFaktury.VAT ||
      rodzajFaktury == TRodzajFaktury.KOR ||
      rodzajFaktury == TRodzajFaktury.KOR_ROZ ||
      rodzajFaktury == TRodzajFaktury.UPR) &&
    Number(p_15) !== 0
  ) {
    opis = [
      {
        stack: createLabelTextArray([
          { value: i18n.t('invoice.rows.totalAmountDue'), formatTyp: FormatTyp.LabelGreater },
          {
            value: p_15,
            formatTyp: [FormatTyp.CurrencyGreater],
            currency: getValue(faVat.KodWaluty)?.toString() ?? '',
          },
        ]),
        alignment: Position.RIGHT,
        margin: [0, 8, 0, 0],
      },
    ];
  }
  if (content.fieldsWithValue.length <= 9 && content.content) {
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
  return createSection([...createHeader(i18n.t('invoice.rows.header')), ceny, ...table, ...opis], true);
}
