import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSection,
  formatText,
  generateTwoColumns,
  getTable,
  getValue,
  hasValue,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot3 } from '../../types/fa1.types';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjne } from './PodmiotDaneIdentyfikacyjne';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { translateMap } from '@shared/generators/common/functions';
import { FA1RolaPodmiotu3 } from '../../../shared/consts/FA.const';
import i18n from 'i18next';

export function generatePodmiot3(podmiot: Podmiot3, index: number): Content[] {
  const result: Content[] = [];

  const column1: Content[] = [
    ...createHeader(i18n.t('invoice.subject3.otherEntity', { index: index + 1 })),
    createLabelText(i18n.t('invoice.subject3.eori'), podmiot.NrEORI),
  ];

  if (hasValue(podmiot.DaneIdentyfikacyjne?.NrID)) {
    column1.push(createLabelText(i18n.t('invoice.subject3.otherTaxId'), podmiot.DaneIdentyfikacyjne?.NrID));
  }
  if (getValue(podmiot.DaneIdentyfikacyjne?.BrakID) === '1') {
    column1.push(createLabelText(i18n.t('invoice.subject3.noTaxId'), ' '));
  }
  if (podmiot.DaneIdentyfikacyjne) {
    column1.push(...generateDaneIdentyfikacyjne(podmiot.DaneIdentyfikacyjne));
  }
  column1.push([
    createLabelText(i18n.t('invoice.subject3.role'), translateMap(podmiot.Rola, FA1RolaPodmiotu3)),
    createLabelText(i18n.t('invoice.subject3.otherRole'), podmiot.OpisRoli),
    createLabelText(i18n.t('invoice.subject3.share'), podmiot.Udzial, [FormatTyp.Percentage]),
  ]);
  const column2: Content[] = [];

  if (podmiot.Adres) {
    column2.push(generatePodmiotAdres(podmiot.Adres, i18n.t('invoice.subject3.address'), true, [0, 12, 0, 1.3]));
  }
  if (podmiot.AdresKoresp) {
    column2.push(
      ...generatePodmiotAdres(podmiot.AdresKoresp, i18n.t('invoice.subject3.correspondenceAddress'), true, [0, 12, 0, 1.3])
    );
  }
  if (podmiot.Email || podmiot.Telefon) {
    column2.push(
      formatText(i18n.t('invoice.subject3.contactData'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot.Email, getTable(podmiot.Telefon))
    );
  }
  if (podmiot.NrKlienta) {
    column2.push(createLabelText(i18n.t('invoice.subject3.clientNumber'), podmiot.NrKlienta));
  }
  result.push(generateTwoColumns(column1, column2));
  return createSection(result, true);
}
