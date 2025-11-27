import { xml2js } from 'xml-js';
import { Faktura } from '../lib-public/types/fa2.types';

export function stripPrefixes<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(stripPrefixes) as T;
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]: [string, T]): [string, T] => [
        key.includes(':') ? key.split(':')[1] : key,
        stripPrefixes(value),
      ])
    ) as T;
  }
  return obj;
}

export function parseXML(file: any): Promise<unknown> {
  return new Promise(async (resolve, reject): Promise<void> => {
    try {
      // Node Buffer
      if (typeof Buffer !== 'undefined' && Buffer.isBuffer(file)) {
        const xmlStr = file.toString('utf8');
        const jsonDoc: Faktura = stripPrefixes(xml2js(xmlStr, { compact: true })) as Faktura;
        resolve(jsonDoc);
        return;
      }

      // ArrayBuffer or TypedArray
      if (file instanceof ArrayBuffer || ArrayBuffer.isView(file)) {
        const buf = file instanceof ArrayBuffer ? Buffer.from(file) : Buffer.from((file as any).buffer);
        const xmlStr = buf.toString('utf8');
        const jsonDoc: Faktura = stripPrefixes(xml2js(xmlStr, { compact: true })) as Faktura;
        resolve(jsonDoc);
        return;
      }

      // Blob or File with text() method (browser or node 18+)
      if (file && typeof file.text === 'function') {
        const xmlStr = await file.text();
        const jsonDoc: Faktura = stripPrefixes(xml2js(xmlStr, { compact: true })) as Faktura;
        resolve(jsonDoc);
        return;
      }

      // Browser File fallback using FileReader
      if (typeof FileReader !== 'undefined' && file instanceof File) {
        const reader = new FileReader();
        reader.onload = function (e: ProgressEvent<FileReader>): void {
          try {
            const xmlStr: string = e.target?.result as string;
            const jsonDoc: Faktura = stripPrefixes(xml2js(xmlStr, { compact: true })) as Faktura;
            resolve(jsonDoc);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
        return;
      }

      reject(new Error('Unsupported file type for parseXML'));
    } catch (err) {
      reject(err);
    }
  });
}
