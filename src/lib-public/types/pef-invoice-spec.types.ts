import { AdditionalInvoiceGrossData, InvoiceLine, ReceiverParty } from './pef-invoice-corrective.types';
import { PEFBasicInvoice, SupplierParty } from './pef-invoice.types';

export type PEFSpecInvoice = Omit<PEFBasicInvoice, 'UBLExtensions'> & {
  UBLExtensions: { UBLExtension: UBLExtensions };
};

export type UBLExtensions = Extension1 | Extension2 | Extension3 | Extension4;

export interface Extension1 {
  ExtensionContent?: {
    AdditionalInvoiceGrossData: AdditionalInvoiceGrossData;
  };
}

export type Extension2 = any;

export interface Extension3 {
  AdditionalInvoiceDataNetto: {
    InvoiceLine: InvoiceLine;
  };
}

export interface Extension4 {
  ExtensionContent?: {
    AdditionalAddressData?: {
      SellerSupplierParty?: SupplierParty;
      ReceiverParty?: ReceiverParty;
    };
    AdditionalInvoiceGrossData: {
      InvoiceLine: InvoiceLine[];
    };
  };
}
