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
import { Fa, ZaliczkaCzesciowa } from '../../types/fa2.types';
import { DifferentValues, ObjectKeysOfFP, TypesOfValues } from '../../../shared/types/universal.types';
import { FP } from '../../types/fa1.types';
import FormatTyp from '../../../shared/enums/common.enum';
import { TableWithFields } from '../../types/fa1-additional-types';
import { FA2FakturaZaliczkowaData } from '../../types/common.types';
import { formatDateTime } from '@shared/generators/common/functions';
import i18n from 'i18next';

export function generateSzczegoly(faVat: Fa): Content[] {
  const faWiersze: Record<string, FP>[] = getTable(faVat.FaWiersz);
  const zamowieniaWiersze: Record<string, FP>[] = getTable(faVat.Zamowienie?.ZamowienieWiersz);
  const LabelP_6: string =
    faVat.RodzajFaktury == TRodzajFaktury.ZAL || faVat.RodzajFaktury == TRodzajFaktury.KOR_ZAL
      ? i18n.t('invoice.details.getMoneyDate')
      : i18n.t('invoice.details.deliveryOrServiceDate');

  const P_6Scope: Content[] = generateP_6Scope(faVat.OkresFa?.P_6_Od, faVat.OkresFa?.P_6_Do);

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
    if (hasValue(faVat.KursWalutyZ)) {
      kodWalutyLabel1.push(createLabelText(i18n.t('invoice.details.commonCurrencyRate'), ' '));
      kodWalutyLabel2.push(
        createLabelText(i18n.t('invoice.details.currencyRate'), faVat.KursWalutyZ, FormatTyp.Currency6)
      );
    } else {
      const Common_KursWaluty: DifferentValues[] = getDifferentColumnsValue('KursWaluty', faWiersze);

      if (Common_KursWaluty.length === 1) {
        kodWalutyLabel1.push(createLabelText(i18n.t('invoice.details.commonCurrencyRate'), ' '));
        kodWalutyLabel2.push(
          createLabelText(
            i18n.t('invoice.details.currencyRate'),
            Common_KursWaluty[0].value,
            FormatTyp.Currency6
          )
        );
      }
    }
  }
  const tpLabel1: Content[] = [];
  const tpLabel2: Content[] = [];

  const forColumns: Content[][] = [
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
    ...generateZaliczkaCzesciowa(faVat.ZaliczkaCzesciowa),
    ...generateFakturaZaliczkowa(faVat.FakturaZaliczkowa),
  ];

  return createSection(table, true);
}

function generateP_6Scope(P_6_Od: TypesOfValues, P_6_Do: TypesOfValues): Content[] {
  const table: Content[] = [];

  if (hasValue(P_6_Od) && hasValue(P_6_Do)) {
    table.push(
      createLabelTextArray([
        {
          value: i18n.t('invoice.details.deliveryOrServiceDateFrom'),
        },
        { value: formatDateTime(getValue(P_6_Od) as string, true, true), formatTyp: FormatTyp.Value },
        { value: ' do ' },
        { value: formatDateTime(getValue(P_6_Do) as string, true, true), formatTyp: FormatTyp.Value },
      ])
    );
  } else if (hasValue(P_6_Od)) {
    table.push(
      createLabelText(
        i18n.t('invoice.details.deliveryOrServiceDateFrom'),
        formatDateTime(getValue(P_6_Od) as string, true, true)
      )
    );
  } else if (hasValue(P_6_Do)) {
    table.push(
      createLabelText(
        i18n.t('invoice.details.deliveryOrServiceDateTo'),
        formatDateTime(getValue(P_6_Do) as string, true, true)
      )
    );
  }
  return table;
}

function generateZaliczkaCzesciowa(zaliczkaCzesciowaData: ZaliczkaCzesciowa[] | undefined): Content[] {
  if (!zaliczkaCzesciowaData) {
    return [];
  }
  const zaplataCzesciowa: ZaliczkaCzesciowa[] = getTable(zaliczkaCzesciowaData);
  const table: Content[] = [];

  const zaplataCzesciowaHeader: HeaderDefine[] = [
    { name: 'P_6Z', title: i18n.t('invoice.details.getMoneyDate2'), format: FormatTyp.Date },
    { name: 'P_15Z', title: i18n.t('invoice.details.costAmount'), format: FormatTyp.Default },
    { name: 'KursWalutyZW', title: i18n.t('invoice.details.currencyRate2'), format: FormatTyp.Currency6 },
  ];

  const tableZaliczkaCzesciowa: TableWithFields = getContentTable<(typeof zaplataCzesciowa)[0]>(
    zaplataCzesciowaHeader,
    zaplataCzesciowa,
    'auto'
  );

  if (tableZaliczkaCzesciowa.content) {
    table.push(tableZaliczkaCzesciowa.content);
  }
  return table;
}

function generateFakturaZaliczkowa(fakturaZaliczkowaData: ObjectKeysOfFP[] | undefined): Content[] {
  if (!fakturaZaliczkowaData) {
    return [];
  }
  const fakturaZaliczkowa = getTable(fakturaZaliczkowaData) as unknown as FA2FakturaZaliczkowaData[];
  const fakturaZaliczkowaMapped = fakturaZaliczkowa.map((item) => {
    if ('NrFaZaliczkowej' in item && item.NrFaZaliczkowej) {
      return { ...item, NrFaZaliczkowej: item.NrFaZaliczkowej };
    }

    if ('NrKSeFFaZaliczkowej' in item && item.NrKSeFFaZaliczkowej) {
      return { ...item, NrFaZaliczkowej: item.NrKSeFFaZaliczkowej };
    }

    return { ...item, NrFaZaliczkowej: { _text: '' } };
  });
  const table: Content[] = [];

  const fakturaZaliczkowaHeader: HeaderDefine[] = [
    {
      name: 'NrFaZaliczkowej',
      title: i18n.t('invoice.details.advanceInvoiceNumbers'),
      format: FormatTyp.Default,
    },
  ];

  const tableFakturaZaliczkowa: TableWithFields = getContentTable<(typeof fakturaZaliczkowa)[0]>(
    fakturaZaliczkowaHeader,
    fakturaZaliczkowaMapped,
    'auto',
    [0, 4, 0, 0]
  );

  if (tableFakturaZaliczkowa.content) {
    table.push(tableFakturaZaliczkowa.content);
  }
  return table;
}
