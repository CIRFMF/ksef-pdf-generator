import { createPefTableHeader, getContentPEFTable } from '@shared/functions-pef';
import { HeaderDefine } from '@shared/types/pdf-types';
import { Content, ContentText } from 'pdfmake/interfaces';
import { FormatTyp, Position } from '@shared/enums/common.enum';
import {
  AllowanceCharge,
  Amount,
  CreditNoteLine,
  InvoiceLine,
  PEFCorrectiveInvoice,
} from 'src/lib-public/types/pef-invoice-corrective.types';
import i18n from 'i18next';
import { SectionType } from '@shared/enums/pef-invoice.enum';
import {
  ColumnDef,
  getExtensionOne,
  getExtensionThree,
  getUBLExtensionArray,
  PEFTable,
  PEFTableCell,
} from '../../types/pef.types';
import {
  createSection,
  formatText,
  getTable,
  getText,
  hasValue,
  normalizeCurrencySeparator,
} from '@shared/PDF-functions';
import { isPEFBasic, isPEFCorrective } from '../../types/typeguards';
import { PEFBasicInvoice, PEFInvoiceInvoiceLine } from '../../types/pef-invoice.types';
import { PEFSpecInvoice } from '../../types/pef-invoice-spec.types';

export function generateInvoiceLine(
  invoice: PEFCorrectiveInvoice | PEFSpecInvoice | PEFBasicInvoice,
  sectionType: SectionType
): Content[] {
  const table: Content[] = [];
  const result: Content[] = [];
  let data: CreditNoteLine[] | InvoiceLine[] | PEFInvoiceInvoiceLine[] = [];
  let sum: Amount | undefined;
  let summary: PEFTable | undefined;

  if (sectionType === SectionType.BeforeCorrection && isPEFCorrective(invoice)) {
    const UBLExtensionArray = getUBLExtensionArray(invoice);
    const UBLExtensionCorrectiveData = getExtensionOne(UBLExtensionArray);
    data = getTable(UBLExtensionCorrectiveData?.OriginalInvoiceData?.InvoiceLine);
    sum = UBLExtensionCorrectiveData?.OriginalInvoiceData?.LegalMonetaryTotal?.LineExtensionAmount;
  }

  if (sectionType === SectionType.AfterCorrection && isPEFCorrective(invoice)) {
    data = getTable(invoice?.CreditNoteLine);
    sum = invoice.LegalMonetaryTotal?.LineExtensionAmount;
  }

  if (sectionType === SectionType.Basic && isPEFBasic(invoice)) {
    data = getTable(invoice?.InvoiceLine);
  }

  if (!data.length) {
    return [];
  }

  if (sum) {
    summary = {
      title: [
        {
          value: [{ text: i18n.t('pef.sum'), format: [FormatTyp.Bold, FormatTyp.Left] }],
          style: 'inline',
          colSpan: 5,
        },
      ],
      sum: [
        {
          value: [
            { text: getText(sum), format: FormatTyp.Currency },
            { text: sum?._attributes?.currencyID as string, format: FormatTyp.Right },
          ],
          style: 'valueLabel',
        },
      ],
    };
  }

  const tableData = prepareData(data, invoice, sectionType);
  const tableHeader = defineHeader(sectionType, invoice);

  const content = getContentPEFTable(tableHeader, tableData, summary, true);

  table.push(content);

  result.push(createPefTableHeader(getHeader(sectionType)), table);

  return createSection(result, false, [0, 8, 0, 12]);
}

function getHeader(sectionType: SectionType): string {
  switch (sectionType) {
    case SectionType.AfterCorrection:
      return i18n.t('pef.after');
    case SectionType.BeforeCorrection:
      return i18n.t('pef.before');
    default:
      return i18n.t('pef.invoiceLine.title');
  }
}

