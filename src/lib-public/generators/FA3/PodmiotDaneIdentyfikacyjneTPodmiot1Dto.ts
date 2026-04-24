import {Content} from 'pdfmake/interfaces';
import {createLabelText} from '../../../shared/PDF-functions';
import {DaneIdentyfikacyjne} from '../../types/fa3.types';
import i18n from "i18next";

export function generateDaneIdentyfikacyjneTPodmiot1Dto(daneIdentyfikacyjne: DaneIdentyfikacyjne): Content[] {
    return [
        createLabelText(i18n.t('invoice.subject1.nip'), daneIdentyfikacyjne.NIP),
        createLabelText(i18n.t('invoice.subject1.name'), daneIdentyfikacyjne.Nazwa),
    ];
}
