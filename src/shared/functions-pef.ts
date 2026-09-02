import FormatTyp, { Position } from './enums/common.enum';
import { formatText, getTable } from '../shared/PDF-functions';
import { Content, ContentTable, ContentText, Margins, TableCell } from 'pdfmake/interfaces';
import i18n from 'i18next';
import { HeaderDefine, PdfOptionField } from './types/pdf-types';
import { CellStyle, PEFTable, PEFTableCell, PEFTextCell } from 'src/lib-public/types/pef.types';

export function formatTextWithCurrency(
  value: number | string | undefined | null,
  currency: string,
  multiplierFactorNumeric?: number | string,
  emptyValue: string = ''
): ContentText | string {
  if (value === undefined || value === null || value === '') {
    return emptyValue;
  }
  const currencyText =
    multiplierFactorNumeric !== undefined &&
    multiplierFactorNumeric !== null &&
    multiplierFactorNumeric !== ''
      ? `${currency} (${multiplierFactorNumeric}%)`
      : currency;

  return {
    text: [formatText(value, FormatTyp.Currency), formatText(`\n${currencyText}`, FormatTyp.GreyTitle)],
  };
}

export function createPefTableHeader(text: string, description?: Content): Content {
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
              ...(description ? [description] : []),
            ],
            fillColor: '#FAFAFA',
          },
        ],
      ],
    },
    layout: {
      hLineWidth: (i) => {
        if (i === 1) {
          return 0.75;
        }
        return 0;
      },
      vLineWidth: () => 0,
      hLineColor: () => '#E3E3E3',
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 6,
      paddingBottom: () => 6,
    },
  } as Content;
}

