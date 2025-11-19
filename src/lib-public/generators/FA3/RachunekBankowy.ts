import { Content, ContentTable } from 'pdfmake/interfaces';
import { createHeader, createSection, formatText } from '../../../shared/PDF-functions.js';
import FormatTyp from '../../../shared/enums/common.enum.js';
import { RachunekBankowy } from '../../types/fa3.types';
import { getTypRachunkowWlasnych } from '../../../shared/generators/common/functions.js';

export const generujRachunekBankowy = (accounts?: RachunekBankowy[], title?: string): Content[] => {
  const result: Content[] = [];

  if (!accounts?.length) {
    return [];
  }

  accounts.forEach((account, index) => {
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
        layout: {
          hLineWidth: () => 1,
          hLineColor: () => '#BABABA',
          vLineWidth: () => 1,
          vLineColor: () => '#BABABA',
        },
      } as ContentTable,
    ]);
  });

  return createSection(result, false);
};
