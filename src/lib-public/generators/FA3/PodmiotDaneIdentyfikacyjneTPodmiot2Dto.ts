import { Content } from 'pdfmake/interfaces';
import { createLabelText, createLabelTextArray, formatText } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { DaneIdentyfikacyjneTPodmiot2Dto } from '../../types/fa2-additional-types';
import i18n from 'i18next';

export function generateDaneIdentyfikacyjneTPodmiot2Dto(
  daneIdentyfikacyjne: DaneIdentyfikacyjneTPodmiot2Dto
): Content[] {
  const result: Content[] = [];

  result.push(createLabelText(i18n.t('invoice.subject2.nip'), daneIdentyfikacyjne.NIP));
  if (daneIdentyfikacyjne.NrVatUE?._text) {
    result.push(
      createLabelTextArray([
        { value: i18n.t('invoice.subject2.vatUeNumber'), formatTyp: FormatTyp.Label },
        { value: daneIdentyfikacyjne.KodUE, formatTyp: FormatTyp.Value },
        { value: ' ' },
        { value: daneIdentyfikacyjne.NrVatUE, formatTyp: FormatTyp.Value },
      ])
    );
  }
  if (daneIdentyfikacyjne.NrID?._text) {
    result.push(
      createLabelTextArray([
        { value: i18n.t('invoice.subject2.taxIdOther'), formatTyp: FormatTyp.Label },
        { value: daneIdentyfikacyjne.KodKraju || '', formatTyp: FormatTyp.Value },
        { value: ' ' },
        { value: daneIdentyfikacyjne.NrID, formatTyp: FormatTyp.Value },
      ])
    );
  }
  if (daneIdentyfikacyjne.BrakID?._text === '1') {
    result.push(formatText(i18n.t('invoice.subject2.noTaxId'), FormatTyp.Label));
  }
  result.push(createLabelText(i18n.t('invoice.subject2.name'), daneIdentyfikacyjne.Nazwa));
  return result;
}
