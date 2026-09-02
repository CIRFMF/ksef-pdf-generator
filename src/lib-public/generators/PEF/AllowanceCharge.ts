import {
  createPefTableHeader,
  displayValueOrDash,
  formatTextWithCurrency,
  generatePefTable,
  generateTaxRateLabel,
} from '../../../shared/functions-pef';
import { Content } from 'pdfmake/interfaces';
import i18n from 'i18next';
import { PEFBasicInvoice, TaxCategory } from '../../types/pef-invoice.types';
import { getNumber, getTable, getText } from '../../../shared/PDF-functions';
import { PEFCorrectiveInvoice, PEFInvoiceAllowanceCharge } from '../../types/pef-invoice-corrective.types';
import { isPEFCorrective } from '../../types/typeguards';
import { SectionType } from '../../../shared/enums/pef-invoice.enum';
import { getExtensionOne, getExtensionTwo, getUBLExtensionArray } from '../../types/pef.types';
import { _ } from 'vitest/dist/chunks/reporters.d.BFLkQcL6';

export function generateAllowanceCharge(
  invoice: PEFBasicInvoice | PEFCorrectiveInvoice,
  sectionType: SectionType
): Content[] {
  let allowanceCharge = [];

  if (isPEFCorrective(invoice)) {
    allowanceCharge = getTable(getAllowanceCharge(invoice, sectionType));
  } else {
    allowanceCharge = getTable(invoice?.AllowanceCharge);
  }

  if (!allowanceCharge) {
    return [];
  }

  const result: Content[] = [];
  const charge = allowanceCharge.filter((item) => getText(item.ChargeIndicator) === 'true');
  const allowance = allowanceCharge.filter((item) => getText(item.ChargeIndicator) === 'false');
  const allowanceTotal = allowance.reduce((sum, item) => sum + getNumber(item.Amount), 0);
  const chargeTotal = charge.reduce((sum, item) => sum + getNumber(item.Amount), 0);
  const currency = getText(invoice.DocumentCurrencyCode);

  const allowanceRows = allowance.map((item) => ({
    reason: displayValueOrDash(getText(getTable(item.AllowanceChargeReason)[0])),
    reasonCode: displayValueOrDash(getText(item.AllowanceChargeReasonCode)),
    baseAmount: formatTextWithCurrency(
      getText(item.BaseAmount),
      currency,
      getText(item.MultiplierFactorNumeric),
      '-'
    ),
    amount: formatTextWithCurrency(getText(item.Amount), currency, undefined, '-'),
    taxCategory: 'TaxCategory' in item ? getTaxCategoryString(getTable(item.TaxCategory)[0]) : '-',
  }));

  if (allowanceTotal) {
    allowanceRows.push({
      reasonCode: `${i18n.t('pef.allowancecharge.totalAmount')}`,
      reason: '',
      taxCategory: '',
      baseAmount: { text: [{ text: '' }] },
      amount: formatTextWithCurrency(allowanceTotal, currency),
    });
  }

  const chargeRows = charge.map((item) => ({
    reason: displayValueOrDash(getText(getTable(item.AllowanceChargeReason)[0])),
    reasonCode: displayValueOrDash(getText(item.AllowanceChargeReasonCode)),
    baseAmount: formatTextWithCurrency(
      getText(item.BaseAmount),
      currency,
      getText(item.MultiplierFactorNumeric),
      '-'
    ),
    amount: formatTextWithCurrency(getText(item.Amount), currency, undefined, '-'),
    taxCategory: 'TaxCategory' in item ? getTaxCategoryString(getTable(item.TaxCategory)[0]) : '-',
  }));

  if (chargeTotal) {
    chargeRows.push({
      reasonCode: `${i18n.t('pef.allowancecharge.totalAmount')}`,
      reason: '',
      taxCategory: '',
      baseAmount: { text: [{ text: '' }] } as any,
      amount: formatTextWithCurrency(chargeTotal, currency),
    });
  }

  if (!charge.length && !allowance.length) {
    return result;
  }

  if (allowance.length) {
    result.push({
      stack: [
        createPefTableHeader(i18n.t('pef.allowancecharge.allowanceHeader')),
        generatePefTable(allowanceRows, {
          reasonCode: i18n.t('pef.allowancecharge.allowanceReasonCode'),
          reason: i18n.t('pef.allowancecharge.allowanceReason'),
          taxCategory: i18n.t('pef.allowancecharge.taxCategory'),
          baseAmount: i18n.t('pef.allowancecharge.baseAmount'),
          amount: i18n.t('pef.allowancecharge.allowanceAmount'),
        }),
      ],
    });
  }

  if (charge.length) {
    result.push({
      stack: [
        createPefTableHeader(i18n.t('pef.allowancecharge.chargeHeader')),
        generatePefTable(chargeRows, {
          reasonCode: i18n.t('pef.allowancecharge.chargeReasonCode'),
          reason: i18n.t('pef.allowancecharge.chargeReason'),
          taxCategory: i18n.t('pef.allowancecharge.taxCategory'),
          baseAmount: i18n.t('pef.allowancecharge.baseAmount'),
          amount: i18n.t('pef.allowancecharge.chargeAmount'),
        }),
      ],
    });
  }
  return [{ stack: result, marginBottom: 12 }] as Content[];
}

function getAllowanceCharge(
  invoice: PEFCorrectiveInvoice,
  sectionType: SectionType
): PEFInvoiceAllowanceCharge | PEFInvoiceAllowanceCharge[] | undefined {
  const UBLExtensionArray = getUBLExtensionArray(invoice);
  const UBLExtensionCorrectiveData = getExtensionOne(UBLExtensionArray);
  const UBLExtensionDiffValues = getExtensionTwo(UBLExtensionArray);

  switch (sectionType) {
    case SectionType.BeforeCorrection:
      return UBLExtensionCorrectiveData?.OriginalInvoiceData?.AllowanceCharge;

    case SectionType.AfterCorrection:
      return invoice.AllowanceCharge;

    case SectionType.Summary:
      return UBLExtensionDiffValues?.InvoiceCorrection?.AllowanceCharge;

    default:
      return undefined;
  }
}

function getTaxCategoryString(taxCategory: TaxCategory): string {
  const taxCategoryId = getText(taxCategory.ID);
  const taxCategoryPercent = getText(taxCategory.Percent);
  const taxSchemeId = getText(taxCategory.TaxScheme?.ID);

  if (getText(taxCategory.ID) === 'E') {
    return generateTaxRateLabel(taxCategoryId, taxCategoryPercent);
  } else {
    return `${taxSchemeId}: ${taxCategoryId}, ${taxCategoryPercent}%`;
  }
}
