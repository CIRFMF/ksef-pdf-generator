import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Podmiot1KDaneIdentyfikacyjne, FP } from '../../types/FaRR.types';
import { createLabelText } from '../../../shared/PDF-functions';
import { generateDaneIdentyfikacyjneTPodmiot1Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot1Dto';

vi.mock('../../../shared/PDF-functions', () => ({
  createLabelText: vi.fn((label: string, value: FP) => ({ text: `${label}${value._text}` })),
}));

describe(generateDaneIdentyfikacyjneTPodmiot1Dto.name, () => {
  const mockData: Podmiot1KDaneIdentyfikacyjne = {
    NIP: { _text: '1234567891' },
    Nazwa: { _text: 'Nazwa' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls createLabelText twice with correct arguments', () => {
    const result = generateDaneIdentyfikacyjneTPodmiot1Dto(mockData);
    expect(createLabelText).toHaveBeenCalledTimes(2);
    expect(createLabelText).toHaveBeenCalledWith('NIP: ', mockData.NIP);
    expect(createLabelText).toHaveBeenCalledWith('Nazwa: ', mockData.Nazwa);
    expect(result).toEqual([{ text: 'NIP: 1234567891' }, { text: 'Nazwa: Nazwa' }]);
  });

  it('handles empty values correctly', () => {
    const result = generateDaneIdentyfikacyjneTPodmiot1Dto({
      NIP: { _text: '' },
      Nazwa: { _text: '' },
    } as Podmiot1KDaneIdentyfikacyjne);
    expect(createLabelText).toHaveBeenCalledWith('NIP: ', { _text: '' });
    expect(createLabelText).toHaveBeenCalledWith('Nazwa: ', { _text: '' });
    expect(result).toEqual([{ text: 'NIP: ' }, { text: 'Nazwa: ' }]);
  });
});
