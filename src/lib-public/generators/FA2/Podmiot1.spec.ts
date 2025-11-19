import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generatePodmiot1 } from './Podmiot1.js';
import type { Podmiot1 } from '../../types/fa2.types';
import type { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText, formatText } from '../../../shared/PDF-functions.js';
import { generateAdres } from './Adres.js';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto.js';
import { generateDaneKontaktowe } from './PodmiotDaneKontaktowe.js';

vi.mock('../../../shared/PDF-functions', () => ({
  createHeader: vi.fn((text: string): Content[] => [{ text, style: 'header' }]),
  createLabelText: vi.fn((label: string, value: any): Content[] => [{ text: `${label}${value ?? ''}` }]),
  formatText: vi.fn((text: string, style?: any): Content => ({ text, style })),
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

describe(generatePodmiot1.name, (): void => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates basic seller data', (): void => {
    const podmiot: Partial<Podmiot1> = {
      NrEORI: 'EORI123' as any,
      PrefiksPodatnika: 'PL' as any,
    };
    const result: Content[] = generatePodmiot1(podmiot as Podmiot1);

    expect(createHeader).toHaveBeenCalledWith('Sprzedawca');
    expect(createLabelText).toHaveBeenCalledWith('NrEORI: ', 'EORI123');
    expect(createLabelText).toHaveBeenCalledWith('Prefiks VAT: ', 'PL');
    expect((result as any[]).some((c) => c?.[0]?.text.includes('EORI123'))).toBe(true);
  });

  it('generates identification data if present', (): void => {
    const podmiot: Partial<Podmiot1> = {
      DaneIdentyfikacyjne: { NIP: { _text: 'nip' }, Nazwa: { _text: 'Nazwa' } },
    };
    const result: Content[] = generatePodmiot1(podmiot as Podmiot1);

    expect(generateDaneIdentyfikacyjneTPodmiot1Dto).toHaveBeenCalledWith({
      NIP: { _text: 'nip' },
      Nazwa: { _text: 'Nazwa' },
    });
    expect(result.some((c: Content): boolean => (c as any).text === 'mockDaneIdentyfikacyjne')).toBe(true);
  });

  it('generates address and correspondence address', (): void => {
    const podmiot: Partial<Podmiot1> = {
      Adres: { KodKraju: { _text: 'Ulica 1' } },
      AdresKoresp: { KodKraju: { _text: 'Ulica 2' } },
    };
    const result: Content[] = generatePodmiot1(podmiot as Podmiot1);

    expect(generateAdres).toHaveBeenCalledWith({ KodKraju: { _text: 'Ulica 1' } });
    expect(generateAdres).toHaveBeenCalledWith({ KodKraju: { _text: 'Ulica 2' } });
    expect(result.some((c) => (c as any).text === 'mockAdres')).toBe(true);
    expect(formatText).toHaveBeenCalledWith('Adres', ['Label', 'LabelMargin']);
    expect(formatText).toHaveBeenCalledWith('Adres do korespondencji', ['Label', 'LabelMargin']);
  });

  it('generates contact data and taxpayer status', (): void => {
    const podmiot: Partial<Podmiot1> = {
      DaneKontaktowe: [{ Telefon: { _text: '123' } }],
      StatusInfoPodatnika: { _text: 'active' },
    };
    const result = generatePodmiot1(podmiot as Podmiot1);

    expect(generateDaneKontaktowe).toHaveBeenCalledWith([{ Telefon: { _text: '123' } }]);
    expect(createLabelText).toHaveBeenCalledWith('Status podatnika: ', { _text: 'active' });
    expect(result.some((c: Content): boolean => (c as any).text === 'mockDaneKontaktowe')).toBe(true);
  });

  it('generates only taxpayer status if no contact data', () => {
    const podmiot: Partial<Podmiot1> = {
      StatusInfoPodatnika: { _text: 'inactive' },
    };

    const result: Content[] = generatePodmiot1(podmiot as Podmiot1);

    expect(generateDaneKontaktowe).not.toHaveBeenCalled();
    expect(createLabelText).toHaveBeenCalledWith(
      expect.stringContaining('Status podatnika'),
      expect.objectContaining({ _text: 'inactive' })
    );
  });
});
