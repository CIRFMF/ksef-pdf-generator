import { getTable, getText, hasValue } from '@shared/PDF-functions';
import { Content } from 'pdfmake/interfaces';
import i18n from 'i18next';
import { PEFCorrectiveInvoice } from 'src/lib-public/types/pef-invoice-corrective.types';
import { createPefTableHeader, getContentPEFTable } from '@shared/functions-pef';
import FormatTyp, { Position } from '@shared/enums/common.enum';
import { HeaderDefine } from '@shared/types/pdf-types';
import { getExtensionTwo, getUBLExtensionArray, PEFTable } from '../../types/pef.types';

export function generateDiffSummary(invoice: PEFCorrectiveInvoice): Content[] {
  const table: Content[] = [];

  const UBLExtensionArray = getUBLExtensionArray(invoice);
  const UBLExtensionDiffValues = getExtensionTwo(UBLExtensionArray);
  const diff = UBLExtensionDiffValues?.InvoiceCorrection;

  const pefWiersze: PEFTable[] = getTable(diff?.TaxTotal?.TaxSubtotal).reduce((acc, wiersz): PEFTable[] => {
    let data: PEFTable = {};

    if (hasValue(wiersz?.TaxCategory?.ID) && hasValue(wiersz?.TaxCategory?.Percent)) {
      data = {
        ...data,
        taxType: [
          {
            value: [
              { text: getText(wiersz?.TaxCategory?.ID) },
              { text: getText(wiersz?.TaxCategory?.Percent), format: FormatTyp.Percentage },
            ],
            style: 'inline',
          },
        ],
      };
    }

    if (hasValue(wiersz.TaxableAmount)) {
      data = {
        ...data,
        taxableAmount: [
          {
            value: [
              { text: getText(wiersz.TaxableAmount), format: FormatTyp.Number },
              { text: wiersz?.TaxableAmount?._attributes?.currencyID ?? '' },
            ],
            style: 'valueLabel',
          },
        ],
      };
    }

    if (hasValue(wiersz.TaxAmount)) {
      data = {
        ...data,
        taxAmount: [
          {
            value: [
              { text: getText(wiersz.TaxAmount), format: FormatTyp.Number },
              { text: wiersz?.TaxAmount?._attributes?.currencyID ?? '' },
            ],
            style: 'valueLabel',
          },
        ],
      };
    }

    if (Object.keys(data).length) {
      acc.push(data);
    }

    return acc;
  }, []);

  if (pefWiersze.length) {
    const defineHeader: HeaderDefine[] = [
      {
        name: 'taxType',
        title: i18n.t('pef.diffSummary.table.typeAndValue'),
        format: FormatTyp.PEFHeaderContent,
        width: '*',
        position: Position.LEFT,
      },
      {
        name: 'taxableAmount',
        title: i18n.t('pef.diffSummary.table.netto'),
        format: FormatTyp.PEFHeaderContent,
        width: '*',
        position: Position.RIGHT,
      },
      {
        name: 'taxAmount',
        title: i18n.t('pef.diffSummary.table.discount'),
        format: FormatTyp.PEFHeaderContent,
        width: '*',
        position: Position.RIGHT,
      },
    ];

    const content = getContentPEFTable(defineHeader, pefWiersze);

    table.push(createPefTableHeader(i18n.t('pef.diffSummary.title')), content);
  }

  return table;
}
