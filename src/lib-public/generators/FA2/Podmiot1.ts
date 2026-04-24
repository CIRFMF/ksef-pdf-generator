import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText, getValue, hasValue } from '../../../shared/PDF-functions';
import { Podmiot1 } from '../../types/fa2.types';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import FormatTyp from '../../../shared/enums/common.enum';
import { TAXPAYER_STATUS } from '../../../shared/consts/FA.const';
import { translateMap } from '@shared/generators/common/functions';
import i18n from 'i18next';

export function generatePodmiot1(podmiot1: Podmiot1): Content[] {
  const result: Content[] = createHeader(i18n.t('invoice.subject1.seller'));

  result.push(
    createLabelText(i18n.t('invoice.subject1.eoriNumber'), podmiot1.NrEORI),
    createLabelText(i18n.t('invoice.subject1.vatPrefix'), podmiot1.PrefiksPodatnika)
  );
  if (podmiot1.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot1.DaneIdentyfikacyjne));
  }

  if (podmiot1.Adres) {
    result.push(
      formatText(i18n.t('invoice.subject1.address'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot1.Adres)
    );
  }
  if (podmiot1.AdresKoresp) {
    result.push(
      formatText(i18n.t('invoice.subject1.correspondenceAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateAdres(podmiot1.AdresKoresp)
    );
  }
  if (podmiot1.DaneKontaktowe) {
    result.push(
      formatText(i18n.t('invoice.subject1.contactDetails'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot1.DaneKontaktowe)
    );
  }
  if (hasValue(podmiot1.StatusInfoPodatnika)) {
    const statusInfo: string = translateMap(podmiot1.StatusInfoPodatnika, TAXPAYER_STATUS);

    result.push(createLabelText(i18n.t('invoice.subject1.taxpayerStatus'), statusInfo));
  }
  return result;
}
