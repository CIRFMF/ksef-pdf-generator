import { Content, ContentImage, ContentText } from 'pdfmake/interfaces';
import { formatText, generateLine } from '../../../shared/PDF-functions';
import { TRodzajFaktury } from '../../../shared/consts/const';
import { Fa as Fa1 } from '../../types/fa1.types';
import { Fa as Fa2 } from '../../types/fa2.types';
import { Fa as Fa3, Zalacznik } from '../../types/fa3.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { AdditionalDataTypes } from '../../types/common.types';

export function generateNaglowek(
  fa?: Fa2 | Fa3 | Fa1,
  additionalData?: AdditionalDataTypes,
  zalacznik?: Zalacznik
): Content[] {
  let invoiceName = '???';

  switch (fa?.RodzajFaktury?._text) {
    case TRodzajFaktury.VAT:
      invoiceName = 'Faktura podstawowa';
      break;
    case TRodzajFaktury.ZAL:
      invoiceName = 'Faktura zaliczkowa';
      break;
    case TRodzajFaktury.ROZ:
      invoiceName = 'Faktura rozliczeniowa';
      break;
    case TRodzajFaktury.KOR_ROZ:
      invoiceName = 'Faktura korygująca rozliczeniową';
      break;
    case TRodzajFaktury.KOR_ZAL:
      invoiceName = 'Faktura korygująca zaliczkową';
      break;
    case TRodzajFaktury.KOR:
      if (fa?.OkresFaKorygowanej != null) {
        invoiceName = 'Faktura korygująca zbiorcza (rabat)';
      } else {
        invoiceName = 'Faktura korygująca';
      }
      break;
    case TRodzajFaktury.UPR:
      invoiceName = 'Faktura uproszczona';
      break;
  }

  const headerTitle: Content = {
    text: [
      { text: 'Krajowy System ', fontSize: 18 },
      { text: 'e', color: 'red', bold: true, fontSize: 18 },
      { text: '-Faktur', bold: true, fontSize: 18 },
    ],
  };

  const invoiceMeta: Content[] = [
    { ...(formatText('Numer Faktury:', FormatTyp.ValueMedium) as ContentText), alignment: Position.RIGHT },
    { ...(formatText(fa?.P_2?._text, FormatTyp.HeaderPosition) as ContentText), alignment: Position.RIGHT },
    {
      ...(formatText(invoiceName, [FormatTyp.ValueMedium, FormatTyp.Default]) as ContentText),
      alignment: Position.RIGHT,
    },
    ...(additionalData?.nrKSeF
      ? [
          {
            text: [
              formatText('Numer KSEF:', FormatTyp.LabelMedium) as ContentText,
              formatText(additionalData?.nrKSeF, FormatTyp.ValueMedium),
            ],
            alignment: Position.RIGHT,
          } as Content,
        ]
      : []),
  ];

  const normalizedLogo: string | undefined = normalizeLogo(additionalData?.companyLogoBase64);

  const result: Content[] = [headerTitle];

  if (normalizedLogo) {
    result.push({
      columns: [
        {
          width: 'auto',
          stack: [
            {
              image: normalizedLogo,
              fit: [120, 60],
              alignment: Position.LEFT,
              margin: [0, 6, 16, 0],
            } as ContentImage,
          ],
        },
        {
          width: '*',
          stack: invoiceMeta,
          alignment: Position.RIGHT,
        },
      ],
      columnGap: 12,
      margin: [0, 4, 0, 0],
    });
  } else {
    result.push(...invoiceMeta);
  }

  if (additionalData?.isMobile && zalacznik) {
    result.push(
      { stack: [generateLine()], margin: [0, 8, 0, 8] } as Content,
      {
        text: [
          formatText(
            'Uwaga, faktura zawiera załącznik, jednak ze względu na ograniczenia wizualizacji, nie został on uwzględniony w pliku PDF',
            FormatTyp.Bold
          ),
        ],
      }
    );
  }

  return result;
}

function normalizeLogo(logo?: string): string | undefined {
  if (!logo) {
    return undefined;
  }

  const trimmed = logo.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  return `data:image/png;base64,${trimmed}`;
}
