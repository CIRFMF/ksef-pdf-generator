import request from 'supertest';
import { app } from './index';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a mock for runTask that we can manipulate
const { mockRunTask } = vi.hoisted(() => ({
  mockRunTask: vi.fn(),
}));

// Mock the worker pool module
vi.mock('./worker-pool', () => ({
  WorkerPool: vi.fn().mockImplementation(() => ({
    runTask: mockRunTask,
    shutdown: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
  })),
}));

describe('Server API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default success behavior
    mockRunTask.mockResolvedValue(Buffer.from('mock-pdf'));
  });

  const validMetadata = JSON.stringify({
    nrKSeF: '1234567890',
    qrCode: 'some-qr-code',
    isMobile: true,
  });

  const mockFile = Buffer.from('<xml>mock invoice</xml>');

  describe('POST /api/generate-invoice', () => {
    it('should return 200 for valid metadata and file', async () => {
      const response = await request(app)
        .post('/api/generate-invoice')
        .field('metadata', validMetadata)
        .attach('file', mockFile, 'invoice.xml');

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/pdf');
      expect(response.headers['content-disposition']).toContain('attachment; filename="1234567890.pdf"');
      expect(mockRunTask).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'invoice',
          xmlContent: expect.any(String),
          additionalData: expect.objectContaining({ nrKSeF: '1234567890' }),
        })
      );
    });

    it('should return 400 if metadata is missing', async () => {
      const response = await request(app)
        .post('/api/generate-invoice')
        .attach('file', mockFile, 'invoice.xml');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing metadata');
    });

    it('should return 400 if file is missing', async () => {
      const response = await request(app).post('/api/generate-invoice').field('metadata', validMetadata);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing XML file');
    });

    it('should return 400 if file type is invalid (not XML)', async () => {
      const response = await request(app)
        .post('/api/generate-invoice')
        .field('metadata', validMetadata)
        .attach('file', Buffer.from('image content'), 'image.png');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Upload error');
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

    it('should return 500 if worker fails', async () => {
      mockRunTask.mockRejectedValueOnce(new Error('Worker crashed'));

      const response = await request(app)
        .post('/api/generate-invoice')
        .field('metadata', validMetadata)
        .attach('file', mockFile, 'invoice.xml');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });

  describe('POST /api/generate-upo', () => {
    it('should return 200 for valid file', async () => {
      const response = await request(app).post('/api/generate-upo').attach('file', mockFile, 'upo.xml');

      expect(response.status).toBe(200);
      expect(response.type).toBe('application/pdf');
      expect(response.headers['content-disposition']).toContain('attachment; filename=upo.pdf');
      expect(mockRunTask).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'upo',
          xmlContent: expect.any(String),
        })
      );
    });

    it('should return 400 if file is missing', async () => {
      const response = await request(app).post('/api/generate-upo');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing XML file');
    });

    it('should return 400 if file type is invalid', async () => {
      const response = await request(app)
        .post('/api/generate-upo')
        .attach('file', Buffer.from('text'), 'test.txt');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Upload error');
    });

    it('should return 500 if worker fails', async () => {
      mockRunTask.mockRejectedValueOnce(new Error('Worker crashed'));

      const response = await request(app).post('/api/generate-upo').attach('file', mockFile, 'upo.xml');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });
});
