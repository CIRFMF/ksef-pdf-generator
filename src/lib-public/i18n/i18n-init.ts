import i18next from 'i18next';
import pl from './lang/pl.json';
import en from './lang/en.json';

export async function initI18next(): Promise<void> {
  if (!i18next.isInitialized) {
    await i18next.init({
      lng: 'pl',
      debug: true,
      resources: {
        en: { translation: en },
        pl: { translation: pl },
      },
    });
  }
}
