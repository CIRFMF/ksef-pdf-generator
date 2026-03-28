import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createSection,
  createSubHeader,
  getContentTable,
  getTable,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { DodatkowyOpi, DokumentZaplaty, FakturaRR as Fa } from '../../types/FaRR.types';
import FormatTyp from '../../../shared/enums/common.enum';

export function generateDodatkoweInformacje(fa: Fa): Content[] {
  const table: Content[] = [
    ...createHeader('Dodatkowe informacje'),
    ...generateDokumentyZaplaty(fa.DokumentZaplaty),
    ...generateDodatkowyOpis(fa.DodatkowyOpis),
  ];

  return table.length > 1 ? createSection(table, true) : [];
}

function generateDokumentyZaplaty(dokumentZaplaty: DokumentZaplaty[] | undefined): Content[] {
  if (!dokumentZaplaty) {
    return [];
  }
  const dokumentZaplatyTable = getTable(dokumentZaplaty)?.map((item, index) => ({
    ...item,
    lp: { _text: index + 1 },
  }));
  const table: Content[] = createSubHeader('Dokumenty Zapłaty', [0, 0, 0, 4]);

  const dokumentZaplatyHeader: HeaderDefine[] = [
    {
      name: 'lp',
      title: 'Lp.',
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'NrDokumentu',
      title: 'Numer dokumentu',
      format: FormatTyp.Default,
      width: '*',
    },
    {
      name: 'DataDokumentu',
      title: 'Data dokumentu',
      format: FormatTyp.Date,
      width: 'auto',
    },
  ];
  const dokumentZaplatyTableContent = getContentTable<(typeof dokumentZaplatyTable)[0]>(
    dokumentZaplatyHeader,
    dokumentZaplatyTable,
    '*',
    [0, 0, 0, 0]
  );

  if (dokumentZaplatyTableContent.content) {
    table.push(dokumentZaplatyTableContent.content);
  }
  return table;
}

function generateDodatkowyOpis(dodatkowyOpis: DodatkowyOpi[] | undefined): Content[] {
  if (!dodatkowyOpis) {
    return [];
  }
  const dodatkowyOpisTable = getTable(dodatkowyOpis)?.map((item, index) => ({
    ...item,
    lp: { _text: index + 1 },
  }));
  const table: Content[] = createSubHeader('Dodatkowy opis');

  const dodatkowyOpisHeader: HeaderDefine[] = [
    {
      name: 'lp',
      title: 'Lp.',
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'NrWiersza',
      title: 'Numer wiersza',
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'Klucz',
      title: 'Rodzaj informacji',
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'Wartosc',
      title: 'Treść informacji',
      format: FormatTyp.Default,
      width: '*',
    },
  ];
  const dodatkowyOpisTableContent = getContentTable<(typeof dodatkowyOpisTable)[0]>(
    dodatkowyOpisHeader,
    dodatkowyOpisTable,
    '*',
    [0, 0, 0, 0]
  );

  if (dodatkowyOpisTableContent.content) {
    table.push(dodatkowyOpisTableContent.content);
  }
  return table;
}
