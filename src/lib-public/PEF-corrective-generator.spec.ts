import { beforeEach, describe, expect, it, MockInstance, vi } from 'vitest';
import { generateCorrectivePEF } from './PEF-corrective-generator';
import pdfMake, { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { AdditionalDataTypes } from './types/common.types';

vi.mock('./generators/PEF/AccountingParty', () => ({
  generateAccountingParty: vi.fn(() => ({ example: 'AccountingCustomerParty' })),
}));
vi.mock('./generators/PEF/AccountingParty', () => ({
  generateAccountingParty: vi.fn(() => ({ example: 'AccountingSupplierParty.Party' })),
}));
vi.mock('./generators/PEF/Delivery', () => ({ generateDelivery: vi.fn(() => ({ example: 'Delivery' })) }));
vi.mock('./generators/PEF/LegalMonetaryTotal', () => ({
  generateLegalMonetaryTotal: vi.fn(() => ({ example: 'LegalMonetaryTotal' })),
}));
vi.mock('./generators/PEF/Steeper', () => ({ generateFooter: vi.fn(() => ({ example: 'Steeper' })) }));
vi.mock('./PDF-functions', () => ({
  generateStyle: vi.fn(() => ({ styles: {}, defaultStyle: {} })),
}));
vi.mock('./generators/PEF/TaxTotal', () => ({ generateTaxTotal: vi.fn(() => ({ example: 'TaxTotal' })) }));

// const Party = {
//   Contact: {
//     ElectronicMail: 'fake@email.com',
//     Name: 'Fake',
//     Telephone: '999999999',
//   },
//   EndpointID: '77777777',
//   PartyLegalEntity: {
//     CompanyID: '77777777',
//     CompanyLegalForm: 'form',
//     RegistrationName: 'Fake registration',
//   },
//   PartyName: {
//     Name: 'Fake name',
//   },
//   PartyTaxScheme: {
//     CompanyID: '77777777',
//     TaxScheme: {
//       ID: 'Fake ID',
//     },
//   },
//   PostalAddress: {
//     AdditionalStreetName: 'additional street',
//     CityName: 'city',
//     CountrySubentity: 'country subEntity',
//     PostalZone: 'postal',
//     StreetName: 'street',
//     AddressLine: { Line: 'additional line' },
//     Country: { IdentificationCode: 'PL' },
//   },
// };

describe('generatePEF', (): void => {
  const mockCreatePdfReturn = { example: 'pdfCreatedObject' };

  beforeEach((): void => {
    vi.restoreAllMocks();
  });

  it('should call pdfMake.createPdf and return its result', () => {
    const additionalData: AdditionalDataTypes = { nrKSeF: 'nrKSeF' };

    //   const accountingCustomerPartyKeys: AccountingCustomerParty = {
    //     AccountingCustomerParty: {
    //       Party,
    //     },
    //   };

    //   const accountingSupplierPartyKeys: AccountingSupplierParty = {
    //     AccountingSupplierParty: {
    //       Party,
    //     },
    //   };

    //   const stepperKeys: Steeper = {
    //     CustomizationID: '123',
    //     ProfileID: '23',
    //   };

    //   const UBLExtensions: UBLExtensions = {
    //     UBLExtensions: {
    //       UBLExtension: [
    //         {} as any,
    //         {} as any,
    //         {} as any,
    //         {} as any,
    //         {
    //           ExtensionContent: {
    //             AdditionalAddressData: {
    //               SellerSupplierParty: {
    //                 Party: Party,
    //               },
    //             },
    //             OriginalInvoiceData: {},
    //           },
    //         },
    //       ],
    //     },
    //   };

    //   const invoice: Partial<CorrectivePEFInvoice> = {
    //     ...accountingCustomerPartyKeys,
    //     ...accountingSupplierPartyKeys,
    //     ...UBLExtensions,
    //     ...stepperKeys,
    //     ...correctiveTaxTotalKeys,
    //   };

    //   const additionalData: AdditionalDataTypes = { nrKSeF: 'nrKSeF' };

    const createPdfSpy: MockInstance = vi
      .spyOn(pdfMake, 'createPdf')
      .mockReturnValue(mockCreatePdfReturn as any);

    const result: TCreatedPdf = generateCorrectivePEF({}, additionalData);

    expect(createPdfSpy).toHaveBeenCalled();
    expect(result).toBe(mockCreatePdfReturn);
  });
});
