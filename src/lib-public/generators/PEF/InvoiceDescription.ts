import { PEFType } from './../../types/pef.types';
import FormatTyp from '@shared/enums/common.enum';
import { formatText, generateColumns, getTable, getText, hasValue } from '@shared/PDF-functions';
import {
  borderedBox,
  createInlineLabelValue,
  createLabelWithBoldText,
  createPEFSubHeader,
  createSmallInlineLabelValue,
} from '@shared/functions-pef';
import { Content, ContentStack, Style } from 'pdfmake/interfaces';
import i18n from 'i18next';
import { PEFBasicInvoice, PEFInvoiceBillingReference } from '../../types/pef-invoice.types';
import { PEFCorrectiveInvoice } from '../../types/pef-invoice-corrective.types';
import { isPEFBasic } from '../../types/typeguards';

export function generateInvoiceDescription(
  pefType: PEFType,
  invoice: PEFBasicInvoice | PEFCorrectiveInvoice
): Content[] {
  const result: Content[] = [];

  const information: Content[] = [];
  const additionalDocumentReference: Content[] = [];

  if (getTable(invoice.BillingReference).length > 0) {
    const invoiceNumber: Content[] = [];

    invoiceNumber.push(formatText(i18n.t('pef.invoiceDescrption.invoiceNumber'), FormatTyp.Value));
    getTable(invoice.BillingReference).forEach((billingReference) => {
      invoiceNumber.push(addInvoiceNumber(billingReference));
    });

    information.push(invoiceNumber);
  }

  information.push(
    createLabelWithBoldText(
      i18n.t('pef.invoiceDescrption.referenceNumber'),
      getText(getTable(invoice?.OriginatorDocumentReference)[0]?.ID)
    )
  );
  if (pefType === PEFType.Basic && isPEFBasic(invoice)) {
    information.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceDescrption.projectNumber'),
        getText(getTable(invoice?.ProjectReference)[0]?.ID)
      )
    );
    information.push(
      createLabelWithBoldText(
        i18n.t('pef.invoiceDescrption.buyerCostReference'),
        getText(invoice?.AccountingCost)
      )
    );
  }

  getTable(invoice?.AdditionalDocumentReference).forEach((element) => {
    let id = getText(element.ID);

    if (
      getTable(element?.DocumentDescription).length > 0 &&
      !element?.Attachment?.EmbeddedDocumentBinaryObject
    ) {
      id += ` - ${getText(getTable(element.DocumentDescription)[0])}`;
    }

    const additionalDocumentReferenceTemp: Content = [];

    additionalDocumentReferenceTemp.push(
      createInlineLabelValue(i18n.t('pef.invoiceDescrption.supportingDocumentReference'))
    );
    additionalDocumentReferenceTemp.push({
      text: [formatText(id, FormatTyp.LabelMedium)],
    });

    if (hasValue(element?.Attachment?.ExternalReference?.URI)) {
      additionalDocumentReferenceTemp.push({
        text: [
          formatText(i18n.t('pef.invoiceDescrption.link'), FormatTyp.PEFInlineLabel),
          formatText(getText(element?.Attachment?.ExternalReference?.URI), FormatTyp.Link),
        ],
      });
    }

    let documentDescription = '';

    if (element?.DocumentType?._text) {
      documentDescription += `${getText(element.DocumentType)} `;
    }

    if (element?.DocumentTypeCode?._text) {
      documentDescription += `[${getText(element.DocumentTypeCode)}]`;
    }

    if (
      (hasValue(element?.DocumentType) || hasValue(element?.DocumentTypeCode)) &&
      getTable(element?.DocumentDescription).length > 0
    ) {
      documentDescription += ` - ${getText(getTable(element.DocumentDescription)[0])}`;
    }

    if (documentDescription.length > 0) {
      additionalDocumentReferenceTemp.push(
        createSmallInlineLabelValue(documentDescription, i18n.t('pef.invoiceDescrption.documentDescription'))
      );
    }

    if (element?.Attachment?.EmbeddedDocumentBinaryObject?._attributes?.mimeCode) {
      additionalDocumentReferenceTemp.push(
        createSmallInlineLabelValue(
          element.Attachment.EmbeddedDocumentBinaryObject._attributes.mimeCode,
          i18n.t('pef.invoiceDescrption.fileType')
        )
      );
    }
    if (element?.Attachment?.EmbeddedDocumentBinaryObject?._attributes?.filename) {
      additionalDocumentReferenceTemp.push(
        createSmallInlineLabelValue(
          element.Attachment.EmbeddedDocumentBinaryObject._attributes.filename,
          i18n.t('pef.invoiceDescrption.fileName')
        )
      );
    }
    additionalDocumentReference.push(additionalDocumentReferenceTemp);
  });

  const additionalDocumentReferenceWithGap: Content[] = additionalDocumentReference.map(
    (item): ContentStack => ({
      stack: [item],
      margin: [0, 0, 0, 16],
    })
  );

  result.push(
    borderedBox([
      generateTwoColumns(information),
      createPEFSubHeader(i18n.t('pef.invoiceDescrption.additionalDocuments')),
      generateColumns([additionalDocumentReferenceWithGap]),
    ])
  );

  return result;
}

function generateTwoColumns(contents: Content[], style: Style | undefined = undefined): Content {
  const columnsContent: Content[][] = [[], []];

  contents.forEach((item, index) => {
    columnsContent[index % 2].push({
      stack: [item],
      margin: [0, 0, 0, 8],
    });
  });

  const columns = columnsContent.map((content) => ({
    stack: content,
    width: '50%',
  }));

  const columnStyle: Style = style ? { ...style } : { columnGap: 16 };

  return {
    columns,
    ...columnStyle,
  };
}

function addInvoiceNumber(billingReference: PEFInvoiceBillingReference): Content {
  if (hasValue(billingReference?.InvoiceDocumentReference?.IssueDate)) {
    const id = getText(billingReference?.InvoiceDocumentReference?.ID);
    const date = new Intl.DateTimeFormat('pl-PL').format(
      new Date(getText(billingReference?.InvoiceDocumentReference?.IssueDate))
    );

    return formatText(i18n.t('pef.invoiceDescrption.dated', { id, date }), FormatTyp.Label);
  } else {
    return formatText(getText(billingReference?.InvoiceDocumentReference?.ID), FormatTyp.Label);
  }
}
