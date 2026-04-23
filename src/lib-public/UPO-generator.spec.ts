import pdfMake from 'pdfmake/build/pdfmake';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateUPO } from './UPO-generator';

describe('generateUPO', () => {
  const dummyUpo = {
    Potwierdzenie: {
      field1: 'value1',
      field2: 'value2',
      NazwaPodmiotuPrzyjmujacego: 'nazwa',
    },
  };

  beforeEach(() => {
    vi.spyOn(pdfMake, 'createPdf').mockImplementation(
      () =>
        ({
          getBlob: (callback: (blob: Blob | null) => void) => {
            const blob = new Blob(['PDF content'], { type: 'application/pdf' });

            callback(blob);
          },
        }) as any
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully generates a PDF blob', async () => {
    const blob = await generateUPO(dummyUpo, 'blob');

    expect(blob).toBeInstanceOf(Blob);
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (): void => resolve(reader.result as string);
      reader.onerror = (): void => reject(reader.error);
      reader.readAsText(blob);
    });

    expect(text).toContain('PDF content');
  });

  it('rejects promise if pdfMake returns null blob', async () => {
    vi.spyOn(pdfMake, 'createPdf').mockReturnValue({
      getBlob: (callback: (blob: Blob | null) => void) => {
        callback(null);
      },
    } as any);

    await expect(generateUPO(dummyUpo, 'blob')).rejects.toEqual('Error');
  });
});
