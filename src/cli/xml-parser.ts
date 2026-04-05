import { readFileSync } from 'fs';
import { xml2js } from 'xml-js';
import { stripPrefix } from '../shared/XML-parser';

export function parseXMLFromPath(filePath: string): unknown {
  const xmlStr = readFileSync(filePath, 'utf-8');
  return xml2js(xmlStr, {
    compact: true,
    cdataKey: '_text',
    trim: true,
    elementNameFn: stripPrefix,
    attributeNameFn: stripPrefix,
  });
}
