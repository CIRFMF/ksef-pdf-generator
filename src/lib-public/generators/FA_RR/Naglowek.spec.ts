import { describe, expect, it } from 'vitest';
import { TRodzajFaktury } from '../../../shared/consts/FA.const';
import { FakturaRR } from '../../types/FaRR.types';
import { generateNaglowek } from './Naglowek';

describe('generateNaglowek', () => {
  it('generates header for correction invoice VAT RR', () => {
    const fa: FakturaRR = {
      RodzajFaktury: { _text: TRodzajFaktury.KOR_VAT_RR },
    } as any;

    const result = generateNaglowek(fa);

    expect(
      result.some(
        (c) =>
          typeof c === 'object' &&
          c !== null &&
          'text' in c &&
          typeof (c as any).text === 'string' &&
          (c as any).text.includes('Faktura korygująca VAT RR')
      )
    ).toBe(true);
  });

  it('generates header with empty string for unknown invoice type', () => {
    const fa: FakturaRR = {
      RodzajFaktury: { _text: 'UNKNOWN' },
    } as any;

    const result = generateNaglowek(fa);

    expect(
      result.some(
        (c) =>
          typeof c === 'object' &&
          c !== null &&
          'text' in c &&
          typeof (c as any).text === 'string' &&
          (c as any).text.includes('')
      )
    ).toBe(true);
  });

  it('generates header even when fa is undefined', () => {
    const result = generateNaglowek();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
