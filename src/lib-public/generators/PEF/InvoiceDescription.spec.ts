import { PEFType } from './../../types/pef.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateInvoiceDescription } from './InvoiceDescription';
import { createLabelWithBoldText } from '@shared/functions-pef';
import {
  LanguageLocaleIDEnum,
  ListAgencyNameEnum,
  PEFBasicInvoice,
} from 'src/lib-public/types/pef-invoice.types';

vi.mock('../../../shared/functions-pef', () => ({
  createLabelWithBoldText: vi.fn((label: string, value: any) => [{ text: `${label}${value ?? ''}` }]),
  createSmallInlineLabelValue: vi.fn((value: any, label: string) => [{ text: `${value}${label ?? ''}` }]),
  createInlineLabelValue: vi.fn((label: string, value: any) => [{ text: `${label}${value ?? ''}` }]),
  createPEFSubHeader: vi.fn((label: string, value: any) => [{ text: `${label}${value ?? ''}` }]),
  borderedBox: vi.fn((content) => ({ content })),
  getValue: vi.fn((v) => v?._text || v),
}));

let invoiceDescription: Partial<PEFBasicInvoice> = {
  InvoiceTypeCode: { _text: 'mock' },
  BillingReference: [
    {
      InvoiceDocumentReference: {
        ID: {
          _text: 'F12345' as LanguageLocaleIDEnum,
        },
        IssueDate: {
          _text: '2018-06-04',
        },
      },
    },
  ],
  AccountingCost: {
    _text: 'Warszawa' as ListAgencyNameEnum,
  },
  ProjectReference: [
    {
      ID: {
        _text: '123' as LanguageLocaleIDEnum,
      },
    },
  ],
};
describe(generateInvoiceDescription.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate invoice descritpion', () => {
    generateInvoiceDescription(PEFType.Basic, invoiceDescription);

    expect(createLabelWithBoldText).toHaveBeenCalledWith('Numer projektu', '123');
    expect(createLabelWithBoldText).toHaveBeenCalledWith('Znak stanowiska kosztów u nabywcy', 'Warszawa');
  });
});
