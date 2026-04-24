import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateColumns,
  getTable,
  getValue,
  hasValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { generateAdres } from '../FA2/Adres';
import { Podmiot1Class, Podmiot1KClass } from '../../types/FaRR.types';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import { TAXPAYER_STATUS } from '../../../shared/consts/FA.const';
import i18n from 'i18next';
import { translateMap } from '@shared/generators/common/functions';

export function generatePodmiot2Podmiot2K(podmiot2: Podmiot1Class, podmiot2K: Podmiot1KClass): Content[] {
  const result: Content[] = createHeader(i18n.t('invoice.subject2k.buyer'));
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];

  if (podmiot2.DaneIdentyfikacyjne) {
    firstColumn.push(
      createHeader(i18n.t('invoice.subject2k.identificationData')),
      ...generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot2.DaneIdentyfikacyjne)
    );
  }

  if (podmiot2.DaneKontaktowe) {
    firstColumn.push(
      formatText(i18n.t('invoice.subject2k.contactDetails'), [FormatTyp.Label, FormatTyp.LabelMargin])
    );
    firstColumn.push(generateDaneKontaktowe(getTable(podmiot2.DaneKontaktowe)));
  }

  if (hasValue(podmiot2.StatusInfoPodatnika)) {
    const statusInfo: string = translateMap(podmiot2.StatusInfoPodatnika, TAXPAYER_STATUS);

    firstColumn.push(createLabelText(i18n.t('invoice.subject2k.taxPayerStatus'), statusInfo));
  }

  if (firstColumn.length) {
    result.push({
      columns: [firstColumn, []],
      columnGap: 20,
    });
  }
  firstColumn = generateCorrectedContent(podmiot2K, i18n.t('invoice.subject2k.correctedContent'));
  secondColumn = generateCorrectedContent(podmiot2, i18n.t('invoice.subject2k.correctiveContent'));

  if (podmiot2.AdresKoresp) {
    secondColumn.push(
      formatText(i18n.t('invoice.subject2k.mailingAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot2.AdresKoresp)
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

export function generateCorrectedContent(podmiot: Podmiot1Class | Podmiot1KClass, header: string): Content[] {
  const result: Content[] = [];

  result.push(createHeader(header));

  if (podmiot.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot.DaneIdentyfikacyjne));
  }
  if (podmiot.Adres) {
    result.push(
      formatText(i18n.t('invoice.subject2k.address'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot.Adres)
    );
  }
  return result;
}
