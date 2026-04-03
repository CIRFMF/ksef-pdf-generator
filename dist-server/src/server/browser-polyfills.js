// src/server/browser-polyfills.ts
// @ts-nocheck
// Polyfill dla globalnego Blob (używamy Buffer zamiast importu)
if (typeof global.Blob === 'undefined') {
    global.Blob = class Blob {
        data;
        type;
        constructor(parts, options) {
            const buffers = parts.map(part => {
                if (typeof part === 'string') {
                    return Buffer.from(part, 'utf-8');
                }
                else if (Buffer.isBuffer(part)) {
                    return part;
                }
                else if (part instanceof ArrayBuffer) {
                    return Buffer.from(part);
                }
                else {
                    return Buffer.from(String(part), 'utf-8');
                }
            });
            this.data = Buffer.concat(buffers);
            this.type = options?.type || '';
        }
        async arrayBuffer() {
            return this.data.buffer.slice(this.data.byteOffset, this.data.byteOffset + this.data.byteLength);
        }
        async text() {
            return this.data.toString('utf-8');
        }
        get size() {
            return this.data.length;
        }
    };
}
// Polyfill dla File API
if (typeof global.File === 'undefined') {
    const BlobPolyfill = global.Blob;
    global.File = class File extends BlobPolyfill {
        name;
        lastModified;
        constructor(parts, name, options) {
            super(parts, options);
            this.name = name;
            this.lastModified = options?.lastModified || Date.now();
        }
    };
}
// Polyfill dla FileReader
if (typeof global.FileReader === 'undefined') {
    global.FileReader = class FileReader {
        result = null;
        onload = null;
        onerror = null;
        readAsText(blob) {
            blob.text().then((text) => {
                this.result = text;
                if (this.onload) {
                    this.onload({ target: this });
                }
            }).catch((err) => {
                if (this.onerror) {
                    this.onerror({ target: this, error: err });
                }
            });
        }
        readAsDataURL(blob) {
            blob.arrayBuffer().then((buffer) => {
                const base64 = Buffer.from(buffer).toString('base64');
                this.result = `data:application/octet-stream;base64,${base64}`;
                if (this.onload) {
                    this.onload({ target: this });
                }
            }).catch((err) => {
                if (this.onerror) {
                    this.onerror({ target: this, error: err });
                }
            });
        }
    };
}
// Polyfill dla document (minimalistyczny)
if (typeof global.document === 'undefined') {
    global.document = {
        createElement: (tag) => {
            if (tag === 'a') {
                return {
                    href: '',
                    download: '',
                    click: () => { },
                    setAttribute: () => { },
                    style: {}
                };
            }
            return {
                appendChild: () => { },
                removeChild: () => { },
                addEventListener: () => { },
                click: () => { },
                body: {}
            };
        },
        body: {
            appendChild: () => { },
            removeChild: () => { }
        },
        getElementById: () => null
    };
}
// Polyfill dla URL.createObjectURL
if (typeof global.URL === 'undefined' || !global.URL.createObjectURL) {
    const OriginalURL = global.URL;
    global.URL = class URL extends (OriginalURL || Object) {
        static createObjectURL(blob) {
            return 'blob:mock-url-for-nodejs';
        }
        static revokeObjectURL() { }
    };
}
console.log('✅ Browser polyfills loaded for Node.js');
