import { getNumber, getTable, getText, hasValue } from '@shared/PDF-functions';
import {
  createPefTableHeader,
  displayValueOrDash,
  formatTextWithCurrency,
  generatePefTable,
  generateTaxRateLabel,
} from '@shared/functions-pef';
import { Content } from 'pdfmake/interfaces';
import i18n from 'i18next';
import { PEFInvoiceTaxTotal, StickyTaxSubtotal } from '../../types/pef-invoice.types';
import { Code } from 'src/lib-public/types/pef-invoice-corrective.types';

export function generateTaxTotal(
  input?: PEFInvoiceTaxTotal[] | PEFInvoiceTaxTotal | undefined,
  documentCurrencyCode?: Code
): Content[] {
  const result: Content[] = [];

  if (!input) {
    return result;
  }

  const taxTotals = getTable(input);

  const taxSubtotals = taxTotals.flatMap((taxTotal) => {
    if (!taxTotal?.TaxSubtotal) {
      return [];
    }
    return getTable(taxTotal?.TaxSubtotal);
  });

  if (!taxSubtotals.length) {
    return result;
  }

  const totalVat = taxSubtotals.reduce((sum, subtotal) => sum + Number(getText(subtotal.TaxAmount) ?? 0), 0);
  const currency = documentCurrencyCode;

  const rows = taxSubtotals.map((subtotal: StickyTaxSubtotal) => {
    const TaxExemptionReason = getTable(subtotal.TaxCategory?.TaxExemptionReason)[0];
    const TaxExemptionReasonCode = subtotal.TaxCategory?.TaxExemptionReasonCode;

    return {
      taxType: generateTaxRateLabel(
        getText(subtotal.TaxCategory?.ID),
        getText(subtotal.TaxCategory?.Percent)
      ),
      exemptionReason: hasValue(TaxExemptionReasonCode)
        ? getText(TaxExemptionReason) + ' - ' + getText(TaxExemptionReasonCode)
        : displayValueOrDash(getText(TaxExemptionReason)),
      taxableAmount: formatTextWithCurrency(
        getNumber(subtotal.TaxableAmount),
        getText(currency),
        undefined,
        '-'
      ),
      taxAmount: formatTextWithCurrency(getNumber(subtotal.TaxAmount), getText(currency), undefined, '-'),
    };
  });

  if (totalVat) {
    rows.push({
      taxType: `${i18n.t('pef.taxtotal.taxAmountId')}`,
      exemptionReason: '',
      taxableAmount: '',
      taxAmount: formatTextWithCurrency(totalVat, getText(currency)),
    });
  }

  result.push({
    stack: [
      createPefTableHeader(i18n.t('pef.taxtotal.taxSubtotalHeader')),
      generatePefTable(rows, {
        taxType: i18n.t('pef.taxtotal.taxCategory'),
        exemptionReason: i18n.t('pef.taxtotal.taxExemptionReason'),
        taxableAmount: i18n.t('pef.taxtotal.taxableAmount'),
        taxAmount: i18n.t('pef.taxtotal.taxAmount'),
      }),
    ],
  } as Content);
  return result;
}
