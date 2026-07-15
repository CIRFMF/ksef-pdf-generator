import pdfMake from 'pdfmake/build/pdfmake';
import { TFontDictionary } from 'pdfmake/interfaces';

export interface FontConfig {
  vfs?: Record<string, Base64URLString>;
  fonts?: TFontDictionary;
}

let defaultFontName: string | undefined = undefined;

export function configureFonts(fontConfig: FontConfig): void {
  if (
    fontConfig?.vfs &&
    Object.keys(fontConfig.vfs).length &&
    fontConfig?.fonts &&
    Object.keys(fontConfig.fonts).length
  ) {
    const { vfs, fonts } = fontConfig;

    pdfMake.addVirtualFileSystem(vfs);
    pdfMake.addFonts(fonts);

    defaultFontName = Object.keys(fontConfig.fonts)[0];
  }
}

export function getDefaultFontName(): string | undefined {
  return defaultFontName;
}
