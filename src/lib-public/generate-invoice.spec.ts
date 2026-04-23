import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as FA1Generator from './FA1-generator';
import * as FA2Generator from './FA2-generator';
import * as FA3Generator from './FA3-generator';
import { generateInvoice } from './generate-invoice';
import { AdditionalDataTypes } from './types/common.types';

describe('generateInvoice', () => {
  const mockBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  const additionalData: AdditionalDataTypes = {
    nrKSeF: 'testKSeF',
    qrCode: 'qrCodeValue',
    isMobile: false,
  };

  it('should call generateFA1 and resolve with blob for version FA (1)', async () => {
    const fakeXml = {
      Faktura: {
        Naglowek: {
          KodFormularza: {
            _attributes: { kodSystemowy: 'FA (1)' },
          },
        },
      },
    };

    const getBlobMock = vi.fn().mockImplementation((cb) => cb(mockBlob));

    vi.spyOn(FA1Generator, 'generateFA1').mockReturnValue({ getBlob: getBlobMock } as any);

    const result = await generateInvoice(fakeXml, additionalData, 'blob');

    expect(result).toStrictEqual(mockBlob);
    expect(FA1Generator.generateFA1).toHaveBeenCalledWith(fakeXml.Faktura, additionalData);
    //?expect(getBlobMock).toHaveBeenCalled();
  });

  it('should call generateFA2 and resolve with blob for version FA (2)', async () => {
    const fakeXml = {
      Faktura: {
        Naglowek: {
          KodFormularza: {
            _attributes: { kodSystemowy: 'FA (2)' },
          },
        },
      },
    };

    const getBlobMock = vi.fn().mockImplementation((cb) => cb(mockBlob));

    vi.spyOn(FA2Generator, 'generateFA2').mockReturnValue({ getBlob: getBlobMock } as any);

    const result = await generateInvoice(fakeXml, additionalData, 'blob');

    expect(result).toStrictEqual(mockBlob);
    expect(FA2Generator.generateFA2).toHaveBeenCalledWith(fakeXml.Faktura, additionalData);
    //?expect(getBlobMock).toHaveBeenCalled();
  });

  it('should call generateFA3 and resolve with blob for version FA (3)', async () => {
    const fakeXml = {
      Faktura: {
        Naglowek: {
          KodFormularza: {
            _attributes: { kodSystemowy: 'FA (3)' },
          },
        },
      },
    };

    const getBlobMock = vi.fn().mockImplementation((cb) => cb(mockBlob));

    vi.spyOn(FA3Generator, 'generateFA3').mockReturnValue({ getBlob: getBlobMock } as any);

    const result = await generateInvoice(fakeXml, additionalData, 'blob');

    expect(result).toStrictEqual(mockBlob);
    expect(FA3Generator.generateFA3).toHaveBeenCalledWith(fakeXml.Faktura, additionalData);
    //?expect(getBlobMock).toHaveBeenCalled();
  });
});
