import { Content } from 'pdfmake/interfaces';
import { createLabelText } from '../../../shared/PDF-functions';
import { FP } from '../../types/fa1.types';
import i18n from 'i18next';

export function generateDaneKontaktowe(email?: FP, telefon?: FP[]): Content[] {
  const result: Content[] = [];

  if (email) {
    result.push(createLabelText(i18n.t('invoice.subjectContactData.email'), email));
  }
  if (telefon) {
    telefon.forEach((item) => {
      result.push(createLabelText(i18n.t('invoice.subjectContactData.phone'), `${item._text}\n`));
    });
  }
  return result;
}
