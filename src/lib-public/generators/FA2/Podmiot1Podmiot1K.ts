import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateColumns,
  getTable,
  getValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot1, Podmiot1K } from '../../types/fa2.types';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { TAXPAYER_STATUS } from '../../../shared/consts/FA.const';
import { translateMap } from '@shared/generators/common/functions';
import i18n from 'i18next';

export function generatePodmiot1Podmiot1K(podmiot1: Podmiot1, podmiot1K: Podmiot1K): Content[] {
  const result: Content[] = createHeader(i18n.t('invoice.subject1K.seller'));
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];

  firstColumn.push(
    createHeader(i18n.t('invoice.subject1K.identificationData')),
    createLabelText(i18n.t('invoice.subject1K.eoriNumber'), podmiot1.NrEORI)
  );
  if (podmiot1.DaneIdentyfikacyjne) {
    firstColumn.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot1.DaneIdentyfikacyjne));
  }

  if (podmiot1.DaneKontaktowe) {
    firstColumn.push(generateDaneKontaktowe(getTable(podmiot1.DaneKontaktowe)));
  }
  if (podmiot1.StatusInfoPodatnika) {
    const statusInfo: string = translateMap(podmiot1.StatusInfoPodatnika, TAXPAYER_STATUS);

    firstColumn.push(createLabelText(i18n.t('invoice.subject1K.taxpayerStatus'), statusInfo));
  }
  if (firstColumn.length) {
    result.push(firstColumn);
  }
  firstColumn = generateCorrectedContent(podmiot1K, i18n.t('invoice.subject1K.correctedContent'));
  secondColumn = generateCorrectedContent(podmiot1, i18n.t('invoice.subject1K.correctiveContent'));

  if (podmiot1.AdresKoresp) {
    secondColumn.push(
      formatText(i18n.t('invoice.subject1K.correspondenceAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot1.AdresKoresp)
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

export function generateCorrectedContent(podmiot: Podmiot1 | Podmiot1K, header: string): Content[] {
  const result: Content[] = [];

  result.push(createHeader(header));

  if (podmiot.PrefiksPodatnika?._text) {
    result.push(createLabelText(i18n.t('invoice.subject1K.vatPrefix'), podmiot.PrefiksPodatnika));
  }
  if (podmiot.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot.DaneIdentyfikacyjne));
  }
  if (podmiot.Adres) {
    result.push(
      formatText(i18n.t('invoice.subject1K.address'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot.Adres)
    );
  }
  return result;
}
