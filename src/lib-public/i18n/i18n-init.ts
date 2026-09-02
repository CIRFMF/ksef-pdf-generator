import i18next from 'i18next';
import { pl } from './lang/pl';
import { en } from './lang/en';

export const i18nReady: Promise<void> = i18next
  .init({
    lng: 'pl',
    debug: false,
    showSupportNotice: false,
    resources: {
      en: { translation: en },
      pl: { translation: pl },
    },
  })
  .then(() => undefined);
