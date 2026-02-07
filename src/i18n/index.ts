import pl from './locales/pl.json';
import en from './locales/en.json';
import type { Translations, TFunction, Locale } from './types';

const locales: Record<Locale, Translations> = {
  pl,
  en,
};

const DEFAULT_LOCALE = 'pl';

/** Current locale used by t(). Set via setLocale() before generating PDF. */
let currentLocale: Locale = DEFAULT_LOCALE;

/**
 * Set the active locale for PDF generation. Call this (e.g. from generateInvoice)
 * before running any generators; they will use t() which reads currentLocale.
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/**
 * Get translation for key using the current locale (set by setLocale).
 * Use dot-notation keys, e.g. t('naglowek.invoiceNumber').
 */
export function t(key: string): string {
  const translations = getTranslations(currentLocale);
  const value = key
    .split('.')
    .reduce(
      (obj: unknown, part) =>
        obj != null && typeof obj === 'object' && part in obj
          ? (obj as Record<string, unknown>)[part]
          : undefined,
      translations as unknown
    );

  return typeof value === 'string' ? value : key;
}

/**
 * Get the full translations object for a locale.
 */
export function getTranslations(locale: Locale): Translations {
  return locales[locale] ?? locales[DEFAULT_LOCALE];
}

/** Get a translation function for a specific locale (e.g. for tests). */
export function getT(locale: Locale): TFunction {
  const translations = getTranslations(locale);

  return (key: string): string => {
    const value = key
      .split('.')
      .reduce(
        (obj: unknown, part) =>
          obj != null && typeof obj === 'object' && part in obj
            ? (obj as Record<string, unknown>)[part]
            : undefined,
        translations as unknown
      );

    return typeof value === 'string' ? value : key;
  };
}

export type { Translations, TFunction };
export type { Locale };
export { locales };
