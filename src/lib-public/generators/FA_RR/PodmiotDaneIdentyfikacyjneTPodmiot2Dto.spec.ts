import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createLabelText } from '../../../shared/PDF-functions';
import { generateDaneIdentyfikacyjneTPodmiot2Dto } from './PodmiotDaneIdentyfikacyjneTPodmiot2Dto';
import { Podmiot1KDaneIdentyfikacyjne } from '../../types/FaRR.types';

vi.mock('../../../shared/PDF-functions', () => ({
  createLabelText: vi.fn((label: string, value: any) => ({ text: `${label}${value?._text ?? value}` })),
}));

describe(generateDaneIdentyfikacyjneTPodmiot2Dto.name, () => {
  const baseData: Podmiot1KDaneIdentyfikacyjne = {
    NIP: { _text: '1234567890' },
    Nazwa: { _text: 'Test Company' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('always includes NIP and Nazwa', () => {
    const result = generateDaneIdentyfikacyjneTPodmiot2Dto(baseData);
    expect(createLabelText).toHaveBeenCalledWith('NIP: ', baseData.NIP);
    expect(createLabelText).toHaveBeenCalledWith('Nazwa: ', baseData.Nazwa);
    expect(result).toContainEqual({ text: 'NIP: 1234567890' });
    expect(result).toContainEqual({ text: 'Nazwa: Test Company' });
  });
});
