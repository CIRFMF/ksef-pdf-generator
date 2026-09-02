import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { generateSpecPEF } from './PEF-spec-generator';
import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { AdditionalDataTypes } from './types/common.types';
import { LegalMonetaryTotal, PEFBasicInvoice } from './types/pef-invoice.types';

vi.mock('./generators/PEF/AccountingParty', () => ({
  generateAccountingParty: vi.fn(() => ({ example: 'AccountingCustomerParty' })),
}));
vi.mock('./generators/PEF/AccountingParty', () => ({
  generateAccountingParty: vi.fn(() => ({ example: 'AccountingSupplierParty.Party' })),
}));
vi.mock('./generators/PEF/AllowanceCharge', () => ({
  generateAllowanceCharge: vi.fn(() => ({ example: 'AllowanceCharge' })),
}));
vi.mock('./generators/PEF/Delivery', () => ({ generateDelivery: vi.fn(() => ({ example: 'Delivery' })) }));
vi.mock('./generators/PEF/InvoiceDescription', () => ({
  generateInvoiceDescription: vi.fn(() => ({ example: 'InvoiceDescription' })),
}));
vi.mock('./generators/PEF/InvoiceHeader', () => ({
  generateInvoiceHeader: vi.fn(() => ({
    example: 'InvoiceHeader',
    numberKSeF: ':5555555555-20250808-9231003CA67B-BE',
  })),
}));
vi.mock('./generators/PEF/InvoiceLine', () => ({
  generateInvoiceLine: vi.fn(() => ({ example: 'InvoiceLine' })),
}));
vi.mock('./generators/PEF/LegalMonetaryTotal', () => ({
  generateLegalMonetaryTotal: vi.fn(() => ({ example: 'LegalMonetaryTotal' })),
}));
vi.mock('./generators/PEF/PayeeParty', () => ({
  generatePayeeParty: vi.fn(() => ({ example: 'PayeeParty' })),
}));
vi.mock('./generators/PEF/Payment', () => ({ generatePayment: vi.fn(() => ({ example: 'Payment' })) }));
vi.mock('./generators/PEF/TaxRepresentativeParty', () => ({
  generateTaxRepresentativeParty: vi.fn(() => ({ example: 'TaxRepresentativeParty' })),
}));
vi.mock('./generators/PEF/TaxTotal', () => ({ generateTaxTotal: vi.fn(() => ({ example: 'TaxTotal' })) }));

vi.mock('./PDF-functions', () => ({
  generateStyle: vi.fn(() => ({ styles: {}, defaultStyle: {} })),
}));

const Party = {
  Contact: {
    ElectronicMail: 'fake@email.com',
    Name: 'Fake',
    Telephone: '999999999',
  },
  EndpointID: '77777777',
  PartyLegalEntity: {
    CompanyID: '77777777',
    CompanyLegalForm: 'form',
    RegistrationName: 'Fake registration',
  },
  PartyName: {
    Name: 'Fake name',
  },
  PartyTaxScheme: {
    CompanyID: '77777777',
    TaxScheme: {
      ID: 'Fake ID',
    },
  },
  PostalAddress: {
    AdditionalStreetName: 'additional street',
    CityName: 'city',
    CountrySubentity: 'country subEntity',
    PostalZone: 'postal',
    StreetName: 'street',
    AddressLine: { Line: 'additional line' },
    Country: { IdentificationCode: 'PL' },
  },
};

describe('generatePEF', (): void => {
  const mockCreatePdfReturn = { example: 'pdfCreatedObject' };

  beforeEach((): void => {
    vi.restoreAllMocks();
  });

  it('should call pdfMake.createPdf and return its result', () => {
    const invoiceHeader = {
      ID: 'INVOICE_PeF_1.0',
      InvoiceTypeCode: '380',
      DocumentCurrencyCode: 'PLN',
      TaxCurrencyCode: 'EUR',
      LegalMonetaryTotal: {
        PayableAmount: '1000.00',
      },
      DueDate: '2018-09-30',
      BuyerReference: '12345',
      IssueDate: '2018-08-31',
      TaxPointDate: '2018-08-32',
      InvoicePeriod: {
        DescriptionCode: '35',
        StartDate: '2018-08-01',
        EndDate: '2018-08-31',
      },
      ContractDocumentReference: {
        ID: 'Contract321',
      },
      OrderReference: {
        ID: '123',
        SalesOrderID: 'SO123',
      },
      DespatchDocumentReference: {
        ID: 'D12345',
      },
      ReceiptDocumentReference: {
        ID: 'R12345',
      },
      Note: 'registration court and registration number, initial capital, invested capital',
    };

    const legalMonetaryTotal: LegalMonetaryTotal = {
      PayableAmount: { _text: '555.95' },
    };

    const accountingCustomerPartyKeys = {
      AccountingCustomerParty: {
        Party,
      },
    };

    const accountingSupplierPartyKeys = {
      AccountingSupplierParty: {
        Party,
      },
    };

    const invoice: Partial<PEFBasicInvoice> = {
      ...invoiceHeader,
      ...legalMonetaryTotal,
      ...accountingCustomerPartyKeys,
      ...accountingSupplierPartyKeys,
    };

    const additionalData: AdditionalDataTypes = { nrKSeF: 'nrKSeF' };

    const createPdfSpy: MockInstance = vi
      .spyOn(pdfMake, 'createPdf')
      .mockReturnValue(mockCreatePdfReturn as any);

    const result: TCreatedPdf = generateSpecPEF(invoice as PEFBasicInvoice, additionalData);

    expect(createPdfSpy).toHaveBeenCalled();
    expect(result).toBe(mockCreatePdfReturn);
  });
});
