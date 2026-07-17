import {
  Column,
  Content,
  ContentQr,
  ContentTable,
  ContentText,
  CustomTableLayout,
  Margins,
  Style,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import {
  DEFAULT_TABLE_LAYOUT,
  FormaPlatnosci,
  Kraj,
  TStawkaPodatku_FA1,
  TStawkaPodatku_FA2,
  TStawkaPodatku_FA3,
} from './consts/FA.const';
import { formatDateTimePl, formatTime, translateMap } from './generators/common/functions';
import { HeaderDefine, PdfFP, PdfOptionField } from './types/pdf-types';
import { FP } from '../lib-public/types/fa3.types';
import { DifferentValues, FilteredKeysOfValues, TypesOfValues } from './types/universal.types';
import { CreateLabelTextData } from './types/additional-data.types';
import FormatTyp, { Answer, Position } from './enums/common.enum';
import { TStawkaPodatku_FARR } from './consts/FARR.const';
import { getDefaultFontName } from './../lib-public/configure-fonts';

export function formatText(
  value: number | string | undefined | null,
  format: FormatTyp | FormatTyp[] | null = null,
  options: PdfOptionField = {},
  currency = ''
): ContentText | string {
  if (!value) {
    return '';
  }
  const result: ContentText = { text: value.toString() };

  Object.assign(result, options);

  if (format) {
    result.style = format;
    if (!Array.isArray(format)) {
      formatValue(format, result, value, currency);
    } else {
      format.forEach((item: FormatTyp): void => {
        formatValue(item, result, value, currency);
      });
    }
  }

  return result;
}

export function generateTable<T>(array: T[], keys: Partial<Record<keyof T, string>>): Content {
  const faRows: NonNullable<T>[] = getTable(array);

  const headers: { name: string; title: string; format: FormatTyp; width?: string }[] = Object.entries(
    keys
  ).map(
    (
      [key, value]: [string, unknown],
      index
    ): { name: string; title: string; format: FormatTyp; width?: string } => {
      return {
        name: key,
        title: value as string,
        format: FormatTyp.Default,
        ...(index === 0 ? { width: 'auto' } : {}),
      };
    }
  );

  const table: { content: ContentTable | null; fieldsWithValue: string[] } = getContentTable(
    headers,
    faRows,
    '*',
    undefined,
    15
  );

  return table.content ?? [];
}

function formatValue(
  item: FormatTyp,
  result: ContentText,
  value: number | string | undefined,
  currency = ''
): void {
  switch (item) {
    case FormatTyp.Currency:
      result.text = isNaN(Number(value))
        ? (value as string)
        : `${normalizeCurrencySeparator(value)} ${currency}`;
      result.alignment = Position.RIGHT;
      break;
    case FormatTyp.CurrencyAbs:
      result.text = isNaN(Number(value))
        ? (value as string)
        : `${dotToComma(Math.abs(Number(value)).toFixed(2))} ${currency}`;
      result.alignment = Position.RIGHT;
      break;
    case FormatTyp.CurrencyGreater:
      result.text = isNaN(Number(value))
        ? (value as string)
        : `${dotToComma(Number(value).toFixed(2))} ${currency}`;
      result.fontSize = 10;
      break;
    case FormatTyp.CurrencyGreaterWithSeparator:
      result.text = isNaN(Number(value))
        ? (value as string)
        : `${normalizeCurrencySeparator(value)} ${currency}`;
      result.fontSize = 10;
      break;
    case FormatTyp.Currency6:
      result.text = isNaN(Number(value))
        ? (value as string)
        : `${dotToComma(Number(value).toFixed(6))} ${currency}`;
      result.alignment = Position.RIGHT;
      break;
    case FormatTyp.DateTime:
      result.text = formatDateTimePl(value as string, true, true);
      break;
    case FormatTyp.Date:
      result.text = formatDateTimePl(value as string);
      break;
    case FormatTyp.Time:
      result.text = formatTime(value as string);
      break;
    case FormatTyp.FormOfPayment:
      result.text = translateMap({ _text: value as string }, FormaPlatnosci);
      break;
    case FormatTyp.Boolean:
      result.text = (value as string)?.trim() === '1' ? Answer.TRUE : Answer.FALSE;
      break;
    case FormatTyp.Percentage:
      result.text = value ? `${dotToComma(value.toString())}%` : ' ';
      break;
    case FormatTyp.Number:
      result.text = replaceDotWithCommaIfNeeded(value);
      result.alignment = Position.RIGHT;
      break;
    case FormatTyp.AccountNumber:
      result.text = formatBankAccountNumber(value as string);
      break;
  }
}

export function normalizeCurrencySeparator(value: string | number | undefined): string {
  if (!value) {
    return '';
  }

  const numberWithComma = dotToComma(typeof value === 'string' ? value : value.toString());

  if (numberWithComma === '0') {
    return numberWithComma;
  } else if (numberWithComma.includes(',')) {
    const parts = numberWithComma.split(',');

    return addThousandSeparator(parts[1].length > 1 ? numberWithComma : numberWithComma + '0');
  } else {
    return addThousandSeparator(numberWithComma + ',00');
  }
}

export function replaceDotWithCommaIfNeeded(value: string | number | undefined): string {
  let copyValue = '';

  if (typeof value === 'number') {
    copyValue = value.toString();
  }

  if (typeof value === 'string') {
    copyValue = value;
  }

  return copyValue.includes('.') ? dotToComma(copyValue) : copyValue;
}

function dotToComma(value: string): string {
  return value.replace('.', ',');
}

export function hasValue(value: FP | string | number | undefined, zeroValidator: boolean = true): boolean {
  return (
    !!((typeof value !== 'object' && value) || (typeof value === 'object' && value._text)) ||
    (zeroValidator && value === 0)
  );
}

export function getValue(value: FP | string | number | undefined): string | number | undefined {
  if (typeof value === 'object') {
    return value._text;
  }
  return value;
}

export function getNumber(value: FP | string | number | undefined): number {
  const text: string | number | undefined = getValue(value);

  if (!text) {
    return 0;
  }
  if (typeof text === 'number') {
    return text;
  }

  return parseFloat(text.toString());
}

export function getNumberRounded(value: FP | string | number | undefined): number {
  const number: number = getNumber(value);

  return Math.round(number * 100) / 100;
}

export function createLabelTextArray(data: CreateLabelTextData[]): Content[] {
  return [
    {
      text: data.map((textEl: CreateLabelTextData): string | ContentText =>
        formatText(getValue(textEl.value) ?? '', textEl.formatTyp ?? FormatTyp.Label, {}, textEl.currency)
      ),
    },
  ];
}

export function addThousandSeparator(
  value: string,
  thousandSeparator = '\xa0',
  decimalSeparator = ','
): string {
  const splitRegex = /\B(?=(\d{3})+(?!\d))/g;

  if (value.includes(decimalSeparator)) {
    const splitValue = value.split(decimalSeparator);

    return `${splitValue[0].replace(splitRegex, thousandSeparator)}${decimalSeparator}${splitValue[1]}`;
  } else {
    return value.replace(splitRegex, thousandSeparator);
  }
}

export function createLabelText(
  label: string,
  value: FP | string | number | undefined | null,
  formatTyp: FormatTyp | FormatTyp[] = FormatTyp.Value,
  style: Style = {}
): Content[] {
  if (!value || (typeof value === 'object' && !value._text)) {
    return [];
  }
  if (typeof value === 'object') {
    return [
      {
        text: [formatText(label, FormatTyp.Label), formatText(value._text, formatTyp)],
        ...style,
      },
    ];
  }

  return [
    {
      text: [formatText(label, FormatTyp.Label), formatText(value, formatTyp)],
      ...style,
    },
  ];
}

export function createSection(content: Content[], isLineOnTop: boolean, margin?: Margins): Content[] {
  return [
    {
      stack: [
        ...(content.length
          ? [...(isLineOnTop ? [{ stack: [generateLine()], margin: [0, 8, 0, 0] } as Content] : []), content]
          : []),
      ],
      margin: margin ?? [0, 0, 0, 8],
    },
  ];
}

export function createHeader(text: string, margin?: Margins): Content[] {
  return [
    {
      stack: [formatText(text, FormatTyp.HeaderContent)],
      margin: margin ?? [0, 8, 0, 8],
    },
  ];
}

export function createPefHeader(text: string): Content[] {
  return [{ stack: [formatText(text, FormatTyp.PEFHeaderContent)], marginBottom: 4 }];
}

export function createPEFSubHeader(text: string): Content[] {
  return [{ stack: [formatText(text, FormatTyp.PEFSubHeaderContent)], marginBottom: 6 }];
}

export function createSubHeader(text: string, margin?: Margins): Content[] {
  return [
    {
      stack: [formatText(text, FormatTyp.SubHeaderContent)],
      margin: margin ?? [0, 4, 0, 4],
    },
  ];
}

export function createInlineLabelValue(
  value: string,
  label: string | undefined = undefined,
  margin?: Margins
): ContentText {
  if (label) {
    return {
      text: [
        formatText(label, FormatTyp.PEFInlineLabel),
        formatText(value ? ' ' + value : ' -', FormatTyp.PEFValue),
      ],
      margin: margin ?? [0, 0, 0, 1],
    };
  }

  return { text: formatText(value, FormatTyp.PEFValue), margin: margin ?? [0, 0, 0, 1] };
}

export function createInlineValueLabel(
  value: string,
  label: string | undefined = undefined,
  margin?: Margins
): ContentText {
  if (label) {
    return {
      text: [
        formatText(value ? ' ' + value : ' -', FormatTyp.PEFValue),
        formatText(label, FormatTyp.PEFInlineLabel),
      ],
      margin: margin ?? [0, 0, 0, 1],
    };
  }

  return { text: formatText(value, FormatTyp.PEFValue), margin: margin ?? [0, 0, 0, 1] };
}

export function createSmallInlineLabelValue(
  value: string,
  label: string | undefined = undefined,
  formatTyp: FormatTyp | FormatTyp[] = FormatTyp.PEFInlineLabel,
  margin?: Margins
): ContentText {
  if (label) {
    return {
      text: [formatText(label, FormatTyp.PEFInlineLabel), formatText(value ? ' ' + value : '-', formatTyp)],
      margin: margin ?? [0, 0, 0, 1],
    };
  }

  return { text: formatText(value, FormatTyp.PEFInlineLabel), margin: margin ?? [0, 0, 0, 1] };
}

export function createPEFSectionTitle(value: string): ContentText {
  return { text: formatText(value, FormatTyp.PEFTitle), marginBottom: 3 };
}

export function generateStyle(): Partial<TDocumentDefinitions> {
  const fontName = getDefaultFontName();

  return {
    styles: {
      columnMarginLeft: {
        margin: [4, 0, 0, 0],
      },
      columnMarginRight: {
        margin: [0, 0, 4, 0],
      },
      GrayBoldTitle: {
        fillColor: '#F6F7FA',
        bold: true,
      },
      GrayTitle: {
        fillColor: '#F6F7FA',
      },
      Label: {
        color: '#343A40',
        bold: true,
      },
      LabelMargin: {
        margin: [0, 12, 0, 1.3],
      },
      LabelSmallMargin: {
        margin: [0, 6, 0, 1.3],
      },
      LabelMedium: {
        color: '#343A40',
        bold: true,
        fontSize: 9,
      },
      PEFInlineLabel: {
        color: '#575757',
      },
      LabelGreater: {
        color: '#343A40',
        bold: true,
        fontSize: 10,
      },
      Value: {
        color: '#343A40',
      },
      PEFValue: { fontSize: 8, color: '#242424' },
      ValueMedium: {
        color: '#343A40',
        fontSize: 9,
      },
      Bold: {
        fontSize: 9,
        bold: true,
      },
      Description: {
        color: 'blue',
        bold: false,
      },
      HeaderPosition: {
        fontSize: 16,
        bold: true,
      },
      Right: {
        alignment: Position.RIGHT,
      },
      header: {
        fontSize: 12,
        bold: true,
        margin: [0, 12, 0, 5],
      },
      HeaderContent: {
        fontSize: 10,
        bold: true,
        color: '#343A40',
      },
      PEFHeaderContent: {
        fontSize: 12,
        bold: true,
        color: '#242424',
        alignment: Position.CENTER,
      },
      PEFSubHeaderContent: {
        fontSize: 9,
        color: '#242424',
        bold: true,
      },
      SubHeaderContent: {
        fontSize: 7,
        bold: true,
        color: '#343A40',
      },
      PEFTitle: {
        fontSize: 9,
        color: '#242424',
      },
      TitleContent: {
        fontSize: 10,
        bold: true,
      },
      Link: {
        color: 'blue',
      },
      MarginBottom4: {
        marginBottom: 4,
      },
      MarginBottom8: {
        marginBottom: 8,
      },
      MarginTop4: {
        marginTop: 4,
      },
    },
    defaultStyle: {
      font: fontName ?? 'Roboto',
      fontSize: 7,
      lineHeight: 1.2,
    },
  };
}

export function getTable<T>(data: T | T[]): NonNullable<T>[] {
  if (!data) {
    return [];
  }
  if (Array.isArray(data)) {
    return data as NonNullable<T>[];
  }
  return [data];
}

export function getRowTable(data: string[], formatColumn: FormatTyp | FormatTyp[]): Content[] {
  return data.map((el: string, index: number): Content => {
    if (Array.isArray(formatColumn)) {
      return formatText(el, formatColumn[index] ?? FormatTyp.Default);
    }
    return formatText(el, formatColumn ?? FormatTyp.Default);
  });
}

export function hasColumnsValue<T, K extends FilteredKeysOfValues<T>>(name: K, data: T[]): boolean {
  return data.some((el: T): boolean => {
    return hasValue(el[name] as TypesOfValues);
  });
}

export function getDifferentColumnsValue<T, K extends FilteredKeysOfValues<T>>(
  name: K,
  data: T[]
): DifferentValues[] {
  const result: DifferentValues[] = [];

  data.forEach((el: T): void => {
    const val: string | number | undefined = getValue(el[name] as TypesOfValues);

    if (val) {
      const index: number = result.findIndex((el: DifferentValues): boolean => el.value === val);

      if (index < 0) {
        result.push({ value: val, count: 1 });
      } else {
        result[index].count++;
      }
    }
  });
  return result;
}

export function getContentTable<T>(
  headers: HeaderDefine[],
  data: T[],
  defaultWidths: string,
  margin?: Margins,
  wordBreak?: number
): { content: ContentTable | null; fieldsWithValue: string[] } {
  const fieldsWithValue: HeaderDefine[] = headers.filter((header: HeaderDefine): boolean => {
    return data.some((d: T): boolean => {
      const name = header.name as keyof T;

      if (name === '' && (d as FP)?._text) {
        return true;
      }

      if (name === '') {
        return false;
      }

      if (typeof d[name] === 'object' && (d[name] as FP)?._text) {
        return true;
      }

      return !!(typeof d[name] !== 'object' && d[name]);
    });
  });

  if (fieldsWithValue.length < 1) {
    return { content: null, fieldsWithValue: [] };
  }

  const headerRow: Content[] = getRowTable(
    fieldsWithValue.map((header: HeaderDefine): string => header.title),
    FormatTyp.GrayBoldTitle
  );
  const tableBody: (string | ContentText)[][] = data.map((row: T): (string | ContentText)[] => {
    return fieldsWithValue.map((header: HeaderDefine): string | ContentText => {
      const fp = (header.name ? row[header.name as keyof T] : row) as PdfFP;
      const value: string | undefined = typeof fp === 'object' ? fp?._text : fp;

      return formatText(
        makeBreakable(
          header.mappingData && value ? translateMap(value, header.mappingData) : (value ?? ''),
          wordBreak ?? 40
        ),
        header.format ?? FormatTyp.Default,
        { rowSpan: fp?._rowSpan ?? 1 }
      );
    });
  });

  return {
    fieldsWithValue: fieldsWithValue.map((el: HeaderDefine): string => el.name),
    content: {
      table: {
        headerRows: 1,
        keepWithHeaderRows: 1,
        widths: fieldsWithValue.map((header: HeaderDefine): string => header.width ?? defaultWidths),
        body: [headerRow, ...tableBody] as TableCell[][],
      },
      margin: margin ?? [0, 0, 0, 8],
      layout: DEFAULT_TABLE_LAYOUT,
    },
  };
}

export function generateTwoColumns(
  kol1: Column,
  kol2: Column,
  margin?: Margins,
  unbreakable = true
): Content {
  return {
    columns: [
      { stack: [kol1], width: '50%' },
      { stack: [kol2], width: '50%' },
    ],
    margin: margin ?? [0, 0, 0, 0],
    columnGap: 20,
    unbreakable,
  };
}

export function generateColumns(contents: Content[][], style: Style | undefined = undefined): Content {
  const width: string = (100 / contents.length).toFixed(0) + '%';
  const columns: Column = contents.map((content: Content[]) => ({ stack: content, width }));
  const columnStyle: Style = style ? { ...style } : { columnGap: 20 };

  return {
    columns,
    ...columnStyle,
  };
}

export function generateQRCode(qrCode?: string): ContentQr | undefined {
  return qrCode
    ? {
        qr: qrCode,
        fit: 150,
        foreground: 'black',
        background: 'white',
        eccLevel: 'M',
      }
    : undefined;
}

export function verticalSpacing(height: number): ContentText {
  return { text: '\n', fontSize: height };
}

export function getKraj(code: string): string {
  if (Kraj[code]) {
    return Kraj[code];
  }
  return code;
}

export function getTStawkaPodatku(code: string, version: 1 | 2 | 3 | 'RR', P_PMarzy?: string): string {
  let TStawkaPodatkuVersioned: Record<string, string> = {};

  switch (version) {
    case 1:
      TStawkaPodatkuVersioned = TStawkaPodatku_FA1;
      break;
    case 2:
      TStawkaPodatkuVersioned = TStawkaPodatku_FA2;
      break;
    case 3:
      TStawkaPodatkuVersioned = TStawkaPodatku_FA3;
      break;
    case 'RR':
      TStawkaPodatkuVersioned = TStawkaPodatku_FARR;
      break;
  }
  if (!code && P_PMarzy === '1') {
    return 'marża';
  }

  if (TStawkaPodatkuVersioned[code]) {
    return translateMap(code, TStawkaPodatkuVersioned);
  }
  return code;
}

export function generateLine(): Content {
  return {
    table: {
      widths: ['*'],
      body: [[{ text: ' ', fontSize: 1 }]],
    },
    layout: {
      hLineWidth: (i: number): 0 | 1 => (i === 0 ? 1 : 0),
      vLineWidth: (): number => 0,
      hLineColor: function (): string {
        return '#c0bfc1';
      },
      paddingTop: (): number => 0,
      paddingBottom: (): number => 0,
    } as CustomTableLayout,
  };
}

export function makeBreakable(
  value: string | number | undefined,
  wordBreak = 40
): string | number | undefined {
  if (typeof value === 'string') {
    return value.replace(new RegExp(`(.{${wordBreak}})`, 'g'), '$1\u200B');
  }
  return value;
}

function splitStringAfter(input: string, after: number): string[] {
  return input.split('').reduce((acc: string[], char, index) => {
    if (index % after === 0) {
      acc.push('');
    }
    acc[acc.length - 1] += char;
    return acc;
  }, []);
}

export function formatBankAccountNumber(number: string): string {
  if (number.length <= 12) return number;

  if (/\s/.test(number.trim())) return number.trim();

  const startsWithLetterOrSymbolRegex = /^[a-z!-\/:-@[-`{-~]/i;

  if (number.charAt(0).match(startsWithLetterOrSymbolRegex)) {
    number = splitStringAfter(number.replace(/ /g, ''), 4).join(' ');
  } else {
    const firstTwoCharacters = number.substring(0, 2);
    number = `${firstTwoCharacters} ${splitStringAfter(number.substring(2).replace(/ /g, ''), 4).join(' ')}`;
  }

  return number;
}

export function createLabelWithBoldText(
  label: string,
  value: string | number,
  formatTyp: FormatTyp | FormatTyp[] = FormatTyp.Label
): Content[] {
  if (value) {
    return [
      {
        text: [formatText(label, FormatTyp.Value)],
      },
      {
        text: [formatText(value, formatTyp)],
      },
    ];
  }
  return [];
}

export function borderedBox(contents: Content[]): Content {
  return {
    margin: [0, 0, 0, 6],

    table: {
      widths: ['*'],
      body: [
        [
          {
            stack: contents,
            fillColor: '#FFFFFF',
          },
        ],
      ],
    },

    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,

      hLineColor: () => '#E3E3E3',
      vLineColor: () => '#E3E3E3',

      paddingLeft: () => 10,
      paddingRight: () => 10,
      paddingTop: () => 10,
      paddingBottom: () => 10,
    },
  };
}

export function generateTaxRateLabel(ID?: string, percent?: string): string {
  if (!ID && !percent) {
    return '';
  }
  const description = getTaxCategoryDescription(ID);

  let result = `VAT: ${ID}`;

  if (description) {
    result += ` (${description})`;
  }

  if (percent) {
    result += `, ${percent}%`;
  }
  return result;
}

export function formatPefTableValue(value: unknown): string {
  const text = String(value ?? '');
  const match = text.match(/^(\d+(?:\.\d+)?)(\s+[A-Z]{3})?$/);
  if (!match) {
    return text;
  }
  const numberPart = match[1];
  const suffix = match[2] ?? '';
  const [integerPart, decimalPart] = numberPart.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formattedInteger},${(decimalPart ?? '00').padEnd(2, '0')}${suffix}`;
}

export function generatePefTable<T extends Record<string, unknown>>(
  rows: T[],
  headers: Record<keyof T, string>
): Content {
  const keys = Object.keys(headers) as (keyof T)[];
  const body: TableCell[][] = [
    keys.map(
      (key): TableCell => ({
        text: String(headers[key]),
        bold: true,
        fillColor: '#E6E6E6',
      })
    ),
    ...rows.map((row): TableCell[] =>
      keys.map((key): TableCell => {
        const value = row[key];
        let textValue;
        if (typeof value === 'object' && value !== null) {
          textValue = (value as any).text;
        } else if (key === 'reasonCode') {
          textValue = String(value ?? '');
        } else {
          textValue = formatPefTableValue(value);
        }

        return {
          text: textValue,
          style: 'formatValue',
          alignment: ['amount', 'baseAmount', 'taxAmount', 'taxableAmount'].includes(String(key))
            ? 'right'
            : 'left',
        };
      })
    ),
  ];
  return {
    table: {
      widths: Object.keys(headers).map(() => '*'),
      body,
    },
    layout: {
      hLineWidth: (i: number) => {
        if (i === 1) {
          return 1;
        }
        if (i === body.length - 1) {
          return 1;
        }
        return 0;
      },

      vLineWidth: () => 0,
      paddingLeft: () => 5,
      paddingRight: () => 5,
      paddingTop: () => 5,
      paddingBottom: () => 5,
    },
    unbreakable: true,
  } as ContentTable;
}

export function createPefTableHeader(text: string, additionalContent?: Content): Content {
  return {
    table: {
      widths: ['*'],
      body: [
        [
          {
            stack: [
              {
                text,
                style: 'PEFHeaderContent',
                alignment: 'left',
              },
              additionalContent ?? null,
            ],
            fillColor: '#FAFAFA',
            margin: [0, 0, 0, 0],
          },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingLeft: () => 5,
      paddingRight: () => 5,
      paddingTop: () => 5,
      paddingBottom: () => 5,
    },
  } as Content;
}

export function getTaxCategoryDescription(ID?: string): string {
  switch (ID) {
    case 'AE':
      return 'Odwrotne obciążenie';
    case 'E':
      return 'Zwolniony';
    case 'S':
      return 'Standard';
    case 'G':
      return 'Export';
    case 'O':
      return 'Nie podlega VAT';
    case 'K':
      return 'Dostawa wewnątrz UE';
    case 'Z':
      return 'Zero';
    case 'L':
      return 'Canary Islands general indirect tax';
    case 'M':
      return 'Tax for production, services and importation in Ceuta and Melilla';
    case 'B':
      return 'Transferred (VAT), In Italy';
    default:
      return '';
  }
}
