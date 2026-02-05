import { describe, expect, it } from 'vitest';
import { addMarza } from './Wiersze';
import { TRodzajFaktury } from '../../../shared/consts/const';

const getMockFaVat = (mockedObjects?: Record<string, any>) =>
  ({
    NrWierszaFa: { _text: '1' },
    P_7: { _text: 'Product 1' },
    P_9A: { _text: '100' },
    P_8B: { _text: '2' },
    ...mockedObjects,
  }) as any;

describe('shouldAddMarza', () => {
  it('returns P_12 when VAT type and P_12/P_12_XII are empty', () => {
    const result = addMarza(TRodzajFaktury.VAT, true, getMockFaVat());

    expect(result).toEqual({ P_12: { _text: 'marża' } });
  });

  it('returns P_12Z when ZAL type and P_12Z/P_12Z_XII are empty', () => {
    const result = addMarza(TRodzajFaktury.ZAL, true, getMockFaVat());

    expect(result).toEqual({ P_12Z: { _text: 'marża' } });
  });

  it('returns empty object when rodzajFaktury is not a string', () => {
    const result = addMarza(undefined, true, getMockFaVat());

    expect(result).toMatchObject({});
  });

  it('returns empty object when isP_PMarzy is false', () => {
    const mockP_12 = { P_12: { _text: '23' } };
    const result = addMarza(TRodzajFaktury.VAT, false, getMockFaVat(mockP_12));

    expect(result).toMatchObject({});
  });

  it('returns null when P_12 already has value', () => {
    const mockP_12 = { P_12: { _text: '23' } };
    const result = addMarza(TRodzajFaktury.VAT, true, getMockFaVat(mockP_12));

    expect(result).toEqual({});
  });

  it('returns null when rodzajFaktury is not VAT or ZAL type', () => {
    const result = addMarza(TRodzajFaktury.UPR, true, getMockFaVat());

    expect(result).toEqual({});
  });
});
