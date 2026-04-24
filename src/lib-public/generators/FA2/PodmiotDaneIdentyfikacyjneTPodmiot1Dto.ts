import { Content } from 'pdfmake/interfaces';
import { DaneIdentyfikacyjne } from '../../types/fa2.types';
import { createLabelText } from '../../../shared/PDF-functions';
import i18n from 'i18next';

export function generateDaneIdentyfikacyjneTPodmiot1Dto(daneIdentyfikacyjne: DaneIdentyfikacyjne): Content[] {
  return [
    createLabelText(i18n.t('invoice.subject1.nip'), daneIdentyfikacyjne.NIP),
    createLabelText(i18n.t('invoice.subject1.name'), daneIdentyfikacyjne.Nazwa),
  ];
}
