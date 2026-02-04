import { describe, expect, it, afterAll } from 'vitest';
import { generateInvoiceFromFile } from './generate-invoice-cli';
import { generateUPOFromFile } from './generate-upo-cli';
import { AdditionalDataTypes } from '../lib-public/types/common.types';
import { existsSync, unlinkSync } from 'fs';
import { resolve, join } from 'path';
import { tmpdir } from 'os';

describe('CLI integration tests', () => {
  const testInvoicePath = resolve(__dirname, '../../assets/invoice.xml');
  const testUpoPath = resolve(__dirname, '../../assets/upo.xml');
  const tempOutputInvoice = join(tmpdir(), 'test-invoice-cli.pdf');
  const tempOutputUpo = join(tmpdir(), 'test-upo-cli.pdf');

  afterAll(() => {
    // Cleanup
    if (existsSync(tempOutputInvoice)) {
      unlinkSync(tempOutputInvoice);
    }
    if (existsSync(tempOutputUpo)) {
      unlinkSync(tempOutputUpo);
    }
  });

  it('should generate invoice PDF from XML file', async () => {
    const additionalData: AdditionalDataTypes = {
      nrKSeF: '5555555555-20250808-9231003CA67B-BE',
      qrCode: 'https://ksef-test.mf.gov.pl/invoice/test',
    };

    const resultPath = await generateInvoiceFromFile(
      testInvoicePath,
      additionalData,
      tempOutputInvoice
    );

    expect(resultPath).toBe(tempOutputInvoice);
    expect(existsSync(tempOutputInvoice)).toBe(true);
  }, 30000);

  it('should generate UPO PDF from XML file', async () => {
    const resultPath = await generateUPOFromFile(testUpoPath, tempOutputUpo);

    expect(resultPath).toBe(tempOutputUpo);
    expect(existsSync(tempOutputUpo)).toBe(true);
  }, 30000);

  it('should reject with error for invalid invoice XML', async () => {
    const additionalData: AdditionalDataTypes = {
      nrKSeF: '',
      qrCode: '',
    };

    await expect(
      generateInvoiceFromFile('/nonexistent/file.xml', additionalData)
    ).rejects.toThrow();
  });
});
