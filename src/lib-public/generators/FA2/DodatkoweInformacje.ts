import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createSection,
  createSubHeader,
  formatText,
  getContentTable,
  getTable,
  getValue,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { DodatkowyOpi, Fa } from '../../types/fa2.types';
import FormatTyp from '../../../shared/enums/common.enum';
import { FormContentState } from '../../../shared/types/additional-data.types';
import i18n from 'i18next';

export function generateDodatkoweInformacje(faVat: Fa): Content[] {
  const tpLabel: Content[] = [];

  if (getValue(faVat.TP) === '1') {
    tpLabel.push(formatText(i18n.t('invoice.additionalInformation.tpLabel')));
  }

  const fpLabel: Content[] = [];

  if (getValue(faVat.FP) === '1') {
    fpLabel.push(formatText(i18n.t('invoice.additionalInformation.fpLabel')));
  }

  const zwrotAkcyzyLabel: Content[] = [];

  if (getValue(faVat.ZwrotAkcyzy) === '1') {
    zwrotAkcyzyLabel.push(formatText(i18n.t('invoice.additionalInformation.exciseTaxRefund')));
  }

  const labels: Content[][] = [tpLabel, fpLabel, zwrotAkcyzyLabel].filter(
    (el: Content[]): boolean => el.length > 0
  );
  const table: Content[] = [
    ...createHeader(i18n.t('invoice.additionalInformation.additionalInformationLabel')),
    ...labels,
    ...generateDodatkowyOpis(faVat.DodatkowyOpis),
  ];

  return table.length > 1 ? createSection(table, true) : [];
}

function generateDodatkowyOpis(fakturaZaliczkowaData: DodatkowyOpi[] | undefined): Content[] {
  if (!fakturaZaliczkowaData) {
    return [];
  }
  const fakturaZaliczkowa: DodatkowyOpi[] = getTable(fakturaZaliczkowaData)?.map(
    (item: DodatkowyOpi, index: number) => ({
      ...item,
      lp: { _text: index + 1 },
    })
  );
  const table: Content[] = createSubHeader(i18n.t('invoice.additionalInformation.additionalDescription'));

  const fakturaZaliczkowaHeader: HeaderDefine[] = [
    {
      name: 'lp',
      title: i18n.t('invoice.additionalInformation.ordinalNumber'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'NrWiersza',
      title: i18n.t('invoice.additionalInformation.rowNumber'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'Klucz',
      title: i18n.t('invoice.additionalInformation.infoType'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'Wartosc',
      title: i18n.t('invoice.additionalInformation.infoContent'),
      format: FormatTyp.Default,
      width: '*',
    },
  ];
  const tableFakturaZaliczkowa: FormContentState = getContentTable<(typeof fakturaZaliczkowa)[0]>(
    fakturaZaliczkowaHeader,
    fakturaZaliczkowa,
    '*',
    [0, 0, 0, 0]
  );

  if (tableFakturaZaliczkowa.content) {
    table.push(tableFakturaZaliczkowa.content);
  }
  return table;
}
