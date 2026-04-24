import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText, getValue, hasValue } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { generateAdres } from './Adres';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { Podmiot1Class } from '../../types/FaRR.types';
import { TAXPAYER_STATUS } from '../../../shared/consts/FA.const';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import i18n from 'i18next';
import { translateMap } from '@shared/generators/common/functions';

export function generatePodmiot2(podmiot2: Podmiot1Class): Content[] {
  const result: Content[] = createHeader(i18n.t('invoice.subject2.buyer'));

  if (podmiot2.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot2Dto(podmiot2.DaneIdentyfikacyjne));
  }

  if (podmiot2.Adres) {
    result.push(
      formatText(i18n.t('invoice.subject2.address'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot2.Adres)
    );
  }
  if (podmiot2.AdresKoresp) {
    result.push(
      formatText(i18n.t('invoice.subject2.mailingAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateAdres(podmiot2.AdresKoresp)
    );
  }
  if (podmiot2.DaneKontaktowe) {
    result.push(
      formatText(i18n.t('invoice.subject2.contactDetails'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot2.DaneKontaktowe)
    );
  }
  if (hasValue(podmiot2.StatusInfoPodatnika)) {
    const statusInfo: string = translateMap(podmiot2.StatusInfoPodatnika, TAXPAYER_STATUS);

    result.push(createLabelText(i18n.t('invoice.subject2.taxPayerStatus'), statusInfo));
  }
  return result;
}
