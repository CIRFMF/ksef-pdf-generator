import { describe, expect, it } from 'vitest';
import { parseXML, stripPrefix } from './XML-parser';

describe('stripPrefixes', () => {
  it('removes prefixes from object keys', () => {
    const input = 'ns:name';

    expect(stripPrefix(input)).toEqual('name');
  });

  it('returns primitives unchanged', () => {
    expect(stripPrefix('string')).toBe('string');
  });
});

describe('parseXML', () => {
  const xmlSample = `<root><ns:name>test</ns:name></root>`;
  const file = new File([xmlSample], 'test.xml', { type: 'text/xml' });
  const errorXmlSample = `<root><ns:name>sssss<test>tttt</asdqwsss>`;
  const errorFile = new File([errorXmlSample], 'test.xml', { type: 'text/xml' });

  it('correctly parses XML into a JSON object', async () => {
    const result: any = await parseXML(file);

    expect(result).toHaveProperty('root');
    expect(Object.keys(result.root)).toContain('name');
  });

  it('rejects the promise with an error on invalid XML', async () => {
    await expect(parseXML(errorFile)).rejects.toThrow();
  });
});
