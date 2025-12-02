import { Content, ContentTable } from 'pdfmake/interfaces';
import { createHeader, createSection, formatText } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { RachunekBankowy } from '../../types/fa2.types';
import { getTypRachunkowWlasnych } from '../../../shared/generators/common/functions';
import { FP } from '../../types/fa1.types';
import { DEFAULT_TABLE_LAYOUT } from '../../../shared/consts/const';

export const generujRachunekBankowy: (accounts?: Record<string, FP>[], title?: string) => Content[] = (
  accounts?: RachunekBankowy[],
  title?: string
): Content[] => {
  const result: Content[] = [];

  if (!accounts?.length) {
    return [];
  }

  accounts.forEach((account: RachunekBankowy, index: number): void => {
    const table: Content[][] = [];
    const base: Content[] = createHeader(
      title ? `${title} ${accounts?.length > 1 ? ++index : ''}` : '',
      [0, 12, 0, 8]
    );

    table.push([
      formatText('Pełny numer rachunku', FormatTyp.GrayBoldTitle),
      formatText(account.NrRB?._text, FormatTyp.Default),
    ]);
    table.push([
      formatText('Kod SWIFT', FormatTyp.GrayBoldTitle),
      formatText(account.SWIFT?._text, FormatTyp.Default),
    ]);
    table.push([
      formatText('Rachunek własny banku', FormatTyp.GrayBoldTitle),
      formatText(getTypRachunkowWlasnych(account.RachunekWlasnyBanku), FormatTyp.Default),
    ]);
    table.push([
      formatText('Nazwa banku', FormatTyp.GrayBoldTitle),
      formatText(account.NazwaBanku?._text, FormatTyp.Default),
    ]);
    table.push([
      formatText('Opis rachunku', FormatTyp.GrayBoldTitle),
      formatText(account.OpisRachunku?._text, FormatTyp.Default),
    ]);
    result.push([
      ...base,
      {
        unbreakable: true,
        table: {
          body: table,
          widths: ['*', 'auto'],
        },
        layout: DEFAULT_TABLE_LAYOUT,
      } as ContentTable,
    ]);
  });

  return createSection(result, false);
};
