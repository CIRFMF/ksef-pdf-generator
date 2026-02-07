import type pl from './locales/pl.json';

/**
 * Translation bundle shape (matches locale JSON structure).
 * Add new namespaces here as you add them to pl.json.
 */
export type Translations = typeof pl;

/**
 * Function to get a translated string by dot-notation key (e.g. 'naglowek.invoiceNumber').
 */
export type TFunction = (key: string) => string;

export type Locale = 'pl' | 'en';
