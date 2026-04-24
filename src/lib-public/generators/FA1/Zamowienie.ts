import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelTextArray,
  formatText,
  getContentTable,
  getTable,
  getTStawkaPodatku,
  getValue,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { Procedura, TRodzajFaktury } from '../../../shared/consts/FA.const';
import { FP, Zamowienie } from '../../types/fa1.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { ZamowienieKorekta } from '../../enums/invoice.enums';
import { FormContentState } from '../../../shared/types/additional-data.types';
import i18n from 'i18next';

export function generateZamowienie(
  orderData: Zamowienie | undefined,
  zamowienieKorekta: ZamowienieKorekta,
  p_15: string,
  rodzajFaktury: string,
  KodWaluty: string,
  P_PMarzy?: string
): Content[] {
  if (!orderData) {
    return [];
  }
  const formatAbs: FormatTyp.Currency | FormatTyp.CurrencyAbs =
    zamowienieKorekta === ZamowienieKorekta.BeforeCorrection ? FormatTyp.CurrencyAbs : FormatTyp.Currency;
  const orderTable: Record<string, FP>[] = getTable(orderData?.ZamowienieWiersz).map((el, index) => {
    if (!el.NrWierszaZam._text) {
      el.NrWierszaZam._text = (index + 1).toString();
    }
    el.P_12Z = { _text: getTStawkaPodatku(getValue(el.P_12Z) as string, 1, P_PMarzy) };
    return el;
  });
  const definedHeaderLp: HeaderDefine[] = [
    { name: 'NrWierszaZam', title: i18n.t('invoice.order.lp'), format: FormatTyp.Default, width: 'auto' },
  ];
  const definedHeader1: HeaderDefine[] = [
    { name: 'UU_IDZ', title: i18n.t('invoice.order.uniqueRowNumber'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_7Z', title: i18n.t('invoice.order.productName'), format: FormatTyp.Default, width: '*' },
    {
      name: 'P_9AZ',
      title: i18n.t('invoice.order.netUnitPrice'),
      format: formatAbs,
    },
    { name: 'P_8BZ', title: i18n.t('invoice.order.quantity'), format: FormatTyp.Right, width: 'auto' },
    { name: 'P_8AZ', title: i18n.t('invoice.order.unit'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_12Z', title: i18n.t('invoice.order.taxRate'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_12Z_XII', title: i18n.t('invoice.order.ossTaxRate'), format: FormatTyp.Percentage, width: 'auto' },
    { name: 'P_11NettoZ', title: i18n.t('invoice.order.netSalesValue'), format: formatAbs, width: 'auto' },
    { name: 'P_11VatZ', title: i18n.t('invoice.order.taxAmount'), format: formatAbs, width: 'auto' },
    { name: 'KursWalutyZ', title: i18n.t('invoice.order.currencyRate'), format: formatAbs, width: 'auto' },
  ];
  const definedHeader2: HeaderDefine[] = [
    { name: 'GTINZ', title: i18n.t('invoice.order.gtin'), format: FormatTyp.Default, width: 'auto' },
    { name: 'PKWiUZ', title: i18n.t('invoice.order.pkwiu'), format: FormatTyp.Default, width: 'auto' },
    { name: 'CNZ', title: i18n.t('invoice.order.cn'), format: FormatTyp.Default, width: 'auto' },
    { name: 'PKOBZ', title: i18n.t('invoice.order.pkob'), format: FormatTyp.Default, width: 'auto' },
    { name: 'DodatkoweInfoZ', title: i18n.t('invoice.order.additionalInfo'), format: FormatTyp.Default, width: '*' },
    {
      name: 'P_12Z_Procedura',
      title: i18n.t('invoice.order.procedure'),
      format: FormatTyp.Default,
      mappingData: Procedura,
      width: '*',
    },
    { name: 'KwotaAkcyzyZ', title: i18n.t('invoice.order.exciseTaxAmount'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'GTUZ', title: i18n.t('invoice.order.gtu'), format: FormatTyp.Default, width: 'auto' },
    { name: 'ProceduraZ', title: i18n.t('invoice.order.procedureMarkings'), format: FormatTyp.Default, width: '*' },
  ];

  let content: FormContentState = getContentTable<(typeof orderTable)[0]>(
    [...definedHeaderLp, ...definedHeader1, ...definedHeader2],
    orderTable,
    '*'
  );
  const table: Content[] = [];

  if (content.fieldsWithValue.length <= 9) {
    if (content.content) {
      table.push(content.content);
    }
  } else {
    content = getContentTable<(typeof orderTable)[0]>(
      [...definedHeaderLp, ...definedHeader1],
      orderTable,
      '*'
    );
    if (content.content) {
      table.push(content.content);
    }
    content = getContentTable<(typeof orderTable)[0]>(
      [...definedHeaderLp, ...definedHeader2],
      orderTable,
      '*'
    );
    if (content.content && content.fieldsWithValue.length > 1) {
      table.push(content.content);
    }
  }
  const ceny = i18n.t('invoice.order.issuedInCurrency', {
    currency: KodWaluty,
  });
  let opis: Content = '';

  if (Number(p_15) > 0 && rodzajFaktury == TRodzajFaktury.ZAL) {
    opis = {
      stack: createLabelTextArray([
        { value: i18n.t('invoice.order.receivedAdvance'), formatTyp: FormatTyp.LabelGreater },
        { value: p_15, formatTyp: FormatTyp.CurrencyGreater },
      ]),
      alignment: Position.RIGHT,
      margin: [0, 8, 0, 0],
    };
  } else if (
    zamowienieKorekta !== ZamowienieKorekta.BeforeCorrection &&
    rodzajFaktury == TRodzajFaktury.KOR_ZAL &&
    Number(p_15) >= 0
  ) {
    opis = {
      stack: createLabelTextArray([
        { value: i18n.t('invoice.order.totalAmountDue'), formatTyp: FormatTyp.LabelGreater },
        { value: p_15, formatTyp: FormatTyp.CurrencyGreater },
      ]),
      alignment: Position.RIGHT,
      margin: [0, 8, 0, 0],
    };
  }
  return [
    {
      stack: [
        createHeader(zamowienieKorekta),
        ceny,
        {
          text: [
            i18n.t('invoice.order.orderValueWithTax'),
            formatText(orderData.WartoscZamowienia?._text, FormatTyp.Currency),
          ],
          marginBottom: 4,
        },
        ...table,
        opis,
      ],
    },
  ];
}
