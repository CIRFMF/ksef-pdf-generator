import {
  formatText,
  generateColumns,
  getTable,
  getText,
  replaceDotWithCommaIfNeeded,
} from '@shared/PDF-functions';
import { borderedBox, createLabelWithBoldText } from '@shared/functions-pef';
import { Content, ContentText, Style } from 'pdfmake/interfaces';
import i18n from 'i18next';
import FormatTyp, { Position } from '@shared/enums/common.enum';
import { PEFBasicInvoice } from '../../types/pef-invoice.types';
import { Amount, PEFCorrectiveInvoice } from '../../types/pef-invoice-corrective.types';
import { isPEFBasic, isPEFCorrective } from '../../types/typeguards';
import { PEFSpecInvoice } from '../../types/pef-invoice-spec.types';
import { getUBLExtensionArray, getExtensionTwo } from '../../types/pef.types';

export function generateInvoiceHeader(
  invoice: PEFBasicInvoice | PEFCorrectiveInvoice,
  numberKSeF: string
): Content[] {
  const result: Content[] = [];
  const additionalDataRow1: Content[] = [];
  const additionalDataRow2: Content[] = [];
  const additionalDataRow3: Content[] = [];
  const additionalDataCorrectiveRow: Content[] = [];

  result.push([
    generateColumns(
      [
        [
          {
            text: [
              { text: i18n.t('invoice.header.ksefPart1'), bold: false, fontSize: 18 },
              { text: i18n.t('invoice.header.ksefPart2'), color: 'red', bold: true, fontSize: 18 },
              { text: i18n.t('invoice.header.ksefPart3'), bold: true, fontSize: 18 },
            ],
          },
        ],
        [
          {
            text: getText(invoice.ID),
            bold: false,
            fontSize: 18,
            alignment: Position.RIGHT,
          },
        ],
      ],
      {
        margin: [0, 0, 0, 8],
        columnGap: 20,
      }
    ),
  ]);

  if (numberKSeF) {
    result.push([
      {
        text: [
          formatText(i18n.t('invoice.header.ksefNumberLabel'), FormatTyp.PEFInlineLabel),
          formatText(numberKSeF, FormatTyp.PEFValue),
        ],
        alignment: Position.RIGHT,
      },
    ]);
  }
  let invoiceTypeCode = '';

  if (isPEFBasic(invoice)) {
    invoiceTypeCode = getText(invoice.InvoiceTypeCode);
  } else if (isPEFCorrective(invoice)) {
    invoiceTypeCode = getText(invoice.CreditNoteTypeCode);
  }
  result.push([
    {
      ...(formatText(
        invoiceTypeCode === '380'
          ? i18n.t('pef.invoiceHeader.invoice')
          : i18n.t('pef.invoiceHeader.correctiveInvoice'),
        FormatTyp.Label
      ) as ContentText),
      alignment: Position.RIGHT,
      marginBottom: 10,
    },
  ]);

  additionalDataRow1.push(
    createLabelWithBoldText(
      i18n.t('pef.invoiceHeader.documentCurrencyCode'),
      getText(invoice?.DocumentCurrencyCode)
    )
  );

  //PayableAmount
  //START
  const payableAmountValue = getPayableAmountValue(invoice);
  const payableAmountLabel = getPayableAmountLabel(payableAmountValue);

  const payableAmount = `${replaceDotWithCommaIfNeeded(getText(payableAmountValue))} ${payableAmountValue?._attributes?.currencyID}`;

  additionalDataRow1.push(createLabelWithBoldText(i18n.t(payableAmountLabel), payableAmount));
  //END

  if (isPEFBasic(invoice)) {
    additionalDataRow1.push(
      createLabelWithBoldText(i18n.t('pef.invoiceHeader.dueDate'), getText(invoice?.DueDate), [
        FormatTyp.Label,
        FormatTyp.Date,
      ])
    );

    additionalDataRow1.push(
      createLabelWithBoldText(i18n.t('pef.invoiceHeader.buyerReference'), getText(invoice?.BuyerReference))
    );
  } else {
    additionalDataRow1.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceHeader.dueDate'),
        getText(getTable(invoice.PaymentMeans)[0]?.PaymentDueDate),
        [FormatTyp.Label, FormatTyp.Date]
      )
    );

    additionalDataRow1.push(
      createLabelWithBoldText(i18n.t('pef.invoiceHeader.accountingCost'), getText(invoice?.AccountingCost))
    );
  }

  // Wiersz z danymi dla korekty
  if (isPEFCorrective(invoice)) {
    additionalDataCorrectiveRow.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceHeader.invoiceDocumentReference.issueDate'),
        getText(getTable(invoice?.BillingReference)[0]?.InvoiceDocumentReference?.IssueDate),
        [FormatTyp.Label, FormatTyp.Date]
      )
    );

    additionalDataCorrectiveRow.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceHeader.invoiceDocumentReference.id'),
        getText(getTable(invoice?.BillingReference)[0]?.InvoiceDocumentReference?.ID),
        [FormatTyp.Label]
      )
    );
  }

  if (isPEFBasic(invoice)) {
    additionalDataRow2.push(
      createLabelWithBoldText(i18n.t('pef.invoiceHeader.issueDate'), getText(invoice?.IssueDate), [
        FormatTyp.Label,
        FormatTyp.Date,
      ])
    );
    additionalDataRow2.push(
      createLabelWithBoldText(i18n.t('pef.invoiceHeader.taxPointDate'), getText(invoice?.TaxPointDate), [
        FormatTyp.Label,
        FormatTyp.Date,
      ])
    );
    additionalDataRow2.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceHeader.startDate'),
        getText(getTable(invoice?.InvoicePeriod)[0]?.StartDate),
        [FormatTyp.Label, FormatTyp.Date]
      )
    );
    additionalDataRow2.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceHeader.endDate'),
        getText(getTable(invoice?.InvoicePeriod)[0]?.EndDate),
        [FormatTyp.Label, FormatTyp.Date]
      )
    );
  } else {
    additionalDataRow2.push(
      createLabelWithBoldText(i18n.t('pef.invoiceHeader.issueDate'), getText(invoice?.IssueDate), [
        FormatTyp.Label,
        FormatTyp.Date,
      ])
    );
    additionalDataRow2.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceHeader.startDate'),
        getText(getTable(invoice?.InvoicePeriod)[0]?.StartDate),
        [FormatTyp.Label, FormatTyp.Date]
      )
    );
    additionalDataRow2.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceHeader.endDate'),
        getText(getTable(invoice?.InvoicePeriod)[0]?.EndDate),
        [FormatTyp.Label, FormatTyp.Date]
      )
    );
    additionalDataRow2.push(
      createLabelWithBoldText(i18n.t('pef.invoiceHeader.taxPointDate'), getText(invoice?.TaxPointDate), [
        FormatTyp.Label,
        FormatTyp.Date,
      ])
    );
  }

  additionalDataRow3.push(
    createLabelWithBoldText(
      i18n.t('pef.invoiceHeader.contractDocumentReferenceId'),
      getText(getTable(invoice?.ContractDocumentReference)[0]?.ID)
    )
  );
  if (isPEFBasic(invoice)) {
    additionalDataRow3.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceHeader.orderReferenceId'),
        getText(invoice?.OrderReference?.ID)
      )
    );
  }
  additionalDataRow3.push(
    createLabelWithBoldText(
      i18n.t('pef.invoiceHeader.orderReferenceSalesOrderId'),
      getText(invoice?.OrderReference?.SalesOrderID)
    )
  );
  additionalDataRow3.push(
    createLabelWithBoldText(
      i18n.t('pef.invoiceHeader.receiptDocumentReferenceId'),
      getText(getTable(invoice?.ReceiptDocumentReference)[0]?.ID)
    )
  );

  result.push(
    borderedBox([
      generateFourColumns(additionalDataRow1),
      generateFourColumns(additionalDataCorrectiveRow),
      generateFourColumns(additionalDataRow2),
      generateFourColumns(additionalDataRow3),
      createLabelWithBoldText(i18n.t('pef.invoiceHeader.note'), getText(getTable(invoice?.Note)[0])),
    ])
  );

  return result;
}

