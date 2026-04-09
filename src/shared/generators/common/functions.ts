import { FP as FP2 } from '../../../lib-public/types/fa2.types';

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

  const year: number = dateTime.getFullYear();
  const month: string = (dateTime.getMonth() + 1).toString().padStart(2, '0');
  const day: string = dateTime.getDate().toString().padStart(2, '0');
  const hours: string = dateTime.getHours().toString().padStart(2, '0');
  const minutes: string = dateTime.getMinutes().toString().padStart(2, '0');
  const seconds: string = dateTime.getSeconds().toString().padStart(2, '0');

  if (withoutTime) {
    return `${day}.${month}.${year}`;
  } else if (withoutSeconds) {
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDateTimePl(value: string, withTime?: boolean, withSeconds?: boolean): string {
  const optionsForDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const optionsForTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  const optionsForSeconds: Intl.DateTimeFormatOptions = { second: '2-digit' };

  if (!value) {
    return '';
  }
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    ...optionsForDate,
    ...(withTime && optionsForTime),
    ...(withSeconds && optionsForSeconds),
  })
    .format(date)
    .replace(', ', ' ');
}

export function getDateTimeWithoutSeconds(isoDate?: FP2): string {
  if (!isoDate?._text) {
    return '';
  }
  return formatDateTimePl(isoDate._text, true);
}

export function formatTime(data?: string, withoutSeconds?: boolean): string {
  if (!data) {
    return '';
  }
  const dateTime: Date = new Date(data);

  if (isNaN(dateTime.getTime())) {
    return data;
  }

  const hours: string = dateTime.getHours().toString().padStart(2, '0');
  const minutes: string = dateTime.getMinutes().toString().padStart(2, '0');
  const seconds: string = dateTime.getSeconds().toString().padStart(2, '0');

  if (withoutSeconds) {
    return `${hours}:${minutes}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}
