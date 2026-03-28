import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText, getValue, hasValue } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot1Class } from '../../types/FaRR.types';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';

export function generatePodmiot1(podmiot1: Podmiot1Class): Content[] {
  const result: Content[] = createHeader('Sprzedawca');

  if (podmiot1.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot1.DaneIdentyfikacyjne));
  }

  if (podmiot1.Adres) {
    result.push(formatText('Adres', [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot1.Adres));
  }
  if (podmiot1.AdresKoresp) {
    result.push(
      formatText('Adres do korespondencji', [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateAdres(podmiot1.AdresKoresp)
    );
  }
  if (podmiot1.DaneKontaktowe) {
    result.push(
      formatText('Dane kontaktowe', [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot1.DaneKontaktowe)
    );
  }

  if (hasValue(podmiot1.NrKontrahenta)) {
    result.push(createLabelText('Numer kontrahenta: ', getValue(podmiot1.NrKontrahenta)));
  }
  return result;
}
