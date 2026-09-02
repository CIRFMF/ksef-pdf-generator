import { beforeEach, describe, it, vi, expect } from 'vitest';
import { generateTaxTotal } from './TaxTotal';
import { borderedBox, createPefTableHeader, generatePefTable } from '@shared/functions-pef';
import { LanguageLocaleIDEnum } from 'src/lib-public/types/pef-invoice.types';
import { PEFInvoice } from 'src/lib-public/types/typeguards';

vi.mock('../../../shared/functions-pef', () => ({
  createPefTableHeader: vi.fn((text: string) => ({ text })),
  generatePefTable: vi.fn((value: string) => [{ text: value }]),
  generateTaxRateLabel: vi.fn((text: string) => [{ text }]),
  borderedBox: vi.fn((content) => ({ content })),
  formatTextWithCurrency: vi.fn((value, currency, multiplierFactorNumeric) => [
    {
      text: [
        { test: String(value) },
        { text: multiplierFactorNumeric ? `\n${currency} (${multiplierFactorNumeric}%)` : `\n${currency}` },
      ],
    },
  ]),
  getText: vi.fn((v) => v?._text || v),
  getTable: vi.fn(() => []),
  hasValue: vi.fn((v) => !!v?._text),
  displayValueOrDash: vi.fn((text: string) => ({ text })),
}));

vi.mock('../../types/typeguards', () => ({
  isPEFBasic: vi.fn((data: PEFInvoice) => true),
  isPEFCorrective: vi.fn((data: PEFInvoice) => false),
}));

describe(generateTaxTotal.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate tax total section', () => {
    const result = generateTaxTotal(
      {
        TaxAmount: { _text: '290.95' },
        TaxSubtotal: [
          {
            TaxableAmount: { _text: '1265.00' },
            TaxAmount: { _text: '290.95' },
            TaxCategory: {
              ID: { _text: 'S' as LanguageLocaleIDEnum },
              Percent: { _text: '23' },
              TaxScheme: {
                ID: { _text: 'VAT' as LanguageLocaleIDEnum },
              },
            },
          },
        ],
      },
      {
        _text: 'PLN',
      }
    );

    const [rows] = vi.mocked(generatePefTable).mock.calls[0];
    const row = rows[0] as any;
    const totalrow = rows[1] as any;
    expect(result).toHaveLength(1);
    expect(createPefTableHeader).toHaveReturned();
    expect(JSON.stringify(row.taxableAmount)).toContain('[{"text":[{"test":"1265"},{"text":"\\nPLN"}]}]');
    expect(JSON.stringify(row.taxableAmount)).toContain('PLN');
    expect(JSON.stringify(row.taxAmount)).toContain('290.95');
    expect(JSON.stringify(row.taxAmount)).toContain('PLN');
    expect(totalrow.taxType).toContain('Suma');
    expect(JSON.stringify(totalrow.taxAmount)).toContain('290.95');
    expect(JSON.stringify(totalrow.taxAmount)).toContain('PLN');
  });

  it('should return empty array when TaxTotal is missing', () => {
    const result = generateTaxTotal({});
    expect(result).toEqual([]);
    expect(generatePefTable).not.toHaveBeenCalled();
  });

  it('should return empty array when TaxSubtotal is empty', () => {
    const result = generateTaxTotal([], { _text: 'PLN' as any });
    expect(result).toEqual([]);
    expect(borderedBox).not.toHaveBeenCalled();
    expect(generatePefTable).not.toHaveBeenCalled();
  });

  it('should return empty array when TaxSubtotal is missing', () => {
    const result = generateTaxTotal(
      [
        {
          TaxAmount: { _text: '290.95' },
        },
      ],
      { _text: 'PLN' }
    );
    expect(result).toEqual([]);
    expect(borderedBox).not.toHaveBeenCalled();
    expect(generatePefTable).not.toHaveBeenCalled();
  });

  it('should generate empty amounts when taxableAmount and taxAmount are missing', () => {
    generateTaxTotal(
      {
        TaxSubtotal: {
          TaxCategory: {
            ID: 'S',
            Percent: '23',
          },
        } as any,
      },
      {
        _text: 'PLN',
      }
    );

    const rows = vi.mocked(generatePefTable).mock.calls[0][0];

    expect(JSON.stringify(rows[0].taxableAmount)).toContain(`[{"text":[{"test":"0"},{"text":"\\nPLN"}]}]`);
  });
});
