import { app } from './index';
import { describe, it, expect } from 'vitest';
import request from 'supertest';

describe('/api/generate-invoice', () => {
  it('should return 400 if metadata is malformed JSON', async () => {
    const response = await request(app)
      .post('/api/generate-invoice')
      .attach('metadata', Buffer.from('{ "test": "test" '), 'metadata.json')
      .attach('file', Buffer.from('<xml></xml>'), 'test.xml');

    expect(response.status).toBe(400);
  });
});
