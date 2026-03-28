import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelTextArray,
  createSection,
  getContentTable,
  getDifferentColumnsValue,
  getTable,
  getTStawkaPodatku,
  getValue,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { FakturaRR as Fa, FP } from '../../types/FaRR.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';

export function generateWiersze(fa: Fa): Content {
  const table: Content[] = [];
  const faWiersze: Record<string, FP>[] = getTable(fa.FakturaRRWiersz).map(
    (wiersz: Record<string, FP>): Record<string, FP> => {
      if (getValue(wiersz.P_9)) {
        wiersz.P_9._text = getTStawkaPodatku(getValue(wiersz.P_9) as string, 'RR');
      }
      return { ...wiersz };
    }
  );
  const definedHeaderLp: HeaderDefine[] = [
    { name: 'NrWierszaFa', title: 'Lp.', format: FormatTyp.Default, width: 'auto' },
  ];
  const definedHeader1: HeaderDefine[] = [
    { name: 'P_5', title: 'Nazwa', format: FormatTyp.Default, width: '*' },
    { name: 'P_6A', title: 'Miara', format: FormatTyp.Default, width: 'auto' },
    { name: 'P_6B', title: 'Ilość', format: FormatTyp.Number, width: 'auto' },
    { name: 'P_6C', title: 'Opis klasy lub jakości', format: FormatTyp.Default, width: 'auto' },
    { name: 'P_7', title: 'Cena jedn.', format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_8', title: 'Wartość bez ZZP', format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_9', title: 'Stawka ZZP', format: FormatTyp.Default, width: 'auto' },
    { name: 'P_10', title: 'Kwota ZZP', format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_11', title: 'Wartość z ZZP', format: FormatTyp.Currency, width: 'auto' },
  ];

  if (getDifferentColumnsValue('KursWaluty', faWiersze).length !== 1) {
    definedHeader1.push({
      name: 'KursWaluty',
      title: 'Kurs waluty',
      format: FormatTyp.Currency6,
      width: 'auto',
    });
  }
  definedHeader1.push({ name: 'StanPrzed', title: 'Stan przed', format: FormatTyp.Boolean, width: 'auto' });
  const definedHeader2: HeaderDefine[] = [
    { name: 'P_4AA', title: 'Data dokonania nabycia', format: FormatTyp.Date, width: 'auto' },
    { name: 'GTIN', title: 'GTIN', format: FormatTyp.Default, width: 'auto' },
    { name: 'PKWiU', title: 'PKWiU', format: FormatTyp.Default, width: 'auto' },
    { name: 'CN', title: 'CN', format: FormatTyp.Default, width: 'auto' },
  ];
  let content = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeaderLp, ...definedHeader1, ...definedHeader2],
    faWiersze,
    'auto'
  );

  const opis: Content = {
    stack: [
      {
        stack: [
          createLabelTextArray([
            {
              value: 'Wartość nabytych produktów rolnych lub wykonanych usług rolniczych: ',
            },
            {
              value: getValue(fa.P_11_1),
              formatTyp: [FormatTyp.Currency, FormatTyp.Value],
              currency: getValue(fa.KodWaluty)?.toString() ?? '',
            },
          ]),
        ],
        margin: [0, 0, 0, 8],
      },
      {
        stack: [
          createLabelTextArray([
            {
              value: 'Kwota zryczałtowanego zwrotu podatku: ',
              formatTyp: [FormatTyp.LabelMargin, FormatTyp.Label],
            },
            {
              value: getValue(fa.P_11_2),
              formatTyp: [FormatTyp.Currency, FormatTyp.Value, FormatTyp.LabelMargin],
              currency: getValue(fa.KodWaluty)?.toString() ?? '',
            },
          ]),
        ],
        margin: [0, 0, 0, 8],
      },
      {
        stack: [
          createLabelTextArray([
            {
              value: 'Kwota należności ogółem: ',
              formatTyp: [FormatTyp.LabelGreater, FormatTyp.LabelMargin],
            },
            {
              value: getValue(fa.P_12_1),
              formatTyp: [FormatTyp.Currency, FormatTyp.ValueMedium, FormatTyp.LabelMargin],
              currency: getValue(fa.KodWaluty)?.toString() ?? '',
            },

            getValue(fa.KodWaluty)?.toString() === 'PLN'
              ? { value: '' }
              : {
                  value: ` (${getValue(fa.P_12_1W)} PLN)`,
                  formatTyp: [FormatTyp.Currency, FormatTyp.ValueMedium, FormatTyp.LabelMargin],
                },
          ]),
        ],
        margin: [0, 0, 0, 8],
      },
      createLabelTextArray([
        { value: 'Słownie: ', formatTyp: [FormatTyp.LabelMargin, FormatTyp.Label] },
        {
          value: getValue(fa.P_12_2),
          formatTyp: [FormatTyp.Value],
        },
      ]),
    ],
    alignment: Position.RIGHT,
    margin: [0, 8, 0, 0],
  };

  if (content.fieldsWithValue.length <= 8 && content.content) {
    table.push(content.content);
  } else {
    content = getContentTable<(typeof faWiersze)[0]>([...definedHeaderLp, ...definedHeader1], faWiersze, '*');
    if (content.content) {
      table.push(content.content);
    }
    content = getContentTable<(typeof faWiersze)[0]>([...definedHeaderLp, ...definedHeader2], faWiersze, '*');
    if (content.content && content.fieldsWithValue.length > 1) {
      table.push('\n');
      table.push(content.content);
    }
  }
  if (table.length < 1) {
    return [];
  }
  return createSection([...createHeader('Pozycje'), ...table, opis], true);
}
