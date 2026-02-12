// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChildProcess, spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { request as httpRequest, IncomingMessage } from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3456 + Math.floor(Math.random() * 1000);
let serverProcess: ChildProcess;

function request(
  path: string,
  options: { method?: string; body?: Buffer; headers?: Record<string, string> } = {}
): Promise<{ status: number; headers: Record<string, string>; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `http://localhost:${PORT}`);
    const req = httpRequest(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
    });

    req.on('response', (res: IncomingMessage) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode!,
          headers: res.headers as Record<string, string>,
          body: Buffer.concat(chunks),
        });
      });
    });

    req.on('error', reject);

    if (options.body && options.body.length > 0) {
      req.write(options.body);
    }
    req.end();
  });
}

describe('ksef-pdf HTTP server', () => {
  beforeAll(async () => {
    serverProcess = spawn('node', [join(__dirname, 'index.js')], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    // Wait for server to be ready
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Server startup timeout')), 15000);

      serverProcess.stdout?.on('data', (data: Buffer) => {
        if (data.toString().includes('listening')) {
          clearTimeout(timeout);
          resolve();
        }
      });

      serverProcess.stderr?.on('data', (data: Buffer) => {
        console.error('Server stderr:', data.toString());
      });

      serverProcess.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });

      serverProcess.on('exit', (code) => {
        if (code !== null && code !== 0) {
          clearTimeout(timeout);
          reject(new Error(`Server exited with code ${code}`));
        }
      });
    });
  }, 30000);

  afterAll(() => {
    serverProcess?.kill('SIGTERM');
  });

  it('GET /health returns 200 with status ok', async () => {
    const res = await request('/health');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/json');
    expect(JSON.parse(res.body.toString())).toEqual({ status: 'ok' });
  });

  it('POST /generate with valid invoice XML returns a PDF', async () => {
    const xml = readFileSync(join(__dirname, '..', 'assets', 'invoice.xml'));

    const res = await request('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xml,
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.body.subarray(0, 5).toString()).toBe('%PDF-');
    expect(res.body.length).toBeGreaterThan(1000);
  }, 15000);

  it('POST /generate with invalid XML returns 500 with JSON error', async () => {
    const res = await request('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: Buffer.from('<invalid>not an invoice</invalid>'),
    });

    expect(res.status).toBe(500);
    expect(res.headers['content-type']).toBe('application/json');
    const body = JSON.parse(res.body.toString());
    expect(body).toHaveProperty('error');
    expect(typeof body.error).toBe('string');
  });

  it('GET /nonexistent returns 404', async () => {
    const res = await request('/nonexistent');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toBe('application/json');
    expect(JSON.parse(res.body.toString())).toEqual({ error: 'Not found' });
  });

  it('POST /generate with empty body returns 400', async () => {
    const res = await request('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: Buffer.alloc(0),
    });

    expect(res.status).toBe(400);
    expect(JSON.parse(res.body.toString())).toEqual({ error: 'Empty request body' });
  });

  it('POST /generate/html with valid invoice XML returns HTML', async () => {
    const xml = readFileSync(join(__dirname, '..', 'assets', 'invoice.xml'));

    const res = await request('/generate/html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xml,
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('text/html; charset=utf-8');

    const html = res.body.toString();

    expect(html).toContain('<!DOCTYPE html');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');
    expect(html.length).toBeGreaterThan(1000);
  }, 15000);

  it('POST /generate/html with empty body returns 400', async () => {
    const res = await request('/generate/html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: Buffer.alloc(0),
    });

    expect(res.status).toBe(400);
    expect(JSON.parse(res.body.toString())).toEqual({ error: 'Empty request body' });
  });

  it('POST /generate/html with invalid XML returns 500 with JSON error', async () => {
    const res = await request('/generate/html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: Buffer.from('<invalid>not an invoice</invalid>'),
    });

    expect(res.status).toBe(500);
    expect(res.headers['content-type']).toBe('application/json');
    const body = JSON.parse(res.body.toString());
    expect(body).toHaveProperty('error');
    expect(typeof body.error).toBe('string');
  });
});
