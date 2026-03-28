import { vi } from 'vitest';

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
