import { describe, it, expect, vi, beforeEach, test } from 'vitest';
import { generateDodatkoweInformacje } from './DodatkoweInformacje';

vi.mock('../../../shared/PDF-functions', () => ({
  createHeader: vi.fn((text: string) => [{ text, style: 'header' }]),
  createSection: vi.fn((content: any, bordered: boolean) => [{ section: content, bordered }]),
  createSubHeader: vi.fn((text: string) => [{ text, style: 'subheader' }]),
  formatText: vi.fn((text: string) => ({ text, style: 'value' })),
  getValue: vi.fn((obj: any) => obj?._text ?? obj ?? ''),
  getTable: vi.fn((data: any) => data ?? []),
  getContentTable: vi.fn(() => ({ content: { text: 'mockTable' } })),
}));

import {
  createSection,
  createSubHeader,
  formatText,
  getTable,
  getContentTable,
} from '../../../shared/PDF-functions';

describe(generateDodatkoweInformacje.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dodaje dodatkowy opis jeśli istnieje DodatkowyOpis', () => {
    (getTable as any).mockReturnValueOnce([
      { NrWiersza: { _text: '1' }, Klucz: { _text: 'Info' }, Wartosc: { _text: 'Opis' } },
    ]);

    const faVat = {
      DodatkowyOpis: [{ NrWiersza: { _text: '1' }, Klucz: { _text: 'Info' }, Wartosc: { _text: 'Opis' } }],
    };

    const result = generateDodatkoweInformacje(faVat as any);

    expect(createSubHeader).toHaveBeenCalledWith('Dodatkowy opis');
    expect(getContentTable).toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
    expect(createSection).toHaveBeenCalled();
  });

  it('dodaje dokumenty zapłaty jeśli istnieje DokumentZaplaty', () => {
    (getTable as any).mockReturnValueOnce([
      { NrDokumentu: { _text: '1' }, DataDokumentu: { _text: '2031-10-15' } },
    ]);

    const faVat = {
      DokumentZaplaty: [{ NrDokumentu: { _text: '1' }, DataDokumentu: { _text: '2031-10-15' } }],
    };

    const result = generateDodatkoweInformacje(faVat as any);
    expect(createSubHeader).toHaveBeenCalledWith('Dokumenty Zapłaty', [0, 0, 0, 4]);
    expect(getContentTable).toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
    expect(createSection).toHaveBeenCalled();
  });

  it('zwraca pustą tablicę gdy brak danych wejściowych', () => {
    const result = generateDodatkoweInformacje({} as any);
    expect(result).toEqual([]);
  });
});
