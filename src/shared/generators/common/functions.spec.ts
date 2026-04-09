import { describe, expect, it, vi } from 'vitest';

import {
  FA1RolaPodmiotu3,
  FA2RolaPodmiotu3,
  FA3RolaPodmiotu3,
  FormaPlatnosci,
  RodzajTransportu,
  TypRachunkowWlasnych,
} from '../../consts/FA.const';
import {
  formatDateTime,
  formatDateTimePl,
  getDateTimeWithoutSeconds,
  translateMap,
} from '@shared/generators/common/functions';

vi.unmock('@shared/generators/common/functions');

describe('translateMap RolaPodmimotu', () => {
  it('returns empty string if rola undefined or _text missing', () => {
    expect(translateMap(undefined, FA1RolaPodmiotu3)).toBe('');
    expect(translateMap({} as any, FA1RolaPodmiotu3)).toBe('');
  });

  it('returns correct string for FA=1', () => {
    const key = Object.keys(FA1RolaPodmiotu3)[0];
    const expected = FA1RolaPodmiotu3[key as keyof typeof FA1RolaPodmiotu3];

    expect(translateMap({ _text: key } as any, FA1RolaPodmiotu3)).toBe(expected);
  });

  it('returns correct string for FA=2', () => {
    const key = Object.keys(FA2RolaPodmiotu3)[0];
    const expected = FA2RolaPodmiotu3[key as keyof typeof FA2RolaPodmiotu3];

    expect(translateMap({ _text: key } as any, FA2RolaPodmiotu3)).toBe(expected);
  });

  it('returns correct string for FA=3', () => {
    const key = Object.keys(FA3RolaPodmiotu3)[0];
    const expected = FA3RolaPodmiotu3[key as keyof typeof FA3RolaPodmiotu3];

    expect(translateMap({ _text: key } as any, FA3RolaPodmiotu3)).toBe(expected);
  });
});

describe('FormaPlatnosci', () => {
  it('returns empty string if undefined or no _text', () => {
    expect(translateMap(undefined, FormaPlatnosci)).toBe('');
  });

  it('returns correct string for known key', () => {
    const key = Object.keys(FormaPlatnosci)[0];
    const expected = FormaPlatnosci[key as keyof typeof FormaPlatnosci];

    expect(translateMap({ _text: key } as any, FormaPlatnosci)).toBe(expected);
  });
});

describe('getRodzajTransportuString', () => {
  it('returns empty string if undefined or no _text', () => {
    expect(translateMap(undefined, RodzajTransportu)).toBe('');
  });

  it('returns correct string for known key', () => {
    const key = Object.keys(RodzajTransportu)[0];
    const expected = RodzajTransportu[key as keyof typeof RodzajTransportu];

    expect(translateMap({ _text: key } as any, RodzajTransportu)).toBe(expected);
  });
});

describe('getTypRachunkowWlasnych', () => {
  it('returns empty string if undefined or no _text', () => {
    expect(translateMap(undefined, TypRachunkowWlasnych)).toBe('');
  });

  it('returns correct string for known key', () => {
    const key = Object.keys(TypRachunkowWlasnych)[0];
    const expected = TypRachunkowWlasnych[key as keyof typeof TypRachunkowWlasnych];

    expect(translateMap({ _text: key } as any, TypRachunkowWlasnych)).toBe(expected);
  });
});

describe('formatDateTime', () => {
  it('returns empty string for empty input', () => {
    expect(formatDateTime('')).toBe('');
    expect(formatDateTime(null as any)).toBe('');
  });

  it('returns input string for invalid date', () => {
    const invalid = 'not-a-date';

    expect(formatDateTime(invalid)).toBe(invalid);
  });

  it('formats date with seconds by default', () => {
    const date = '2025-10-03T12:15:30Z';

    expect(formatDateTime(date)).toBe('03.10.2025 14:15:30');
  });

  it('formats date without seconds if withoutSeconds true', () => {
    const date = '2025-10-03T12:15:30Z';

    expect(formatDateTime(date, true)).toBe('03.10.2025 14:15');
  });
});

describe('getDateTimeWithoutSeconds', () => {
  it('returns empty string if undefined or _text missing', () => {
    expect(getDateTimeWithoutSeconds(undefined)).toBe('');
    expect(getDateTimeWithoutSeconds({} as any)).toBe('');
  });

  it('returns formatted date without seconds if _text present', () => {
    const isoDate = { _text: '2025-10-03T12:15:30Z' } as any;

    expect(getDateTimeWithoutSeconds(isoDate)).toBe('03.10.2025 14:15');
  });
});

describe('formatDateTimePl', () => {
  it('returns a date from a mock string if it might be a date', () => {
    expect(formatDateTimePl('2026-05-02')).toBe('02.05.2026');
  });

  it('returns a date-time from a mock string if it might be a date', () => {
    expect(formatDateTimePl('2026-05-02 14:40', true)).toBe('02.05.2026 14:40');
    expect(formatDateTimePl('2026-03-19T23:31:47.543+01:00', true)).toBe('19.03.2026 23:31');
    expect(formatDateTimePl('2026-03-19T23:31:47.543+01:00', true)).toBe('19.03.2026 23:31');
    expect(formatDateTimePl('2026-03-30T13:46:26.307+02:00', true)).toBe('30.03.2026 13:46');
    expect(formatDateTimePl('2026-03-30T13:46:26.307+02:00', true, true)).toBe('30.03.2026 13:46:26');
    expect(formatDateTimePl('2026-03-30T13:46:26.307+02:00', true, true)).toBe('30.03.2026 13:46:26');
  });

  it('returns empty value for a wrong date', () => {
    expect(formatDateTimePl('ABC', true)).toBe('ABC');
    expect(formatDateTimePl(undefined as any, true)).toBe('');
    expect(formatDateTimePl('', true)).toBe('');
  });
});
