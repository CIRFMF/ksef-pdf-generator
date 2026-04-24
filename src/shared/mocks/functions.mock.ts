import { beforeAll, vi } from 'vitest';
import { initI18next } from "../../lib-public/i18n/i18n-init";

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

beforeAll(async () => {
  await initI18next();
});