function defineHeader(
  sectionType: SectionType,
  invoice: PEFCorrectiveInvoice | PEFSpecInvoice | PEFBasicInvoice
): HeaderDefine[] {
  const headers: (HeaderDefine & { isVisible?: boolean })[] = [
    {
      name: 'rowNumber',
      title: i18n.t('pef.invoiceLine.lineNo'),
      format: FormatTyp.PEFHeaderContent,
      width: 'auto',
      position: Position.LEFT,
    },
    {
      name: 'name',
      title: i18n.t('pef.invoiceLine.name'),
      format: FormatTyp.PEFHeaderContent,
      width: '*',
      position: Position.LEFT,
    },
    {
      name: 'quantity',
      title: i18n.t('pef.invoiceLine.quantityUom'),
      format: FormatTyp.PEFHeaderContent,
      width: '10%',
      position: Position.RIGHT,
    },
    {
      name: 'netPrice',
      title: i18n.t('pef.invoiceLine.netPrice'),
      format: FormatTyp.PEFHeaderContent,
      width: '10%',
      position: Position.RIGHT,
    },
    {
      name: 'taxTypeRate',
      title: i18n.t('pef.invoiceLine.taxTypeRate'),
      format: FormatTyp.PEFHeaderContent,
      width: '10%',
      position: Position.LEFT,
      isVisible: sectionType === SectionType.Basic,
    },
    {
      name: 'chargesDiscounts',
      title: i18n.t('pef.invoiceLine.chargesDiscounts'),
      format: FormatTyp.PEFHeaderContent,
      width: '15%',
      position: Position.LEFT,
      isVisible: !(isPEFBasic(invoice) && !invoice.AllowanceCharge?.length),
    },
    {
      name: 'netAmount',
      title: i18n.t('pef.invoiceLine.netAmount'),
      format: FormatTyp.PEFHeaderContent,
      width: '10%',
      position: Position.RIGHT,
    },
    {
      name: 'taxVat',
      title: i18n.t('pef.invoiceLine.taxVat'),
      format: FormatTyp.PEFHeaderContent,
      width: 'auto',
      position: Position.RIGHT,
      isVisible: sectionType !== SectionType.Basic,
    },
    {
      name: 'grossAmount',
      title: i18n.t('pef.invoiceLine.grossAmount'),
      format: FormatTyp.PEFHeaderContent,
      width: 'auto',
      position: Position.RIGHT,
      isVisible: sectionType !== SectionType.Basic,
    },
  ];

  return headers.filter((h) => h.isVisible !== false);
}

function prepareName(
  row: InvoiceLine | CreditNoteLine | PEFInvoiceInvoiceLine,
  sectionType: SectionType
): (PEFTableCell | null)[][] {
  return [
    [
      { value: [{ text: getText(row?.Item?.Name), format: FormatTyp.PEFValue }], style: 'inline' },
      hasValue(getTable(row?.Item?.Description)[0])
        ? {
            value: [
              { text: getText(getTable(row?.Item?.Description)[0]) },
              { text: i18n.t('pef.invoiceLine.description') + ':' },
            ],
            style: 'labelValueInline',
          }
        : null,
      hasValue(row?.Item?.StandardItemIdentification?.ID) ||
      hasValue(row?.Item?.StandardItemIdentification?.ID?._attributes?.schemeID)
        ? {
            value: [
              {
                text: `${getText(row?.Item?.StandardItemIdentification?.ID)} ${row?.Item?.StandardItemIdentification?.ID?._attributes?.schemeID ? [row?.Item?.StandardItemIdentification?.ID?._attributes?.schemeID] : ''}`,
              },
              { text: i18n.t('pef.invoiceLine.standardId') + ':' },
            ],
            style: 'labelValueInline',
          }
        : null,
      ...(getTable(row?.Item?.CommodityClassification)?.length
        ? getTable(row?.Item?.CommodityClassification).map(
            (i): PEFTableCell => ({
              value: [
                { text: getText(i.ItemClassificationCode) },
                {
                  text: `${i.ItemClassificationCode?._attributes?.listID} ${i.ItemClassificationCode?._attributes?.listVersionID}:`,
                },
              ],
              style: 'labelValueInline',
            })
          )
        : []),
      hasValue(row?.Item?.SellersItemIdentification?.ID)
        ? {
            value: [
              { text: getText(row?.Item?.SellersItemIdentification?.ID) },
              { text: i18n.t('pef.invoiceLine.sellerId') + ':' },
            ],
            style: 'labelValueInline',
          }
        : null,
    ],
    [
      ...(getTable(row?.Item?.AdditionalItemProperty)?.length
        ? [
            {
              value: [
                { text: i18n.t('pef.invoiceLine.additionalAttributes'), format: FormatTyp.BoldDefault },
              ],
              style: 'inline',
            } as PEFTableCell,
            ...getTable(row?.Item?.AdditionalItemProperty).map(
              (i): PEFTableCell => ({
                value: [{ text: getText(i.Value) }, { text: getText(i.Name) + ':' }],
                style: 'labelValueInline',
              })
            ),
          ]
        : []),
    ],
    [
      hasValue(getTable(row?.Note)[0])
        ? {
            value: [
              { text: getText(getTable(row?.Note)[0]) },
              { text: i18n.t('pef.invoiceLine.note') + ':' },
            ],
            style: 'labelValueInline',
          }
        : null,
      hasValue(row?.Item?.BuyersItemIdentification?.ID)
        ? {
            value: [
              { text: getText(row?.Item?.BuyersItemIdentification?.ID) },
              { text: i18n.t('pef.invoiceLine.buyerItemId') + ':' },
            ],
            style: 'labelValueInline',
          }
        : null,
      hasValue(row?.AccountingCost)
        ? {
            value: [
              { text: getText(row?.AccountingCost) },
              { text: i18n.t('pef.invoiceLine.buyerCostCenterCode') + ':' },
            ],
            style: 'labelValueInline',
          }
        : null,
    ],
    [
      hasValue(getTable(row?.Price?.AllowanceCharge)?.[0]?.Amount)
        ? {
            value: [
              {
                text: getText(getTable(row?.Price?.AllowanceCharge)?.[0]?.Amount),
                format: FormatTyp.Currency,
                currency: getTable(row?.Price?.AllowanceCharge)?.[0]?.Amount?._attributes?.currencyID,
              },
              { text: i18n.t('pef.invoiceLine.netPriceDiscount') + ':' },
            ],
            style: 'labelValueInline',
          }
        : null,
      hasValue(getTable(row?.Price?.AllowanceCharge)?.[0]?.BaseAmount)
        ? {
            value: [
              {
                text: getText(getTable(row?.Price?.AllowanceCharge)?.[0]?.BaseAmount),
                format: FormatTyp.Currency,
                currency: getTable(row?.Price?.AllowanceCharge)?.[0]?.BaseAmount?._attributes?.currencyID,
              },
              { text: i18n.t('pef.invoiceLine.grossPrice') + ':' },
            ],
            style: 'labelValueInline',
          }
        : null,
      hasValue(row?.Item?.OriginCountry?.IdentificationCode)
        ? ({
            value: [
              { text: getText(row?.Item?.OriginCountry?.IdentificationCode) },
              { text: i18n.t('pef.invoiceLine.originCountry') },
            ],
            style: 'labelValueInline',
          } as PEFTableCell)
        : null,
    ],
    sectionType === SectionType.AfterCorrection || sectionType === SectionType.Basic
      ? [...generateBillingPeriod(row), ...generateDocumentReference(row)]
      : [],
  ];
}

