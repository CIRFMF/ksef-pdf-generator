import {
  createHeader,
  createLabelText,
  createSection,
  formatText,
  generateQRCode,
  getText,
  verticalSpacing,
} from '@shared/PDF-functions';
import { Content, ContentQr } from 'pdfmake/interfaces';
import { AdditionalDataTypes } from '../../types/common.types';
import i18n from 'i18next';
import FormatTyp from '@shared/enums/common.enum';
import { version } from '../../../../package.json';
import { CustomizationID } from '../../types/pef-invoice.types';

export function generateFooter(
  additionalData: AdditionalDataTypes,
  CustomizationID: CustomizationID
): Content[] {
  const qrCode: Content[] = generateQRCodeData(additionalData);
  const qr2Code: Content[] = generateQR2CodeData(additionalData);

  const result: Content = [
    verticalSpacing(1),
    {
      text: [formatText(i18n.t('pef.stepper.messageVersion'), FormatTyp.PEFInlineLabel)],
    },
    {
      text: [formatText(getText(CustomizationID), FormatTyp.Value)],
      marginBottom: 6,
    },
    {
      text: [formatText(i18n.t('pef.stepper.descriptionVersion'), FormatTyp.Value)],
    },
    { stack: [...qrCode], unbreakable: true },
    { stack: [...qr2Code], unbreakable: true },
    createSection(
      [
        {
          stack: createLabelText(
            i18n.t('invoice.footer.generatedIn'),
            i18n.t('pef.stepper.generatorVersion', { version: version })
          ),
          margin: [0, 8, 0, 0],
        },
      ],
      false,
      [0, 0, 0, 0]
    ),
  ];

  return createSection(result, false);
}

function generateQRCodeData(additionalData?: AdditionalDataTypes): Content[] {
  const result: Content = [];
  const QR_SIZE = 150;

  if (additionalData?.qrCode) {
    const qrCode: ContentQr | undefined = generateQRCode(additionalData.qrCode);

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
              createHeader(i18n.t('invoice.qr1.header')),
              formatText(i18n.t('invoice.qr1.description'), FormatTyp.Label),
              {
                text: formatText(additionalData.qrCode, FormatTyp.Link),
                link: additionalData.qrCode,
                margin: [0, 5, 0, 0],
              },
            ],
            margin: [0, 25, 0, 0],
            width: 330,
            alignment: 'left',
          },
        ],
        columnGap: 20,
        marginTop: 20,
      });
    }
  }
  return createSection(result, false);
}

function generateQR2CodeData(additionalData?: AdditionalDataTypes): Content[] {
  const result: Content = [];
  const QR_SIZE = 210;

  if (additionalData?.qr2Code) {
    const qrCode: ContentQr | undefined = generateQRCode(additionalData.qr2Code);

    if (qrCode) {
      qrCode.fit = QR_SIZE;

      result.push({
        columns: [
          {
            stack: [
              qrCode,
              { text: i18n.t('invoice.qr2.certificate'), alignment: 'center', margin: [0, 8, 0, 0] },
            ],
            alignment: 'center',
            width: 'auto',
          },
          {
            stack: [
              createHeader(i18n.t('invoice.qr2.header')),
              formatText(i18n.t('invoice.qr2.description'), FormatTyp.Label),
              {
                text: formatText(breakLongText(additionalData.qr2Code), FormatTyp.Link),
                link: additionalData.qr2Code,
                margin: [0, 5, 0, 0],
              },
            ],
            margin: [0, 60, 0, 0],
            alignment: 'left',
          },
        ],
        columnGap: 20,
        marginTop: 20,
        alignment: 'center',
      });
    }
  }
  return createSection(result, false);
}

function breakLongText(text: string, chunk = 60): string {
  return text.match(new RegExp(`.{1,${chunk}}`, 'g'))?.join('\n') || text;
}
