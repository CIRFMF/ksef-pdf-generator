import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, hasValue } from '../../../shared/PDF-functions';
import { PodmiotUpowazniony } from '../../types/fa3.types';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import { generatePodmiotUpowaznionyDaneKontaktowe } from './PodmiotUpowaznionyDaneKontaktowe';
import { translateMap } from '@shared/generators/common/functions';
import { TRolaPodmiotuUpowaznionegoFA3 } from '@shared/consts/FA.const';

export function generatePodmiotUpowazniony(podmiotUpowazniony: PodmiotUpowazniony | undefined): Content[] {
  if (!podmiotUpowazniony) {
    return [];
  }
  const result: Content[] = createHeader('Podmiot upoważniony');

  if (hasValue(podmiotUpowazniony.RolaPU)) {
    result.push(
      createLabelText('Rola: ', translateMap(podmiotUpowazniony.RolaPU, TRolaPodmiotuUpowaznionegoFA3))
    );
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
