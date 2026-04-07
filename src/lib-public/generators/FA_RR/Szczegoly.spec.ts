import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateSzczegoly } from './Szczegoly';
import * as PDFFunctions from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { TRodzajFaktury } from '../../../shared/consts/FA.const';
import { FakturaRR } from '../../types/FaRR.types';

vi.mock('../../../shared/PDF-functions', () => ({
  createHeader: vi.fn(),
  createLabelText: vi.fn(),
  createLabelTextArray: vi.fn(),
  createSection: vi.fn(),
  generateTwoColumns: vi.fn(),
  getContentTable: vi.fn(),
  getDifferentColumnsValue: vi.fn(),
  getTable: vi.fn(),
  getValue: vi.fn(),
  hasColumnsValue: vi.fn(),
  hasValue: vi.fn(),
}));

describe(generateSzczegoly.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFaVat: FakturaRR = {
    P_4B: { _text: '2024-01-01' },
    P_1M: { _text: 'Warsaw' },
    P_4A: { _text: '2024-01-15' },
    KodWaluty: { _text: 'PLN' },
  };

  beforeEach(() => {
    vi.mocked(PDFFunctions.getTable).mockReturnValue([]);
    vi.mocked(PDFFunctions.createHeader).mockReturnValue(['header'] as any);
    vi.mocked(PDFFunctions.createLabelText).mockReturnValue('label' as any);
    vi.mocked(PDFFunctions.createLabelTextArray).mockReturnValue('labelArray' as any);
    vi.mocked(PDFFunctions.createSection).mockReturnValue('section' as any);
    vi.mocked(PDFFunctions.generateTwoColumns).mockReturnValue('columns' as any);
    vi.mocked(PDFFunctions.getContentTable).mockReturnValue({
      content: null,
      fieldsWithValue: [],
    });
    vi.mocked(PDFFunctions.getDifferentColumnsValue).mockReturnValue([]);
    vi.mocked(PDFFunctions.getValue).mockReturnValue('PLN');
    vi.mocked(PDFFunctions.hasColumnsValue).mockReturnValue(false);
    vi.mocked(PDFFunctions.hasValue).mockReturnValue(false);
  });

  it('should call createHeader with "Szczegóły"', () => {
    generateSzczegoly(mockFaVat);

    expect(PDFFunctions.createHeader).toHaveBeenCalledWith('Szczegóły');
  });

  it('should call createSection and return result', () => {
    const mockSection = 'section';
    vi.mocked(PDFFunctions.createSection).mockReturnValue(mockSection as any);

    const result = generateSzczegoly(mockFaVat);

    expect(PDFFunctions.createSection).toHaveBeenCalledWith(expect.any(Array), true);
    expect(result).toEqual(mockSection);
  });

  describe('standard labels', () => {
    it('should add data wystawienia label', () => {
      generateSzczegoly(mockFaVat);

      expect(PDFFunctions.createLabelText).toHaveBeenCalledWith(
        'Data wystawienia: ',
        mockFaVat.P_4B,
        FormatTyp.Date
      );
    });

    it('should add miejsce wystawienia label', () => {
      generateSzczegoly(mockFaVat);

      expect(PDFFunctions.createLabelText).toHaveBeenCalledWith('Miejsce wystawienia: ', mockFaVat.P_1M);
    });

    it('should add data dokonania nabycia label', () => {
      generateSzczegoly(mockFaVat);

      expect(PDFFunctions.createLabelText).toHaveBeenCalledWith(
        'Data dokonania nabycia: ',
        mockFaVat.P_4A,
        FormatTyp.Date
      );
    });
  });

  describe('columns generation', () => {
    it('should call generateTwoColumns', () => {
      generateSzczegoly(mockFaVat);

      expect(PDFFunctions.generateTwoColumns).toHaveBeenCalledWith(expect.any(Array), expect.any(Array));
    });

    it('should distribute labels between two columns', () => {
      generateSzczegoly(mockFaVat);

      const calls = vi.mocked(PDFFunctions.generateTwoColumns).mock.calls;
      expect(calls.length).toBeGreaterThanOrEqual(1);

      const firstCall = calls[0];
      expect(Array.isArray(firstCall[0])).toBe(true);
      expect(Array.isArray(firstCall[1])).toBe(true);
    });
  });
});
