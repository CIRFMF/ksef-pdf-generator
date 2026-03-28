import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generatePodmiot1 } from './Podmiot1';
import type { Podmiot1Class } from '../../types/FaRR.types';
import type { Content } from 'pdfmake/interfaces';
import { createLabelText, formatText } from '../../../shared/PDF-functions';
import { generateAdres } from './Adres';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe';

vi.mock('../../../shared/PDF-functions', () => ({
  createHeader: vi.fn((text: string): Content[] => [{ text, style: 'header' }]),
  createLabelText: vi.fn((label: string, value: any): Content[] => [{ text: `${label}${value ?? ''}` }]),
  formatText: vi.fn((text: string, style?: any): Content => ({ text, style })),
  getValue: vi.fn((val) => val?._text || ''),
  hasValue: vi.fn((val) => Boolean(val && val._text)),
}));

vi.mock('./Adres', () => ({
  generateAdres: vi.fn((adres: any): Content[] => [{ text: 'mockAdres' }]),
}));

vi.mock('./PodmiotDaneIdentyfikacyjneTPodmiot1Dto', () => ({
  generateDaneIdentyfikacyjneTPodmiot1Dto: vi.fn((data: any): Content[] => [
    { text: 'mockDaneIdentyfikacyjne' },
  ]),
}));

vi.mock('./PodmiotDaneKontaktowe', () => ({
  generateDaneKontaktowe: vi.fn((data: any): Content[] => [{ text: 'mockDaneKontaktowe' }]),
}));

describe(generatePodmiot1.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates identification data if present', () => {
    const podmiot: Partial<Podmiot1Class> = {
      DaneIdentyfikacyjne: { NIP: { _text: 'nip' }, Nazwa: { _text: 'Nazwa' } },
    };
    const result = generatePodmiot1(podmiot as Podmiot1Class);

    expect(generateDaneIdentyfikacyjneTPodmiot1Dto).toHaveBeenCalledWith({
      NIP: { _text: 'nip' },
      Nazwa: { _text: 'Nazwa' },
    });
    expect(result.some((c) => (c as any).text === 'mockDaneIdentyfikacyjne')).toBe(true);
  });

  it('generates address and correspondence address', () => {
    const podmiot: Partial<Podmiot1Class> = {
      Adres: { KodKraju: { _text: 'Ulica 1' } },
      AdresKoresp: { KodKraju: { _text: 'Ulica 2' } },
    };
    const result = generatePodmiot1(podmiot as Podmiot1Class);

    expect(generateAdres).toHaveBeenCalledWith({ KodKraju: { _text: 'Ulica 1' } });
    expect(generateAdres).toHaveBeenCalledWith({ KodKraju: { _text: 'Ulica 2' } });
    expect(result.some((c) => (c as any).text === 'mockAdres')).toBe(true);
    expect(formatText).toHaveBeenCalledWith('Adres', ['Label', 'LabelMargin']);
    expect(formatText).toHaveBeenCalledWith('Adres do korespondencji', ['Label', 'LabelMargin']);
  });

  it('generates contact data', () => {
    const podmiot: Partial<Podmiot1Class> = {
      DaneKontaktowe: [{ Telefon: { _text: '123' } }],
    };
    const result = generatePodmiot1(podmiot as Podmiot1Class);

    expect(generateDaneKontaktowe).toHaveBeenCalledWith([{ Telefon: { _text: '123' } }]);
    expect(result.some((c) => (c as any).text === 'mockDaneKontaktowe')).toBe(true);
  });
});
