import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createAddress } from './address';

import { createInlineLabelValue, createPEFSectionTitle } from '@shared/functions-pef';
import { ListAgencyNameEnum, PartyPostalAddress } from 'src/lib-public/types/pef-invoice.types';
import { getTable } from '@shared/PDF-functions';

vi.mock('../../../../shared/PDF-functions', () => ({
  formatText: vi.fn((text: string, style: string) => ({ text, style })),
  getText: vi.fn((data) => data?._text || data),
  hasValue: vi.fn((v) => !!v?._text),
  getTable: vi.fn(() => []),
}));
vi.mock('../../../../shared/functions-pef', () => ({
  createPEFSectionTitle: vi.fn((text: string) => ({ text })),
  createInlineLabelValue: vi.fn((value: string, label: string | undefined) => ({
    text: `${label ?? ''}${label ? ' ' + value : value}`,
  })),
}));

describe(createAddress.name, () => {
  let addressData: Partial<PartyPostalAddress> = {};

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("return empty array when don't have data", () => {
    const result = createAddress();

    expect(result).toEqual([]);
  });

  it('generate address', () => {
    addressData = {
      StreetName: { _text: 'street name' as ListAgencyNameEnum },
      AdditionalStreetName: { _text: 'additional StreetName' as ListAgencyNameEnum },
      PostalZone: { _text: 'zone' as ListAgencyNameEnum },
    };

    createAddress(addressData);

    expect(createPEFSectionTitle).toHaveBeenCalledWith('Adres');
    expect(createInlineLabelValue).toHaveBeenCalledWith(
      'street name additional StreetName',
      undefined,
      undefined
    );
    expect(createInlineLabelValue).toHaveBeenCalledWith('zone', undefined, [0, 0, 0, 0]);
  });
});
