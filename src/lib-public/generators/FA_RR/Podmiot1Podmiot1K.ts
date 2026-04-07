import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateColumns,
  getTable,
  getValue,
  hasValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { generateAdres } from './Adres';
import { Podmiot1Class, Podmiot1KClass } from '../../types/FaRR.types';

export function generatePodmiot1Podmiot1K(podmiot1: Podmiot1Class, podmiot1K: Podmiot1KClass): Content[] {
  const result: Content[] = createHeader('Sprzedawca');
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];

  if (podmiot1.DaneIdentyfikacyjne) {
    firstColumn.push(
      createHeader('Dane identyfikacyjne'),
      ...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot1.DaneIdentyfikacyjne)
    );
  }

  if (podmiot1.DaneKontaktowe) {
    const daneKontaktowe = generateDaneKontaktowe(getTable(podmiot1.DaneKontaktowe));

    if (daneKontaktowe.length) {
      firstColumn.push(createHeader('Dane kontaktowe'));
      firstColumn.push(daneKontaktowe);
    }
  }
  if (hasValue(podmiot1.NrKontrahenta)) {
    firstColumn.push(createLabelText('Numer kontrahenta: ', getValue(podmiot1.NrKontrahenta)));
  }

  if (firstColumn.length) {
    result.push({
      columns: [firstColumn, []],
      columnGap: 20,
    });
  }
  firstColumn = generateCorrectedContent(podmiot1K, 'Treść korygowana');
  secondColumn = generateCorrectedContent(podmiot1, 'Treść korygująca');

  if (podmiot1.AdresKoresp) {
    secondColumn.push(
      formatText('Adres do korespondencji', [FormatTyp.Label, FormatTyp.LabelMargin]),
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

export function generateCorrectedContent(podmiot: Podmiot1Class | Podmiot1KClass, header: string): Content[] {
  const result: Content[] = [];

  result.push(createHeader(header));

  if (podmiot.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot.DaneIdentyfikacyjne));
  }
  if (podmiot.Adres) {
    result.push(formatText('Adres', [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot.Adres));
  }
  return result;
}