function generateFourColumns(contents: Content[], style: Style | undefined = undefined): Content {
  const columnsContent: Content[][] = [[], [], [], []];

  contents.forEach((item, index) => {
    columnsContent[index % 4].push({
      stack: [item],
      margin: [0, 0, 0, 8],
    });
  });

  const columns = columnsContent.map((content) => ({
    stack: content,
    width: '25%',
  }));

  const columnStyle: Style = style ? { ...style } : { columnGap: 16 };

  return {
    columns,
    ...columnStyle,
  };
}

function getPayableAmountValue(
  invoice: PEFCorrectiveInvoice | PEFBasicInvoice | PEFSpecInvoice
): Amount | Amount | undefined {
  if (isPEFCorrective(invoice)) {
    const UBLExtensionArray = getUBLExtensionArray(invoice);
    const UBLExtensionDiffValues = getExtensionTwo(UBLExtensionArray);

    return UBLExtensionDiffValues?.InvoiceCorrection?.LegalMonetaryTotal.PayableAmount;
  } else {
    return invoice?.LegalMonetaryTotal?.PayableAmount;
  }
}

function getPayableAmountLabel(payableAmount: Amount | Amount | undefined): string {
  if (!payableAmount) {
    return '';
  } else if (Number(payableAmount._text) >= 0) {
    return 'pef.legalMonetaryTotal.payableAmount';
  } else {
    return 'pef.legalMonetaryTotal.settlementAmount';
  }
}
