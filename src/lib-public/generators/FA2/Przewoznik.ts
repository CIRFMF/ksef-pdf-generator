import { Content } from 'pdfmake/interfaces';
import { createHeader, generateTwoColumns } from '../../../shared/PDF-functions';
import { Przewoznik } from '../../types/fa2.types';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import i18n from 'i18next';

export function generatePrzewoznik(przewoznik: Przewoznik | undefined): Content {
  if (!przewoznik) {
    return [];
  }
  return [
    ...createHeader(i18n.t('invoice.carrier.carrier')),
    [
      generateTwoColumns(
        generateDaneIdentyfikacyjneTPodmiot2Dto(przewoznik.DaneIdentyfikacyjne as any),
        generatePodmiotAdres(
          przewoznik.AdresPrzewoznika,
          i18n.t('invoice.carrier.carrierAddress'),
          true,
          [0, 0, 0, 0]
        ),
        [0, 0, 0, 8]
      ),
    ],
  ];
}
