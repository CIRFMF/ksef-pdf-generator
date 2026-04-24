import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createLabelTextArray,
  createSection,
  generateTwoColumns,
  getContentTable,
  getDifferentColumnsValue,
  getTable,
  getValue,
  hasColumnsValue,
  hasValue,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { TRodzajFaktury } from '../../../shared/consts/FA.const';
import { Fa, FP } from '../../types/fa1.types';
import { DifferentValues, TypesOfValues } from '../../../shared/types/universal.types';
import FormatTyp from '../../../shared/enums/common.enum';
import { TableWithFields } from '../../types/fa1-additional-types';
import { formatDateTime } from '@shared/generators/common/functions';
import i18n from 'i18next';

export function generateSzczegoly(faVat: Fa): Content[] {
  const faWiersze: Record<string, FP>[] = getTable(faVat.FaWiersze?.FaWiersz);
  const zamowieniaWiersze: Record<string, FP>[] = getTable(faVat.Zamowienie?.ZamowienieWiersz);
  const LabelP_6: string =
    faVat.RodzajFaktury == TRodzajFaktury.ZAL || faVat.RodzajFaktury == TRodzajFaktury.KOR_ZAL
      ? i18n.t('invoice.details.paymentReceivedDate')
      : i18n.t('invoice.details.deliveryOrServiceDate');

  const P_6Scope: Content[] = generateP_6Scope(faVat.OkresFa?.P_6_Od, faVat.OkresFa?.P_6_Do, i18n);

  const cenyLabel1: Content[] = [];
  const cenyLabel2: Content[] = [];

  if (hasValue(faVat.KodWaluty)) {
    cenyLabel2.push(createLabelText(i18n.t('invoice.details.currencyCode'), faVat.KodWaluty));
  }

  const P_12_XIILabel: Content[] = [];

  if (hasColumnsValue('P_12_XII', faWiersze) || hasColumnsValue('P_12_XII', zamowieniaWiersze)) {
    P_12_XIILabel.push(createLabelText(i18n.t('invoice.details.ossProcedure'), ' '));
  }

  const kodWalutyLabel1: Content[] = [];
  const kodWalutyLabel2: Content[] = [];

  if (hasValue(faVat.KodWaluty) && getValue(faVat.KodWaluty) != 'PLN') {
    if (faVat.Zamowienie?.ZamowienieWiersz?.length) {
      const Common_KursWaluty: DifferentValues[] = getDifferentColumnsValue(
        'KursWalutyZ',
        faVat.Zamowienie?.ZamowienieWiersz
      );

      if (Common_KursWaluty.length === 1) {
        kodWalutyLabel1.push(createLabelText(i18n.t('invoice.details.commonCurrencyRate'), ' '));
        kodWalutyLabel2.push(
          createLabelText(i18n.t('invoice.details.currencyRate'), Common_KursWaluty[0].value, FormatTyp.Currency6)
        );
      }
    } else {
      const Common_KursWaluty: DifferentValues[] = getDifferentColumnsValue('KursWaluty', faWiersze);

      if (Common_KursWaluty.length === 1) {
        kodWalutyLabel1.push(createLabelText(i18n.t('invoice.details.commonCurrencyRate'), ' '));
        kodWalutyLabel2.push(
          createLabelText(i18n.t('invoice.details.currencyRate'), Common_KursWaluty[0].value, FormatTyp.Currency6)
        );
      }
    }
  }
  const tpLabel1: Content[] = [];
  const tpLabel2: Content[] = [];

  const forColumns: Content[][] = [
    createLabelText(i18n.t('invoice.details.invoiceNumber'), faVat.P_2),
    createLabelText(i18n.t('invoice.details.issueDate'), faVat.P_1, FormatTyp.Date),
    createLabelText(i18n.t('invoice.details.issuePlace'), faVat.P_1M),
    createLabelText(i18n.t('invoice.details.discountPeriod'), faVat.OkresFaKorygowanej),
    createLabelText(LabelP_6, faVat.P_6, FormatTyp.Date),
    P_6Scope,
    cenyLabel1,
    cenyLabel2,
    P_12_XIILabel,
    kodWalutyLabel1,
    kodWalutyLabel2,
    tpLabel1,
    tpLabel2,
  ].filter((el: Content[]): boolean => el.length > 0);
  const columns1: Content[] = [];
  const columns2: Content[] = [];

  forColumns.forEach((tab: Content[], index: number): void => {
    if (index % 2) {
      columns2.push(tab);
    } else {
      columns1.push(tab);
    }
  });
  const table: Content[] = [
    ...createHeader(i18n.t('invoice.details.header')),
    generateTwoColumns(columns1, columns2),
    ...generateFakturaZaliczkowa(getTable(faVat.NrFaZaliczkowej), i18n),
  ];

  return createSection(table, true);
}

function generateP_6Scope(P_6_Od: TypesOfValues, P_6_Do: TypesOfValues, i18n: any): Content[] {
  const table: Content[] = [];

  if (hasValue(P_6_Od) && hasValue(P_6_Do)) {
    table.push(
      createLabelTextArray([
        {
          value: i18n.t('invoice.details.deliveryOrServiceDateFrom'),
        },
        { value: formatDateTime(getValue(P_6_Od) as string, true, true), formatTyp: FormatTyp.Value },
        { value: i18n.t('invoice.details.to') },
        { value: formatDateTime(getValue(P_6_Do) as string, true, true), formatTyp: FormatTyp.Value },
      ])
    );
  } else if (hasValue(P_6_Od)) {
    table.push(createLabelText(i18n.t('invoice.details.deliveryOrServiceDateFrom'),
        formatDateTime(getValue(P_6_Od)as string, true, true)
      )
    );
  } else if (hasValue(P_6_Do)) {
    table.push(createLabelText(i18n.t('invoice.details.deliveryOrServiceDateTo'),
        formatDateTime(getValue(P_6_Do)as string, true, true)
      )
    );
  }
  return table;
}

function generateFakturaZaliczkowa(fakturaZaliczkowa: FP[] | undefined, i18n: any): Content[] {
  if (!fakturaZaliczkowa) {
    return [];
  }
  const table: Content[] = [];

  const fakturaZaliczkowaHeader: HeaderDefine[] = [
    {
      name: '',
      title: i18n.t('invoice.details.advanceInvoiceNumbers'),
      format: FormatTyp.Default,
    },
  ];

  const tableFakturaZaliczkowa: TableWithFields = getContentTable<(typeof fakturaZaliczkowa)[0]>(
    fakturaZaliczkowaHeader,
    fakturaZaliczkowa,
    '50%',
    [0, 4, 0, 0]
  );

  if (tableFakturaZaliczkowa.content) {
    table.push(tableFakturaZaliczkowa.content);
  }
  return table;
}
