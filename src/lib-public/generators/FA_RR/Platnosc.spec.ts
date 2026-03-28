import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generatePlatnosc } from './Platnosc';
import type { Platnosc, RachunekBankowy } from '../../types/FaRR.types';
import type { Content } from 'pdfmake/interfaces';
import { createHeader, createLabelText } from '../../../shared/PDF-functions';
import { generujRachunekBankowy } from './RachunekBankowy';

vi.mock('../../../shared/PDF-functions', () => ({
  createHeader: vi.fn((text: string): Content[] => [{ text, style: 'header' }]),
  createLabelText: vi.fn((label: string, value: any): Content[] => [{ text: `${label}${value ?? ''}` }]),
  generateLine: vi.fn((): Content[] => [{ line: true } as any]),
  generateTwoColumns: vi.fn((left: any[], right: any[], margins?: number[]): Content[] => [
    { twoColumns: { left, right }, margins } as any,
  ]),
  getTable: vi.fn((data: any): any[] => data ?? []),
  getContentTable: vi.fn(() => ({ content: [{ text: 'mockTable' }] })),
  hasValue: vi.fn((v: any) => !!v),
  getValue: vi.fn((v: any) => !!v),
}));

vi.mock('./RachunekBankowy', () => ({
  generujRachunekBankowy: vi.fn((data: any, label: string): Content[] => [{ text: label }]),
}));
const mockedCreateLabelText = vi.mocked(createLabelText);

describe(generatePlatnosc.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('dodaje informacje o formie zapłaty przelew jezeli istnieje FormaPlatnosci', () => {
    const platnosc: Partial<Platnosc> = { FormaPlatnosci: { _text: 'Przelew' } };
    const result = generatePlatnosc(platnosc as Platnosc);

    expect(createLabelText).toHaveBeenCalledWith('Forma zapłaty: ', 'Przelew');
  });

  it('dodaje informacje o formie zapłaty inna jezeli istnieje PlatnoscInna', () => {
    const platnosc: Partial<Platnosc> = { PlatnoscInna: { _text: '1' }, OpisPlatnosci: { _text: 'opis' } };
    const result = generatePlatnosc(platnosc as Platnosc);

    expect(createLabelText).toHaveBeenCalledWith('Forma zapłaty: ', 'Inna');
  });

  it('dodaje rachunki bankowe', () => {
    const platnosc: Partial<Platnosc> = {
      RachunekBankowy1: ['123'] as RachunekBankowy[],
      RachunekBankowy2: ['456'] as RachunekBankowy[],
    };

    const result: Content = generatePlatnosc(platnosc as Platnosc);

    expect(generujRachunekBankowy).toHaveBeenCalledTimes(2);
    expect(createHeader).toHaveBeenCalledWith('Płatność');
  });

  it('zwraca pustą tablicę jeśli platnosc undefined', () => {
    const result = generatePlatnosc(undefined);

    expect(result).toEqual([]);
  });
});
