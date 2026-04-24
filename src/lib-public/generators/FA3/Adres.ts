import {Content} from 'pdfmake/interfaces';
import {createLabelText, formatText, getKraj} from '../../../shared/PDF-functions';
import {Adres} from '../../types/fa3.types';
import FormatTyp from '../../../shared/enums/common.enum';
import i18n from "i18next";

export function generateAdres(adres: Adres): Content[] {
    const result: Content[] = [];

    if (adres?.AdresL1) {
        result.push(formatText(adres.AdresL1._text, FormatTyp.Value));
    }
    if (adres?.AdresL2) {
        result.push(formatText(adres.AdresL2._text, FormatTyp.Value));
    }
    if (adres?.KodKraju) {
        result.push(formatText(i18n.t(getKraj(adres.KodKraju._text ?? '')), FormatTyp.Value));
    }
    result.push(...createLabelText(i18n.t('invoice.address.GLN'), adres.GLN));
    return result;
}
