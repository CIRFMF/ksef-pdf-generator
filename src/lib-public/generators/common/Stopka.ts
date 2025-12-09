import { Content, ContentQr, ContentStack, Margins } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSection,
  createSubHeader,
  formatText,
  generateLine,
  generateQRCode,
  generateTwoColumns,
  getContentTable,
  getTable,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { FormContentState } from '../../../shared/types/additional-data.types';
import { FP, Naglowek, Stopka } from '../../types/fa2.types';
import { Zalacznik } from '../../types/fa3.types';
import { generateZalaczniki } from './Zalaczniki';
import FormatTyp from '../../../shared/enums/common.enum';
import { Informacje, Rejestry } from '../../types/fa1.types';
import { AdditionalDataTypes } from '../../types/common.types';

export function generateStopka(
  additionalData?: AdditionalDataTypes,
  stopka?: Stopka,
  naglowek?: Naglowek,
  wz?: FP[],
  zalacznik?: Zalacznik
): Content[] {
  const wzty: Content[] = generateWZ(wz);
  const rejestry: Content[] = generateRejestry(stopka);
  const informacje: Content[] = generateInformacje(stopka);
  const zalaczniki: Content[] = !additionalData?.isMobile ? generateZalaczniki(zalacznik) : [];
  const baseContent: Content[] = [
    verticalSpacing(1),
    ...(wzty.length ? [generateLine()] : []),
    ...(wzty.length ? [generateTwoColumns(wzty, [])] : []),
    ...(rejestry.length || informacje.length ? [generateLine()] : []),
    ...rejestry,
    ...informacje,
    ...(zalaczniki.length ? zalaczniki : []),
  ];
  const qrCodeSection: Content[] = generateQRCodeData(additionalData);

  if (qrCodeSection.length) {
    tightenBottomSpacing(baseContent);
  }

  const result: Content[] = [
    ...baseContent,
    ...qrCodeSection,
    createSection(
      [
        {
          stack: createLabelText('Wytworzona w:', naglowek?.SystemInfo),
          margin: [0, 8, 0, 0],
        },
      ],
      true,
      [0, 0, 0, 0]
    ),
  ];

  return createSection(result, false);
}

function generateWZ(wz?: FP[]): Content[] {
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [{ name: '', title: 'Numer WZ', format: FormatTyp.Default }];
  const faWiersze: FP[] = getTable(wz ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*'
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createSubHeader('Numery dokumentów magazynowych WZ', [0, 8, 0, 4]));
    result.push(content.content);
  }
  return result;
}

function generateRejestry(stopka?: Stopka): Content[] {
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    { name: 'PelnaNazwa', title: 'Pełna nazwa', format: FormatTyp.Default },
    { name: 'KRS', title: 'KRS', format: FormatTyp.Default },
    { name: 'REGON', title: 'REGON', format: FormatTyp.Default },
    { name: 'BDO', title: 'BDO', format: FormatTyp.Default },
  ];
  const faWiersze: Rejestry[] = getTable(stopka?.Rejestry ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*'
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createHeader('Rejestry'));
    result.push(content.content);
  }
  return result;
}

function generateInformacje(stopka?: Stopka): Content[] {
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    { name: 'StopkaFaktury', title: 'Stopka faktury', format: FormatTyp.Default },
  ];
  const faWiersze: Informacje[] = getTable(stopka?.Informacje ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*'
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createHeader('Pozostałe informacje'));
    result.push(content.content);
  }
  return result;
}

function generateQRCodeData(additionalData?: AdditionalDataTypes): Content[] {
  const sections: Content[][] = [];

  if (additionalData?.qrCode) {
    const qrLabel = additionalData.nrKSeF?.trim() ? additionalData.nrKSeF : 'OFFLINE';
    sections.push(
      buildQrSection({
        title: additionalData.qrCode2
          ? 'KOD I – weryfikacja faktury w KSeF'
          : 'Sprawdź, czy Twoja faktura znajduje się w KSeF!',
        qrValue: additionalData.qrCode,
        label: qrLabel,
        helperText:
          'Nie możesz zeskanować kodu z obrazka? Kliknij w link weryfikacyjny i przejdź do weryfikacji faktury!',
        link: additionalData.qrCode,
      })
    );
  }

  if (additionalData?.qrCode2) {
    sections.push(
      buildQrSection({
        title: 'KOD II – weryfikacja certyfikatu wystawcy (tryb offline)',
        qrValue: additionalData.qrCode2,
        label: 'CERTYFIKAT',
        helperText:
          'KOD II potwierdza autentyczność certyfikatu offline KSeF wystawcy i jest wymagany w scenariuszach offline opisanych w dokumentacji MF.',
        link: additionalData.qrCode2,
      })
    );
  }

  if (!sections.length) {
    return [];
  }

  return sections.map(
    (section: Content[], index: number): Content => ({
      stack: section,
      unbreakable: true,
      margin: [0, index === 0 ? 15 : 6, 0, 0],
    })
  );
}

interface QrSectionConfig {
  title: string;
  qrValue: string;
  label: string;
  helperText: string;
  link?: string;
}

function buildQrSection(config: QrSectionConfig): Content[] {
  const qrCode: ContentQr | undefined = generateQRCode(config.qrValue);

  if (!qrCode) {
    return [];
  }

  const header: Content = {
    stack: [formatText(config.title, FormatTyp.HeaderContent)],
    margin: [0, 0, 0, 4],
  };

  return [
    header,
    {
      columns: [
        {
          stack: [
            qrCode,
            {
              stack: [formatText(config.label, FormatTyp.Default)],
              width: 'auto',
              alignment: 'center',
              marginLeft: 10,
              marginRight: 10,
              marginTop: 4,
            } as ContentStack,
          ],
          width: 150,
        } as ContentStack,
        {
          stack: [
            formatText(config.helperText, FormatTyp.Value),
            ...(config.link
              ? ([{ stack: [formatText(config.link, FormatTyp.Link)], marginTop: 5 }] as Content[])
              : []),
          ],
          link: config.link,
          margin: [10, (qrCode.fit ?? 120) / 2 - 30, 0, 0],
          width: 'auto',
        } as ContentStack,
      ],
    },
  ];
}

function tightenBottomSpacing(content: Content[], marginBottom = 2): void {
  for (let i = content.length - 1; i >= 0; i--) {
    const element = content[i];

    if (!element) {
      continue;
    }

    if (Array.isArray(element) && element.length) {
      tightenBottomSpacing(element as Content[], marginBottom);
      return;
    }

    if (typeof element === 'object') {
      const contentWithMargin = element as Content & { margin?: Margins };
      const marginValue = contentWithMargin.margin;

      if (marginValue !== undefined) {
        if (Array.isArray(marginValue)) {
          const [left = 0, top = 0, right = 0] = marginValue;
          contentWithMargin.margin = [left, top, right, marginBottom];
        } else if (typeof marginValue === 'number') {
          contentWithMargin.margin = [marginValue, marginValue, marginValue, marginBottom];
        } else {
          contentWithMargin.margin = [0, 0, 0, marginBottom];
        }
        return;
      }
    }
  }
}
