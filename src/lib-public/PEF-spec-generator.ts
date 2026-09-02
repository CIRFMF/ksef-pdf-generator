import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { generateAccountingParty } from './generators/PEF/AccountingParty';
import { generateDelivery } from './generators/PEF/Delivery';
import { generatePayeeParty } from './generators/PEF/PayeeParty';
import { generateFooter } from './generators/PEF/Steeper';
import { generateTaxRepresentativeParty } from './generators/PEF/TaxRepresentativeParty';
import { getExtensionFour, getUBLExtensionArray, PEFType } from './types/pef.types';
import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import i18n from 'i18next';
import { AdditionalDataTypes } from './types/common.types';
import { generateStyle, getTable } from '@shared/PDF-functions';
import { generateInvoiceHeader } from './generators/PEF/InvoiceHeader';
import { generateInvoiceDescription } from './generators/PEF/InvoiceDescription';
import { generateAllowanceCharge } from './generators/PEF/AllowanceCharge';
import { generateTaxTotal } from './generators/PEF/TaxTotal';
import { generateLegalMonetaryTotal } from './generators/PEF/LegalMonetaryTotal';
import { generatePayment } from './generators/PEF/Payment';
import { Position } from '@shared/enums/common.enum';
import { SectionType } from '@shared/enums/pef-invoice.enum';
import { PEFSpecInvoice } from './types/pef-invoice-spec.types';
import { generateReceiverParty } from './generators/PEF/ReceiverParty';
import { generateAccountReckoning } from './generators/PEF/AccountReckoning';
import { generateInvoiceLine } from './generators/PEF/InvoiceLine';

pdfMake.addVirtualFileSystem(pdfFonts);

export function generateSpecPEF(invoice: PEFSpecInvoice, additionalData: AdditionalDataTypes): TCreatedPdf {
  const content: Content[] = [];

  const UBLExtensionArray = getUBLExtensionArray(invoice);
  const additionalAddressDataExtension = getExtensionFour(UBLExtensionArray);
  const sellerSupplierParty =
    additionalAddressDataExtension?.AdditionalAddressData?.SellerSupplierParty?.Party;
  const receiverParty = additionalAddressDataExtension?.AdditionalAddressData?.ReceiverParty;

  content.push(
    generateInvoiceHeader(invoice, additionalData.nrKSeF), // Nagłówek faktury
    generateAccountingParty(sellerSupplierParty, 'Issuer'), // Wystawca
    generateAccountingParty(invoice.AccountingSupplierParty?.Party, 'Supplier'), // Sprzedawca
    generateAccountingParty(invoice.AccountingCustomerParty?.Party, 'Customer'), // Nabywca
    generateReceiverParty(receiverParty), // Adresat
    generateTaxRepresentativeParty(invoice), // Przedstawiciel podatkowy sprzedawcy
    generateDelivery(getTable(invoice.Delivery)), // Odbiorca
    generatePayeeParty(invoice.PayeeParty), // Odbiorca płatności
    generateInvoiceDescription(PEFType.Basic, invoice), // Treść faktury
    generateInvoiceLine(invoice, SectionType.Basic), // Pozycje
    generateAllowanceCharge(invoice, SectionType.Basic), // Upusty / obciążenia
    generateTaxTotal(invoice.TaxTotal, invoice.DocumentCurrencyCode), // Rozliczenie VAT wg stawek
    generateLegalMonetaryTotal(invoice, SectionType.Basic), // Podsumowanie faktury
    generateAccountReckoning(invoice), //Rozliczenie konta
    generatePayment(invoice), // Instrukcje płatności
    generateFooter(additionalData, invoice.CustomizationID!) // Element struktury
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
