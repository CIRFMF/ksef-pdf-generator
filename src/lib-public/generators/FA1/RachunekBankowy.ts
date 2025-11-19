import { Content, ContentTable } from 'pdfmake/interfaces';
import { createHeader, createSection, formatText } from '../../../shared/PDF-functions.js';
import FormatTyp from '../../../shared/enums/common.enum.js';
import { FP } from '../../types/fa1.types';
import { getTypRachunkowWlasnych } from '../../../shared/generators/common/functions.js';
import { DEFAULT_TABLE_LAYOUT } from '../../../shared/consts/const.js';

export const generujRachunekBankowy: (accounts?: Record<string, FP>[], title?: string) => Content[] = (
  accounts?: Record<string, FP>[],
  title?: string
): Content[] => {
  const result: Content[] = [];

  if (!accounts?.length) {
    return [];
  }

  accounts.forEach((account: Record<string, FP>, index: number): void => {
    const table: Content[][] = [];
    const base: Content[] = createHeader(
      title ? `${title} ${accounts?.length > 1 ? ++index : ''}` : '',
      [0, 12, 0, 8]
    );

    if (account.NrRBZagr?._text) {
      table.push([
        formatText('Format rachunku', FormatTyp.GrayBoldTitle),
        formatText('Zagraniczny', FormatTyp.Default),
      ]);
    } else if (account.NrRBPL?._text) {
      table.push([
        formatText('Format rachunku', FormatTyp.GrayBoldTitle),
        formatText('Polski', FormatTyp.Default),
      ]);
    }
    if (account.NrRBPL?._text) {
      table.push([
        formatText('Pełny numer rachunku w standardzie NRB', FormatTyp.GrayBoldTitle),
        formatText(account.NrRBPL?._text, FormatTyp.Default),
      ]);
    }
    if (account.NrRBZagr?._text) {
      table.push([
        formatText('Pełny numer rachunku zagranicznego', FormatTyp.GrayBoldTitle),
        formatText(account.NrRBZagr?._text, FormatTyp.Default),
      ]);
    }
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
