import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generatePodmioty } from './Podmioty';
import { createSection } from '../../../shared/PDF-functions';
import { generatePodmiot1Podmiot1K } from './Podmiot1Podmiot1K';
import { generatePodmiot2Podmiot2K } from './Podmiot2Podmiot2k';
import { generatePodmiot3 } from './Podmiot3';
import { FaRR } from '../../types/FaRR.types';
import { generatePodmiot1 } from './Podmiot1';
import { generatePodmiot2 } from './Podmiot2';

vi.mock('../../../shared/PDF-functions', () => ({
  createSection: vi.fn((content: any, flag: boolean) => ({ content, flag })),
  getTable: vi.fn((data: any) => data || []),
  getValue: vi.fn((val: any) => val?._text ?? val),
  generateColumns: vi.fn((left, right) => ({ columns: [left, right] })),
}));

vi.mock('./Podmiot1', () => ({
  generatePodmiot1: vi.fn((data: any) => ({ text: 'Podmiot1 content' })),
}));

vi.mock('./Podmiot1Podmiot1K', () => ({
  generatePodmiot1Podmiot1K: vi.fn((podmiot1: any, podmiot1K: any) => ({ text: 'Podmiot1K content' })),
}));

vi.mock('./Podmiot2', () => ({
  generatePodmiot2: vi.fn((data: any) => ({ text: 'Podmiot2 content' })),
}));

vi.mock('./Podmiot2Podmiot2k', () => ({
  generatePodmiot2Podmiot2K: vi.fn((podmiot2: any, podmiot2K: any) => ({ text: 'Podmiot2K content' })),
}));

vi.mock('./Podmiot3', () => ({
  generatePodmiot3: vi.fn((data: any, idx: number) => ({ text: `Podmiot3 content ${idx}` })),
}));

describe(generatePodmioty.name, () => {
  const baseInvoice: FaRR = {
    FakturaRR: {
      Podmiot1K: { DaneIdentyfikacyjne: {} },
      Podmiot2K: { DaneIdentyfikacyjne: {} },
    },
    Podmiot1: { DaneIdentyfikacyjne: {} },
    Podmiot2: { DaneIdentyfikacyjne: {} },
    Podmiot3: [{ Rola: { _text: '4' } }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates section with all podmioty when Podmiot1K and Podmiot2K are present', () => {
    const result = generatePodmioty(baseInvoice) as any;
    const content = result.content;

    expect(generatePodmiot1Podmiot1K).toHaveBeenCalledWith(
      baseInvoice.Podmiot1,
      baseInvoice.FakturaRR?.Podmiot1K
    );
    expect(generatePodmiot2Podmiot2K).toHaveBeenCalledWith(
      baseInvoice.Podmiot2,
      baseInvoice.FakturaRR?.Podmiot2K
    );
    expect(generatePodmiot3).toHaveBeenCalled();
    expect(createSection).toHaveBeenCalled();
    expect(result.flag).toBe(true);
    expect(content).toHaveLength(3);
    expect(content[0]).toEqual({ text: 'Podmiot1K content' });
    expect(content[1]).toEqual({ text: 'Podmiot2K content' });
    expect(content[2]).toEqual({ text: 'Podmiot3 content 0' });
  });

  it('calls generatePodmiot1 and generatePodmiot2 when no Podmiot1K and Podmiot2K', () => {
    const invoice: FaRR = { Podmiot1: {}, Podmiot2: {} } as any;
    const result = generatePodmioty(invoice) as any;

    expect(generatePodmiot1).toHaveBeenCalledWith(invoice.Podmiot1);
    expect(generatePodmiot2).toHaveBeenCalledWith(invoice.Podmiot2);
    expect(result.flag).toBe(true);
    expect(result.content[0].length).toBeGreaterThan(0);
  });
});
