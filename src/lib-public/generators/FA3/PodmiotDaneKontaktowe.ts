import {Content} from 'pdfmake/interfaces';
import {createLabelText, getTable} from '../../../shared/PDF-functions';
import {Podmiot1DaneKontaktowe} from '../../types/fa3.types';
import i18n from "i18next";

export function generateDaneKontaktowe(daneKontaktowe: Podmiot1DaneKontaktowe[]): Content[] {
    return getTable(daneKontaktowe)?.map((daneKontaktowe) => {
        if (daneKontaktowe?.Email || daneKontaktowe?.Telefon) {
            return [
                createLabelText(i18n.t('invoice.authorizedSubject.email'), daneKontaktowe.Email),
                createLabelText(i18n.t('invoice.authorizedSubject.phone'), daneKontaktowe.Telefon),
            ];
        } else {
            return '-';
        }
    });
}
