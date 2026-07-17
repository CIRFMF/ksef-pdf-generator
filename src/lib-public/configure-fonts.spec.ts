import { beforeEach, describe, expect, it, vi } from 'vitest';
import pdfmake from 'pdfmake/build/pdfmake';
import { configureFonts, getDefaultFontName } from './configure-fonts';

vi.mock('pdfmake/build/pdfmake', () => ({
  default: {
    addVirtualFileSystem: vi.fn(),
    addFonts: vi.fn(),
  },
}));

let config = {
  vfs: {
    'Roboto-Regular.tts': 'base64-font',
  },

  fonts: {
    Roboto: {
      normal: 'Roboto-Regular.tts',
    },
  },
};

describe('font configuration', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
  });
  it('should register fonts in pdfMake', () => {
    configureFonts(config);

    expect(pdfmake.addVirtualFileSystem).toHaveBeenCalledWith(config.vfs);
    expect(pdfmake.addFonts).toHaveBeenCalledWith(config.fonts);
  });

  it('should not register fonts when configuration is empty', () => {
    configureFonts({});

    expect(pdfmake.addVirtualFileSystem).not.toHaveBeenCalled();
    expect(pdfmake.addFonts).not.toHaveBeenCalled();
  });

  it('should get font name if register fonts in configuration', () => {
    configureFonts(config);

    expect(getDefaultFontName()).toBe('Roboto');
  });

  it('shuld get undefined font name if cnfiguration is wrong or empty', async () => {
    const { getDefaultFontName } = await import('./configure-fonts');
    configureFonts({});

    expect(getDefaultFontName()).toBeUndefined();
  });
});
