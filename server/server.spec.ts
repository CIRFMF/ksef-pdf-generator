// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChildProcess, spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { request as httpRequest, IncomingMessage } from 'node:http';

const __dirname = dirname(fileURLToPath(import.meta.url));
let PORT: number;
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
      env: { ...process.env, PORT: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    // Wait for server to be ready and parse the OS-assigned port
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Server startup timeout')), 15000);

      serverProcess.stdout?.on('data', (data: Buffer) => {
        const match = data.toString().match(/listening on port (\d+)/);

        if (match) {
          PORT = Number(match[1]);
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

  afterAll(async () => {
    if (!serverProcess) {
      return;
    }

    serverProcess.kill('SIGTERM');
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        serverProcess.kill('SIGKILL');
        resolve();
      }, 5000);

      serverProcess.on('exit', () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  });

  it('GET /health returns 200 with status ok', async () => {
    const res = await request('/health');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/json');
    expect(JSON.parse(res.body.toString())).toEqual({ status: 'ok' });
  });

  it('POST /generate/pdf with valid invoice XML returns a PDF', async () => {
    const xml = readFileSync(join(__dirname, '..', 'assets', 'invoice.xml'));

    const res = await request('/generate/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: xml,
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.body.subarray(0, 5).toString()).toBe('%PDF-');
    expect(res.body.length).toBeGreaterThan(1000);
  }, 15000);

  it('POST /generate/pdf with invalid XML returns 500 with JSON error', async () => {
    const res = await request('/generate/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: Buffer.from('<invalid>not an invoice</invalid>'),
    });

    expect(res.status).toBe(500);
    expect(res.headers['content-type']).toBe('application/json');

    const body = JSON.parse(res.body.toString());

    expect(body).toHaveProperty('error');
    expect(body.error).toBe('Internal server error');
    expect(body).toHaveProperty('requestId');
    expect(body.requestId.length).toBeGreaterThan(0);
  });

  it('GET /nonexistent returns 404', async () => {
    const res = await request('/nonexistent');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toBe('application/json');
    expect(JSON.parse(res.body.toString())).toEqual({ error: 'Not found' });
  });

  it('POST /generate/pdf with empty body returns 400', async () => {
    const res = await request('/generate/pdf', {
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

  it('POST /generate/pdf with oversized body returns 413', async () => {
    const oversized = Buffer.alloc(11 * 1024 * 1024, 'x');

    const res = await request('/generate/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: oversized,
    });

    expect(res.status).toBe(413);

    const body = JSON.parse(res.body.toString());

    expect(body.error).toBe('Payload too large');
    expect(body).toHaveProperty('requestId');
    expect(body.requestId.length).toBeGreaterThan(0);
  }, 15000);

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
    expect(body.error).toBe('Internal server error');
    expect(body).toHaveProperty('requestId');
    expect(body.requestId.length).toBeGreaterThan(0);
  });
});
