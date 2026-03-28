import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText, getValue } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot2 } from '../../types/fa3.types';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { DaneIdentyfikacyjneTPodmiot2Dto } from '../../types/fa2-additional-types';

export function generatePodmiot2(podmiot2: Podmiot2): Content[] {
  const result: Content[] = createHeader('Nabywca');

  result.push(
    createLabelText('Identyfikator nabywcy: ', podmiot2.IDNabywcy),
    createLabelText('Numer EORI: ', podmiot2.NrEORI)
  );
  if (podmiot2.DaneIdentyfikacyjne) {
    result.push(
      ...generateDaneIdentyfikacyjneTPodmiot2Dto(
        podmiot2.DaneIdentyfikacyjne as DaneIdentyfikacyjneTPodmiot2Dto
      )
    );
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
  if (podmiot2.DaneKontaktowe || podmiot2.NrKlienta) {
    result.push(
      formatText('Dane kontaktowe', [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot2.DaneKontaktowe ?? []),
      createLabelText('Numer klienta: ', podmiot2.NrKlienta)
    );
  }

  if (podmiot2?.JST) {
    result.push(
      createLabelText(
        'Faktura dotyczy jednostki podrzędnej JST: ',
        getValue(podmiot2?.JST)?.toString().trim() === '1' ? 'TAK' : 'NIE',
        FormatTyp.Default,
        { marginTop: 8 }
      )
    );
  }

  if (podmiot2?.GV) {
    result.push(
      createLabelText(
        'Faktura dotyczy członka grupy GV: ',
        getValue(podmiot2?.GV)?.toString().trim() === '1' ? 'TAK' : 'NIE',
        FormatTyp.Default,
        podmiot2?.JST ? {} : { marginTop: 8 }
      )
    );
  }

  return result;
}
