import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Content } from 'pdfmake/interfaces';
import type { Podmiot1Class } from '../../types/FaRR.types';
import { generatePodmiot2 } from './Podmiot2';
import { createHeader, formatText } from '../../../shared/PDF-functions';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';

vi.mock('../../../shared/PDF-functions', () => ({
  createHeader: vi.fn((text: string): Content[] => [{ text, style: 'header' } as Content]),
  createLabelText: vi.fn((label: string, value: any): Content[] => [
    { text: `${label}${value ?? ''}` } as Content,
  ]),
  formatText: vi.fn((text: any, style?: any): Content => ({ text: String(text), style }) as Content),
  getTable: vi.fn((data: any) => (data ? (Array.isArray(data) ? data : [data]) : [])),
  hasValue: vi.fn((val) => Boolean(val && val._text)),
}));

vi.mock('./Adres', async () => {
  const actual = await vi.importActual('./Adres');

  return {
    ...actual,
    generateAdres: vi.fn((): Content[] => [{ text: 'mockAddress' } as Content]),
  };
});

vi.mock('./PodmiotDaneIdentyfikacyjneTPodmiot2Dto', async () => {
  const actual = await vi.importActual('./PodmiotDaneIdentyfikacyjneTPodmiot2Dto');

  return {
    ...actual,
    generateDaneIdentyfikacyjneTPodmiot2Dto: vi.fn((): Content[] => [
      { text: 'mockDaneIdentyfikacyjne' } as Content,
    ]),
  };
});

vi.mock('./PodmiotDaneKontaktowe', async () => {
  const actual = await vi.importActual('./PodmiotDaneKontaktowe');

  return {
    ...actual,
    generateDaneKontaktowe: vi.fn((): Content[] => [{ text: 'mockDaneKontaktowe' } as Content]),
  };
});

describe(generatePodmiot2.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates basic header and identifiers', () => {
    const podmiot: Partial<Podmiot1Class> = {
      DaneIdentyfikacyjne: { NIP: { _text: 'nip' }, Nazwa: { _text: 'Nazwa' } },
    };
    const result = generatePodmiot2(podmiot as Podmiot1Class);

    expect(createHeader).toHaveBeenCalledWith('Nabywca');
    expect(generateDaneIdentyfikacyjneTPodmiot2Dto).toHaveBeenCalledWith({
      NIP: { _text: 'nip' },
      Nazwa: { _text: 'Nazwa' },
    });
    expect(result.some((c) => (c as any).text === 'mockDaneIdentyfikacyjne')).toBe(true);
    expect(result[0]).toEqual({ text: 'Nabywca', style: 'header' });
  });

  it('generates identification data if provided', () => {
    const podmiot: Partial<Podmiot1Class> = {
      DaneIdentyfikacyjne: { NIP: { _text: 'nip' }, Nazwa: { _text: 'Nazwa' } },
    };
    const result = generatePodmiot2(podmiot as Podmiot1Class);

    expect(generateDaneIdentyfikacyjneTPodmiot2Dto).toHaveBeenCalledWith(podmiot.DaneIdentyfikacyjne);
    expect(result.some((c: any) => c.text === 'mockDaneIdentyfikacyjne')).toBe(true);
  });

  it('generates address and correspondence address', () => {
    const podmiot: Partial<Podmiot1Class> = {
      Adres: { KodKraju: { _text: 'PL' } },
      AdresKoresp: { KodKraju: { _text: 'PL-K' } },
    };
    const result = generatePodmiot2(podmiot as Podmiot1Class);

    expect(generateAdres).toHaveBeenCalledWith(podmiot.Adres);
    expect(generateAdres).toHaveBeenCalledWith(podmiot.AdresKoresp);
    expect(formatText).toHaveBeenCalledWith('Adres', ['Label', 'LabelMargin']);
    expect(formatText).toHaveBeenCalledWith('Adres do korespondencji', ['Label', 'LabelMargin']);
    expect(result.some((c: any) => c.text === 'mockAddress')).toBe(true);
  });

  it('generates contact data', () => {
    const podmiot: Partial<Podmiot1Class> = {
      DaneKontaktowe: [{ Telefon: { _text: '123' } }],
    };
    const result = generatePodmiot2(podmiot as Podmiot1Class);

    expect(generateDaneKontaktowe).toHaveBeenCalledWith(podmiot.DaneKontaktowe);
    expect(result.some((c: any) => c.text === 'mockDaneKontaktowe')).toBe(true);
  });
});
