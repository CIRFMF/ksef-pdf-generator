import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createContact } from './contact';

import { createInlineLabelValue, createPEFSectionTitle } from '@shared/functions-pef';
import { Contact, ListAgencyNameEnum } from '../../../types/pef-invoice.types';

vi.mock('../../../../shared/PDF-functions', () => ({
  formatText: vi.fn((text: string, style: string) => ({ text, style })),
  getText: vi.fn((data) => data?._text || data),
  hasValue: vi.fn((v) => !!v?._text),
}));
vi.mock('../../../../shared/functions-pef', () => ({
  createPEFSectionTitle: vi.fn((text: string) => ({ text })),
  createInlineLabelValue: vi.fn((value: string, label: string | undefined) => ({
    text: `${label ?? ''}${label ? ' ' + value : value}`,
  })),
}));

describe(createContact.name, () => {
  let contactData: Partial<Contact> = {} as Contact;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("return empty array when don't have data", () => {
    const result = createContact(contactData as Contact);

    expect(result).toEqual([]);
  });

  it('generate contact', () => {
    contactData = {
      ElectronicMail: { _text: 'fake@email.com' as ListAgencyNameEnum },
      Name: { _text: 'Fake' as ListAgencyNameEnum },
      Telephone: { _text: '999999999' as ListAgencyNameEnum },
    };

    createContact(contactData as Contact);

    expect(createPEFSectionTitle).toHaveBeenCalledWith('Kontakt');
    expect(createInlineLabelValue).toHaveBeenCalledWith('Fake', 'Imię i nazwisko', [0, 0, 0, 0]);
    expect(createInlineLabelValue).toHaveBeenCalledWith('999999999', 'Numer telefonu', [0, 0, 0, 0]);
    expect(createInlineLabelValue).toHaveBeenCalledWith('fake@email.com', 'E-mail', [0, 0, 0, 0]);
  });
});
