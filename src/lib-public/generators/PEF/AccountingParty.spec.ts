import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateAccountingParty } from './AccountingParty';
import { ListAgencyNameEnum, Party } from '../../types/pef-invoice.types';
import { createPefHeader, createPEFSubHeader } from '@shared/functions-pef';
import { createContact } from './shared/contact';

vi.mock('../../../shared/functions-pef', () => ({
  createPEFSectionTitle: vi.fn((text: string) => ({ text })),
  createPefHeader: vi.fn((text: string) => ({ text })),
  createPEFSubHeader: vi.fn((value: string) => [{ text: value }]),
  createInlineLabelValue: vi.fn((value: string, label: string | undefined) => ({
    text: `${label ?? ''}${label ? ' ' + value : value}`,
  })),
  borderedBox: vi.fn((content) => ({ content })),
}));
vi.mock('./shared/contact', () => ({
  createContact: vi.fn(),
}));

let party: Partial<Party> = {
  Contact: {
    ElectronicMail: { _text: 'fake@email.com' as ListAgencyNameEnum },
    Name: { _text: 'Fake' as ListAgencyNameEnum },
    Telephone: { _text: '999999999' as ListAgencyNameEnum },
  },
  PartyName: [
    {
      Name: { _text: 'Fake name' as ListAgencyNameEnum },
    },
  ],
};

describe(generateAccountingParty.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate supplier', () => {
    generateAccountingParty(party as Party, 'Supplier');

    expect(createPefHeader).toHaveReturned();
    expect(createPEFSubHeader).toHaveBeenCalledWith('Fake name');
    expect(createContact).toHaveBeenCalled();
  });
});
