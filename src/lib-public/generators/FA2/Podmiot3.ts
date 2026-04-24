import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateLine,
  generateTwoColumns,
} from '../../../shared/PDF-functions';
import { Podmiot3 } from '../../types/fa2.types';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot3Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot3Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { translateMap } from '@shared/generators/common/functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { FA2RolaPodmiotu3 } from '../../../shared/consts/FA.const';
import i18n from 'i18next';

export function generatePodmiot3(podmiot: Podmiot3, index: number): Content[] {
  const result: Content[] = [];

  result.push(generateLine());
  const column1: Content[] = [
    ...createHeader(i18n.t('invoice.subject3.otherEntity', { index: index + 1 })),
    createLabelText(i18n.t('invoice.subject3.getterId'), podmiot.IDNabywcy),
    createLabelText(i18n.t('invoice.subject3.eori'), podmiot.NrEORI),
    ...generateDaneIdentyfikacyjneTPodmiot3Dto(podmiot.DaneIdentyfikacyjne),
    createLabelText(i18n.t('invoice.subject3.role'), translateMap(podmiot.Rola, FA2RolaPodmiotu3)),
    createLabelText(i18n.t('invoice.subject3.otherRole'), podmiot.OpisRoli),
    createLabelText(i18n.t('invoice.subject3.share'), podmiot.Udzial, [FormatTyp.Percentage]),
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
  if (podmiot.DaneKontaktowe || podmiot.NrKlienta) {
    column2.push(
      formatText(i18n.t('invoice.subject3.contactData'), [FormatTyp.Label, FormatTyp.LabelMargin])
    );
    if (podmiot.DaneKontaktowe) {
      column2.push(...generateDaneKontaktowe(podmiot.DaneKontaktowe));
    }
    if (podmiot.NrKlienta) {
      column2.push(createLabelText(i18n.t('invoice.subject3.clientNumber'), podmiot.NrKlienta));
    }
  }
  result.push(generateTwoColumns(column1, column2));
  return result;
}
