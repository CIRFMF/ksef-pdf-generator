import { Content, ContentTable } from 'pdfmake/interfaces';
import {
  createHeader,
  createSection,
  formatText,
  getValue,
  hasValue,
  makeBreakable,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { FP } from '../../types/fa1.types';
import { DEFAULT_TABLE_LAYOUT, TypRachunkowWlasnych } from '../../../shared/consts/FA.const';
import { translateMap } from '@shared/generators/common/functions';
import i18n from 'i18next';

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

    if (hasValue(account.NrRBZagr)) {
      table.push([
        formatText(i18n.t('invoice.registers.billFormat'), FormatTyp.GrayBoldTitle),
        formatText(i18n.t('invoice.registers.foreign'), FormatTyp.Default),
      ]);
    } else if (hasValue(account.NrRBPL)) {
      table.push([
        formatText(i18n.t('invoice.registers.billFormat'), FormatTyp.GrayBoldTitle),
        formatText(i18n.t('invoice.registers.polish'), FormatTyp.Default),
      ]);
    }
    if (hasValue(account.NrRBPL)) {
      table.push([
        formatText(i18n.t('invoice.registers.fullNrbAccountNumber'), FormatTyp.GrayBoldTitle),
        formatText(getValue(account.NrRBPL), FormatTyp.Default),
      ]);
    }
    if (hasValue(account.NrRBZagr)) {
      table.push([
        formatText(i18n.t('invoice.registers.fullForeignAccountNumber'), FormatTyp.GrayBoldTitle),
        formatText(getValue(account.NrRBZagr), FormatTyp.Default),
      ]);
    }
    table.push([
      formatText(i18n.t('invoice.registers.swiftCode'), FormatTyp.GrayBoldTitle),
      formatText(getValue(account.SWIFT), FormatTyp.Default),
    ]);
    table.push([
      formatText(i18n.t('invoice.registers.ownBankAccount'), FormatTyp.GrayBoldTitle),
      formatText(
        makeBreakable(translateMap(account.RachunekWlasnyBanku, TypRachunkowWlasnych), 20),
        FormatTyp.Default
      ),
    ]);
    table.push([
      formatText(i18n.t('invoice.registers.bankName'), FormatTyp.GrayBoldTitle),
      formatText(makeBreakable(getValue(account.NazwaBanku), 20), FormatTyp.Default),
    ]);
    result.push([
      ...base,
      {
        unbreakable: true,
        table: {
          body: table,
          widths: ['auto', '*'],
        },
        layout: DEFAULT_TABLE_LAYOUT,
      } as ContentTable,
    ]);
  });

  return createSection(result, false);
};
