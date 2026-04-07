import { FP as FP2 } from '../../../lib-public/types/fa2.types';

/** Polish civil time for PDF; avoids Date#getHours() which follows process TZ (e.g. UTC in Docker). */
const DISPLAY_TZ = 'Europe/Warsaw';

function getWarsawDateOnly(date: Date): { day: string; month: string; year: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DISPLAY_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const m: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') {
      m[p.type] = p.value;
    }
  }
  return { day: m.day ?? '', month: m.month ?? '', year: m.year ?? '' };
}

function getWarsawParts(date: Date, includeSeconds: boolean): Record<string, string> {
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: DISPLAY_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    ...(includeSeconds ? { second: '2-digit' } : {}),
  };
  const parts = new Intl.DateTimeFormat('en-GB', opts).formatToParts(date);
  const m: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') {
      m[p.type] = p.value;
    }
  }
  return m;
}

export function translateMap(value: FP2 | string | undefined, map: Record<string, string>): string {
  let valueToTranslate = typeof value === 'string' ? value : value?._text;

  valueToTranslate = valueToTranslate?.trim();
  if (!valueToTranslate || !map[valueToTranslate]) {
    return '';
  }
  return map[valueToTranslate];
}

export function formatDateTime(data?: string, withoutSeconds?: boolean, withoutTime?: boolean): string {
  if (!data) {
    return '';
  }
  const dateTime: Date = new Date(data);

  if (isNaN(dateTime.getTime())) {
    return data;
  }

  if (withoutTime) {
    const { day, month, year } = getWarsawDateOnly(dateTime);
    return `${day}.${month}.${year}`;
  }

  const withSec = !withoutSeconds;
  const p = getWarsawParts(dateTime, withSec);
  const { day, month, year, hour, minute, second } = p;

  if (withoutSeconds) {
    return `${day}.${month}.${year} ${hour}:${minute}`;
  }
  return `${day}.${month}.${year} ${hour}:${minute}:${second ?? '00'}`;
}

export function getDateTimeWithoutSeconds(isoDate?: FP2): string {
  if (!isoDate?._text) {
    return '';
  }
  return formatDateTime(isoDate._text, true);
}

export function formatTime(data?: string, withoutSeconds?: boolean): string {
  if (!data) {
    return '';
  }
  const dateTime: Date = new Date(data);

  if (isNaN(dateTime.getTime())) {
    return data;
  }

  const withSec = !withoutSeconds;
  const p = getWarsawParts(dateTime, withSec);
  const hour = p.hour ?? '';
  const minute = p.minute ?? '';
  const second = p.second ?? '00';

  if (withoutSeconds) {
    return `${hour}:${minute}`;
  }
  return `${hour}:${minute}:${second}`;
}
