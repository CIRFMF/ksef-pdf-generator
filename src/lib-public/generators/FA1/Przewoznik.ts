import { Content } from 'pdfmake/interfaces';
import { createHeader, generateTwoColumns } from '../../../shared/PDF-functions';
import { Przewoznik } from '../../types/fa1.types';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjne } from './PodmiotDaneIdentyfikacyjne';
import i18n from 'i18next';

export function generatePrzewoznik(przewoznik: Przewoznik | undefined): Content {
  if (!przewoznik) {
    return [];
  }
  return [
    ...createHeader(i18n.t('invoice.carrier.carrier')),
    [
      generateTwoColumns(
        generateDaneIdentyfikacyjne(przewoznik.DaneIdentyfikacyjne as any),
        generatePodmiotAdres(przewoznik.AdresPrzewoznika, i18n.t('invoice.carrier.carrierAddress'), true, [0, 0, 0, 0]),
        [0, 0, 0, 8]
      ),
    ],
  ];
}
