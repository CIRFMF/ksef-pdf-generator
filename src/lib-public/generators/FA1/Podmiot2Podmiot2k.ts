import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSubHeader,
  generateColumns,
  generateLine,
  getTable,
  getValue,
  hasValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import { Podmiot2, Podmiot2K } from '../../types/fa1.types';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjne } from './PodmiotDaneIdentyfikacyjne';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import i18n from 'i18next';

export function generatePodmiot2Podmiot2K(podmiot2: Podmiot2, podmiot2K: Podmiot2K): Content[] {
  const result: Content[] = [];

  result.push(generateLine());
  result.push(createHeader(i18n.t('invoice.subject2.buyer')));
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];

  firstColumn.push(createSubHeader(i18n.t('invoice.subject2k.identificationData')), createLabelText(i18n.t('invoice.subject2k.eori'), podmiot2.NrEORI));
  if (podmiot2.DaneIdentyfikacyjne) {
    firstColumn.push(...generateDaneIdentyfikacyjne(podmiot2.DaneIdentyfikacyjne));
  }

  if (podmiot2.Email || podmiot2.Telefon) {
    firstColumn.push(generateDaneKontaktowe(podmiot2.Email, getTable(podmiot2.Telefon)));
  }
  if (podmiot2.NrKlienta) {
    firstColumn.push(createLabelText(i18n.t('invoice.subject2.customerNumber'), podmiot2.NrKlienta));
  }
  if (firstColumn.length) {
    result.push({
      columns: [firstColumn, []],
      columnGap: 20,
    });
  }
  if (podmiot2K.DaneIdentyfikacyjne) {
    firstColumn = generateCorrectedContent(podmiot2K, i18n.t('invoice.subject2k.correctedContent'));
    secondColumn = generateCorrectedContent(podmiot2, i18n.t('invoice.subject2k.correctiveContent'));
  }

  if (podmiot2.AdresKoresp) {
    secondColumn.push(
      generatePodmiotAdres(podmiot2.AdresKoresp, i18n.t('invoice.subject2.mailingAddress'), true, [0, 12, 0, 1.3])
    );
  }

  if (firstColumn.length || secondColumn.length) {
    result.push(generateColumns([firstColumn, secondColumn]));
  }
  if (result.length) {
    result.push(verticalSpacing(1));
  }
  return result;
}

export function generateCorrectedContent(podmiot: Podmiot2 | Podmiot2K, headerText: string): Content[] {
  const result: Content[] = [];

  result.push(createSubHeader(headerText));

  if (hasValue(podmiot.PrefiksNabywcy)) {
    result.push(createLabelText(i18n.t('invoice.subject1K.vatPrefix'), podmiot.PrefiksNabywcy));
  }
  if (podmiot.DaneIdentyfikacyjne) {
    if (hasValue(podmiot.DaneIdentyfikacyjne.NrID)) {
      result.push(createLabelText(i18n.t('invoice.subject2.taxIdOther'), podmiot.DaneIdentyfikacyjne.NrID));
    }
    if (getValue(podmiot.DaneIdentyfikacyjne.BrakID) === '1') {
      result.push(createLabelText(i18n.t('invoice.subject2.noId'), ' '));
    }
    result.push(...generateDaneIdentyfikacyjne(podmiot.DaneIdentyfikacyjne));
  }
  if (podmiot.Adres) {
    result.push(generatePodmiotAdres(podmiot.Adres, i18n.t('invoice.subject2.address'), true, [0, 12, 0, 1.3]));
  }
  return result;
}
