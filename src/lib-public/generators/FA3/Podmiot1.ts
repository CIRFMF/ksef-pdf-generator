import { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText, getValue, hasValue } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot1 } from '../../types/fa3.types';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';
import { TAXPAYER_STATUS } from '../../../shared/consts/const';
import { t } from '../../../i18n';

export function generatePodmiot1(podmiot1: Podmiot1): Content[] {
  const result: Content[] = createHeader(t('podmioty.sprzedawca'));

  result.push(
    createLabelText(t('podmioty.numerEORI'), podmiot1.NrEORI),
    createLabelText(t('podmioty.prefiksVAT'), podmiot1.PrefiksPodatnika)
  );
  if (podmiot1.DaneIdentyfikacyjne) {
    result.push(...generateDaneIdentyfikacyjneTPodmiot1Dto(podmiot1.DaneIdentyfikacyjne));
  }

  if (podmiot1.Adres) {
    result.push(formatText(t('podmioty.adres'), [FormatTyp.Label, FormatTyp.LabelMargin]), generateAdres(podmiot1.Adres));
  }
  if (podmiot1.AdresKoresp) {
    result.push(
      formatText(t('podmioty.adresKorespondencyjny'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateAdres(podmiot1.AdresKoresp)
    );
  }
  if (podmiot1.DaneKontaktowe) {
    result.push(
      formatText(t('podmioty.daneKontaktowe'), [FormatTyp.Label, FormatTyp.LabelMargin]),
      ...generateDaneKontaktowe(podmiot1.DaneKontaktowe)
    );
  }
  if (hasValue(podmiot1.StatusInfoPodatnika)) {
    const statusInfo: string = TAXPAYER_STATUS[getValue(podmiot1.StatusInfoPodatnika)!];

    result.push(createLabelText(t('podmioty.statusPodatnika'), statusInfo));
  }
  return result;
}
