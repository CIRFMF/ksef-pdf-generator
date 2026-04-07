import { xml2js } from 'xml-js';
import { Faktura } from '../lib-public/types/fa2.types';

export function stripPrefix(key: string): string {
  return key.includes(':') ? key.split(':')[1] : key;
}

async function readBlobAsText(blob: Blob): Promise<string> {
  if (typeof blob.text === 'function') {
    return blob.text();
  }
  if (typeof blob.arrayBuffer === 'function') {
    return new TextDecoder().decode(await blob.arrayBuffer());
  }
  return new Promise((resolve, reject) => {
    if (typeof FileReader === 'undefined') {
      reject(new Error('Cannot read Blob as text in this environment'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsText(blob);
  });
}

export async function parseXML(file: File): Promise<unknown> {
  const xmlStr = await readBlobAsText(file);
  const jsonDoc: Faktura = xml2js(xmlStr, {
    compact: true,
    cdataKey: '_text',
    trim: true,
    elementNameFn: stripPrefix,
    attributeNameFn: stripPrefix,
  }) as Faktura;

  return jsonDoc;
}
