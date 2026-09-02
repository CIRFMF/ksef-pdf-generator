import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Party, ReceiverParty } from 'src/lib-public/types/pef.types';
import { createPefHeader, createPEFSubHeader } from '@shared/functions-pef';
import { createContact } from './shared/contact';
import { generateReceiverParty } from './ReceiverParty';

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
    ElectronicMail: 'fake@email.com',
    Name: 'Fake',
    Telephone: '999999999',
  },
  PartyName: {
    Name: 'Fake name',
  },
};

describe(generateReceiverParty.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate supplier', () => {
    generateReceiverParty({ Party: party } as ReceiverParty);

    expect(createPefHeader).toHaveReturned();
    expect(createPEFSubHeader).toHaveBeenCalledWith('Fake name');
    expect(createContact).toHaveBeenCalled();
  });
});