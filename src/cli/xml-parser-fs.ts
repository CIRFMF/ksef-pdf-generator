import { xml2js } from 'xml-js';
import { readFileSync } from 'fs';

function stripPrefixes<T>(obj: T): T {
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

export function parseXMLFromFile(filePath: string): unknown {
  const xmlStr = readFileSync(filePath, 'utf-8');
  const jsonDoc = stripPrefixes(xml2js(xmlStr, { compact: true }));
  return jsonDoc;
}
