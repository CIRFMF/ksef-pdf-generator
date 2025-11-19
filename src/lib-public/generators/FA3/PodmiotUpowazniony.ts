import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, hasValue } from '../../../shared/PDF-functions.js';
import { PodmiotUpowazniony } from '../../types/fa3.types';
import { generatePodmiotAdres } from './PodmiotAdres.js';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto.js';
import { generatePodmiotUpowaznionyDaneKontaktowe } from './PodmiotUpowaznionyDaneKontaktowe.js';
import { getRolaUpowaznionegoString } from '../../../shared/generators/common/functions.js';

export function generatePodmiotUpowazniony(podmiotUpowazniony: PodmiotUpowazniony | undefined): Content[] {
  if (!podmiotUpowazniony) {
    return [];
  }
  const result: Content[] = createHeader('Podmiot upoważniony');

  if (hasValue(podmiotUpowazniony.RolaPU)) {
    result.push(createLabelText('Rola: ', getRolaUpowaznionegoString(podmiotUpowazniony.RolaPU, 3)));
  }
  if (hasValue(podmiotUpowazniony.NrEORI)) {
    result.push(createLabelText('Numer EORI: ', podmiotUpowazniony.NrEORI));
  }
  if (podmiotUpowazniony.DaneIdentyfikacyjne) {
    result.push(generateDaneIdentyfikacyjneTPodmiot1Dto(podmiotUpowazniony.DaneIdentyfikacyjne));
  }
  result.push([
    ...generatePodmiotAdres(podmiotUpowazniony.Adres),
    ...generatePodmiotAdres(podmiotUpowazniony.AdresKoresp, 'Adres korespondencyjny'),
    ...generatePodmiotUpowaznionyDaneKontaktowe(podmiotUpowazniony.DaneKontaktowe),
  ]);

  return result;
}
