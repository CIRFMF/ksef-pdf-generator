import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateInvoiceHeader } from './InvoiceHeader';
import { createLabelWithBoldText } from '../../../shared/functions-pef';
import { PEFInvoice } from 'src/lib-public/types/typeguards';
import { LanguageLocaleIDEnum, ListAgencyNameEnum } from 'src/lib-public/types/pef-invoice.types';

vi.mock('../../../shared/PDF-functions', () => ({
  getText: vi.fn((data) => data?._text || data),
  getTable: vi.fn(() => []),
  generateColumns: vi.fn((left, right) => ({ columns: [left, right] })),
  formatText: vi.fn((txt, type) => ({ text: txt, formatType: type })),
  replaceDotWithCommaIfNeeded: vi.fn((txt) => txt),
}));
vi.mock('../../../shared/functions-pef', () => ({
  createLabelWithBoldText: vi.fn((label: string, value: any) => [{ text: `${label}${value ?? ''}` }]),
  borderedBox: vi.fn((content) => ({ content })),
}));

describe(generateInvoiceHeader.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate simple BasicInvoiceHeader data', () => {
    const podmiot: Partial<PEFInvoice> = {
      DueDate: { _text: '2018-09-30' },
      BuyerReference: { _text: '12345' as ListAgencyNameEnum },
      IssueDate: { _text: '2018-08-31' },
      TaxPointDate: { _text: '2018-08-32' },
      InvoiceTypeCode: { _text: '380' },
    };
    const numberKSef = '5555555555-20250808-9231003CA67B-BE';
    generateInvoiceHeader(podmiot, numberKSef);

    expect(createLabelWithBoldText).toHaveBeenCalledTimes(13);
  });

  it('generate simple CorrectiveInvoiceHeader data', () => {
    const podmiot: Partial<PEFInvoice> = {
      IssueDate: { _text: '2018-08-31' },
      TaxPointDate: { _text: '2018-08-32' },
      CreditNoteTypeCode: { _text: '0' as LanguageLocaleIDEnum },
    };

    const numberKSef = '5555555555-20250808-9231003CA67B-BE';
    generateInvoiceHeader(podmiot, numberKSef);

    expect(createLabelWithBoldText).toHaveBeenCalledTimes(14);
  });
});
