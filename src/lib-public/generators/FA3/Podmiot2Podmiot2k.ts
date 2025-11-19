import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  getTable,
  verticalSpacing,
} from '../../../shared/PDF-functions.js';
import FormatTyp from '../../../shared/enums/common.enum.js';
import { Podmiot2, Podmiot2K } from '../../types/fa3.types';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto.js';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe.js';
import { generateCorrectedContent } from '../FA2/Podmiot2Podmiot2k.js';
import { generateAdres } from '../FA2/Adres.js';

export function generatePodmiot2Podmiot2K(podmiot2: Podmiot2, podmiot2K: Podmiot2K): Content[] {
  const result: Content[] = createHeader('Nabywca');
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];

  firstColumn.push(createHeader('Dane identyfikacyjne'), createLabelText('Numer EORI: ', podmiot2.NrEORI));
  if (podmiot2.DaneIdentyfikacyjne) {
    firstColumn.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot2.DaneIdentyfikacyjne));
  }

  if (podmiot2.DaneKontaktowe) {
    firstColumn.push(formatText('Dane kontaktowe', [FormatTyp.Label, FormatTyp.LabelMargin]));
    if (podmiot2.NrKlienta) {
      firstColumn.push(createLabelText('Numer klienta: ', podmiot2.NrKlienta));
    }
    firstColumn.push(generateDaneKontaktowe(getTable(podmiot2.DaneKontaktowe)));
  }

  if (firstColumn.length) {
    result.push({
      columns: [firstColumn, []],
      columnGap: 20,
    });
  }
  firstColumn = generateCorrectedContent(podmiot2K);
  secondColumn = generateCorrectedContent(podmiot2);
  if (podmiot2.AdresKoresp) {
    secondColumn.push(
      formatText('Adres do korespondencji', [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot2.AdresKoresp)
    );
  }

  if (firstColumn.length || secondColumn.length) {
    result.push({
      columns: [firstColumn, secondColumn],
      columnGap: 20,
    });
  }
  if (result.length) {
    result.push(verticalSpacing(1));
  }
  return result;
}
