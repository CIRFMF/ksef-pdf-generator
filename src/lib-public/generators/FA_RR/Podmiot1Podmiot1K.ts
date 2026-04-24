import {Content} from 'pdfmake/interfaces';
import {
    createHeader,
    createLabelText,
    formatText,
    generateColumns,
    getTable,
    getValue,
    hasValue,
    verticalSpacing,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import {generateDaneIdentyfikacyjneTPodmiot1Dto} from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import {generateDaneKontaktowe} from './PodmiotDaneKontaktowe';
import {generateAdres} from './Adres';
import {Podmiot1Class, Podmiot1KClass} from '../../types/FaRR.types';
import i18n from "i18next";

export function generatePodmiot1Podmiot1K(podmiot1: Podmiot1Class, podmiot1K: Podmiot1KClass): Content[] {
    const result: Content[] = createHeader(i18n.t('invoice.subject1K.seller'));
    let firstColumn: Content[] = [];
    let secondColumn: Content[] = [];

    if (podmiot1.DaneIdentyfikacyjne) {
        firstColumn.push(
            createHeader(i18n.t('invoice.subject1K.identificationData')),
            ...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot1.DaneIdentyfikacyjne)
        );
    }

    if (podmiot1.DaneKontaktowe) {
        const daneKontaktowe = generateDaneKontaktowe(getTable(podmiot1.DaneKontaktowe));

        if (daneKontaktowe.length) {
            firstColumn.push(createHeader(i18n.t('invoice.subject1K.contactDetails')));
            firstColumn.push(daneKontaktowe);
        }
    }
    if (hasValue(podmiot1.NrKontrahenta)) {
        firstColumn.push(createLabelText(i18n.t('invoice.subject1K.contractorNumber'), getValue(podmiot1.NrKontrahenta)));
    }

    if (firstColumn.length) {
        result.push({
            columns: [firstColumn, []],
            columnGap: 20,
        });
    }
    firstColumn = generateCorrectedContent(podmiot1K, i18n.t('invoice.subject1K.correctedContent'));
    secondColumn = generateCorrectedContent(podmiot1, i18n.t('invoice.subject1K.correctiveContent'));

    if (podmiot1.AdresKoresp) {
        secondColumn.push(
            formatText(i18n.t('invoice.subject1K.mailingAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
            generateAdres(podmiot1.AdresKoresp)
        );
    }
    if (firstColumn.length || secondColumn.length) {
        result.push(generateColumns([firstColumn, secondColumn]));
    }
    if (result.length) {
        result.push(verticalSpacing(1));
    }
    return result;
}

export function generateCorrectedContent(podmiot: Podmiot1Class | Podmiot1KClass, header: string): Content[] {
    const result: Content[] = [];

    result.push(createHeader(header));

    if (podmiot.DaneIdentyfikacyjne) {
        result.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot.DaneIdentyfikacyjne));
    }
    if (podmiot.Adres) {
        result.push(formatText(i18n.t('invoice.subject1K.address'), [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot.Adres));
    }
    return result;
}
