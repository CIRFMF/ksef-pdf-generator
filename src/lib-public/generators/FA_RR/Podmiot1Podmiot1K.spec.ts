import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Content } from 'pdfmake/interfaces';
import type { Podmiot1Class, Podmiot1KClass } from '../../types/FaRR.types';
import { generatePodmiot1Podmiot1K } from './Podmiot1Podmiot1K';
import { generateAdres } from './Adres';

vi.mock('../../../shared/PDF-functions', () => ({
  createHeader: vi.fn((text: string): Content[] => [{ text, style: 'header' }]),
  createLabelText: vi.fn((label: string, value: any): Content[] => [{ text: `${label}${value ?? ''}` }]),
  getTable: vi.fn((data: any) => data || []),
  formatText: vi.fn((text: string, style?: any): Content => ({ text, style })),
  verticalSpacing: vi.fn((margin: number) => ({ margin })),
  generateColumns: vi.fn((left, right) => ({ columns: [left, right] })),
  hasValue: vi.fn((value: any) => value !== undefined && value !== null),
}));

vi.mock('./Adres', () => ({
  generateAdres: vi.fn((adres: any): Content[] => [{ text: 'mockAddress' }]),
}));

describe(generatePodmiot1Podmiot1K.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates main header and columns', () => {
    const podmiot1: Podmiot1Class = {
      DaneIdentyfikacyjne: {
        NIP: { _text: '1111111' },
        Nazwa: { _text: 'a' },
      },
    };
    const podmiot1K: Podmiot1KClass = {} as any;
    const result: any = generatePodmiot1Podmiot1K(podmiot1, podmiot1K);
    expect(result[0]).toEqual({ text: 'Sprzedawca', style: 'header' });

    expect(result[1]).toHaveProperty('columns');
    expect(Array.isArray(result[1].columns[0])).toBe(true);
    expect(Array.isArray(result[1].columns[1])).toBe(true);
    expect(result[1].columns[0].length).toBeGreaterThan(0);
    expect(result[1].columns[1].length).toBe(0);

    expect(result[2]).toHaveProperty('columns');
    expect(Array.isArray(result[2].columns[0])).toBe(true);
    expect(result[2].columns[0].length).toBeGreaterThan(0);

    expect(result[3]).toEqual({ margin: 1 });
  });

  it('calls generateAdres if AdresKoresp exists', () => {
    const podmiot1: Podmiot1Class = { AdresKoresp: { AdresL1: { _text: 'Ulica Testowa 1' } } };
    const podmiot1K: Podmiot1KClass = {};
    generatePodmiot1Podmiot1K(podmiot1, podmiot1K);
    expect(generateAdres).toHaveBeenCalledWith(podmiot1.AdresKoresp);
  });

  it('handles all fields together', () => {
    const podmiot1: Podmiot1Class = {
      DaneIdentyfikacyjne: { NIP: { _text: '1111111' }, Nazwa: { _text: 'Firma' } },
      DaneKontaktowe: [{ Telefon: { _text: '123' } }],
      StatusInfoPodatnika: { _text: 'active' },
      AdresKoresp: { AdresL1: { _text: 'Ulica Testowa 1' } },
    };
    const podmiot1K: Podmiot1KClass = {
      DaneIdentyfikacyjne: { NIP: { _text: '1111111' }, Nazwa: { _text: 'Firma' } },
    };
    const result: any = generatePodmiot1Podmiot1K(podmiot1, podmiot1K);

    expect(result.length).toBe(4);
    expect(result[0]).toEqual({ text: 'Sprzedawca', style: 'header' });
    expect(result[1].columns[0]).toBeInstanceOf(Array);
    expect(result[1].columns[1]).toBeInstanceOf(Array);
    expect(result[2].columns[0]).toBeInstanceOf(Array);
    expect(result[3]).toEqual({ margin: 1 });
  });
});
