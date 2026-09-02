import { Content, ContentTable, TableCell } from 'pdfmake/interfaces';
import i18n from 'i18next';
import { formatText, getTable, hasValue } from '@shared/PDF-functions';
import { createInlineLabelValue, createInlineValueLabel, createPefTableHeader } from '@shared/functions-pef';
import FormatTyp, { Position } from '@shared/enums/common.enum';
import UNECE_pl from './scheme/UNECE_pl.json';
import { PEFBasicInvoice, PEFInvoiceInvoiceLine } from '../../types/pef-invoice.types';

export function generateInvoiceLine(invoice: PEFBasicInvoice): Content[] {
  const result: Content[] = [];

  result.push(createPefTableHeader(i18n.t('pef.invoiceLine.title')));

  result.push({
    stack: [addInvoiceLineTable(invoice)],
    marginBottom: 12,
  });
  return [{ stack: result }];
}

export function addInvoiceLineTable(invoice: PEFBasicInvoice): ContentTable {
  const headers: TableCell[] = [
    i18n.t('pef.invoiceLine.lineNo'),
    i18n.t('pef.invoiceLine.name'),
    i18n.t('pef.invoiceLine.quantityUom'),
    i18n.t('pef.invoiceLine.netPrice'),
    i18n.t('pef.invoiceLine.taxTypeRate'),
    i18n.t('pef.invoiceLine.chargesDiscounts'),
    i18n.t('pef.invoiceLine.netAmount'),
  ].map((h) => ({
    text: h,
    style: FormatTyp.LabelMedium,

    alignment: 'left',
  }));
  const data = getTable(invoice.InvoiceLine).map((invoiceLine) => {
    return addOneInvoiceLine(invoiceLine);
  });

  const invoiceLineTable = createInvoiceLineTable(headers, data);

  return invoiceLineTable;
}

function createInvoiceLineTable(headers: any, data: any): ContentTable {
  return {
    table: {
      widths: ['7%', '38%', '10%', '8%', '14%', '13%', '10%'],
      headerRows: 1,
      body: [headers, ...data],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingTop: () => 12,
      paddingBottom: () => 12,
      paddingLeft: () => 8,
      paddingRight: () => 8,
      fillColor: (i): string | null => {
        return i % 2 === 0 ? '#f2f2f2' : null;
      },
    },
  };
}