export function generatePefTable<T extends Record<string, unknown>>(
  rows: T[],
  headers: Record<keyof T, string>,
  reckoningTests = false
): Content {
  const keys = Object.keys(headers) as (keyof T)[];
  const body: TableCell[][] = [
    keys.map(
      (key): TableCell => ({
        text: String(headers[key]),
        alignment: ['amount', 'baseAmount', 'taxAmount', 'taxableAmount'].includes(String(key))
          ? 'right'
          : 'left',
        bold: true,
        fillColor: '#E6E6E6',
      })
    ),
    ...rows.map((row): TableCell[] =>
      keys.map((key): TableCell => {
        const value = row[key];
        let textValue;

        if (Array.isArray(value)) {
          textValue = value;
        } else if (typeof value === 'object' && value !== null) {
          textValue = [(value as any).text];
        } else if (key === 'reasonCode') {
          textValue = [String(value ?? '')];
        } else {
          textValue = [formatText(value as string)];
        }

        return textValue.map((v) => ({
          text: v,
          alignment: ['amount', 'baseAmount', 'taxAmount', 'taxableAmount'].includes(String(key))
            ? 'right'
            : 'left',
        }));
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
        if (reckoningTests) {
          return 0.2;
        }
        if (i === body.length - 1) {
          return 1;
        }
        return 0;
      },
      hLineColor: (i: number) => (reckoningTests && i !== 1 ? '#F2F2F2' : 'black'),
      vLineWidth: () => 0,
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 6,
      paddingBottom: () => 6,
    },
    unbreakable: true,
  } as ContentTable;
}

export function generateTaxRateLabel(ID?: string, percent?: string): string {
  if (!ID && !percent) {
    return '';
  }
  const description = ID ? `${i18n.t('pef.taxCategory.' + ID)}` : '';

  let result = `VAT: ${ID}`;

  if (description) {
    result += ` (${description})`;
  }

  if (percent) {
    result += `, ${percent}%`;
  }
  return result;
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

export function createPefHeader(text: string): Content[] {
  return [{ stack: [formatText(text, FormatTyp.PEFHeaderContent)], marginBottom: 4 }];
}

export function createPEFSubHeader(text: string): Content[] {
  return [{ stack: [formatText(text, FormatTyp.PEFSubHeaderContent)], marginBottom: 6 }];
}

export function createInlineLabelValue(
  value: string | number | undefined,
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

export function createInlineLabelValueForCell(
  value: string | number | undefined,
  label: string | undefined = undefined,
  valueOptions?: PdfOptionField,
  valueformatTyp?: FormatTyp | FormatTyp[],
  labelOptions?: PdfOptionField,
  labelFormatTyp?: FormatTyp | FormatTyp[],
  currency?: string,
  margin?: Margins
): ContentText {
  if (label) {
    return {
      text: [
        formatText(label, labelFormatTyp ?? FormatTyp.PEFInlineLabel, labelOptions),
        formatText(value ? ' ' + value : ' -', valueformatTyp ?? FormatTyp.PEFValue, valueOptions, currency),
      ],
      margin: margin ?? [0, 0, 0, 1],
    };
  }

  return {
    text: formatText(value, valueformatTyp ?? FormatTyp.PEFValue, valueOptions),
    margin: margin ?? [0, 0, 0, 1],
  };
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

export function createTableLabelValue(
  value: string,
  label: string,
  options?: PdfOptionField,
  valueFormat: FormatTyp[] = [],
  labelFormat: FormatTyp[] = []
): ContentText[] {
  return [
    { text: formatText(value, [FormatTyp.PEFValue, ...valueFormat], options) },
    { text: formatText(label, [FormatTyp.PEFInlineLabel, ...labelFormat], options) },
  ];
}

export function createPEFSectionTitle(value: string): ContentText {
  return { text: formatText(value, FormatTyp.PEFTitle), marginBottom: 3 };
}

export function getContentPEFTable(
  headers: HeaderDefine[],
  data: PEFTable[],
  summary?: PEFTable,
  hLine = false
): ContentTable {
  const headerRow: Content[] = headers.map((headear) => ({
    text: headear.title,
    alignment: headear.position,
    fillColor: '#E6E6E6',
    bold: true,
  }));

  const cellsRows = data.map((row: PEFTable) => {
    return headers.map((header) => {
      const values = row[header.name as keyof PEFTable];
      const cell: Content = [];

      values.forEach((value, i) => {
        if (Array.isArray(value)) {
          value
            .filter((v) => !!v)
            .forEach((v, index) =>
              cell.push(
                prepareContentCell(v, header.position, i !== values.length - 1 && index === value.length - 1)
              )
            );
        } else if (value) {
          cell.push(prepareContentCell(value, header.position));
        }
      });

      return cell;
    });
  });

  const sum: Content[] = [];

  if (summary) {
    const keys = ['title', 'sum'];
    const cellTemp: Content[] = [];
    let elementLength = headerRow.length;

    keys.forEach((key) => {
      const values = summary[key];

      values.forEach((s) => {
        if (Array.isArray(s)) {
          return [];
        } else {
          const cell = prepareContentCell(s, s.style === 'inline' ? Position.LEFT : Position.RIGHT, false) as
            | ContentText
            | ContentText[];
          let emptyCell = 0;

          elementLength = elementLength - 1;
          if (s.colSpan) {
            emptyCell = s.colSpan - 1;
            elementLength = elementLength - emptyCell;
          } else {
            emptyCell = elementLength;
          }
          if (Array.isArray(cell)) {
            cellTemp.push(
              { stack: cell, colSpan: s.colSpan, verticalAlignment: 'middle' },
              ...Array(emptyCell).fill('')
            );
          } else {
            cellTemp.push(
              { ...cell, colSpan: s.colSpan, verticalAlignment: 'middle' },
              ...Array(emptyCell).fill('')
            );
          }
        }
      });
    });

    sum.push(cellTemp);
  }

  return {
    table: {
      dontBreakRows: true,
      keepWithHeaderRows: 1,
      widths: headers.map((header) => header.width ?? 'auto'),
      body: [headerRow, ...cellsRows, ...sum],
      verticalAlignment: 'middle',
    },
    layout: {
      hLineWidth: (i: number, node) => {
        if (i === 1) {
          return 1;
        }
        if (i === node.table.body.length) {
          return 1;
        }
        return hLine ? 0.5 : 0;
      },
      vLineWidth: () => 0,
      hLineColor: (i, node) => {
        if (i === 1 || i === node.table.body.length - (summary ? 1 : 0)) {
          return '#000';
        }

        return '#E3E3E3';
      },
      paddingLeft: () => 5,
      paddingRight: () => 5,
      paddingTop: () => 8,
      paddingBottom: () => 8,
      fillColor: (i, node) => {
        return i > 0 && i !== node.table.body.length - 1 && i % 2 === 0 ? '#f2f2f2' : null;
      },
    },
  } as ContentTable;
}

function prepareContentCell(value: PEFTableCell, position = Position.CENTER, lastSection = false): Content {
  const generator: Record<CellStyle, (v: PEFTextCell[]) => ContentText | ContentText[] | Content> = {
    inline: (v) => inlineGenerator(v, position, lastSection),
    labelValueInline: (v) => {
      if (v[0].text && v[1].text) {
        return createInlineLabelValueForCell(
          v[0].text,
          v[1].text,
          {
            alignment: position,
            verticalAlignment: 'middle',
          },
          v[0].format,
          { alignment: position, verticalAlignment: 'middle' },
          v[1].format,
          v[0].currency,
          lastSection ? [0, 0, 0, 8] : [0, 0, 0, 0]
        );
      } else {
        return { text: '-' };
      }
    },
    valueLabel: (v): ContentText | ContentText[] | Content => {
      if (v[0].text && v[1].text) {
        return lastSection
          ? {
              stack: createTableLabelValue(
                v[0].text,
                v[1].text,
                {
                  alignment: position,
                  verticalAlignment: 'middle',
                },
                getTable(v[0].format)
              ),
              margin: [0, 0, 0, 8],
            }
          : createTableLabelValue(
              v[0].text,
              v[1].text,
              {
                alignment: position,
                verticalAlignment: 'middle',
              },
              getTable(v[0].format)
            );
      } else {
        return { text: '-' };
      }
    },
  };

  return generator[value.style ?? 'inline'](value.value);
}

function inlineGenerator(
  value: PEFTextCell[],
  position: Position,
  lastSection: boolean
): ContentText | ContentText[] {
  return {
    text: value.reduce((acc: ContentText[], v, i) => {
      acc.push(
        formatText(
          v.text,
          v.format,
          { alignment: position, verticalAlignment: 'middle' },
          v?.currency
        ) as ContentText
      );
      if (i !== value.length - 1) {
        acc.push({ text: ', ' });
      }

      return acc[0].text ? acc : '-';
    }, []),
    margin: lastSection ? [0, 0, 0, 8] : [0, 0, 0, 0],
    alignment: 'center',
  };
}

export function createHeaderRow(headers: Content[], widths: string[]): Content {
  return {
    stack: [
      {
        columns: headers.map((header, index) => ({
          width: widths[index],
          text: header,
          bold: true,
          margin: [12, 12, 12, 12],
          alignment: Position.LEFT,
        })),
      },
    ],
  };
}

export function createDataRow(values: string[], widths: string[]): Content {
  return {
    columns: values.map((value, index) => ({
      width: widths[index],
      text: value,
      margin: [12, 12, 12, 12],
    })),
  };
}

export function horizontalLine(color = '#E3E3E3', lineWidth = 1): Content {
  return {
    canvas: [
      {
        type: 'line',
        x1: 0,
        y1: 0,
        x2: 515,
        y2: 0,
        lineColor: color,
        lineWidth,
      },
    ],
  };
}

export function formatDateFromTo(from?: string | null, to?: string | null): string {
  const fromFormatted = from
    ? `${i18n.t('pef.from')} ${(formatText(from, [FormatTyp.Date, FormatTyp.Value]) as ContentText).text}`
    : '';
  const toFormatted = to
    ? `${i18n.t('pef.to')} ${(formatText(to, [FormatTyp.Date, FormatTyp.Value]) as ContentText).text}`
    : '';

  const separator = from && to ? ' - ' : '';

  return `${fromFormatted}${separator}${toFormatted}`;
}

export function displayValueOrDash(value: undefined | null | string): string {
  return value === null || value === undefined || (value as string).replace(/\s+/g, '') === ''
    ? '-'
    : String(value);
}
