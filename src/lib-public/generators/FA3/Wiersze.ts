import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelTextArray,
  createSection,
  formatText,
  getContentTable,
  getDifferentColumnsValue,
  getTable,
  getTStawkaPodatku,
  getValue,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { TRodzajFaktury } from '../../../shared/consts/const';
import { Fa, FP } from '../../types/fa3.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { addMarza } from '../common/Wiersze';
import { t } from '../../../i18n';

export function generateWiersze(faVat: Fa): Content {
  const table: Content[] = [];
  const rodzajFaktury: string | number | undefined = getValue(faVat.RodzajFaktury);
  const isP_PMarzy = Boolean(Number(getValue(faVat.Adnotacje?.PMarzy?.P_PMarzy)));
  const faWiersze: Record<string, FP>[] = getTable(faVat.FaWiersz).map(
    (wiersz: Record<string, FP>): Record<string, FP> => {
      const marza: Record<string, FP> = addMarza(rodzajFaktury, isP_PMarzy, wiersz)!;

      if (getValue(wiersz.P_12)) {
        wiersz.P_12._text = getTStawkaPodatku(getValue(wiersz.P_12) as string, 3);
      }
      const p8a: Record<string, FP> = wiersz.P_8A?._text === 'szt' ? { P_8A: { _text: t('units.szt') } } : {};
      return { ...wiersz, ...marza, ...p8a };
    }
  );
  const definedHeaderLp: HeaderDefine[] = [
    { name: 'NrWierszaFa', title: 'Lp.', format: FormatTyp.Default, width: 'auto' },
  ];
  const definedHeader1: HeaderDefine[] = [
    { name: 'UU_ID', title: 'Unikalny numer wiersza', format: FormatTyp.Default, width: 'auto' },
    { name: 'P_7', title: t('wiersze.nazwaTowaruLubUslugi'), format: FormatTyp.Default, width: '*' },
    { name: 'P_9A', title: t('wiersze.cenaJednNetto'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_9B', title: t('wiersze.cenaJednBrutto'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_8B', title: t('wiersze.ilosc'), format: FormatTyp.Number, width: 'auto' },
    { name: 'P_8A', title: t('wiersze.miara'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_10', title: 'Rabat', format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_12', title: t('wiersze.stawkaPodatku'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_12_XII', title: t('wiersze.stawkaPodatkuOSS'), format: FormatTyp.Percentage, width: 'auto' },
    {
      name: 'P_12_Zal_15',
      title: 'Znacznik dla towaru lub usługi z zał. nr 15 do ustawy',
      format: FormatTyp.Default,
      width: 'auto',
    },
    { name: 'P_11', title: t('wiersze.wartoscSprzedazyNetto'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_11A', title: t('wiersze.wartoscSprzedazyBrutto'), format: FormatTyp.Currency, width: 'auto' },
    { name: 'P_11Vat', title: t('wiersze.wartoscSprzedazyVat'), format: FormatTyp.Currency, width: 'auto' },
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
    { name: 'GTIN', title: 'GTIN', format: FormatTyp.Default, width: 'auto' },
    { name: 'PKWiU', title: 'PKWiU', format: FormatTyp.Default, width: 'auto' },
    { name: 'CN', title: 'CN', format: FormatTyp.Default, width: 'auto' },
    { name: 'PKOB', title: 'PKOB', format: FormatTyp.Default, width: 'auto' },
    { name: 'KwotaAkcyzy', title: 'KwotaAkcyzy', format: FormatTyp.Default, width: 'auto' },
    { name: 'GTU', title: 'GTU', format: FormatTyp.Default, width: 'auto' },
    { name: 'Procedura', title: 'Procedura', format: FormatTyp.Default, width: '*' },
    { name: 'P_6A', title: 'Data dostawy / wykonania', format: FormatTyp.Default, width: 'auto' },
    { name: 'Indeks', title: 'Indeks', format: FormatTyp.Default, width: 'auto' },
  ];
  let content = getContentTable<(typeof faWiersze)[0]>(
    [...definedHeaderLp, ...definedHeader1, ...definedHeader2],
    faWiersze,
    'auto'
  );
  const ceny = formatText(
    (content.fieldsWithValue.includes('P_11') ? t('wiersze.fakturaWCenachNettoWalucie') : t('wiersze.fakturaWCenachBruttoWalucie')) + (faVat.KodWaluty?._text ?? ''),
    [FormatTyp.Label, FormatTyp.MarginBottom8]
  );

  const p_15 = getValue(faVat.P_15);
  let opis: Content = '';

  if (rodzajFaktury == TRodzajFaktury.ROZ && Number(p_15) !== 0) {
    opis = {
      stack: createLabelTextArray([
        { value: 'Kwota pozostała do zapłaty: ', formatTyp: FormatTyp.LabelGreater },
        {
          value: p_15,
          formatTyp: FormatTyp.CurrencyGreater,
          currency: getValue(faVat.KodWaluty)?.toString() ?? '',
        },
      ]),
      alignment: Position.RIGHT,
      margin: [0, 8, 0, 0],
    };
  } else if (
    (rodzajFaktury == TRodzajFaktury.VAT ||
      rodzajFaktury == TRodzajFaktury.KOR ||
      rodzajFaktury == TRodzajFaktury.KOR_ROZ ||
      rodzajFaktury == TRodzajFaktury.UPR) &&
    Number(p_15) !== 0
  ) {
    opis = {
      stack: createLabelTextArray([
        { value: t('wiersze.kwotaNaleznosciOgolem'), formatTyp: FormatTyp.LabelGreater },
        {
          value: p_15,
          formatTyp: [FormatTyp.CurrencyGreater, FormatTyp.HeaderContent, FormatTyp.Value],
          currency: getValue(faVat.KodWaluty)?.toString() ?? '',
        },
      ]),
      alignment: Position.RIGHT,
      margin: [0, 8, 0, 0],
    };
  }
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
  return createSection([...createHeader(t('wiersze.pozycje')), ceny, ...table, opis], true);
}
