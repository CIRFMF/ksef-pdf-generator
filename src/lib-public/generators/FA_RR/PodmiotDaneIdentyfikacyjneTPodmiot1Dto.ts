import { Content } from 'pdfmake/interfaces';
import { createLabelText } from '../../../shared/PDF-functions';
import { Podmiot1KDaneIdentyfikacyjne } from '../../types/FaRR.types';

export function generateDaneIdentyfikacyjneTPodmiot1Dto(
  daneIdentyfikacyjne: Podmiot1KDaneIdentyfikacyjne
): Content[] {
  return [
    createLabelText('NIP: ', daneIdentyfikacyjne.NIP),
    createLabelText('Nazwa: ', daneIdentyfikacyjne.Nazwa),
  ];
}
