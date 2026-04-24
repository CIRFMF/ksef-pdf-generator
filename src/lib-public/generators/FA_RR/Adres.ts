import {Content} from 'pdfmake/interfaces';
import {createLabelText, formatText, getKraj, getValue} from '../../../shared/PDF-functions';
import {Adres} from '../../types/FaRR.types';
import FormatTyp from '../../../shared/enums/common.enum';
import i18n from 'i18next';

export function generateAdres(adres: Adres): Content[] {
    const result: Content[] = [];

    if (adres?.AdresL1) {
        result.push(formatText(getValue(adres.AdresL1), FormatTyp.Value));
    }
    if (adres?.AdresL2) {
        result.push(formatText(getValue(adres.AdresL2), FormatTyp.Value));
    }
    if (adres?.KodKraju) {
        result.push(formatText(i18n.t(getKraj((getValue(adres.KodKraju) as string) ?? '')), FormatTyp.Value));
    }
    result.push(...createLabelText(i18n.t('invoice.address.GLN'), adres.GLN));
    return result;
}
