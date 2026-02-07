import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSection,
  formatText,
  generateTwoColumns,
  getContentTable,
  getTable,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { Fa } from '../../types/fa3.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { t } from '../../../i18n';

export function generateRabat(invoice: Fa): Content[] {
  const faRows = getTable(invoice!.FaWiersz).map((row: Record<string, any>) => {
    const p8a: Record<string, any> = row.P_8A?._text === 'szt' ? { P_8A: { _text: t('units.szt') } } : {};
    return { ...row, ...p8a };
  });
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    { name: 'NrWierszaFa', title: 'Lp.', format: FormatTyp.Default },
    { name: 'P_7', title: t('wiersze.nazwaTowaruLubUslugi'), format: FormatTyp.Default },
    { name: 'P_8B', title: t('wiersze.ilosc'), format: FormatTyp.Default },
    { name: 'P_8A', title: t('wiersze.miara'), format: FormatTyp.Default },
  ];
  const tabRabat = getContentTable<(typeof faRows)[0]>(definedHeader, faRows, '*');

  const isNrWierszaFa = tabRabat.fieldsWithValue.includes('NrWierszaFa');

  result.push(
    ...createHeader('Rabat'),
    ...createLabelText('Wartość rabatu ogółem: ', invoice.P_15, FormatTyp.Currency, {
      alignment: Position.RIGHT,
    }),
    generateTwoColumns(
      formatText(
        `Rabat ${isNrWierszaFa ? 'nie ' : ''}dotyczy wszystkich dostaw towarów i wykonanych usług na rzecz tego nabywcy w danym okresie.`,
        FormatTyp.Default
      ),
      ''
    )
  );
  if (tabRabat.fieldsWithValue.length > 0 && tabRabat.content) {
    result.push(tabRabat.content);
  }

  return createSection(result, true);
}
