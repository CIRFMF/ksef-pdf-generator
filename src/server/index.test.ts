import request from 'supertest';
import { app } from './index';
import { describe, it, expect, vi } from 'vitest';

// Mock generateInvoice to avoid actual processing
vi.mock('../lib-public', () => ({
  generateInvoice: vi.fn().mockResolvedValue(Buffer.from('mock-pdf')),
  generatePDFUPO: vi.fn(),
}));

describe('POST /api/generate-invoice', () => {
  const validMetadata = JSON.stringify({
    nrKSeF: '1234567890',
    qrCode: 'some-qr-code',
    isMobile: true,
  });

  const mockFile = Buffer.from('<xml>mock invoice</xml>');

  it('should return 200 for valid metadata and file', async () => {
    const response = await request(app)
      .post('/api/generate-invoice')
      .field('metadata', validMetadata)
      .attach('file', mockFile, 'invoice.xml');

    expect(response.status).toBe(200);
    expect(response.type).toBe('application/pdf');
    expect(response.headers['content-disposition']).toContain('attachment; filename=invoice.pdf');
  });

  it('should return 400 if metadata is missing', async () => {
    const response = await request(app).post('/api/generate-invoice').attach('file', mockFile, 'invoice.xml');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing metadata');
  });

  it('should return 400 if file is missing', async () => {
    const response = await request(app).post('/api/generate-invoice').field('metadata', validMetadata);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing XML file');
  });

  it('should return 400 for invalid JSON in metadata', async () => {
    const response = await request(app)
      .post('/api/generate-invoice')
      .field('metadata', '{invalid-json')
      .attach('file', mockFile, 'invoice.xml');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid JSON format');
  });

  it('should return 400 if metadata is missing required fields (nrKSeF)', async () => {
    const invalidMetadata = JSON.stringify({
      qrCode: 'some-qr',
    });

    const response = await request(app)
      .post('/api/generate-invoice')
      .field('metadata', invalidMetadata)
      .attach('file', mockFile, 'invoice.xml');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Validation error');
    expect(response.body.error).toContain('nrKSeF');
  });

  it('should return 400 if metadata has wrong types', async () => {
    const invalidMetadata = JSON.stringify({
      nrKSeF: 12345, // Should be string
    });

    const response = await request(app)
      .post('/api/generate-invoice')
      .field('metadata', invalidMetadata)
      .attach('file', mockFile, 'invoice.xml');

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Validation error');
    expect(response.body.error).toContain('nrKSeF');
  });
});
