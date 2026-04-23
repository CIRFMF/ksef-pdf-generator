// src/server/browser-polyfills.ts
// @ts-nocheck

// Polyfill dla globalnego Blob (używamy Buffer zamiast importu)
if (typeof global.Blob === 'undefined') {
  (global as any).Blob = class Blob {
    private data: Buffer;
    public type: string;

    constructor(parts: any[], options?: { type?: string }) {
      const buffers = parts.map(part => {
        if (typeof part === 'string') {
          return Buffer.from(part, 'utf-8');
        } else if (Buffer.isBuffer(part)) {
          return part;
        } else if (part instanceof ArrayBuffer) {
          return Buffer.from(part);
        } else {
          return Buffer.from(String(part), 'utf-8');
        }
      });
      this.data = Buffer.concat(buffers);
      this.type = options?.type || '';
    }

    async arrayBuffer(): Promise<ArrayBuffer> {
      return this.data.buffer.slice(
        this.data.byteOffset,
        this.data.byteOffset + this.data.byteLength
      );
    }

    async text(): Promise<string> {
      return this.data.toString('utf-8');
    }

    get size(): number {
      return this.data.length;
    }
  };
}

// Polyfill dla File API
if (typeof global.File === 'undefined') {
  const BlobPolyfill = (global as any).Blob;
  
  (global as any).File = class File extends BlobPolyfill {
    public name: string;
    public lastModified: number;

    constructor(parts: any[], name: string, options?: { type?: string; lastModified?: number }) {
      super(parts, options);
      this.name = name;
      this.lastModified = options?.lastModified || Date.now();
    }
  };
}

// Polyfill dla FileReader
if (typeof global.FileReader === 'undefined') {
  (global as any).FileReader = class FileReader {
    result: string | ArrayBuffer | null = null;
    onload: ((event: any) => void) | null = null;
    onerror: ((event: any) => void) | null = null;

    readAsText(blob: any): void {
      blob.text().then((text: string) => {
        this.result = text;
        if (this.onload) {
          this.onload({ target: this });
        }
      }).catch((err: Error) => {
        if (this.onerror) {
          this.onerror({ target: this, error: err });
        }
      });
    }

    readAsDataURL(blob: any): void {
      blob.arrayBuffer().then((buffer: ArrayBuffer) => {
        const base64 = Buffer.from(buffer).toString('base64');
        this.result = `data:application/octet-stream;base64,${base64}`;
        if (this.onload) {
          this.onload({ target: this });
        }
      }).catch((err: Error) => {
        if (this.onerror) {
          this.onerror({ target: this, error: err });
        }
      });
    }
  };
}

// Polyfill dla document (minimalistyczny)
if (typeof global.document === 'undefined') {
  (global as any).document = {
    createElement: (tag: string) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: () => {},
          setAttribute: () => {},
          style: {}
        };
      }
      return {
        appendChild: () => {},
        removeChild: () => {},
        addEventListener: () => {},
        click: () => {},
        body: {}
      };
    },
    body: {
      appendChild: () => {},
      removeChild: () => {}
    },
    getElementById: () => null
  };
}

// Polyfill dla URL.createObjectURL
if (typeof global.URL === 'undefined' || !(global.URL as any).createObjectURL) {
  const OriginalURL = global.URL;
  (global as any).URL = class URL extends (OriginalURL || Object) {
    static createObjectURL(blob: any): string {
      return 'blob:mock-url-for-nodejs';
    }
    static revokeObjectURL(): void {}
  };
}

console.log('✅ Browser polyfills loaded for Node.js');
