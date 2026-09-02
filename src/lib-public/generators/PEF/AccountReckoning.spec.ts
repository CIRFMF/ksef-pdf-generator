import { describe, expect, it } from 'vitest';
import { generateAccountReckoning } from './AccountReckoning';
import { PEFCorrectiveInvoice } from 'src/lib-public/types/pef-invoice-corrective.types';

let mockInvoice: Partial<PEFCorrectiveInvoice> = {
  UBLExtensions: {
    UBLExtension: [
      {} as any,
      {} as any,
      {} as any,
      {
        ExtensionContent: {
          AdditionalInvoiceGrossData: { InvoiceLine: [] },
        },
      },
    ],
  },
};

describe(generateAccountReckoning.name, () => {
  it('shuuld return empty array', () => {
    const result = generateAccountReckoning(mockInvoice);

    expect(result).toEqual([]);
  });

  it('shuold return section with accouting only Rozliczenia', () => {
    mockInvoice = {
      ...mockInvoice,
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
                    AccountingCost: { _text: 'Rozliczenie' },
                    InvoicePeriod: { EndDate: { _text: '2026-08-11' }, StartDate: { _text: '2026-08-01' } },
                    Item: {
                      Description: { _text: 'Opis rozliczenia' },
                      Name: { _text: 'nazwa rozliczenia' },
                    },

                    LineExtensionGrossAmount: { _attributes: { currencyID: 'PLN' }, _text: 150 },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    const result = generateAccountReckoning(mockInvoice);
    const stack = (result[0] as any).stack[0][1].table.body[1];

    expect(stack[0][0].text[0].text).toEqual('1');
    expect(stack[1][0].text[0].text).toEqual('nazwa rozliczenia');
    expect(stack[2][0].text[0].text).toEqual('Opis rozliczenia');
    expect(stack[3][0].text[0].text).toEqual('od 01.08.2026 - do 11.08.2026');
    expect(stack[4][0][0].text.text).toEqual('150');
    expect(stack[4][0][1].text.text).toEqual('PLN');
  });
});
