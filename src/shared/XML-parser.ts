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

export function parseXMLFromString(xmlStr: string): unknown {
  return stripPrefixes(xml2js(xmlStr, { compact: true }));
}

type XmlInput = {
  text?: () => Promise<string>;
};

export async function parseXML(file: File | XmlInput): Promise<unknown> {
  // Prefer text() because it works in Node.js and browser environments.
  if (typeof file?.text === 'function') {
    const xmlStr = await file.text();

    return parseXMLFromString(xmlStr);
  }

  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject): void => {
      const reader = new FileReader();

      reader.onload = function (e: ProgressEvent<FileReader>): void {
        try {
          const xmlStr: string = e.target?.result as string;

          resolve(parseXMLFromString(xmlStr));
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Unable to read XML input'));
      reader.readAsText(file as File);
    });
  }

  throw new Error('Unsupported XML input. Expected object with text() method.');
}
