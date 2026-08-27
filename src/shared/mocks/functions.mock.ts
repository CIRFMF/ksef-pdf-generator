import { beforeAll, vi } from 'vitest';
import { i18nReady } from '../../lib-public/i18n/i18n-init';

vi.mock('@shared/generators/common/functions.ts', async (importOriginal) => {
  const original = await importOriginal<any>();

  return {
    ...original,
    formatDateTime: vi.fn(original.formatDateTime),
    getDateTimeWithoutSeconds: vi.fn(original.getDateTimeWithoutSeconds),
    formatTime: vi.fn(original.formatTime),
    translateMap: vi.fn(original.translateMap),
  };
});

vi.mock('../PDF-functions', async () => {
  const original = await vi.importActual<typeof import('../PDF-functions')>('../PDF-functions');

  return {
    ...original,
    formatText: vi.fn(original.formatText),
    generateColumns: vi.fn(original.generateColumns),
    generateTwoColumns: vi.fn(original.generateTwoColumns),
    getValue: vi.fn(original.getValue),
    getNumber: vi.fn(original.getNumber),
    createLabelText: vi.fn(original.createLabelText),
    createHeader: vi.fn(original.createHeader),
    createSection: vi.fn(original.createSection),
    generateQRCode: vi.fn(original.generateQRCode),
    verticalSpacing: vi.fn(original.verticalSpacing),
  };
});

beforeAll(async () => {
  await i18nReady;
});
