import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText, getValue, hasValue } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { generateAdres } from './Adres';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { Podmiot1Class } from '../../types/FaRR.types';
import { TAXPAYER_STATUS } from '../../../shared/consts/FA.const';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';

export function generatePodmiot2(podmiot2: Podmiot1Class): Content[] {
  const result: Content[] = createHeader('Nabywca');

  if (podmiot2.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot2.DaneIdentyfikacyjne));
  }

  if (podmiot2.Adres) {
    result.push(formatText('Adres', [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot2.Adres));
  }
  if (podmiot2.AdresKoresp) {
    result.push(
      formatText('Adres do korespondencji', [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateAdres(podmiot2.AdresKoresp)
    );
  }
  if (podmiot2.DaneKontaktowe) {
    result.push(
      formatText('Dane kontaktowe', [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot2.DaneKontaktowe)
    );
  }
  if (hasValue(podmiot2.StatusInfoPodatnika)) {
    const statusInfo: string = TAXPAYER_STATUS[getValue(podmiot2.StatusInfoPodatnika)!];

    result.push(createLabelText('Status podatnika: ', statusInfo));
  }
  return result;
}
