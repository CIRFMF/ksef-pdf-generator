import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Content } from 'pdfmake/interfaces';
import { Adres, Podmiot1Class, Podmiot1KClass } from '../../types/FaRR.types';
import { generateAdres } from './Adres';
import { generatePodmiot2Podmiot2K } from './Podmiot2Podmiot2k';
import { generatePodmiot2 } from './Podmiot2';
import { generatePodmiot1Podmiot1K } from './Podmiot1Podmiot1K';

vi.mock('../../../shared/PDF-functions', () => ({
  createHeader: vi.fn((text: string): Content[] => [{ text, style: 'header' }]),
  createLabelText: vi.fn((label: string, value: any): Content[] => [{ text: `${label}${value ?? ''}` }]),
  formatText: vi.fn((text: string, style?: any): Content => ({ text, style })),
  getTable: vi.fn((data: any) => data || []),
  hasValue: vi.fn((value: any) => value !== undefined && value !== null),
  verticalSpacing: vi.fn((margin: number) => ({ margin })),
  generateColumns: vi.fn((left, right) => ({ columns: [left, right] })),
}));

vi.mock('./Adres', () => ({
  generateAdres: vi.fn((adres: any): Content[] => [{ text: 'mockAddress' }]),
}));

vi.mock('./PodmiotDaneIdentyfikacyjneTPodmiot2Dto', () => ({
  generateDaneIdentyfikacyjneTPodmiot2Dto: vi.fn((data: any): Content[] => [
    { text: 'mockDaneIdentyfikacyjne' },
  ]),
}));

vi.mock('./PodmiotDaneKontaktowe', () => ({
  generateDaneKontaktowe: vi.fn((data: any): Content[] => [{ text: 'mockDaneKontaktowe' }]),
}));

describe(generatePodmiot2Podmiot2K.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates main header and columns', () => {
    const podmiot2: Podmiot1Class = {
      DaneIdentyfikacyjne: {
        NIP: { _text: '1111111' },
        Nazwa: { _text: 'a' },
      },
    };
    const podmiot2K: Podmiot1KClass = {};
    const result: any = generatePodmiot2Podmiot2K(podmiot2, podmiot2K);
    expect(result[0]).toEqual({ text: 'Nabywca', style: 'header' });

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
    const podmiot2: Podmiot1Class = { AdresKoresp: { AdresL1: { _text: 'Ulica Testowa 1' } } };
    const podmiot2K: Podmiot1KClass = {};
    const result = generatePodmiot2(podmiot2);

    generatePodmiot2Podmiot2K(podmiot2, podmiot2K);
    expect(generateAdres).toHaveBeenCalledWith(podmiot2.AdresKoresp);
  });

  it('generates corrected content columns', () => {
    const podmiot2: Podmiot1Class = {
      DaneIdentyfikacyjne: {
        NIP: { _text: '1111111' },
        Nazwa: { _text: 'a' },
      },
      Adres: { AdresL1: { _text: 'Ulica Testowa 2' } },
    };
    const podmiot2K: Podmiot1KClass = {
      Adres: { AdresL1: { _text: 'Ulica Testowa 1' } },
    };
    const result = generatePodmiot2Podmiot2K(podmiot2, podmiot2K) as any;

    expect(Array.isArray(result[2].columns[0])).toBe(true);
    expect(result[2].columns[0].length).toBeGreaterThanOrEqual(0);
  });

  it('adds vertical spacing at the end', () => {
    const podmiot2: Podmiot1Class = {
      DaneIdentyfikacyjne: {
        NIP: { _text: '1111111' },
        Nazwa: { _text: 'a' },
      },
    };
    const podmiot2K: Podmiot1KClass = {};
    const result = generatePodmiot2Podmiot2K(podmiot2, podmiot2K);

    expect(result[result.length - 1]).toEqual({ margin: 1 });
  });

  it('handles all fields together', () => {
    const podmiot2: Podmiot1Class = {
      DaneIdentyfikacyjne: { NIP: { _text: '1111111' } },
      DaneKontaktowe: [{ Telefon: { _text: '123' } }],
      Adres: { AdresL1: { _text: 'Ulica Testowa 1' } },
    };
    const podmiot2K: Podmiot1KClass = { Adres: { AdresL1: { _text: 'Ulica Testowa 2' } } };
    const result = generatePodmiot2Podmiot2K(podmiot2, podmiot2K) as any;

    expect(result.length).toBeGreaterThan(3);
    expect(result[0]).toEqual({ text: 'Nabywca', style: 'header' });

    expect(result[2]).toHaveProperty('columns');
    expect(Array.isArray(result[2].columns[0])).toBe(true);
    expect(Array.isArray(result[2].columns[1])).toBe(false);
    expect(result[2].columns[0].length).toBeGreaterThanOrEqual(0);
    expect(result[result.length - 1]).toHaveProperty('margin');
  });
});
