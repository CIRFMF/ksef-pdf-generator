import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateColumns,
  generateLine,
  getTable,
  hasValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot2, Podmiot2K } from '../../types/fa3.types';
import { generateAdres } from './Adres';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import i18n from 'i18next';

export function generatePodmiot2Podmiot2K(podmiot2: Podmiot2, podmiot2K: Podmiot2K): Content[] {
  const result: Content[] = [];

  result.push(generateLine());
  result.push(createHeader(i18n.t('invoice.subject2k.buyer')));
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];

  firstColumn.push(
    createHeader(i18n.t('invoice.subject2k.identificationData')),
    createLabelText(i18n.t('invoice.subject2k.eori'), podmiot2.NrEORI)
  );
  if (podmiot2.DaneIdentyfikacyjne) {
    firstColumn.push(...generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot2.DaneIdentyfikacyjne));
  }

  if (podmiot2.DaneKontaktowe) {
    firstColumn.push(generateDaneKontaktowe(getTable(podmiot2.DaneKontaktowe)));
  }
  if (podmiot2.NrKlienta) {
    firstColumn.push(createLabelText(i18n.t('invoice.subject2k.clientNumber'), podmiot2.NrKlienta));
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
      formatText(i18n.t('invoice.subject2k.correspondenceAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
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

export function generateCorrectedContent(podmiot: Podmiot2 | Podmiot2K, header: string): Content[] {
  const result: Content[] = [];

  result.push(createHeader(header));

  if (hasValue(podmiot.IDNabywcy)) {
    result.push(createLabelText(i18n.t('invoice.subject2k.buyerId'), podmiot.IDNabywcy));
  }
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
