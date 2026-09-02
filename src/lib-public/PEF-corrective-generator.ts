import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateAccountingParty } from './generators/PEF/AccountingParty';
import { generateDelivery } from './generators/PEF/Delivery';
import { generatePayeeParty } from './generators/PEF/PayeeParty';
import { generateFooter } from './generators/PEF/Steeper';
import { generateTaxRepresentativeParty } from './generators/PEF/TaxRepresentativeParty';
import {
  getExtensionFour,
  getExtensionOne,
  getExtensionTwo,
  getUBLExtensionArray,
  PEFType,
} from './types/pef.types';
import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import i18n from 'i18next';
import { AdditionalDataTypes } from './types/common.types';
import { generateStyle, getTable } from '@shared/PDF-functions';
import { Position } from '@shared/enums/common.enum';
import { generateInvoiceHeader } from './generators/PEF/InvoiceHeader';
import { generateReceiverParty } from './generators/PEF/ReceiverParty';
import { generateInvoiceDescription } from './generators/PEF/InvoiceDescription';
import { generateTaxTotal } from './generators/PEF/TaxTotal';
import { generateAllowanceCharge } from './generators/PEF/AllowanceCharge';
import { PEFCorrectiveInvoice } from './types/pef-invoice-corrective.types';
import { generateDiffSummary } from './generators/PEF/DiffSummary';
import { generatePayment } from './generators/PEF/Payment';
import { generateLegalMonetaryTotal } from './generators/PEF/LegalMonetaryTotal';
import { generateInvoiceLine } from './generators/PEF/InvoiceLine';
import { generateAccountReckoning } from './generators/PEF/AccountReckoning';
import { SectionType } from '@shared/enums/pef-invoice.enum';

pdfMake.addVirtualFileSystem(pdfFonts);

export function generateCorrectivePEF(
  invoice: PEFCorrectiveInvoice,
  additionalData: AdditionalDataTypes
): TCreatedPdf {
  const content: Content[] = [];

  const UBLExtensionArray = getUBLExtensionArray(invoice);
  const extensionFour = getExtensionFour(UBLExtensionArray);
  const sellerSupplierParty = extensionFour?.AdditionalAddressData?.SellerSupplierParty;
  const receiverParty = extensionFour?.AdditionalAddressData?.ReceiverParty;
  const totalTaxBeforeCorrection = getExtensionOne(UBLExtensionArray)?.OriginalInvoiceData?.TaxTotal;
  const totalTaxSummary = getExtensionTwo(UBLExtensionArray)?.InvoiceCorrection?.TaxTotal;

  content.push(
    generateInvoiceHeader(invoice, additionalData.nrKSeF), // Nagłówek faktury
    generateAccountingParty(sellerSupplierParty?.Party, 'Issuer'), // Wystawca faktury
    generateAccountingParty(invoice.AccountingSupplierParty?.Party, 'Supplier'), // Sprzedawca
    generateAccountingParty(invoice.AccountingCustomerParty?.Party, 'Customer'), // Nabywca
    generateTaxRepresentativeParty(invoice), // Przedstawiciel podatkowy sprzedawcy
    generateDelivery(getTable(invoice.Delivery)), // Odbiorca
    generatePayeeParty(invoice.PayeeParty), // Odbiorca płatności
    generateReceiverParty(receiverParty), // Adresat
    generateInvoiceDescription(PEFType.Corrective, invoice), // Treść faktury
    generateInvoiceLine(invoice, SectionType.BeforeCorrection), // Pozycje przed korektą
    generateAllowanceCharge(invoice, SectionType.BeforeCorrection), // Upusty i obciążenia na poziomie dokumentu
    generateTaxTotal(totalTaxBeforeCorrection, invoice?.DocumentCurrencyCode), // Rozliczenie VAT wg stawek przed korektą
    generateLegalMonetaryTotal(invoice, SectionType.BeforeCorrection), // Podsumowanie faktury przed korektą
    generateInvoiceLine(invoice, SectionType.AfterCorrection), // Pozycje po korekcie
    generateAllowanceCharge(invoice, SectionType.AfterCorrection), // Upusty i obciążenia na poziomie dokumentu
    generateTaxTotal(invoice.TaxTotal, invoice?.DocumentCurrencyCode), // Rozliczenie VAT wg stawek po korekcie
    generateAccountReckoning(invoice), //Rozliczenie konta
    generateLegalMonetaryTotal(invoice, SectionType.AfterCorrection), //Podsumowanie faktury po korekcie
    generatePayment(invoice), // Instrukcje płatności
    generateDiffSummary(invoice), // Podsumowanie różnic
    generateAllowanceCharge(invoice, SectionType.Summary), // Upusty i obciążenia na poziomie dokumentu
    generateTaxTotal(totalTaxSummary, invoice?.DocumentCurrencyCode), // Rozliczenie VAT wg stawek podsumowanie
    generateLegalMonetaryTotal(invoice, SectionType.Summary), // Podsumowanie faktury
    generateFooter(additionalData, invoice!.CustomizationID!) // Elementy struktury
  );
  const docDefinition: TDocumentDefinitions = {
    content: content,
    footer: (currentPage, pageCount) => {
      return {
        text: `${currentPage.toString()} ${i18n.t('invoice.footer.pagesTotal')} ${pageCount}`,
        alignment: Position.RIGHT,
        margin: [0, 0, 40, 0],
      };
    },
    ...generateStyle(),
  };

  return pdfMake.createPdf(docDefinition);
}
