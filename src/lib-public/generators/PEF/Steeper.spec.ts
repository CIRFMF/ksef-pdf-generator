import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateFooter } from './Steeper';

import { formatText } from '@shared/PDF-functions';
import { AdditionalDataTypes } from '../../types/common.types';
import { CustomizationID } from '../../types/pef-invoice.types';

vi.mock('../../../../shared/PDF-functions', () => ({
  formatText: vi.fn(),
  getText: vi.fn((v) => v?._text || v),
}));

let steeper = {
  CustomizationID: { _text: '123' },
};

let additionalData: Partial<AdditionalDataTypes> = {
  nrKSeF: '123',
};

describe(generateFooter.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate stepper', () => {
    generateFooter(additionalData as AdditionalDataTypes, steeper.CustomizationID as CustomizationID);

    expect(formatText).toHaveBeenCalledWith('Wersja komunikatu', 'PEFInlineLabel');
    expect(formatText).toHaveBeenCalledWith('123', 'Value');
    expect(formatText).toHaveBeenCalledWith(
      'Ten dokument został wygenerowany na podstawie wizualizacji PEF.v_1.4.37.02',
      'Value'
    );
  });
});
