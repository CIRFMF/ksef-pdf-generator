import { Content, ContentTable } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createLabelTextArray,
  createSection,
  createSubHeader,
  generateColumns,
  generateTwoColumns,
  getContentTable,
  getTable,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { Rozliczenie as Rozliczenie1, Zenia } from '../../types/fa1.types';
import { Rozliczenie as Rozliczenie2, Rozliczenie as Rozliczenie3 } from '../../types/fa2.types';
import { Rozliczenie as RozliczenieRR } from '../../types/FaRR.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { FormContentState } from '../../../shared/types/additional-data.types';
import i18n from 'i18next';

export function generateRozliczenie(
  rozliczenie: Rozliczenie1 | Rozliczenie2 | Rozliczenie3 | RozliczenieRR | undefined,
  KodWaluty: string
): Content[] {
  if (!rozliczenie) {
    return [];
  }

  const obciazenia: Zenia[] = getTable(rozliczenie?.Obciazenia);
  const odliczenia: Zenia[] = getTable(rozliczenie?.Odliczenia);
  const result: Content[] = [];

  const headerOdliczenia: HeaderDefine[] = [
    {
      title: i18n.t('invoice.settlement.deductionReason'),
      name: 'Powod',
      format: FormatTyp.Default,
      width: '*',
    },
    {
      title: 'Kwota',
      name: 'Kwota',
      format: FormatTyp.Currency,
      width: 'auto',
    },
  ];

  const headerObciazenia: HeaderDefine[] = [
    {
      name: 'Powod',
      title: i18n.t('invoice.settlement.chargeReason'),
      format: FormatTyp.Default,
      width: '*',
    },
    {
      name: 'Kwota',
      title: 'Kwota',
      format: FormatTyp.Currency,
      width: 'auto',
    },
  ];

  const tableObciazenia: FormContentState = getContentTable<(typeof obciazenia)[0]>(
    headerObciazenia,
    obciazenia,
    '*',
    undefined,
    20
  );

  const tableOdliczenia: FormContentState = getContentTable<(typeof odliczenia)[0]>(
    headerOdliczenia,
    odliczenia,
    '*',
    undefined,
    20
  );

  const SumaObciazen: Content[] = createLabelText(
    i18n.t('invoice.settlement.totalCharges'),
    rozliczenie.SumaObciazen,
    FormatTyp.Currency,
    {
      alignment: Position.RIGHT,
    }
  );

  const Sumaodliczen: Content[] = createLabelText(
    i18n.t('invoice.settlement.totalDeductions'),
    rozliczenie?.SumaOdliczen,
    FormatTyp.Currency,
    {
      alignment: Position.RIGHT,
    }
  );

  const resultObciazenia: (ContentTable | Content[])[] = [
    createSubHeader(i18n.t('invoice.settlement.charges')),
    tableObciazenia.content ?? [],
    SumaObciazen,
  ];

  const resultOdliczenia: (ContentTable | Content[])[] = [
    createSubHeader(i18n.t('invoice.settlement.deductions')),
    tableOdliczenia.content ?? [],
    Sumaodliczen,
  ];

  result.push(createHeader(i18n.t('invoice.settlement.header'), [0, 8, 0, 4]));

  if (obciazenia.length > 0 && odliczenia.length > 0) {
    result.push(generateColumns([resultObciazenia, resultOdliczenia]));
  } else if (obciazenia.length > 0) {
    result.push(generateTwoColumns([resultObciazenia], [], undefined, false));
  } else if (odliczenia.length > 0) {
    result.push(generateTwoColumns([], [resultOdliczenia], undefined, false));
  }

  if (rozliczenie?.DoZaplaty?._text) {
    result.push({
      stack: createLabelTextArray([
        { value: i18n.t('invoice.settlement.toPay'), formatTyp: FormatTyp.LabelGreater },
        {
          value: rozliczenie?.DoZaplaty,
          formatTyp: FormatTyp.CurrencyGreater,
          currency: KodWaluty,
        },
      ]),
      alignment: Position.RIGHT,
      margin: [0, 8, 0, 0],
    });
  } else if (rozliczenie?.DoRozliczenia?._text) {
    result.push({
      stack: createLabelTextArray([
        { value: i18n.t('invoice.settlement.toSettle'), formatTyp: FormatTyp.LabelGreater },
        {
          value: rozliczenie?.DoRozliczenia,
          formatTyp: FormatTyp.CurrencyGreater,
          currency: KodWaluty,
        },
      ]),
      alignment: Position.RIGHT,
      marginTop: 8,
    });
  }

  return createSection(result, true);
}
