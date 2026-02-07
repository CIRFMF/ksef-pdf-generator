import { Content, ContentQr, ContentStack } from 'pdfmake/interfaces';
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
import { t } from '../../../i18n';

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
  const qrCode: Content[] = generateQRCodeData(additionalData);
  const zalaczniki: Content[] = !additionalData?.isMobile ? generateZalaczniki(zalacznik) : [];

  const result: Content = [
    verticalSpacing(1),
    ...(wzty.length ? [generateLine()] : []),
    ...(wzty.length ? [generateTwoColumns(wzty, [])] : []),
    ...(rejestry.length || informacje.length ? [generateLine()] : []),
    ...rejestry,
    ...informacje,
    ...(zalaczniki.length ? zalaczniki : []),
    { stack: [...qrCode], unbreakable: true },
    createSection(
      [
        {
          stack: createLabelText(t('stopka.wytworzonaW'), naglowek?.SystemInfo),
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
  const definedHeader: HeaderDefine[] = [
    { name: '', title: t('stopka.numerWz'), format: FormatTyp.Default },
  ];
  const faWiersze: FP[] = getTable(wz ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*'
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createSubHeader(t('stopka.numeryDokumentowWz'), [0, 8, 0, 4]));
    result.push(content.content);
  }
  return result;
}

function generateRejestry(stopka?: Stopka): Content[] {
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    { name: 'PelnaNazwa', title: t('stopka.pelnaNazwa'), format: FormatTyp.Default },
    { name: 'KRS', title: t('stopka.krs'), format: FormatTyp.Default },
    { name: 'REGON', title: t('stopka.regon'), format: FormatTyp.Default },
    { name: 'BDO', title: t('stopka.bdo'), format: FormatTyp.Default },
  ];
  const faWiersze: Rejestry[] = getTable(stopka?.Rejestry ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*'
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createHeader(t('stopka.rejestry')));
    result.push(content.content);
  }
  return result;
}

function generateInformacje(stopka?: Stopka): Content[] {
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    {
      name: 'StopkaFaktury',
      title: t('stopka.stopkaFaktury'),
      format: FormatTyp.Default,
    },
  ];
  const faWiersze: Informacje[] = getTable(stopka?.Informacje ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*'
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createHeader(t('stopka.pozostaleInformacje')));
    result.push(content.content);
  }
  return result;
}

function generateQRCodeData(additionalData?: AdditionalDataTypes): Content[] {
  const result: Content = [];

  if (additionalData?.qrCode && additionalData.nrKSeF) {
    const qrCode: ContentQr | undefined = generateQRCode(additionalData.qrCode);

    result.push(createHeader(t('stopka.qrCheckKSeF')));
    if (qrCode) {
      result.push({
        columns: [
          {
            stack: [
              qrCode,

              {
                stack: [formatText(additionalData.nrKSeF, FormatTyp.Default)],
                width: 'auto',
                alignment: 'center',
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
              } as ContentStack,
            ],
            width: 150,
          } as ContentStack,
          {
            stack: [
              formatText(t('stopka.qrCantScanHint'), FormatTyp.Value),
              {
                stack: [formatText(additionalData.qrCode, FormatTyp.Link)],
                marginTop: 5,
                link: additionalData.qrCode,
              },
            ],

            margin: [10, (qrCode.fit ?? 120) / 2 - 30, 0, 0],
            width: 'auto',
          } as ContentStack,
        ],
      });
    }
  }
  return createSection(result, true);
}
