import { beforeEach, describe, it, vi, expect } from 'vitest';
import { generateLegalMonetaryTotal } from './LegalMonetaryTotal';
import {
  LanguageLocaleIDEnum,
  ListAgencyNameEnum,
  PEFBasicInvoice,
} from 'src/lib-public/types/pef-invoice.types';
import { PEFCorrectiveInvoice } from 'src/lib-public/types/pef-invoice-corrective.types';
import { ContentTable } from 'pdfmake/interfaces';
import { isPEFCorrective } from '../../types/typeguards';
import { SectionType } from '@shared/enums/pef-invoice.enum';

const invoicePEFBasic: Partial<PEFBasicInvoice> = {
  LegalMonetaryTotal: {
    TaxExclusiveAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '12740.00',
    },
    TaxInclusiveAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '15670.20',
    },
    PrepaidAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '1000.00',
    },
    PayableRoundingAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '0.00',
    },
    PayableAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '14870.20',
    },
  },
};

const invoicePEFCorrective: Partial<PEFCorrectiveInvoice> = {
  LegalMonetaryTotal: {
    TaxExclusiveAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '12740.00',
    },
    TaxInclusiveAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '15670.20',
    },
    PrepaidAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '1000.00',
    },
    PayableRoundingAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '0.00',
    },
    PayableAmount: {
      _attributes: {
        currencyID: 'PLN' as LanguageLocaleIDEnum,
      },
      _text: '14870.20',
    },
  },
  UBLExtensions: {
    UBLExtension: [
      {} as any,
      {} as any,
      {} as any,
      {
        ExtensionContent: {
          AdditionalInvoiceGrossData: {
            InvoiceLine: [
              {
                LineExtensionGrossAmount: {
                  _attributes: {
                    currencyID: 'PLN' as LanguageLocaleIDEnum,
                  },
                  _text: '15657.90',
                },
              },
              {
                LineExtensionGrossAmount: {
                  _attributes: {
                    currencyID: 'PLN' as LanguageLocaleIDEnum,
                  },
                  _text: '200.00',
                },
                AccountingCost: {
                  _text: 'Raty' as ListAgencyNameEnum,
                },
              },
            ],
          },
        },
      },
    ],
  },
};

vi.mock('../../types/typeguards', () => ({
  isPEFBasic: vi.fn(),
  isPEFCorrective: vi.fn(),
}));

describe(generateLegalMonetaryTotal.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate legal monetary total section for PEFBasic invoice', () => {
    vi.mocked(isPEFCorrective).mockReturnValue(false);

    const result = generateLegalMonetaryTotal(
      invoicePEFBasic,
      SectionType.Basic
    ) as ContentTable;
    const stack = (result.table.body[0][0] as any).stack;
    expect(stack[0].text[0].text).toContain('Suma faktury bez podatku VAT');
    expect(stack[0].text[1].text).toContain('PLN');
    expect(stack[1].text[0].text).toContain('Całkowita kwota faktury z podatkiem VAT');
    expect(stack[1].text[1].text).toContain('PLN');
    expect(stack[2].text[0].text).toContain('Kwota przedpłacona');
    expect(stack[2].text[1].text).toContain('PLN');
    expect(stack[3].text[0].text).toContain('Kwota zaokrągleń');
    expect(stack[3].text[1].text).toContain('PLN');
    expect(stack[4].text[0].text).toContain('Kwota do zapłaty');
    expect(stack[4].text[1].text).toContain('PLN');
  });

  it('should generate legal monetary total section for PEFCorrective invoice', () => {
    vi.mocked(isPEFCorrective).mockReturnValue(true);

    const result = generateLegalMonetaryTotal(
      invoicePEFCorrective,
      SectionType.AfterCorrection
    ) as ContentTable;
    const stack = (result.table.body[0][0] as any).stack;
    expect(stack[0].text[0].text).toContain('Suma faktury bez podatku VAT');
    expect(stack[0].text[1].text).toContain('PLN');
    expect(stack[1].text[0].text).toContain('Całkowita kwota faktury z podatkiem VAT');
    expect(stack[1].text[1].text).toContain('PLN');
    expect(stack[2].text[0].text).toContain('Raty za sprzęt');
    expect(stack[2].text[1].text).toContain('PLN');
    expect(stack[3].text[0].text).toContain('Kwota przedpłacona');
    expect(stack[3].text[1].text).toContain('PLN');
    expect(stack[4].text[0].text).toContain('Kwota zaokrągleń');
    expect(stack[4].text[1].text).toContain('PLN');
    expect(stack[5].text[0].text).toContain('Kwota do zapłaty');
    expect(stack[5].text[1].text).toContain('PLN');
  });

  it('should generate empty array when LegalMonetaryTotal is missing', () => {
    const input = {};

    const result = generateLegalMonetaryTotal(input, SectionType.Basic);

    expect(result).toEqual([]);
  });
});
