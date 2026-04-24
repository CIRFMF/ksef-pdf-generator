import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateTwoColumns,
  getTable,
  getValue,
  hasValue,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { PodmiotUpowazniony } from '../../types/fa1.types';
import { generatePodmiotAdres } from './PodmiotAdres';
import { generateDaneIdentyfikacyjne } from './PodmiotDaneIdentyfikacyjne';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { translateMap } from '@shared/generators/common/functions';
import { TRolaPodmiotuUpowaznionegoFA1 } from '@shared/consts/FA.const';
import i18n from 'i18next';

export function generatePodmiotUpowazniony(podmiot: PodmiotUpowazniony | undefined): Content[] {
  if (!podmiot) {
    return [];
  }
  const result: Content[] = createHeader(i18n.t('invoice.authorizedSubject.authorizedSubject'));
  const columnLeft: Content[] = [];
  const columnRight: Content[] = [];

  if (hasValue(podmiot.RolaPU)) {
    columnLeft.push(
      createLabelText(i18n.t('invoice.authorizedSubject.role'), translateMap(podmiot.RolaPU, TRolaPodmiotuUpowaznionegoFA1))
    );
  }
  if (hasValue(podmiot.NrEORI)) {
    columnLeft.push(createLabelText(i18n.t('invoice.authorizedSubject.eori'), podmiot.NrEORI));
  }
  if (podmiot.DaneIdentyfikacyjne) {
    if (hasValue(podmiot.DaneIdentyfikacyjne.NrID)) {
      columnLeft.push(
        createLabelText(i18n.t('invoice.authorizedSubject.otherTaxId'), podmiot.DaneIdentyfikacyjne.NrID)
      );
    }
    if (getValue(podmiot.DaneIdentyfikacyjne.BrakID) === '1') {
      columnLeft.push(createLabelText(i18n.t('invoice.authorizedSubject.noTaxId'), ' '));
    }
    columnLeft.push(generateDaneIdentyfikacyjne(podmiot.DaneIdentyfikacyjne));
  }

  if (podmiot.Adres) {
    columnRight.push(generatePodmiotAdres(podmiot.Adres, i18n.t('invoice.authorizedSubject.address'), true));
  }
  if (podmiot.AdresKoresp) {
    columnRight.push(
      generatePodmiotAdres(podmiot.AdresKoresp, i18n.t('invoice.authorizedSubject.correspondenceAddress'), true)
    );
  }
  if (podmiot.EmailPU || podmiot.TelefonPU) {
    columnRight.push(
      formatText(i18n.t('invoice.authorizedSubject.contactData'), [FormatTyp.Label]),
      ...generateDaneKontaktowe(podmiot.EmailPU, getTable(podmiot.TelefonPU))
    );
  }
  result.push(generateTwoColumns(columnLeft, columnRight));
  return result;
}
