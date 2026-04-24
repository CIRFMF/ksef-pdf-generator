import {Content, ContentText} from 'pdfmake/interfaces';
import {formatText, getValue} from '../../../shared/PDF-functions';
import {TRodzajFaktury} from '../../../shared/consts/FA.const';
import {FakturaRR as Fa} from '../../types/FaRR.types';
import FormatTyp, {Position} from '../../../shared/enums/common.enum';
import {AdditionalDataTypes} from '../../types/common.types';
import i18n from "i18next";

export function generateNaglowek(fa?: Fa, additionalData?: AdditionalDataTypes): Content[] {
    let invoiceName = '';

    switch (getValue(fa?.RodzajFaktury)) {
        case TRodzajFaktury.VAT_RR:
            invoiceName = i18n.t('invoice.header.primalInvoiceVatRr');
            break;
        case TRodzajFaktury.KOR_VAT_RR:
            invoiceName = i18n.t('invoice.header.correctedInvoiceVatRr');
            break;
    }

    return [
        {
            text: [
                {text: i18n.t('invoice.header.ksefPart1'), fontSize: 18},
                {text: i18n.t('invoice.header.ksefPart2'), color: 'red', bold: true, fontSize: 18},
                {text: i18n.t('invoice.header.ksefPart3'), bold: true, fontSize: 18},
            ],
        },
        {
            ...(formatText(i18n.t('invoice.header.invoiceNumberLabel'), FormatTyp.ValueMedium) as ContentText),
            alignment: Position.RIGHT
        },
        {
            ...(formatText(getValue(fa?.P_4C), FormatTyp.HeaderPosition) as ContentText),
            alignment: Position.RIGHT,
        },
        {
            ...(formatText(invoiceName, [FormatTyp.ValueMedium, FormatTyp.Default]) as ContentText),
            alignment: Position.RIGHT,
        },
        ...(additionalData?.nrKSeF
            ? [
                {
                    text: [
                        formatText(i18n.t('invoice.header.ksefNumberLabel'), FormatTyp.LabelMedium) as ContentText,
                        formatText(additionalData?.nrKSeF, FormatTyp.ValueMedium),
                    ],
                    alignment: Position.RIGHT,
                } as Content,
            ]
            : []),
    ];
}
