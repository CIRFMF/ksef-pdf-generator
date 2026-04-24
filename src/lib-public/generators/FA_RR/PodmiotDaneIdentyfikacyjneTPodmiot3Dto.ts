import { Content } from 'pdfmake/interfaces';
import { createLabelText, getValue, hasValue } from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Podmiot3DaneIdentyfikacyjne } from '../../types/FaRR.types';
import i18n from 'i18next';

export function generateDaneIdentyfikacyjneTPodmiot3Dto(
  daneIdentyfikacyjne: Podmiot3DaneIdentyfikacyjne | undefined
): Content[] {
  if (!daneIdentyfikacyjne) {
    return [];
  }
  const result: Content[] = [];

  if (hasValue(daneIdentyfikacyjne.NIP)) {
    result.push(
      createLabelText(
        i18n.t('invoice.subjectIdentificationData.nip'),
        daneIdentyfikacyjne.NIP,
        FormatTyp.Default
      )
    );
  } else if (hasValue(daneIdentyfikacyjne.IDWew)) {
    result.push(
      createLabelText(
        i18n.t('invoice.subjectIdentificationData.internalId'),
        daneIdentyfikacyjne.IDWew,
        FormatTyp.Default
      )
    );
  } else if (getValue(daneIdentyfikacyjne.BrakID) === '1') {
    result.push(createLabelText(i18n.t('invoice.subjectIdentificationData.noId'), ' ', FormatTyp.Default));
  }

  if (hasValue(daneIdentyfikacyjne.Nazwa)) {
    result.push(
      createLabelText(
        i18n.t('invoice.subjectIdentificationData.name'),
        daneIdentyfikacyjne.Nazwa,
        FormatTyp.Default
      )
    );
  }
  return result;
}
