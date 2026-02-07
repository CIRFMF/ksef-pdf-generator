import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, hasValue } from '../../../shared/PDF-functions';
import { PodmiotUpowazniony } from '../../types/fa3.types';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import { generatePodmiotUpowaznionyDaneKontaktowe } from './PodmiotUpowaznionyDaneKontaktowe';
import { getRolaUpowaznionegoString } from '../../../shared/generators/common/functions';
import { t } from '../../../i18n';

export function generatePodmiotUpowazniony(podmiotUpowazniony: PodmiotUpowazniony | undefined): Content[] {
  if (!podmiotUpowazniony) {
    return [];
  }
  const result: Content[] = createHeader('Podmiot upoważniony');

  if (hasValue(podmiotUpowazniony.RolaPU)) {
    result.push(createLabelText('Rola: ', getRolaUpowaznionegoString(podmiotUpowazniony.RolaPU, 3)));
  }
  if (hasValue(podmiotUpowazniony.NrEORI)) {
    result.push(createLabelText(t('podmioty.numerEORI'), podmiotUpowazniony.NrEORI));
  }
  if (podmiotUpowazniony.DaneIdentyfikacyjne) {
    result.push(generateDaneIdentyfikacyjneTPodmiot1Dto(podmiotUpowazniony.DaneIdentyfikacyjne));
  }
  result.push([
    ...generatePodmiotAdres(podmiotUpowazniony.Adres, t('podmioty.adres')),
    ...generatePodmiotAdres(podmiotUpowazniony.AdresKoresp, t('podmioty.adresKorespondencyjny')),
    ...generatePodmiotUpowaznionyDaneKontaktowe(podmiotUpowazniony.DaneKontaktowe),
  ]);

  return result;
}
