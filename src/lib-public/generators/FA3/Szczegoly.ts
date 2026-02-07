import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createLabelTextArray,
  createSection,
  generateTwoColumns,
  getContentTable,
  getDifferentColumnsValue,
  getTable,
  getValue,
  hasColumnsValue,
  hasValue,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { TRodzajFaktury } from '../../../shared/consts/const';
import { Fa, ZaliczkaCzesciowa } from '../../types/fa3.types';
import { ObjectKeysOfFP, TypesOfValues } from '../../../shared/types/universal.types';
import FormatTyp from '../../../shared/enums/common.enum';
import { FA3FakturaZaliczkowaData } from '../../types/common.types';
import { t } from '../../../i18n';

export function generateSzczegoly(faVat: Fa): Content[] {
  const faWiersze = getTable(faVat.FaWiersz);
  const zamowieniaWiersze = getTable(faVat.Zamowienie?.ZamowienieWiersz);
  const LabelP_6 =
    faVat.RodzajFaktury == TRodzajFaktury.ZAL || faVat.RodzajFaktury == TRodzajFaktury.KOR_ZAL
      ? t('szczegoly.dataOtrzymaniaZaplaty')
      : t('szczegoly.dataDokonaniaDostawy');

  const P_6Scope: Content[] = generateP_6Scope(faVat.OkresFa?.P_6_Od, faVat.OkresFa?.P_6_Do);

  const cenyLabel1: Content[] = [];
  const cenyLabel2: Content[] = [];

  if (!(faWiersze.length > 0 || zamowieniaWiersze.length > 0)) {
    const Any_P_11 = hasColumnsValue('P_11', faWiersze) || hasColumnsValue('P_11', zamowieniaWiersze);

    if (Any_P_11) {
      cenyLabel1.push(createLabelText(t('szczegoly.fakturaWCenach'), t('szczegoly.netto')));
    } else {
      cenyLabel1.push(createLabelText(t('szczegoly.fakturaWCenach'), t('szczegoly.brutto')));
    }
    cenyLabel2.push(createLabelText(t('szczegoly.kodWaluty'), faVat.KodWaluty));
  }

  const P_12_XIILabel: Content[] = [];

  if (hasColumnsValue('P_12_XII', faWiersze) || hasColumnsValue('P_12_XII', zamowieniaWiersze)) {
    P_12_XIILabel.push(createLabelText(t('szczegoly.proceduraOSS'), ' '));
  }

  const kodWalutyLabel1: Content[] = [];
  const kodWalutyLabel2: Content[] = [];

  if (hasValue(faVat.KodWaluty) && getValue(faVat.KodWaluty) != 'PLN') {
    if (hasValue(faVat.KursWalutyZ)) {
      kodWalutyLabel1.push(createLabelText(t('szczegoly.kursWalutyWspolny'), ' '));
      kodWalutyLabel2.push(createLabelText(t('szczegoly.kursWaluty'), faVat.KursWalutyZ, FormatTyp.Currency6));
    } else {
      const Common_KursWaluty = getDifferentColumnsValue('KursWaluty', faWiersze);

      if (Common_KursWaluty.length === 1) {
        kodWalutyLabel1.push(createLabelText(t('szczegoly.kursWalutyWspolny'), ' '));
        kodWalutyLabel2.push(
          createLabelText(t('szczegoly.kursWaluty'), Common_KursWaluty[0].value, FormatTyp.Currency6)
        );
      }
    }
  }
  const tpLabel1: Content[] = [];
  const tpLabel2: Content[] = [];

  const forColumns = [
    createLabelText(t('szczegoly.dataWystawienia'), faVat.P_1, FormatTyp.Date),
    createLabelText(t('szczegoly.miejsceWystawienia'), faVat.P_1M),
    createLabelText(t('szczegoly.okresRabat'), faVat.OkresFaKorygowanej),
    createLabelText(LabelP_6, faVat.P_6, FormatTyp.Date),
    P_6Scope,
    cenyLabel1,
    cenyLabel2,
    P_12_XIILabel,
    kodWalutyLabel1,
    kodWalutyLabel2,
    tpLabel1,
    tpLabel2,
  ].filter((el) => el.length > 0);
  const columns1: Content[] = [];
  const columns2: Content[] = [];

  forColumns.forEach((tab, index) => {
    if (index % 2) {
      columns2.push(tab);
    } else {
      columns1.push(tab);
    }
  });
  const table: Content[] = [
    ...createHeader(t('szczegoly.sectionTitle')),
    generateTwoColumns(columns1, columns2),
    ...generateZaliczkaCzesciowa(faVat.ZaliczkaCzesciowa),
    ...generateFakturaZaliczkowa(faVat.FakturaZaliczkowa),
  ];

  return createSection(table, true);
}

