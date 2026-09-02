import { PEFBasicInvoice } from './pef-invoice.types';
import { PEFCorrectiveInvoice } from './pef-invoice-corrective.types';
import { PEFSpecInvoice } from './pef-invoice-spec.types';

export type PEFInvoice = PEFBasicInvoice | PEFCorrectiveInvoice | PEFSpecInvoice;

export function isPEFBasic(invoice: PEFInvoice): invoice is PEFBasicInvoice {
  return 'InvoiceTypeCode' in invoice;
}

export function isPEFCorrective(invoice: PEFInvoice): invoice is PEFCorrectiveInvoice {
  return 'CreditNoteTypeCode' in invoice;
}
