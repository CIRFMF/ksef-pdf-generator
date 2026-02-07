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
import { TAXPAYER_STATUS } from '../../../shared/consts/const';
import { t } from '../../../i18n';

export function generatePodmiot1Podmiot1K(podmiot1: Podmiot1, podmiot1K: Podmiot1K): Content[] {
  const result: Content[] = createHeader(t('podmioty.sprzedawca'));
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];

  firstColumn.push(createHeader('Dane identyfikacyjne'), createLabelText(t('podmioty.numerEORI'), podmiot1.NrEORI));
  if (podmiot1.DaneIdentyfikacyjne) {
    firstColumn.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot1.DaneIdentyfikacyjne));
  }

  if (podmiot1.DaneKontaktowe) {
    firstColumn.push(generateDaneKontaktowe(getTable(podmiot1.DaneKontaktowe)));
  }
  if (podmiot1.StatusInfoPodatnika) {
    const statusInfo: string = TAXPAYER_STATUS[getValue(podmiot1.StatusInfoPodatnika)!];

    firstColumn.push(createLabelText(t('podmioty.statusPodatnika'), statusInfo));
  }
  if (firstColumn.length) {
    result.push(firstColumn);
  }
  firstColumn = generateCorrectedContent(podmiot1K, 'Treść korygowana');
  secondColumn = generateCorrectedContent(podmiot1, 'Treść korygująca');

  if (podmiot1.AdresKoresp) {
    secondColumn.push(
      formatText(t('podmioty.adresKorespondencyjny'), [FormatTyp.Label, FormatTyp.LabelMargin]),
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
    result.push(createLabelText(t('podmioty.prefiksVAT'), podmiot.PrefiksPodatnika));
  }
  if (podmiot.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot.DaneIdentyfikacyjne));
  }
  if (podmiot.Adres) {
    result.push(formatText(t('podmioty.adres'), [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot.Adres));
  }
  return result;
}
