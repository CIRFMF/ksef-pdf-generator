import {Content} from 'pdfmake/interfaces';
import {createHeader, createLabelText, formatText, getValue, hasValue} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import {Podmiot1Class} from '../../types/FaRR.types';
import {generateAdres} from './Adres';
import {generateDaneIdentyfikacyjneTPodmiot1Dto} from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import {generateDaneKontaktowe} from './PodmiotDaneKontaktowe';
import i18n from "i18next";

export function generatePodmiot1(podmiot1: Podmiot1Class): Content[] {
    const result: Content[] = createHeader(i18n.t('invoice.subject1.seller'));

    if (podmiot1.DaneIdentyfikacyjne) {
        result.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot1.DaneIdentyfikacyjne));
    }

    if (podmiot1.Adres) {
        result.push(formatText(i18n.t('invoice.subject1.address'), [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot1.Adres));
    }
    if (podmiot1.AdresKoresp) {
        result.push(
            formatText(i18n.t('invoice.subject1.mailingAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
            ...generateAdres(podmiot1.AdresKoresp)
        );
    }
    if (podmiot1.DaneKontaktowe) {
        result.push(
            formatText(i18n.t('invoice.subject1.contactDetails'), [FormatTyp.Label, FormatTyp.LabelMargin]),
            ...generateDaneKontaktowe(podmiot1.DaneKontaktowe)
        );
    }

    if (hasValue(podmiot1.NrKontrahenta)) {
        result.push(createLabelText(i18n.t('invoice.subject1.contractorNumber'), getValue(podmiot1.NrKontrahenta)));
    }
    return result;
}
