import { createSection, getTable, getText } from '@shared/PDF-functions';
import { Content } from 'pdfmake/interfaces';
import i18n from 'i18next';
import FormatTyp, { Position } from '@shared/enums/common.enum';
import { createPefTableHeader, formatDateFromTo, getContentPEFTable } from '@shared/functions-pef';
import { InvoiceLine, PEFCorrectiveInvoice } from '../../types/pef-invoice-corrective.types';
import { HeaderDefine } from '@shared/types/pdf-types';
import { getExtensionThree, getUBLExtensionArray, PEFTable } from '../../types/pef.types';
import { PEFSpecInvoice } from '../../types/pef-invoice-spec.types';

export function generateAccountReckoning(invoice: PEFCorrectiveInvoice | PEFSpecInvoice): Content[] {
  const result: Content[] = [];

  const UBLExtensionArray = getUBLExtensionArray(invoice);
  const UBLExtensionCorrectiveData = getExtensionThree(UBLExtensionArray);

  const data = getTable(UBLExtensionCorrectiveData?.AdditionalInvoiceGrossData?.InvoiceLine)?.filter(
    (el) => getText(el.AccountingCost) === 'Rozliczenie'
  );

  if (!data?.length) {
    return result;
  }

  const rows: PEFTable[] = getTable(data).map(
    (item: InvoiceLine, index): PEFTable => ({
      lineNo: [{ value: [{ text: (index + 1).toString() }], style: 'inline' }],
      name: [{ value: [{ text: getText(item?.Item?.Name) ?? '-' }], style: 'inline' }],
      description: [{ value: [{ text: getText(item?.Item?.Description) ?? '-' }], style: 'inline' }],
      period: [
        {
          value: [
            {
              text:
                formatDateFromTo(
                  getText(item.InvoicePeriod?.StartDate),
                  getText(item.InvoicePeriod?.EndDate)
                ) ?? '-',
            },
          ],
          style: 'inline',
        },
      ],
      costAmount: [
        {
          value: [
            { text: getText(item.LineExtensionGrossAmount) },
            { text: item.LineExtensionGrossAmount?._attributes?.currencyID ?? '' },
          ],
          style: 'valueLabel',
        },
      ],
    })
  );

  const defineHeader: HeaderDefine[] = [
    {
      name: 'lineNo',
      title: i18n.t('pef.accountReckoning.lineNo'),
      format: FormatTyp.PEFHeaderContent,
      width: 'auto',
      position: Position.LEFT,
    },
    {
      name: 'name',
      title: i18n.t('pef.accountReckoning.name'),
      format: FormatTyp.PEFHeaderContent,
      width: '*',
      position: Position.LEFT,
    },
    {
      name: 'description',
      title: i18n.t('pef.accountReckoning.description'),
      format: FormatTyp.PEFHeaderContent,
      width: '*',
      position: Position.LEFT,
    },
    {
      name: 'period',
      title: i18n.t('pef.accountReckoning.period'),
      format: FormatTyp.PEFHeaderContent,
      width: '*',
      position: Position.LEFT,
    },
    {
      name: 'costAmount',
      title: i18n.t('pef.accountReckoning.costAmount'),
      format: FormatTyp.PEFHeaderContent,
      width: 'auto',
      position: Position.RIGHT,
    },
  ];

  const content = getContentPEFTable(defineHeader, rows, undefined, true);

  result.push(createPefTableHeader(i18n.t('pef.accountReckoning.title')), content);

  return createSection(result, false, [0, 8, 0, 0]);
}
