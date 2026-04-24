import { Content, ContentText } from 'pdfmake/interfaces';
import { formatText, generateLine, getValue } from '../../../shared/PDF-functions';
import { TRodzajFaktury } from '../../../shared/consts/FA.const';
import { Fa as Fa1 } from '../../types/fa1.types';
import { Fa as Fa2 } from '../../types/fa2.types';
import { Fa as Fa3, Zalacznik } from '../../types/fa3.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { AdditionalDataTypes } from '../../types/common.types';
import i18n from 'i18next';

export function generateNaglowek(
  fa?: Fa2 | Fa3 | Fa1,
  additionalData?: AdditionalDataTypes,
  zalacznik?: Zalacznik
): Content[] {
  let invoiceName = '';

  switch (getValue(fa?.RodzajFaktury)) {
    case TRodzajFaktury.VAT:
      invoiceName = i18n.t('invoice.header.vat');
      break;
    case TRodzajFaktury.ZAL:
      invoiceName = i18n.t('invoice.header.advance');
      break;
    case TRodzajFaktury.ROZ:
      invoiceName = i18n.t('invoice.header.settlement');
      break;
    case TRodzajFaktury.KOR_ROZ:
      invoiceName = i18n.t('invoice.header.correctionSettlement');
      break;
    case TRodzajFaktury.KOR_ZAL:
      invoiceName = i18n.t('invoice.header.correctionAdvance');
      break;
    case TRodzajFaktury.KOR:
      if (fa?.OkresFaKorygowanej != null) {
        invoiceName = i18n.t('invoice.header.correctionCollective');
      } else {
        invoiceName = i18n.t('invoice.header.correction');
      }
      break;
    case TRodzajFaktury.UPR:
      invoiceName = i18n.t('invoice.header.simplified');
      break;
  }

  return [
    {
      text: [
        { text: i18n.t('invoice.header.ksefPart1'), fontSize: 18 },
        { text: i18n.t('invoice.header.ksefPart2'), color: 'red', bold: true, fontSize: 18 },
        { text: i18n.t('invoice.header.ksefPart3'), bold: true, fontSize: 18 },
      ],
    },
    { ...(formatText(i18n.t('invoice.header.invoiceNumberLabel'), FormatTyp.ValueMedium) as ContentText), alignment: Position.RIGHT },
    {
      ...(formatText(getValue(fa?.P_2), FormatTyp.HeaderPosition) as ContentText),
      alignment: Position.RIGHT,
    },
    {
      ...(formatText(invoiceName, [FormatTyp.ValueMedium, FormatTyp.Default]) as ContentText),
      alignment: Position.RIGHT,
    },
    ...(additionalData?.nrKSeF
      ? [
          {
            text: [
              formatText(i18n.t('invoice.header.ksefNumberLabel'), FormatTyp.LabelMedium) as ContentText,
              formatText(additionalData?.nrKSeF, FormatTyp.ValueMedium),
            ],
            alignment: Position.RIGHT,
          } as Content,
        ]
      : []),
    ...(additionalData?.isMobile && zalacznik
      ? [
          { stack: [generateLine()], margin: [0, 8, 0, 8] } as Content,
          {
            text: [formatText(i18n.t('invoice.header.attachmentWarning'), FormatTyp.Bold)],
          },
        ]
      : []),
  ];
}
