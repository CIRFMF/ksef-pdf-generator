import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateTaxRepresentativeParty } from './TaxRepresentativeParty';
import { createInlineLabelValue, createPefHeader, createPEFSubHeader } from '@shared/functions-pef';
import { EParty, PEFBasicInvoice } from 'src/lib-public/types/pef-invoice.types';

vi.mock('../../../shared/functions-pef', () => ({
  createPEFSectionTitle: vi.fn((text: string) => ({ text })),
  createPefHeader: vi.fn((text: string) => ({ text })),
  createPEFSubHeader: vi.fn((value: string) => [{ text: value }]),
  createInlineLabelValue: vi.fn((value: string, label: string | undefined) => ({
    text: `${label ?? ''}${label ? ' ' + value : value}`,
  })),
  borderedBox: vi.fn((content) => ({ content })),
  getText: vi.fn((data) => data?._text || data),
}));

let texRepresentative = {
  TaxRepresentativeParty: {
    PartyName: [
      {
        Name: { _text: 'Fake name' },
      },
    ],
    PartyTaxScheme: {
      CompanyID: { _text: 'Company id' },
      TaxScheme: {
        ID: { _text: 'scheme id' },
      },
    },
  },
} as EParty;

describe(generateTaxRepresentativeParty.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate tax representative', () => {
    generateTaxRepresentativeParty(texRepresentative as Partial<PEFBasicInvoice>);

    expect(createPefHeader).toHaveReturned();
    expect(createPEFSubHeader).toHaveBeenCalledWith('Fake name');
    expect(createInlineLabelValue).toHaveBeenCalled();
    expect(createInlineLabelValue).toHaveBeenCalledWith(
      'Company id [scheme id]',
      'Identyfikator scheme id',
      [0, 0, 0, 0]
    );
  });
});
