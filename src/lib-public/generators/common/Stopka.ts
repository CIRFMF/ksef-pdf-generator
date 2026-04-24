import { Content, ContentQr } from 'pdfmake/interfaces';
import FormatTyp from '../../../shared/enums/common.enum';
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
import { FormContentState } from '../../../shared/types/additional-data.types';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { AdditionalDataTypes } from '../../types/common.types';
import { Informacje, Rejestry } from '../../types/fa1.types';
import { FP, Naglowek, Stopka } from '../../types/fa2.types';
import { Zalacznik } from '../../types/fa3.types';
import { generateZalaczniki } from './Zalaczniki';
import i18n from 'i18next';

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
  const qr2Code: Content[] = generateQR2CodeData(additionalData);
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
    { stack: [...qr2Code], unbreakable: true },
    createSection(
      [
        {
          stack: createLabelText(i18n.t('invoice.footer.generatedIn'), naglowek?.SystemInfo),
          margin: [0, 8, 0, 0],
        },
      ],
      false,
      [0, 0, 0, 0]
    ),
  ];

  return createSection(result, false);
}

function generateWZ(wz?: FP[]): Content[] {
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    { name: '', title: i18n.t('invoice.wz.number'), format: FormatTyp.Default },
  ];
  const faWiersze: FP[] = getTable(wz ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*'
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createSubHeader(i18n.t('invoice.wz.documentsHeader'), [0, 8, 0, 4]));
    result.push(content.content);
  }
  return result;
}

function generateRejestry(stopka?: Stopka): Content[] {
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    { name: 'PelnaNazwa', title: i18n.t('invoice.registers.fullName'), format: FormatTyp.Default },
    { name: 'KRS', title: i18n.t('invoice.registers.krs'), format: FormatTyp.Default },
    { name: 'REGON', title: i18n.t('invoice.registers.regon'), format: FormatTyp.Default },
    { name: 'BDO', title: i18n.t('invoice.registers.bdo'), format: FormatTyp.Default },
  ];
  const faWiersze: Rejestry[] = getTable(stopka?.Rejestry ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*',
    undefined,
    30
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createHeader(i18n.t('invoice.registers.header')));
    result.push(content.content);
  }
  return result;
}

function generateInformacje(stopka?: Stopka): Content[] {
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    { name: 'StopkaFaktury', title: i18n.t('invoice.information.invoiceFooter'), format: FormatTyp.Default },
  ];
  const faWiersze: Informacje[] = getTable(stopka?.Informacje ?? []);
  const content: FormContentState = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeader],
    faWiersze,
    '*'
  );

  if (content.fieldsWithValue.length && content.content) {
    result.push(createHeader(i18n.t('invoice.information.header')));
    result.push(content.content);
  }
  return result;
}

function generateQRCodeData(additionalData?: AdditionalDataTypes): Content[] {
  const result: Content = [];
  const QR_SIZE = 150;

  if (additionalData?.qrCode) {
    const qrCode: ContentQr | undefined = generateQRCode(additionalData.qrCode);

    result.push(createHeader(i18n.t('invoice.qr1.header')));
    if (qrCode) {
      qrCode.fit = QR_SIZE;

      result.push({
        columns: [
          {
            stack: [
              qrCode,
              {
                text: additionalData.qr2Code ? i18n.t('invoice.qr1.offline') : additionalData.nrKSeF,
                alignment: 'center',
                margin: [0, 8, 0, 0],
              },
            ],
            alignment: 'center',
            width: 'auto',
          },
          {
            stack: [
              formatText(i18n.t('invoice.qr1.description'), FormatTyp.Label),
              {
                text: formatText(additionalData.qrCode, FormatTyp.Link),
                link: additionalData.qrCode,
                margin: [0, 5, 0, 0],
              },
            ],
            margin: [0, 2, 0, 0],
            width: 330,
            alignment: 'left',
          },
        ],
        columnGap: 20,
      });
    }
  }
  return createSection(result, true);
}

function breakLongText(text: string, chunk = 60): string {
  return text.match(new RegExp(`.{1,${chunk}}`, 'g'))?.join('\n') || text;
}

function generateQR2CodeData(additionalData?: AdditionalDataTypes): Content[] {
  const result: Content = [];
  const QR_SIZE = 210;

  if (additionalData?.qr2Code) {
    const qrCode: ContentQr | undefined = generateQRCode(additionalData.qr2Code);

    result.push(createHeader(i18n.t('invoice.qr2.header')));
    if (qrCode) {
      qrCode.fit = QR_SIZE;

      result.push({
        columns: [
          {
            stack: [qrCode, { text: i18n.t('invoice.qr2.certificate'), alignment: 'center', margin: [0, 8, 0, 0] }],
            alignment: 'center',
            width: 'auto',
          },
          {
            stack: [
              formatText(
                  i18n.t('invoice.qr2.description'),
                FormatTyp.Label
              ),
              {
                text: formatText(breakLongText(additionalData.qr2Code), FormatTyp.Link),
                link: additionalData.qr2Code,
                margin: [0, 5, 0, 0],
              },
            ],
            margin: [0, 2, 0, 0],
            alignment: 'left',
          },
        ],
        columnGap: 20,
      });
    }
  }
  return createSection(result, true);
}