function generateBillingPeriod(row: InvoiceLine | CreditNoteLine | PEFInvoiceInvoiceLine): PEFTableCell[] {
  const { StartDate, EndDate } = getTable(row?.InvoicePeriod)?.[0] ?? {};
  let billingPeriod: PEFTableCell[] = [];

  if (hasValue(StartDate) || hasValue(EndDate)) {
    billingPeriod = [
      {
        value: [{ text: i18n.t('pef.invoiceLine.billingPeriod'), format: FormatTyp.BoldDefault }],
        style: 'inline',
      },
      hasValue(StartDate)
        ? {
            value: [
              {
                text: `${(formatText(getText(getTable(row?.InvoicePeriod)?.[0]?.StartDate), FormatTyp.Date) as ContentText).text}`,
              },
              { text: i18n.t('pef.invoiceLine.periodStartDate') },
            ],
            style: 'labelValueInline',
          }
        : { value: [] },
      hasValue(EndDate)
        ? {
            value: [
              {
                text: `${(formatText(getText(getTable(row?.InvoicePeriod)?.[0]?.EndDate), FormatTyp.Date) as ContentText).text}`,
              },
              { text: i18n.t('pef.invoiceLine.periodEndDate') },
            ],
            style: 'labelValueInline',
          }
        : { value: [] },
    ] as PEFTableCell[];
  }
  return billingPeriod;
}

function generateDocumentReference(
  row: InvoiceLine | CreditNoteLine | PEFInvoiceInvoiceLine
): PEFTableCell[] {
  let OrderLineReference: PEFTableCell = { value: [], style: 'inline' };
  let DocumentReference: PEFTableCell = { value: [], style: 'inline' };

  if (hasValue(getTable(row?.OrderLineReference)?.[0]?.LineID)) {
    OrderLineReference = {
      value: [
        { text: getText(getTable(row?.OrderLineReference)?.[0]?.LineID) },
        { text: i18n.t('pef.invoiceLine.purchaseOrderItemId') },
      ],
      style: 'labelValueInline',
    };
  }
  if (hasValue(getTable(row?.DocumentReference)?.[0]?.ID)) {
    DocumentReference = {
      value: [
        {
          text: `${getText(getTable(row?.DocumentReference)?.[0]?.ID)} [${getTable(row?.DocumentReference)?.[0]?.ID?._attributes?.schemeID}]`,
        },
        { text: i18n.t('pef.invoiceLine.invoiceItemId') },
      ],
      style: 'labelValueInline',
    };
  }
  return [OrderLineReference, DocumentReference] as PEFTableCell[];
}

