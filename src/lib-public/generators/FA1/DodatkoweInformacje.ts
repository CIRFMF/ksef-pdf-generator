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
import { DodatkowyOpi, Fa } from '../../types/fa1.types';
import FormatTyp from '../../../shared/enums/common.enum';
import { FakturaZaliczkowa, TableWithFields } from '../../types/fa1-additional-types';
import i18n from 'i18next';

export function generateDodatkoweInformacje(faVat: Fa): Content[] {
  const tpLabel: Content[] = [];

  if (getValue(faVat.TP) === '1') {
    tpLabel.push(
      formatText(i18n.t('invoice.additionalInformation.tpLabel'))
    );
  }

  const fpLabel: Content[] = [];

  if (getValue(faVat.FP) === '1') {
    fpLabel.push(formatText(i18n.t('invoice.additionalInformation.fpLabel')));
  }

  const zwrotAkcyzyLabel: Content[] = [];

  if (getValue(faVat.ZwrotAkcyzy) === '1') {
    zwrotAkcyzyLabel.push(
      formatText(
          i18n.t('invoice.additionalInformation.exciseTaxRefund')
      )
    );
  }

  const labels: Content[][] = [tpLabel, fpLabel, zwrotAkcyzyLabel].filter((el) => el.length > 0);
  const table: Content[] = [
    ...createHeader(i18n.t('invoice.additionalInformation.additionalInformationLabel')),
    ...labels,
    ...generateDodatkowyOpis(faVat.DodatkowyOpis, i18n),
  ];

  return table.length > 1 ? createSection(table, true) : [];
}

function generateDodatkowyOpis(fakturaZaliczkowaData: DodatkowyOpi[] | undefined, i18n: any): Content[] {
  if (!fakturaZaliczkowaData) {
    return [];
  }
  const fakturaZaliczkowa: FakturaZaliczkowa[] = getTable(fakturaZaliczkowaData)?.map((item, index) => ({
    ...item,
    lp: { _text: index + 1 },
  }));
  const table: Content[] = createSubHeader(i18n.t('invoice.additionalInformation.additionalDescription'));

  const fakturaZaliczkowaHeader: HeaderDefine[] = [
    {
      name: 'lp',
      title: i18n.t('invoice.additionalInformation.ordinalNumber'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'Klucz',
      title: i18n.t('invoice.additionalInformation.typeOfInformation'),
      format: FormatTyp.Default,
      width: 'auto',
    },
    {
      name: 'Wartosc',
      title: i18n.t('invoice.additionalInformation.informationContent'),
      format: FormatTyp.Default,
      width: '*',
    },
  ];
  const tableFakturaZaliczkowa: TableWithFields = getContentTable<(typeof fakturaZaliczkowa)[0]>(
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
