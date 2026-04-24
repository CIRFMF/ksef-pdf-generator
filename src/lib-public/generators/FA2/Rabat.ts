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
import { Fa } from '../../types/fa2.types';
import FormatTyp, { Position } from '../../../shared/enums/common.enum';
import { TableWithFields } from '../../types/fa1-additional-types';
import { FP } from '../../types/fa1.types';
import i18n from 'i18next';

export function generateRabat(invoice: Fa): Content[] {
  const faRows: Record<string, FP>[] = getTable(invoice!.FaWiersz);
  const result: Content[] = [];
  const definedHeader: HeaderDefine[] = [
    { name: 'NrWierszaFa', title: i18n.t('invoice.discount.lp'), format: FormatTyp.Default, width: 'auto' },
    { name: 'P_7', title: i18n.t('invoice.discount.productName'), format: FormatTyp.Default },
    { name: 'P_8B', title: i18n.t('invoice.discount.quantity'), format: FormatTyp.Default },
    { name: 'P_8A', title: i18n.t('invoice.discount.unit'), format: FormatTyp.Default },
  ];
  const tabRabat: TableWithFields = getContentTable<(typeof faRows)[0]>(definedHeader, faRows, '*');
  const isNrWierszaFa: boolean = tabRabat.fieldsWithValue.includes('NrWierszaFa');

  result.push(
    ...createHeader(i18n.t('invoice.discount.header')),
    ...createLabelText(i18n.t('invoice.discount.totalValue'), invoice.P_15, FormatTyp.Currency, {
      alignment: Position.RIGHT,
    }),
    generateTwoColumns(
      formatText(
        i18n.t(isNrWierszaFa ? 'invoice.discount.notAll' : 'invoice.discount.all'),
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
