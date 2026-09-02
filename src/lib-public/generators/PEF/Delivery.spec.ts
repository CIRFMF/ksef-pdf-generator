import { beforeEach, describe, it, vi, expect } from 'vitest';
import { generateDelivery } from './Delivery';
import { createInlineLabelValue, createPefHeader, createPEFSubHeader } from '@shared/functions-pef';
import {
  LanguageLocaleIDEnum,
  ListAgencyNameEnum,
  PEFInvoiceDelivery,
} from 'src/lib-public/types/pef-invoice.types';

vi.mock('../../../shared/functions-pef', () => ({
  createPefHeader: vi.fn((text: string) => ({ text })),
  createPEFSubHeader: vi.fn((value: string) => [{ text: value }]),
  createPEFSectionTitle: vi.fn((value: string) => [{ text: value }]),
  createInlineLabelValue: vi.fn((value: string, label: string | undefined) => ({
    text: `${label ?? ''}${label ? ' ' + value : value}`,
  })),
  borderedBox: vi.fn((content) => ({ content })),
  getText: vi.fn((data) => data?._text || data),
}));

const party: Partial<PEFInvoiceDelivery>[] = [
  {
    DeliveryParty: {
      PartyName: [
        {
          Name: { _text: 'ABC Company' as ListAgencyNameEnum },
        },
      ],
    },
    DeliveryLocation: {
      ID: { _text: '111111111111' as LanguageLocaleIDEnum },
    },
    ActualDeliveryDate: { _text: '2000-01-01' },
  },
];

describe(generateDelivery.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate delivery section', () => {
    generateDelivery(party);

    expect(createPefHeader).toHaveReturned();
    expect(createPEFSubHeader).toHaveBeenCalledWith('ABC Company');
    expect(createInlineLabelValue).toHaveBeenCalled();
    expect(createInlineLabelValue).toHaveBeenCalledWith('111111111111', 'Identyfikator');
    expect(createInlineLabelValue).toHaveBeenCalledWith(
      '01.01.2000',
      'Rzeczywista data dostawy/Data sprzedaży'
    );
  });
});
