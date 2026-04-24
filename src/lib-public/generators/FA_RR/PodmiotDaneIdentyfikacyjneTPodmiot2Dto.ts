import { Content } from 'pdfmake/interfaces';
import { createLabelText } from '../../../shared/PDF-functions';
import { Podmiot1KDaneIdentyfikacyjne } from '../../types/FaRR.types';
import i18n from 'i18next';

export function generateDaneIdentyfikacyjneTPodmiot2Dto(
  daneIdentyfikacyjne: Podmiot1KDaneIdentyfikacyjne
): Content[] {
  return [
    createLabelText(i18n.t('invoice.subjectIdentificationData.nip'), daneIdentyfikacyjne.NIP),
    createLabelText(i18n.t('invoice.subjectIdentificationData.name'), daneIdentyfikacyjne.Nazwa),
  ];
}
