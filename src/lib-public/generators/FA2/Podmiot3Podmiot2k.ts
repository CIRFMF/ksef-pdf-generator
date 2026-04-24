import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  generateLine,
  generateTwoColumns,
  getTable,
  hasValue,
} from '../../../shared/PDF-functions';
import { Podmiot3Podmiot2KDto } from '../../types/fa2-additional-types';
import { translateMap } from '@shared/generators/common/functions';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot1DaneKontaktowe, Podmiot2K, Podmiot3 } from '../../types/fa2.types';
import { Adres } from '../../types/fa1.types';
import { FA2RolaPodmiotu3 } from '../../../shared/consts/FA.const';
import i18n from 'i18next';

export function generateDaneIdentyfikacyjneTPodmiot3Dto(
  podmiot2KDto: Podmiot3Podmiot2KDto | undefined,
  index: number
): Content[] {
  if (!podmiot2KDto) {
    return [];
  }
  const podmiot1: Podmiot3 = podmiot2KDto.fakturaPodmiotNDto;
  const podmiot1DaneKontaktowe: Podmiot1DaneKontaktowe[] = getTable(podmiot1.DaneKontaktowe);
  const podmiot1K: (Podmiot2K & { Adres?: Adres }) | undefined = podmiot2KDto.podmiot2KDto;
  const result: Content[] = [];

  result.push(generateLine());
  result.push(createHeader(`${i18n.t('invoice.subject3k.otherEntity')} ${index + 1}`));

  if (
    hasValue(podmiot1.NrEORI) ||
    hasValue(podmiot1.Rola) ||
    hasValue(podmiot1.OpisRoli) ||
    hasValue(podmiot1?.Udzial)
  ) {
    result.push(
      ...createHeader(i18n.t('invoice.subject3k.identificationData')),
      createLabelText(i18n.t('invoice.subject3k.eori'), podmiot1.NrEORI),
      createLabelText(i18n.t('invoice.subject3k.role'), translateMap(podmiot1.Rola, FA2RolaPodmiotu3)),
      createLabelText(i18n.t('invoice.subject3k.otherRole'), podmiot1.OpisRoli),
      createLabelText(i18n.t('invoice.subject3k.share'), podmiot1.Udzial, FormatTyp.Percentage)
    );
  }

  if (podmiot1DaneKontaktowe.length > 0 || hasValue(podmiot1.NrKlienta)) {
    result.push(generateDaneKontaktowe(podmiot1.DaneKontaktowe ?? []));
    result.push(createLabelText(i18n.t('invoice.subject3k.clientNumber'), podmiot1.NrKlienta));
  }
  const columns1: Content[] = [
    ...createHeader(i18n.t('invoice.subject3k.correctedContent')),
    createLabelText(i18n.t('invoice.subject3k.getterId'), podmiot1K?.IDNabywcy),
  ];

  if (podmiot1K?.DaneIdentyfikacyjne) {
    columns1.push(generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot1K.DaneIdentyfikacyjne));
  }
  if (podmiot1K?.Adres) {
    columns1.push(generatePodmiotAdres(podmiot1K.Adres));
  }
  const columns2: Content[] = [
    ...createHeader(i18n.t('invoice.subject3k.correctiveContent')),
    createLabelText(i18n.t('invoice.subject3k.getterId'), podmiot1?.IDNabywcy),
  ];

  if (podmiot1?.DaneIdentyfikacyjne) {
    columns2.push(generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot1.DaneIdentyfikacyjne));
  }
  if (podmiot1?.Adres) {
    columns2.push(generatePodmiotAdres(podmiot1.Adres));
  }

  if (podmiot1.AdresKoresp != null) {
    columns2.push(
      generatePodmiotAdres(podmiot1.AdresKoresp, i18n.t('invoice.subject3k.correspondenceAddress'))
    );
  }
  result.push(generateTwoColumns(columns1, columns2));
  return result;
}
