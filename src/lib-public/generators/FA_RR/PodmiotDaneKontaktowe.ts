import { Content } from 'pdfmake/interfaces';
import { createLabelText, getTable } from '../../../shared/PDF-functions';
import { DaneKontaktowe } from '../../types/FaRR.types';
import i18n from 'i18next';

export function generateDaneKontaktowe(daneKontaktowe: DaneKontaktowe[]): Content[] {
  return getTable(daneKontaktowe)?.map((daneKontaktowe) => {
    return [
      createLabelText(i18n.t('invoice.subjectContactData.e-mail'), daneKontaktowe.Email),
      createLabelText(i18n.t('invoice.subjectContactData.phone'), daneKontaktowe.Telefon),
    ];
  });
}
