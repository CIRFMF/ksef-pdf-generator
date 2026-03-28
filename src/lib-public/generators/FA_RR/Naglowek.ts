import { Content, ContentText } from 'pdfmake/interfaces';
import { formatText, generateLine, getValue } from '../../../shared/PDF-functions';
import { TRodzajFaktury } from '../../../shared/consts/FA.const';
import { FakturaRR as Fa } from '../../types/FaRR.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { AdditionalDataTypes } from '../../types/common.types';

export function generateNaglowek(fa?: Fa, additionalData?: AdditionalDataTypes): Content[] {
  let invoiceName = '';

  switch (getValue(fa?.RodzajFaktury)) {
    case TRodzajFaktury.VAT_RR:
      invoiceName = 'Faktura pierwotna VAT RR';
      break;
    case TRodzajFaktury.KOR_VAT_RR:
      invoiceName = 'Faktura korygująca VAT RR';
      break;
  }

  return [
    {
      text: [
        { text: 'Krajowy System ', fontSize: 18 },
        { text: 'e', color: 'red', bold: true, fontSize: 18 },
        { text: '-Faktur', bold: true, fontSize: 18 },
      ],
    },
    { ...(formatText('Numer Faktury:', FormatTyp.ValueMedium) as ContentText), alignment: Position.RIGHT },
    {
      ...(formatText(getValue(fa?.P_4C), FormatTyp.HeaderPosition) as ContentText),
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
              formatText('Numer KSeF:', FormatTyp.LabelMedium) as ContentText,
              formatText(additionalData?.nrKSeF, FormatTyp.ValueMedium),
            ],
            alignment: Position.RIGHT,
          } as Content,
        ]
      : []),
  ];
}
