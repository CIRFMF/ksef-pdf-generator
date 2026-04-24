import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot2 } from '../../types/fa2.types';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { DaneIdentyfikacyjneTPodmiot2Dto } from '../../types/fa2-additional-types';
import i18n from 'i18next';

export function generatePodmiot2(podmiot2: Podmiot2): Content[] {
  const result: Content[] = createHeader(i18n.t('invoice.subject2.buyer'));

  result.push(
    createLabelText(i18n.t('invoice.subject2.getterId'), podmiot2.IDNabywcy),
    createLabelText(i18n.t('invoice.subject2.eoriNumber'), podmiot2.NrEORI)
  );
  if (podmiot2.DaneIdentyfikacyjne) {
    result.push(
      ...generateDaneIdentyfikacyjneTPodmiot2Dto(
        podmiot2.DaneIdentyfikacyjne as DaneIdentyfikacyjneTPodmiot2Dto
      )
    );
  }

  if (podmiot2.Adres) {
    result.push(
      formatText(i18n.t('invoice.subject2.address'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot2.Adres)
    );
  }
  if (podmiot2.AdresKoresp) {
    result.push(
      formatText(i18n.t('invoice.subject2.correspondenceAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateAdres(podmiot2.AdresKoresp)
    );
  }
  if (podmiot2.DaneKontaktowe) {
    result.push(
      formatText(i18n.t('invoice.subject2.contactDetails'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot2.DaneKontaktowe),
      createLabelText(i18n.t('invoice.subject2.customerNumber'), podmiot2.NrKlienta)
    );
  }
  return result;
}
