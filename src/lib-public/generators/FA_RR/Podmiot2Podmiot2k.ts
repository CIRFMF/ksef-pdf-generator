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
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { generateAdres } from '../FA2/Adres';
import { Podmiot1Class, Podmiot1KClass } from '../../types/FaRR.types';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import { TAXPAYER_STATUS } from '../../../shared/consts/FA.const';

export function generatePodmiot2Podmiot2K(podmiot2: Podmiot1Class, podmiot2K: Podmiot1KClass): Content[] {
  const result: Content[] = createHeader('Nabywca');
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];

  if (podmiot2.DaneIdentyfikacyjne) {
    firstColumn.push(
      createHeader('Dane identyfikacyjne'),
      ...generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot2.DaneIdentyfikacyjne)
    );
  }

  if (podmiot2.DaneKontaktowe) {
    firstColumn.push(formatText('Dane kontaktowe', [FormatTyp.Label, FormatTyp.LabelMargin]));
    firstColumn.push(generateDaneKontaktowe(getTable(podmiot2.DaneKontaktowe)));
  }

  if (hasValue(podmiot2.StatusInfoPodatnika)) {
    const statusInfo: string = TAXPAYER_STATUS[getValue(podmiot2.StatusInfoPodatnika)!];

    firstColumn.push(createLabelText('Status podatnika: ', statusInfo));
  }

  if (firstColumn.length) {
    result.push({
      columns: [firstColumn, []],
      columnGap: 20,
    });
  }
  firstColumn = generateCorrectedContent(podmiot2K, 'Treść korygowana');
  secondColumn = generateCorrectedContent(podmiot2, 'Treść korygująca');

  if (podmiot2.AdresKoresp) {
    secondColumn.push(
      formatText('Adres do korespondencji', [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot2.AdresKoresp)
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
    result.push(...generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot.DaneIdentyfikacyjne));
  }
  if (podmiot.Adres) {
    result.push(formatText('Adres', [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot.Adres));
  }
  return result;
}
