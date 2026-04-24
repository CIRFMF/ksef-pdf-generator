import { Content } from 'pdfmake/interfaces';
import { createLabelText, getValue, hasValue } from '../../../shared/PDF-functions';
import { DaneIdentyfikacyjneTPodmiot2Dto } from '../../types/fa2-additional-types';
import i18n from 'i18next';

export function generateDaneIdentyfikacyjne(daneIdentyfikacyjne: DaneIdentyfikacyjneTPodmiot2Dto): Content[] {
  const result: Content[] = [];

  result.push(createLabelText(i18n.t('invoice.subjectIdentificationData.nip'), daneIdentyfikacyjne.NIP));
  if (hasValue(daneIdentyfikacyjne.ImiePierwsze) || hasValue(daneIdentyfikacyjne.Nazwisko)) {
    result.push(
      createLabelText(
          i18n.t('invoice.subjectIdentificationData.nameSurname'),
        `${getValue(daneIdentyfikacyjne.ImiePierwsze)} ${getValue(daneIdentyfikacyjne.Nazwisko)}`
      )
    );
  }
  if (daneIdentyfikacyjne.PelnaNazwa) {
    result.push(createLabelText(i18n.t('invoice.subjectIdentificationData.fullName'), daneIdentyfikacyjne.PelnaNazwa));
  }
  if (daneIdentyfikacyjne.Nazwisko) {
    result.push(createLabelText(i18n.t('invoice.subjectIdentificationData.tradeName'), daneIdentyfikacyjne.NazwaHandlowa));
  }
  return result;
}