function prepareQuantity(row: InvoiceLine | CreditNoteLine | PEFInvoiceInvoiceLine): PEFTableCell[] {
  const quantity = isCreditNoteLine(row) ? row.CreditedQuantity : row.InvoicedQuantity;

  return [
    {
      value: [{ text: getText(quantity) }, { text: quantity?._attributes?.unitCode as string }],
      style: 'valueLabel',
    },
  ];
}

function prepareChargesAndDiscounts(
  row: InvoiceLine | CreditNoteLine | PEFInvoiceInvoiceLine
): PEFTableCell[][] {
  const items = getTable(row?.AllowanceCharge);

  if (!items?.length) {
    return [
      [
        {
          value: [{ text: '-' }],
          style: 'inline',
        },
      ],
    ];
  }

  return items.map((i): PEFTableCell[] => {
    return [
      {
        value: [
          {
            text: i18n.t(
              getText(i?.ChargeIndicator) == 'true' ? 'pef.invoiceLine.charges' : 'pef.invoiceLine.discounts'
            ),
            format: FormatTyp.BoldDefault,
          },
        ],
        style: 'inline',
      },
      {
        value: [
          { text: normalizeCurrencySeparator(getText(i?.Amount)) },
          {
            text: `${i?.Amount?._attributes?.currencyID as string}, ${getText(getTable(i.AllowanceChargeReason)[0])} (${getText(i.AllowanceChargeReasonCode)})${getMultiplierFactorNumeric(i)}`,
          },
        ],
        style: 'valueLabel',
      },
    ];
  });
}

function getMultiplierFactorNumeric(allowanceCharge: AllowanceCharge) {
  const { MultiplierFactorNumeric, BaseAmount } = allowanceCharge;

  const percentText = MultiplierFactorNumeric
    ? (formatText(getText(MultiplierFactorNumeric), FormatTyp.Percentage) as ContentText).text
    : '';

  const baseAmountText = BaseAmount
    ? `od ${(formatText(getText(BaseAmount), FormatTyp.Currency, undefined, BaseAmount?._attributes?.currencyID) as ContentText).text}`
    : '';

  const parts = [percentText, baseAmountText].filter(Boolean);

  return parts.length ? ` ${parts.join(' - ')}` : '';
}

function prepareTaxVat(
  row: InvoiceLine | CreditNoteLine | PEFInvoiceInvoiceLine,
  invoiceGross: InvoiceLine | undefined
): PEFTableCell[] {
  let taxScheme;
  let id;
  let percent;

  if (Array.isArray(row?.Item?.ClassifiedTaxCategory)) {
    const classified = getTable(row?.Item?.ClassifiedTaxCategory)?.[0];

    taxScheme = getText(classified?.TaxScheme?.ID);
    id = getText(classified?.ID);
    percent = getText(classified?.Percent);
  } else {
    taxScheme = getText(row?.Item?.ClassifiedTaxCategory?.TaxScheme?.ID);
    id = getText(row?.Item?.ClassifiedTaxCategory?.ID);
    percent = getText(row?.Item?.ClassifiedTaxCategory?.Percent);
  }

  return [
    {
      value: [
        { text: normalizeCurrencySeparator(getText(invoiceGross?.TaxTotal?.TaxAmount)) },
        {
          text: `${invoiceGross?.TaxTotal?.TaxAmount?._attributes?.currencyID as string}, ${taxScheme}: ${id} ${(formatText(percent, FormatTyp.Percentage) as ContentText).text} `,
        },
      ],
      style: 'valueLabel',
    },
  ];
}

function isCreditNoteLine(row: InvoiceLine | CreditNoteLine | PEFInvoiceInvoiceLine): row is CreditNoteLine {
  if ('CreditedQuantity' in row) {
    return true;
  }

  return false;
}

