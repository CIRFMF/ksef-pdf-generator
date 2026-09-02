import { beforeEach, describe, it, vi, expect } from 'vitest';
import { generatePayeeParty } from './PayeeParty';
import { createInlineLabelValue, createPefHeader, createPEFSubHeader } from '@shared/functions-pef';
import { EParty, LanguageLocaleIDEnum, ListAgencyNameEnum } from 'src/lib-public/types/pef-invoice.types';

vi.mock('../../../shared/functions-pef', () => ({
  createPefHeader: vi.fn((text: string) => ({ text })),
  createPEFSubHeader: vi.fn((value: string) => [{ text: value }]),
  createInlineLabelValue: vi.fn((value: string, label: string | undefined) => ({
    text: `${label ?? ''}${label ? ' ' + value : value}`,
  })),
  borderedBox: vi.fn((content) => ({ content })),
}));
const party: Partial<EParty> = {
  PartyIdentification: [
    {
      ID: { _text: '11111111111' as LanguageLocaleIDEnum },
    },
  ],
  PartyName: [
    {
      Name: { _text: 'ABC Company' as ListAgencyNameEnum },
    },
  ],
  PartyLegalEntity: [
    {
      CompanyID: { _text: '222222222222' as LanguageLocaleIDEnum },
    },
  ],
};

describe(generatePayeeParty.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate payee party', () => {
    generatePayeeParty(party);

    expect(createPefHeader).toHaveReturned();
    expect(createPEFSubHeader).toHaveBeenCalledWith('ABC Company');
    expect(createInlineLabelValue).toHaveBeenCalled();
    expect(createInlineLabelValue).toHaveBeenCalledWith('11111111111', 'Identyfikator');
    expect(createInlineLabelValue).toHaveBeenCalledWith('222222222222', 'Identyfikator rejestracji prawnej');
  });
});