export function addOneInvoiceLine(invoiceLine: PEFInvoiceInvoiceLine) {
  const getText = (node?: { _text?: string } | null): string => node?._text ?? '';
  const { Item } = invoiceLine;
  const CommodityClassification = getTable(Item?.CommodityClassification);
  let ItemClassificationCode: Content[] = [];

  if (CommodityClassification?.length) {
    ItemClassificationCode = CommodityClassification.slice(1).map((classification, index) => {
      return createInlineLabelValue(
        `${getText(classification.ItemClassificationCode)} [${
          classification.ItemClassificationCode?._attributes?.listID ?? ''
        }]`,
        `${i18n.t('pef.invoiceLine.classificationId')} (${index + 2})`
      );
    });
  }

  const standardId =
    hasValue(Item?.StandardItemIdentification?.ID) || hasValue(Item?.StandardItemIdentification?.ID)
      ? createInlineLabelValue(
          `${getText(Item?.StandardItemIdentification?.ID)} [${Item?.StandardItemIdentification?.ID?._attributes?.schemeID}]`,
          i18n.t('pef.invoiceLine.standardId')
        )
      : [];

  const nameColContent = {
    stack: [
      formatText(getText(invoiceLine.Item?.Name), FormatTyp.LabelMedium),
      hasValue(getTable(invoiceLine.Item?.Description)[0])
        ? createInlineLabelValue(
            getText(getTable(invoiceLine.Item?.Description)[0]),

            i18n.t('pef.invoiceLine.description')
          )
        : [],
      standardId,
      ...(CommodityClassification[0]
        ? [
            createInlineLabelValue(
              `${getText(CommodityClassification[0]?.ItemClassificationCode)}
                   [${getTable(CommodityClassification[0]?.ItemClassificationCode?._attributes?.listID)[0]}]`,
              i18n.t('pef.invoiceLine.classificationId') + '(1)'
            ),
          ]
        : []),
      hasValue(invoiceLine?.Item?.SellersItemIdentification?.ID)
        ? createInlineLabelValue(
            getText(invoiceLine?.Item?.SellersItemIdentification?.ID),
            i18n.t('pef.invoiceLine.sellerId')
          )
        : [],
      { text: '' },
      ...(invoiceLine.Item?.AdditionalItemProperty
        ? [
            formatText(i18n.t('pef.invoiceLine.additionalAttributes'), FormatTyp.LabelMedium),
            getTable(invoiceLine.Item!.AdditionalItemProperty).map((additionalItemProperty) =>
              createInlineLabelValue(
                getText(additionalItemProperty.Value),
                getText(additionalItemProperty.Name)
              )
            ),
            { text: '' },
          ]
        : []),
      hasValue(getTable(invoiceLine.Note)[0])
        ? createInlineLabelValue(getText(getTable(invoiceLine.Note)[0]), i18n.t('pef.invoiceLine.note'))
        : [],
      ...ItemClassificationCode,
      hasValue(invoiceLine?.Item?.BuyersItemIdentification?.ID)
        ? createInlineLabelValue(
            getText(invoiceLine?.Item?.BuyersItemIdentification?.ID),
            i18n.t('pef.invoiceLine.buyerItemId')
          )
        : [],
      getText(invoiceLine?.AccountingCost)
        ? createInlineLabelValue(
            getText(invoiceLine.AccountingCost),
            i18n.t('pef.invoiceLine.buyerCostCenterCode')
          )
        : [],
      { text: '' },
      formatText(i18n.t('pef.invoiceLine.billingPeriod'), FormatTyp.LabelMedium),
      hasValue(getTable(invoiceLine.InvoicePeriod)[0]?.StartDate)
        ? createInlineLabelValue(
            new Intl.DateTimeFormat('pl-PL').format(
              new Date(getText(getTable(invoiceLine.InvoicePeriod)[0]?.StartDate))
            ),
            i18n.t('pef.invoiceLine.periodStartDate')
          )
        : [],
      hasValue(getTable(invoiceLine.InvoicePeriod)[0]?.EndDate)
        ? createInlineLabelValue(
            new Intl.DateTimeFormat('pl-PL').format(
              new Date(getText(getTable(invoiceLine.InvoicePeriod)[0]?.EndDate))
            ),
            i18n.t('pef.invoiceLine.periodEndDate')
          )
        : [],
      { text: '' },
      getText(getTable(invoiceLine?.Price?.AllowanceCharge)[0]?.Amount)
        ? createInlineLabelValue(
            getText(getTable(invoiceLine?.Price?.AllowanceCharge)[0]?.Amount) +
              ' ' +
              getTable(invoiceLine?.Price?.AllowanceCharge)[0]?.Amount?._attributes?.currencyID,
            i18n.t('pef.invoiceLine.netPriceDiscount')
          )
        : [],
      createInlineLabelValue(
        getText(getTable(invoiceLine?.Price?.AllowanceCharge)[0]?.BaseAmount) +
          ' ' +
          getTable(invoiceLine?.Price?.AllowanceCharge)[0]?.BaseAmount?._attributes?.currencyID,
        i18n.t('pef.invoiceLine.grossPrice')
      ),
      getText(invoiceLine?.Item?.OriginCountry?.IdentificationCode)
        ? createInlineLabelValue(
            getText(invoiceLine?.Item?.OriginCountry?.IdentificationCode),
            i18n.t('pef.invoiceLine.originCountry')
          )
        : [],
      getText(getTable(invoiceLine?.OrderLineReference)[0]?.LineID)
        ? createInlineLabelValue(
            getText(getTable(invoiceLine.OrderLineReference)[0]?.LineID),
            i18n.t('pef.invoiceLine.purchaseOrderItemId')
          )
        : [],

      invoiceLine.DocumentReference
        ? createInlineLabelValue(
            getText(getTable(invoiceLine.DocumentReference)[0]?.ID) +
              ` ${[getTable(invoiceLine.DocumentReference)[0]?.ID?._attributes?.schemeID]} ` +
              i18n.t('pef.invoiceLine.invoiceItemId')
          )
        : [],
    ],
  };

  const row = [
    formatText(getText(invoiceLine.ID) + '.', FormatTyp.PEFValue),
    nameColContent,
    {
      stack: [
        {
          text: [formatText(getText(invoiceLine.InvoicedQuantity), FormatTyp.PEFValue)],
          alignment: Position.RIGHT,
        },
        {
          text: [
            formatText(
              getNameByCode(invoiceLine?.InvoicedQuantity?._attributes?.unitCode ?? ''),
              FormatTyp.PEFInlineLabel
            ),
          ],
          alignment: Position.RIGHT,
        },
      ],
    },
    {
      stack: [
        {
          text: [formatText(getText(invoiceLine?.Price?.PriceAmount), FormatTyp.PEFValue)],
          alignment: Position.RIGHT,
        },
        {
          text: [
            formatText(
              invoiceLine?.Price?.PriceAmount?._attributes?.currencyID ?? '',
              FormatTyp.PEFInlineLabel
            ),
          ],
          alignment: Position.RIGHT,
        },
      ],
    },
    {
      text: [
        formatText(
          `${getText(getTable(invoiceLine?.Item?.ClassifiedTaxCategory)[0]?.TaxScheme?.ID)}: ${
            getText(getTable(invoiceLine?.Item?.ClassifiedTaxCategory)[0]?.ID) === 'E'
              ? 'zw.'
              : getText(getTable(invoiceLine?.Item?.ClassifiedTaxCategory)[0]?.ID)
          }${
            getText(getTable(invoiceLine?.Item?.ClassifiedTaxCategory)[0]?.Percent)
              ? ', ' + getText(getTable(invoiceLine?.Item?.ClassifiedTaxCategory)[0]?.Percent) + '%'
              : ''
          }`,
          FormatTyp.PEFValue
        ),
      ],
      alignment: Position.LEFT,
    },
    {
      stack: [
        ...((invoiceLine?.AllowanceCharge?.length ?? 0) > 0
          ? invoiceLine.AllowanceCharge!.map((allowanceCharge) =>
              createInlineValueLabel(
                `${
                  getText(allowanceCharge?.ChargeIndicator) === 'true'
                    ? i18n.t('pef.invoiceLine.charges')
                    : i18n.t('pef.invoiceLine.discounts')
                }
                  ${getText(allowanceCharge.Amount)} \n`,
                `${allowanceCharge?.BaseAmount?._attributes?.currencyID ?? ''}, ${
                  getText(getTable(allowanceCharge?.AllowanceChargeReason)[0])
                    ? getText(getTable(allowanceCharge.AllowanceChargeReason)[0])
                    : ''
                } ${
                  hasValue(allowanceCharge?.AllowanceChargeReasonCode)
                    ? `(${getText(allowanceCharge.AllowanceChargeReasonCode)})`
                    : ''
                } ${
                  hasValue(allowanceCharge?.MultiplierFactorNumeric)
                    ? `${getText(allowanceCharge.MultiplierFactorNumeric)}%`
                    : ''
                } - od ${getText(allowanceCharge.BaseAmount)} \n`,
                [0, 0, 0, 8]
              )
            )
          : [
              {
                text: [
                  formatText(
                    getText(invoiceLine?.Price?.PriceAmount) +
                      ' ' +
                      invoiceLine?.Price?.PriceAmount?._attributes?.currencyID,
                    FormatTyp.PEFValue
                  ),
                ],
                alignment: Position.RIGHT,
              },
            ]),
      ],
    },
    {
      stack: [
        {
          text: [formatText(getText(invoiceLine.LineExtensionAmount), FormatTyp.PEFValue)],
          alignment: Position.RIGHT,
        },
        {
          text: [
            formatText(invoiceLine?.LineExtensionAmount?._attributes?.currencyID, FormatTyp.PEFInlineLabel),
          ],
          alignment: Position.RIGHT,
        },
      ],
    },
  ];

  return row;
}

export function getNameByCode(code: string): string | undefined {
  const fn = getNameByCode as any;

  if (!fn.map) {
    const map = new Map<string, string>();
    const rows = UNECE_pl.CodeList.SimpleCodeList.Row;

    for (const row of rows) {
      const codeValue = row.Value.find((v: any) => v._ColumnRef === 'code')?.SimpleValue;
      const nameValue = row.Value.find((v: any) => v._ColumnRef === 'name')?.SimpleValue;

      if (codeValue && nameValue) {
        map.set(codeValue, nameValue);
      }
    }
    fn.map = map;
  }

  return fn.map.get(code);
}
