import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText, getTable } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot2 } from '../../types/fa3.types';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { DaneIdentyfikacyjneTPodmiot2Dto } from '../../types/fa2-additional-types';
import { t } from '../../../i18n';

export function generatePodmiot2(podmiot2: Podmiot2): Content[] {
  const result: Content[] = createHeader(t('podmioty.nabywca'));

  result.push(
    createLabelText('Identyfikator nabywcy: ', podmiot2.IDNabywcy),
    createLabelText(t('podmioty.numerEORI'), podmiot2.NrEORI)
  );
  if (podmiot2.DaneIdentyfikacyjne) {
    result.push(
      ...generateDaneIdentyfikacyjneTPodmiot2Dto(
        podmiot2.DaneIdentyfikacyjne as DaneIdentyfikacyjneTPodmiot2Dto
      )
    );
  }

  if (podmiot2.Adres) {
    result.push(formatText(t('podmioty.adres'), [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot2.Adres));
  }
  if (podmiot2.AdresKoresp) {
    result.push(
      formatText(t('podmioty.adresKorespondencyjny'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateAdres(podmiot2.AdresKoresp)
    );
  }
  if (podmiot2.DaneKontaktowe || podmiot2.NrKlienta) {
    result.push(
      formatText(t('podmioty.daneKontaktowe'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot2.DaneKontaktowe ?? []),
      createLabelText(t('podmioty.numerKlienta'), podmiot2.NrKlienta)
    );

    const daneKontaktowe = getTable(podmiot2.DaneKontaktowe);

    if (daneKontaktowe.length) {
      result.push(
        createLabelText(
          t('podmioty.fakturaDotyczyJst'),
          daneKontaktowe[0].JST?._text === '1' ? 'TAK' : 'NIE'
        )
      );
      result.push(
        createLabelText(
          t('podmioty.fakturaDotyczyGv'),
          daneKontaktowe[0].GV?._text === '1' ? 'TAK' : 'NIE'
        )
      );
    }
  }
  return result;
}