function getAdditonalInvoiceGrossData(
  id: string,
  invoice: PEFCorrectiveInvoice | PEFSpecInvoice | PEFBasicInvoice,
  sectionType: SectionType
): InvoiceLine | undefined {
  const UBLExtensionArray = getUBLExtensionArray(invoice);
  const UBLExtensionAdditionalInvoiceGrossData = getExtensionThree(UBLExtensionArray);
  const UBLExtensionCorrectiveData = getExtensionOne(UBLExtensionArray);

  if (isPEFCorrective(invoice)) {
    if (sectionType === SectionType.AfterCorrection) {
      return getTable(UBLExtensionAdditionalInvoiceGrossData?.AdditionalInvoiceGrossData?.InvoiceLine).find(
        (i) => getText(i.ID) === id
      );
    } else {
      return getTable(
        UBLExtensionCorrectiveData?.OriginalInvoiceData?.AdditionalInvoiceGrossData?.InvoiceLine
      ).find((i) => getText(i.ID) === id);
    }
  } else {
    return getTable(UBLExtensionAdditionalInvoiceGrossData?.AdditionalInvoiceGrossData?.InvoiceLine).find(
      (i) => getText(i.ID) === id
    );
  }
}

function prepareData(
  data: InvoiceLine[] | PEFInvoiceInvoiceLine[] | CreditNoteLine[],
  invoice: PEFCorrectiveInvoice | PEFSpecInvoice | PEFBasicInvoice,
  sectionType: SectionType
): PEFTable[] {
  return data.map((row) => {
    const grossData = getAdditonalInvoiceGrossData(getText(row.ID), invoice, sectionType);

    return columnDefs.reduce((acc, col) => {
      acc[col.key] = col.isVisible(invoice) ? col.render(row, { invoice, sectionType, grossData }) : [];
      return acc;
    }, {} as PEFTable);
  });
}

const columnDefs: ColumnDef<InvoiceLine | PEFInvoiceInvoiceLine | CreditNoteLine>[] = [
  {
    key: 'rowNumber',
    isVisible: () => true,
    render: (row) => [{ value: [{ text: getText(row?.ID) + '.' }], style: 'inline' }],
  },
  {
    key: 'name',
    isVisible: () => true,
    render: (row, ctx) => prepareName(row, ctx.sectionType),
  },
  {
    key: 'quantity',
    isVisible: () => true,
    render: (row) => prepareQuantity(row),
  },
  {
    key: 'netPrice',
    isVisible: () => true,
    render: (row) => [
      {
        value: [
          { text: getText(row?.Price?.PriceAmount), format: FormatTyp.Currency },
          { text: row?.Price?.PriceAmount?._attributes?.currencyID as string },
        ],
        style: 'valueLabel',
      },
    ],
  },
  {
    key: 'taxTypeRate',
    isVisible: (invoice) => isPEFBasic(invoice),
    render: (row) => [
      {
        value: [
          formatText(
            `${getText(getTable((row as PEFInvoiceInvoiceLine)?.Item?.ClassifiedTaxCategory)[0]?.TaxScheme?.ID)}: ${
              getText(getTable((row as PEFInvoiceInvoiceLine)?.Item?.ClassifiedTaxCategory)[0]?.ID) === 'E'
                ? 'zw.'
                : getText(getTable((row as PEFInvoiceInvoiceLine)?.Item?.ClassifiedTaxCategory)[0]?.ID)
            }${
              getText(getTable((row as PEFInvoiceInvoiceLine)?.Item?.ClassifiedTaxCategory)[0]?.Percent)
                ? ', ' +
                  getText(getTable((row as PEFInvoiceInvoiceLine)?.Item?.ClassifiedTaxCategory)[0]?.Percent) +
                  '%'
                : ''
            }`,
            FormatTyp.PEFValue
          ),
        ],
        style: 'inline',
      },
    ],
  },
  {
    key: 'chargesDiscounts',
    isVisible: (invoice) => !(isPEFBasic(invoice) && !invoice.AllowanceCharge?.length),
    render: (row, ctx) => prepareChargesAndDiscounts(row),
  },
  {
    key: 'netAmount',
    isVisible: () => true,
    render: (row, ctx) => [
      {
        value: [
          { text: getText(row?.LineExtensionAmount), format: FormatTyp.Currency },
          { text: row?.LineExtensionAmount?._attributes?.currencyID as string },
        ],
        style: 'valueLabel',
      },
    ],
  },
  {
    key: 'taxVat',
    isVisible: (invoice) => !isPEFBasic(invoice),
    render: (row, ctx) => prepareTaxVat(row, ctx.grossData),
  },
  {
    key: 'grossAmount',
    isVisible: (invoice) => !isPEFBasic(invoice),
    render: (_, ctx) => [
      {
        value: [
          {
            text: getText(ctx.grossData?.LineExtensionGrossAmount),
            format: FormatTyp.Currency,
          },
          {
            text: ctx.grossData?.LineExtensionGrossAmount?._attributes?.currencyID as string,
          },
        ],
        style: 'valueLabel',
      },
    ],
  },
];
