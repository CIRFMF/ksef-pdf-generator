import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSection,
  formatText,
  generateTwoColumns,
  getContentTable,
  getTable,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { Fa } from '../../types/fa2.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { FP } from '../../types/fa1.types';
import i18n from 'i18next';

export function generateRabat(invoice: Fa): Content[] {
  const faRows: Record<string, FP>[] = getTable(invoice!.FaWiersz);
  const result: Content[] = [];
  const definedHeaderLp: HeaderDefine[] = [
    { name: 'NrWierszaFa', title: i18n.t('invoice.discount.lp'), format: FormatTyp.Default, width: 'auto' },
  ];

  const definedHeader1: HeaderDefine[] = [
    { name: 'P_7', title: i18n.t('invoice.discount.productName'), format: FormatTyp.Default, width: '*' },
    {
      name: 'P_9A',
      title: i18n.t('invoice.discount.netUnitPrice'),
      format: FormatTyp.Currency,
      width: 'auto',
    },
    {
      name: 'P_9B',
      title: i18n.t('invoice.discount.grossUnitPrice'),
      format: FormatTyp.Currency,
      width: 'auto',
    },
    { name: 'P_8B', title: i18n.t('invoice.discount.quantity'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_8A', title: i18n.t('invoice.discount.unit'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_10', title: i18n.t('invoice.discount.discount'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_12', title: i18n.t('invoice.discount.taxRate'), format: FormatTyp.Default, width: 'auto' },
    {
      name: 'P_12_XII',
      title: i18n.t('invoice.discount.ossTaxRate'),
      format: FormatTyp.Percentage,
      width: 'auto',
    },
    {
      name: 'P_12_Zal_15',
      title: i18n.t('invoice.discount.productMarker'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'P_11',
      title: i18n.t('invoice.discount.netSalesValue'),
      format: FormatTyp.Currency,
      width: 'auto',
    },
    {
      name: 'P_11A',
      title: i18n.t('invoice.discount.grossSalesValue'),
      format: FormatTyp.Currency,
      width: 'auto',
    },
    {
      name: 'KursWaluty',
      title: i18n.t('invoice.discount.currencyRate'),
      format: FormatTyp.Currency6,
      width: 'auto',
    },
  ];

  const definedHeader2: HeaderDefine[] = [
    { name: 'GTIN', title: i18n.t('invoice.discount.gtin'), format: FormatTyp.Default, width: 'auto' },
    { name: 'PKWiU', title: i18n.t('invoice.discount.pkwiu'), format: FormatTyp.Default, width: 'auto' },
    { name: 'CN', title: i18n.t('invoice.discount.cn'), format: FormatTyp.Default, width: 'auto' },
    { name: 'PKOB', title: i18n.t('invoice.discount.pkob'), format: FormatTyp.Default, width: 'auto' },
    {
      name: 'KwotaAkcyzy',
      title: i18n.t('invoice.discount.exciseTaxAmount'),
      format: FormatTyp.Currency,
      width: 'auto',
    },
    { name: 'GTU', title: i18n.t('invoice.discount.gtu'), format: FormatTyp.Default, width: 'auto' },
    { name: 'Procedura', title: i18n.t('invoice.discount.procedure'), format: FormatTyp.Default, width: '*' },
    { name: 'P_6A', title: i18n.t('invoice.discount.getOrMakeDate'), format: FormatTyp.Date, width: 'auto' },
    { name: 'Indeks', title: i18n.t('invoice.discount.index'), format: FormatTyp.Default, width: 'auto' },
    {
      name: 'UU_ID',
      title: i18n.t('invoice.discount.uuid'),
      format: FormatTyp.Default,
      width: 'auto',
    },
  ];

  let tabRabat = getContentTable<(typeof faRows)[0]>(
    [...definedHeaderLp, ...definedHeader1, ...definedHeader2],
    faRows,
    'auto'
  );

  const isNrWierszaFa: boolean = tabRabat.fieldsWithValue.includes('NrWierszaFa');

  result.push(
    ...createHeader(i18n.t('invoice.discount.header')),
    ...createLabelText(i18n.t('invoice.discount.totalValue'), invoice.P_15, FormatTyp.Currency, {
      alignment: Position.RIGHT,
    }),
    generateTwoColumns(
      formatText(
        i18n.t(isNrWierszaFa ? 'invoice.discount.notAll' : 'invoice.discount.all'),
        FormatTyp.Default
      ),
      ''
    )
  );

  if (tabRabat.fieldsWithValue.length < 1) {
    result.push([]);
  } else if (tabRabat.fieldsWithValue.length <= 8 && tabRabat.content) {
    result.push(tabRabat.content);
  } else {
    tabRabat = getContentTable<(typeof faRows)[0]>([...definedHeaderLp, ...definedHeader1], faRows, '*');
    if (tabRabat.content) {
      result.push(tabRabat.content);
    }
    tabRabat = getContentTable<(typeof faRows)[0]>([...definedHeaderLp, ...definedHeader2], faRows, '*');
    if (tabRabat.content && tabRabat.fieldsWithValue.length > 1) {
      result.push('\n');
      result.push(tabRabat.content);
    }
  }

  return createSection(result, true);
}
