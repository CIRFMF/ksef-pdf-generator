import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText, getTable } from '../../../shared/PDF-functions.js';
import FormatTyp from '../../../shared/enums/common.enum.js';
import { Podmiot1 } from '../../types/fa1.types';
import { generatePodmiotAdres } from './PodmiotAdres.js';
import { generateDaneIdentyfikacyjne } from './PodmiotDaneIdentyfikacyjne.js';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe.js';

export function generatePodmiot1(podmiot1: Podmiot1): Content[] {
  const result: Content[] = createHeader('Sprzedawca');

  result.push(
    createLabelText('NrEORI: ', podmiot1.NrEORI),
    createLabelText('Prefiks VAT: ', podmiot1.PrefiksPodatnika)
  );
  if (podmiot1.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjne(podmiot1.DaneIdentyfikacyjne));
  }

  if (podmiot1.Adres) {
    result.push(generatePodmiotAdres(podmiot1.Adres, 'Adres', true, [0, 12, 0, 1.3]));
  }
  if (podmiot1.AdresKoresp) {
    result.push(
      ...generatePodmiotAdres(podmiot1.AdresKoresp, 'Adres do korespondencji', true, [0, 12, 0, 1.3])
    );
  }
  if (podmiot1.Email || podmiot1.Telefon) {
    result.push(
      formatText('Dane kontaktowe', [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot1.Email, getTable(podmiot1.Telefon))
    );

    result.push(createLabelText('Status podatnika: ', podmiot1.StatusInfoPodatnika));
  } else if (podmiot1.StatusInfoPodatnika) {
    result.push(createLabelText('Status podatnika: ', podmiot1.StatusInfoPodatnika));
  }
  return result;
}