function generateP_6Scope(P_6_Od: TypesOfValues, P_6_Do: TypesOfValues): Content[] {
  const table: Content[] = [];

  if (hasValue(P_6_Od) && hasValue(P_6_Do)) {
    table.push(
      createLabelTextArray([
        { value: t('szczegoly.dataDokonaniaOd') },
        { value: P_6_Od, formatTyp: FormatTyp.Value },
        { value: t('szczegoly.dataDokonaniaDo') },
        { value: P_6_Do, formatTyp: FormatTyp.Value },
      ])
    );
  } else if (hasValue(P_6_Od)) {
    table.push(createLabelText(t('szczegoly.dataDokonaniaOd'), P_6_Od));
  } else if (hasValue(P_6_Do)) {
    table.push(createLabelText(t('szczegoly.dataDokonaniaDoLabel'), P_6_Do));
  }
  return table;
}

function generateZaliczkaCzesciowa(zaliczkaCzesciowaData: ZaliczkaCzesciowa[] | undefined): Content[] {
  if (!zaliczkaCzesciowaData) {
    return [];
  }
  const zaplataCzesciowa = getTable(zaliczkaCzesciowaData);
  const table: Content[] = [];

  const zaplataCzesciowaHeader: HeaderDefine[] = [
    { name: 'P_6Z', title: 'Data otrzymania płatności', format: FormatTyp.Default },
    { name: 'P_15Z', title: 'Kwota płatności', format: FormatTyp.Default },
    { name: 'KursWalutyZW', title: 'Kurs waluty', format: FormatTyp.Currency6 },
  ];

  const tableZaliczkaCzesciowa = getContentTable<(typeof zaplataCzesciowa)[0]>(
    zaplataCzesciowaHeader,
    zaplataCzesciowa,
    'auto'
  );

  if (tableZaliczkaCzesciowa.content) {
    table.push(tableZaliczkaCzesciowa.content);
  }
  return table;
}

function generateFakturaZaliczkowa(fakturaZaliczkowaData: ObjectKeysOfFP[] | undefined): Content[] {
  if (!fakturaZaliczkowaData) {
    return [];
  }
  const fakturaZaliczkowa = getTable(fakturaZaliczkowaData) as unknown as FA3FakturaZaliczkowaData[];
  const fakturaZaliczkowaMapped = fakturaZaliczkowa.map(item => {
    const fp =
        (
            'NrFaZaliczkowej' in item && item.NrFaZaliczkowej
        ) ? item.NrFaZaliczkowej : ('NrKSeFFaZaliczkowej' in item ? item.NrKSeFFaZaliczkowej : undefined );

    return{
        ...item,
        NrFaZaliczkowej : fp ?? { _text: ''},
    };
  })
  const table: Content[] = [];

  const fakturaZaliczkowaHeader: HeaderDefine[] = [
    {
      name: 'NrFaZaliczkowej',
      title: t('szczegoly.numeryFakturZaliczkowych'),
      format: FormatTyp.Default,
    },
  ];

  const tableFakturaZaliczkowa = getContentTable<(typeof fakturaZaliczkowa)[0]>(
    fakturaZaliczkowaHeader,
    fakturaZaliczkowaMapped,
    'auto',
    [0, 4, 0, 0]
  );

  if (tableFakturaZaliczkowa.content) {
    table.push(tableFakturaZaliczkowa.content);
  }
  return table;
}
