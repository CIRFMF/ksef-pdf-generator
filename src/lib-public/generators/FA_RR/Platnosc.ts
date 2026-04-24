import {Content, ContentText} from 'pdfmake/interfaces';
import {
    createHeader,
    createLabelText,
    formatText,
    generateLine,
    generateTwoColumns,
    getTable,
    getValue,
    hasValue,
} from '../../../shared/PDF-functions';
import {Platnosc} from '../../types/FaRR.types';
import {generujRachunekBankowy} from './RachunekBankowy';
import FormatTyp from '../../../shared/enums/common.enum';
import i18n from "i18next";

export function generatePlatnosc(platnosc: Platnosc | undefined): Content {
    if (!platnosc) {
        return [];
    }
    const table: Content[] = [generateLine(), ...createHeader(i18n.t('invoice.payment.payment'))];

    if (hasValue(platnosc.FormaPlatnosci)) {
        table.push(createLabelText(i18n.t('invoice.payment.paymentMethod3'), i18n.t('invoice.payment.transfer')));
    } else {
        if (hasValue(platnosc.OpisPlatnosci)) {
            table.push(createLabelText(i18n.t('invoice.payment.paymentMethod3'), i18n.t('invoice.payment.other')));
            table.push(createLabelText(i18n.t('invoice.payment.description'), platnosc.OpisPlatnosci));
        }
    }

    if (hasValue(platnosc.LinkDoPlatnosci)) {
        table.push(formatText(i18n.t('invoice.payment.moneylessLink'), FormatTyp.Label));
        table.push({
            text: formatText(getValue(platnosc.LinkDoPlatnosci), FormatTyp.Link),
            link: formatText(getValue(platnosc.LinkDoPlatnosci), FormatTyp.Link),
        } as ContentText);
    }
    if (hasValue(platnosc.IPKSeF)) {
        table.push(createLabelText(i18n.t('invoice.payment.ksefTransferId'), platnosc.IPKSeF));
    }

    const rachunekBankowy1: Content[][] = getTable(platnosc.RachunekBankowy1).map((rachunek) =>
        generujRachunekBankowy([rachunek], i18n.t('invoice.payment.farmer'))
    );
    const rachunekBankowy2: Content[][] = getTable(platnosc.RachunekBankowy2).map((rachunek) =>
        generujRachunekBankowy([rachunek], i18n.t('invoice.payment.getter'))
    );
    const rachunekBankowy: Content[][] = [...rachunekBankowy1, ...rachunekBankowy2];

    if (rachunekBankowy.length > 0) {
        rachunekBankowy.forEach((rachunek, index) => {
            if (index % 2 === 0) {
                table.push(generateTwoColumns(rachunek, rachunekBankowy[index + 1] ?? []));
            }
        });
    }

    table.push({margin: [0, 8, 0, 0], text: ''});

    return table;
}
