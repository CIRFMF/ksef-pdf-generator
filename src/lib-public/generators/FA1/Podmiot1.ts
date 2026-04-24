import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  getTable,
  getValue,
  hasValue,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot1 } from '../../types/fa1.types';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjne } from './PodmiotDaneIdentyfikacyjne';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { TAXPAYER_STATUS } from '../../../shared/consts/FA.const';
import i18n from 'i18next';
import { translateMap } from '@shared/generators/common/functions';

export function generatePodmiot1(podmiot1: Podmiot1): Content[] {
  const result: Content[] = createHeader(i18n.t('invoice.subject1.seller'));

  result.push(
    createLabelText(i18n.t('invoice.subject1.eoriNumber'), podmiot1.NrEORI),
    createLabelText(i18n.t('invoice.subject1.vatPrefix'), podmiot1.PrefiksPodatnika)
  );
  if (podmiot1.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjne(podmiot1.DaneIdentyfikacyjne));
  }

  if (podmiot1.Adres) {
    result.push(
      generatePodmiotAdres(podmiot1.Adres, i18n.t('invoice.subject1.address'), true, [0, 12, 0, 1.3])
    );
  }
  if (podmiot1.AdresKoresp) {
    result.push(
      ...generatePodmiotAdres(
        podmiot1.AdresKoresp,
        i18n.t('invoice.subject1.mailingAddress'),
        true,
        [0, 12, 0, 1.3]
      )
    );
  }
  if (podmiot1.Email || podmiot1.Telefon) {
    result.push(
      formatText(i18n.t('invoice.subject1.contactDetails'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot1.Email, getTable(podmiot1.Telefon))
    );
  }
  if (hasValue(podmiot1.StatusInfoPodatnika)) {
    const statusInfo: string = translateMap(podmiot1.StatusInfoPodatnika, TAXPAYER_STATUS);

    result.push(createLabelText(i18n.t('invoice.subject1.taxpayerStatus'), statusInfo));
  }
  return result;
}
