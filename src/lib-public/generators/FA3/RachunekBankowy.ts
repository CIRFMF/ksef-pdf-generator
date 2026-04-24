import {Content, ContentTable} from 'pdfmake/interfaces';
import {
    createHeader,
    createSection,
    formatText,
    getValue,
    hasValue,
    makeBreakable,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import {RachunekBankowy} from '../../types/fa3.types';
import {translateMap} from '@shared/generators/common/functions';
import {TypRachunkowWlasnych} from '@shared/consts/FA.const';
import i18n from "i18next";

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
            formatText(i18n.t('invoice.registers.fullAccountNumber'), FormatTyp.GrayBoldTitle),
            formatText(getValue(account.NrRB), FormatTyp.Default),
        ]);
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
            formatText(
                hasValue(account.NazwaBanku)
                    ? makeBreakable(getValue(account.NazwaBanku), 20)
                    : getValue(account.NazwaBanku),
                FormatTyp.Default
            ),
        ]);
        table.push([
            formatText(i18n.t('invoice.registers.accountDescription'), FormatTyp.GrayBoldTitle),
            formatText(
                hasValue(account.OpisRachunku)
                    ? makeBreakable(getValue(account.OpisRachunku), 20)
                    : getValue(account.OpisRachunku),
                FormatTyp.Default
            ),
        ]);
        result.push([
            ...base,
            {
                unbreakable: true,
                table: {
                    body: table,
                    widths: ['auto', '*'],
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
