import { getText, hasValue, normalizeCurrencySeparator } from '@shared/PDF-functions';
import { Content } from 'pdfmake/interfaces';
import i18n from 'i18next';
import { Position } from '@shared/enums/common.enum';
import {
  Amount,
  LanguageLocaleIDEnum,
  LegalMonetaryTotal,
  PEFBasicInvoice,
} from '../../types/pef-invoice.types';
import { InvoiceLine, PEFCorrectiveInvoice } from '../../types/pef-invoice-corrective.types';
import { isPEFCorrective } from '../../types/typeguards';
import { SectionType } from '@shared/enums/pef-invoice.enum';
import {
  getExtensionOne,
  getExtensionThree,
  getExtensionTwo,
  getUBLExtensionArray,
} from '../../types/pef.types';

export function generateLegalMonetaryTotal(
  invoice: PEFBasicInvoice | PEFCorrectiveInvoice,
  sectionType: SectionType
): Content {
  let legalMonetaryTotal = {};

  if (!invoice || !Object.keys(invoice).length) {
    return [];
  }

  if (isPEFCorrective(invoice)) {
    legalMonetaryTotal = getCorrectiveLegalMonetaryTotal(invoice, sectionType);

    if (!Object.keys(legalMonetaryTotal).length) {
      return [];
    }

    switch (sectionType) {
      case SectionType.BeforeCorrection:
        return setTable(setLegalMonetaryTotal(legalMonetaryTotal), legalMonetaryTotal);

      case SectionType.AfterCorrection:
        return setTable(
          setLegalMonetaryTotal(legalMonetaryTotal, getAdditionalInvoiceGrossData(invoice)),
          legalMonetaryTotal
        );

      case SectionType.Summary:
        return setTable(setLegalMonetaryTotal(legalMonetaryTotal), legalMonetaryTotal);

      default:
        return [];
    }
  } else {
    legalMonetaryTotal = invoice.LegalMonetaryTotal ?? {};
    return setTable(setLegalMonetaryTotal(legalMonetaryTotal), legalMonetaryTotal);
  }
}

function setLegalMonetaryTotal(
  legalMonetaryTotal: LegalMonetaryTotal,
  additionalInvoiceGrossData?: InvoiceLine[]
): { label: string; value: string; currency: LanguageLocaleIDEnum | undefined }[] {
  const rows = [];

  if (hasValue(legalMonetaryTotal.TaxExclusiveAmount)) {
    rows.push({
      label: i18n.t('pef.legalMonetaryTotal.taxExclusiveAmount'),
      value: getText(legalMonetaryTotal.TaxExclusiveAmount),
      currency: legalMonetaryTotal.TaxExclusiveAmount?._attributes?.currencyID,
    });
  }

  if (hasValue(legalMonetaryTotal.TaxInclusiveAmount)) {
    rows.push({
      label: i18n.t('pef.legalMonetaryTotal.taxInclusiveAmount'),
      value: getText(legalMonetaryTotal.TaxInclusiveAmount),
      currency: legalMonetaryTotal.TaxInclusiveAmount?._attributes?.currencyID,
    });
  }

  if (additionalInvoiceGrossData?.length) {
    additionalInvoiceGrossData.forEach((item) =>
      rows.push({
        label: i18n.t('pef.legalMonetaryTotal.additionalInvoiceGrossData.' + item.AccountingCost?._text),
        value: getText(item.LineExtensionGrossAmount),
        currency: item.LineExtensionGrossAmount?._attributes?.currencyID,
      })
    );
  }

  if (hasValue(legalMonetaryTotal.PrepaidAmount)) {
    rows.push({
      label: i18n.t('pef.legalMonetaryTotal.prepaidAmount'),
      value: getText(legalMonetaryTotal.PrepaidAmount),
      currency: legalMonetaryTotal.PrepaidAmount?._attributes?.currencyID,
    });
  }

  if (hasValue(legalMonetaryTotal.PayableRoundingAmount)) {
    rows.push({
      label: i18n.t('pef.legalMonetaryTotal.rndPrepaidAmount'),
      value: getText(legalMonetaryTotal.PayableRoundingAmount),
      currency: legalMonetaryTotal.PayableRoundingAmount?._attributes?.currencyID,
    });
  }

  return rows;
}

function setTable(
  rows: { label: string; value: string; currency: string | undefined }[],
  legalMonetaryTotal: LegalMonetaryTotal
): Content {
  return {
    table: {
      dontBreakRows: true,
      widths: ['*'],
      body: [
        [
          {
            stack: [
              ...rows.map((row) => ({
                text: [
                  {
                    text: `${row.label} `,
                    style: 'PEFInlineLabel',
                  },
                  {
                    text: `${normalizeCurrencySeparator(row.value)} ${row.currency}`,
                    style: 'PEFValue',
                    bold: true,
                  },
                ],
                fontSize: 8,
              })),
              {
                text: [
                  {
                    text: `${i18n.t(getPayableAmountLabel(legalMonetaryTotal.PayableAmount))} `,
                    style: 'PEFInlineLabel',
                    fontSize: 12,
                    color: '#707070',
                  },
                  {
                    text: `${normalizeCurrencySeparator(getText(legalMonetaryTotal.PayableAmount))} ${legalMonetaryTotal.PayableAmount?._attributes?.currencyID}`,
                    bold: true,
                    style: 'PEFValue',
                    fontSize: 16,
                  },
                ],
              },
            ],
            margin: 8,
          },
        ],
      ],
    },
    fillColor: '#FAFAFA',
    layout: 'noBorders',
    alignment: Position.RIGHT,
    marginBottom: 12,
  };
}

function getAdditionalInvoiceGrossData(
  invoice: PEFBasicInvoice | PEFCorrectiveInvoice
): InvoiceLine[] | undefined {
  if (isPEFCorrective(invoice)) {
    const allowedAccountingCost = new Set(['Bilans', 'Faktury', 'Raty', 'Odsetki']);
    const UBLExtensionArray = getUBLExtensionArray(invoice);
    const UBLExtensionCorrectiveInvoiceGross = getExtensionThree(UBLExtensionArray);
    const invoiceLine = UBLExtensionCorrectiveInvoiceGross?.AdditionalInvoiceGrossData?.InvoiceLine;

    return invoiceLine?.filter((x) => allowedAccountingCost.has(x.AccountingCost?._text ?? ''));
  }
}

function getCorrectiveLegalMonetaryTotal(
  invoice: PEFCorrectiveInvoice,
  sectionType?: SectionType
): LegalMonetaryTotal {
  const UBLExtensionArray = getUBLExtensionArray(invoice);
  const UBLExtensionCorrectiveData = getExtensionOne(UBLExtensionArray);
  const UBLExtensionDiffValues = getExtensionTwo(UBLExtensionArray);

  switch (sectionType) {
    case SectionType.BeforeCorrection:
      return UBLExtensionCorrectiveData?.OriginalInvoiceData?.LegalMonetaryTotal ?? {};

    case SectionType.AfterCorrection:
      return invoice.LegalMonetaryTotal ?? {};

    case SectionType.Summary:
      return UBLExtensionDiffValues?.InvoiceCorrection?.LegalMonetaryTotal ?? {};
    default:
      return {};
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
