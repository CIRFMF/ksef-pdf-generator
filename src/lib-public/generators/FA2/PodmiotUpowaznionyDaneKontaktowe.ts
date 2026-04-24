import { Content } from 'pdfmake/interfaces';
import {
  createLabelText,
  formatText,
  getTable,
  hasValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { PodmiotUpowaznionyDaneKontaktowe } from '../../types/fa2.types';
import i18n from 'i18next';

export function generatePodmiotUpowaznionyDaneKontaktowe(
  daneKontaktoweSource: PodmiotUpowaznionyDaneKontaktowe[] | undefined
): Content[] {
  if (!daneKontaktoweSource) {
    return [];
  }
  const result: Content[] = [
    formatText(i18n.t('invoice.authorizedSubject.contactData'), FormatTyp.Description),
  ];
  const daneKontaktowe: PodmiotUpowaznionyDaneKontaktowe[] = getTable(daneKontaktoweSource);

  if (daneKontaktowe.length === 0) {
    return [];
  }
  daneKontaktowe.forEach((kontakt: PodmiotUpowaznionyDaneKontaktowe): void => {
    if (hasValue(kontakt.EmailPU)) {
      result.push(createLabelText(i18n.t('invoice.authorizedSubject.email'), kontakt.EmailPU));
    }
    if (hasValue(kontakt.TelefonPU)) {
      result.push(createLabelText(i18n.t('invoice.authorizedSubject.phone'), kontakt.TelefonPU));
    }
    result.push(verticalSpacing(1));
  });
  return result;
}
