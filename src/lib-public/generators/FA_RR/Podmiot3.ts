import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateLine,
  generateTwoColumns,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot3 } from '../../types/FaRR.types';
import { generateDaneIdentyfikacyjneTPodmiot3Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot3Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { translateMap } from '@shared/generators/common/functions';
import { generateAdres } from './Adres';
import { FARRRolaPodmiotu3 } from '../../../shared/consts/FARR.const';
import i18n from 'i18next';

export function generatePodmiot3(podmiot: Podmiot3, index: number): Content[] {
  const result: Content[] = [];

  result.push(generateLine());
  const column1: Content[] = [
    ...createHeader(i18n.t('invoice.subject3.otherEntity', { index: index + 1 })),
    ...generateDaneIdentyfikacyjneTPodmiot3Dto(podmiot.DaneIdentyfikacyjne),
    createLabelText(i18n.t('invoice.subject3.role'), translateMap(podmiot.Rola, FARRRolaPodmiotu3)),
    createLabelText(i18n.t('invoice.subject3.roleDescription'), podmiot.OpisRoli),
  ];

  const column2: Content[] = [];

  if (podmiot.Adres) {
    column2.push(
      formatText(i18n.t('invoice.subject3.address'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      generateAdres(podmiot.Adres)
    );
  }
  if (podmiot.AdresKoresp) {
    column2.push(
      formatText(i18n.t('invoice.subject3.correspondenceAddress'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateAdres(podmiot.AdresKoresp)
    );
  }
  if (podmiot.DaneKontaktowe) {
    column2.push(
      formatText(i18n.t('invoice.subject3.contactData'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot.DaneKontaktowe)
    );
  }
  result.push(generateTwoColumns(column1, column2));
  return result;
}
