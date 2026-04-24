import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSubHeader,
  generateTwoColumns,
  getTable,
  getValue,
  hasValue,
} from '@shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot3Podmiot2KDto } from '../../types/fa1-additional-types';
import { translateMap } from '@shared/generators/common/functions';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjne } from './PodmiotDaneIdentyfikacyjne';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { Podmiot2K, Podmiot3 } from '../../types/fa1.types';
import { FA1RolaPodmiotu3 } from '@shared/consts/FA.const';
import i18n from 'i18next';

export function generateDaneIdentyfikacyjneTPodmiot3Dto(
  podmiot2KDto: Podmiot3Podmiot2KDto | undefined,
  index: number
): Content[] {
  if (!podmiot2KDto) {
    return [];
  }
  const podmiot1: Podmiot3 = podmiot2KDto.fakturaPodmiotNDto;
  const podmiot1K: Podmiot2K | undefined = podmiot2KDto.podmiot2KDto;
  const result: Content[] = createHeader(`${i18n.t('invoice.subject3k.otherEntity')} ${index + 1}`);

  if (
    hasValue(podmiot1.NrEORI) ||
    hasValue(podmiot1.Rola) ||
    hasValue(podmiot1.OpisRoli) ||
    hasValue(podmiot1?.Udzial)
  ) {
    result.push(
      ...createSubHeader(i18n.t('invoice.subject3k.identificationData')),
      createLabelText(i18n.t('invoice.subject3k.eori'), podmiot1.NrEORI),
      createLabelText(i18n.t('invoice.subject3k.role'), translateMap(podmiot1.Rola, FA1RolaPodmiotu3)),
      createLabelText(i18n.t('invoice.subject3k.otherRole'), podmiot1.OpisRoli),
      createLabelText(i18n.t('invoice.subject3k.share'), podmiot1.Udzial, FormatTyp.Percentage)
    );
  }

  if (podmiot1.Email || podmiot1.Telefon) {
    result.push(generateDaneKontaktowe(podmiot1.Email, getTable(podmiot1.Telefon)));
  }
  if (hasValue(podmiot1.NrKlienta)) {
    result.push(createLabelText(i18n.t('invoice.subject3k.clientNumber'), podmiot1.NrKlienta));
  }
  const columns1: Content[] = [...createSubHeader(i18n.t('invoice.subject3k.correctedContent'))];

  if (hasValue(podmiot1K?.DaneIdentyfikacyjne?.NrID)) {
    columns1.push(createLabelText(i18n.t('invoice.subject3k.otherTaxId'), podmiot1K?.DaneIdentyfikacyjne?.NrID));
  }
  if (getValue(podmiot1K?.DaneIdentyfikacyjne?.BrakID) === '1') {
    columns1.push(createLabelText(i18n.t('invoice.subject3k.noTaxId'), ' '));
  }

  if (podmiot1K?.DaneIdentyfikacyjne) {
    columns1.push(generateDaneIdentyfikacyjne(podmiot1K.DaneIdentyfikacyjne));
  }
  if (podmiot1K?.Adres) {
    columns1.push(generatePodmiotAdres(podmiot1K.Adres, i18n.t('invoice.subject3k.address'), true));
  }
  const columns2: Content[] = [...createSubHeader(i18n.t('invoice.subject3k.correctiveContent'))];

  if (hasValue(podmiot1.DaneIdentyfikacyjne?.NrID)) {
    columns2.push(createLabelText(i18n.t('invoice.subject3k.otherTaxId'), podmiot1.DaneIdentyfikacyjne?.NrID));
  }
  if (getValue(podmiot1.DaneIdentyfikacyjne?.BrakID) === '1') {
    columns2.push(createLabelText(i18n.t('invoice.subject3k.noTaxId'), ' '));
  }

  if (podmiot1?.DaneIdentyfikacyjne) {
    columns2.push(generateDaneIdentyfikacyjne(podmiot1.DaneIdentyfikacyjne));
  }
  if (podmiot1?.Adres) {
    columns2.push(generatePodmiotAdres(podmiot1.Adres, i18n.t('invoice.subject3k.address'), true));
  }

  if (podmiot1.AdresKoresp != null) {
    columns2.push(generatePodmiotAdres(podmiot1.AdresKoresp, i18n.t('invoice.subject3k.correspondenceAddress'), true));
  }
  result.push(generateTwoColumns(columns1, columns2));
  return result;
}
