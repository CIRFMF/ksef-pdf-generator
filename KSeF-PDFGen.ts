#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, resolve, dirname, basename } from 'path';
import { createHash } from 'crypto';
import { generateInvoice } from './src/lib-public/generate-invoice';
import { generateUPO } from './src/lib-public/UPO-generator';
import { AdditionalDataTypes } from './src/lib-public/types/common.types';
import { xml2js } from 'xml-js';
import { stripPrefix } from './src/shared/XML-parser';

function parseXMLString(xmlString: string): any {
  try {
    const jsonDoc = xml2js(xmlString, {
      compact: true,
      cdataKey: '_text',
      trim: true,
      elementNameFn: stripPrefix,
      attributeNameFn: stripPrefix,
    });

    return jsonDoc;
  } catch (error) {
    throw new Error(`Błąd parsowania XML: ${error}`);
  }
}
interface CliArgs {
  input?: string;
  output?: string;
  type: 'invoice' | 'upo';
  nrKSeF?: string;
  qrCode?: string;
  qr2Code?: string;
  html: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: Partial<CliArgs> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--input':
      case '-i':
        if (nextArg) {
          result.input = resolve(nextArg);
          i++;
        }
        break;
      case '--output':
      case '-o':
        if (nextArg) {
          result.output = resolve(nextArg);
          i++;
        }
        break;
      case '--type':
      case '-t':
        if (nextArg === 'invoice' || nextArg === 'upo') {
          result.type = nextArg;
          i++;
        }
        break;
      case '--nrKSeF':
        if (nextArg) {
          if (!result.qr2Code) {
            result.nrKSeF = nextArg;
          }
          i++;
        }
        break;
      case '--qrCode':
        if (nextArg) {
          result.qrCode = nextArg;
          i++;
        }
        break;
      case '--qr2Code':
        if (nextArg) {
          result.qr2Code = nextArg;
          result.nrKSeF = 'OFFLINE';
          i++;
        }
        break;
      case '--html':
        result.html = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
    }
  }

  if (!result.type) {
    console.error('Błąd: Brakuje wymaganego argumentu --type');
    printHelp();
    process.exit(1);
  }

  if (!result.input) {
    console.error('Błąd: W trybie plikowym wymagany jest argument --input');
    printHelp();
    process.exit(1);
  }

  return result as CliArgs;
}

function printHelp(): void {
  // process.execPath zawiera ścieżkę do pliku wykonywalnego (.exe lub node)
  // basename() wyciąga tylko nazwę pliku
  const exeName = basename(process.execPath);

  console.log(`
KSEF PDF/HTML Generator - Generator PDF/HTML dla faktur i UPO

Użycie:
  ${exeName} -t upo -i <ścieżka> -o <ścieżka>
  ${exeName} -t invoice -i <ścieżka> -o <ścieżka> --nrKSeF <url> --qrCode <url>
  ${exeName} -t invoice -i <ścieżka> -o <ścieżka> --qrCode <url> --qrCode2 <url>
  ${exeName} -h

Opcje:
  -i, --input <ścieżka>      Ścieżka do pliku XML wejściowego
  -o, --output <ścieżka>     Ścieżka do pliku wyjściowego
  -t, --type <typ>           Typ dokumentu: 'invoice' lub 'upo' (wymagane)
  --nrKSeF <wartość>         Numer KSeF (wymagane dla faktur)
  --qrCode <url>             URL kodu QR (wymagane dla faktur), obsługuje parametry {hash}, {nip}, {p1}
  --qr2Code <url>            URL kodu QR2 (wymagane dla faktur), obsługuje parametry {hash}, {nip}, {p1}
  --html                     Generuj HTML zamiast PDF
  -h, --help                 Wyświetla tę pomoc

Przykłady:
  # Generowanie faktury
  ${exeName} -i invoice.xml -t invoice --nrKSeF "1111111111-20251107-080080679C57-14" --qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}"
  ${exeName} -i invoice.xml -t invoice --nrKSeF "1111111111-20251107-080080679C57-14" --qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" --html

  # Generowanie faktury offline
  ${exeName} -i invoice.xml -t invoice --qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" --qrCode2 "https://qr.ksef.mf.gov.pl/certificate/Nip/1111111111/{nip}/01F20A5D352AE590/..."
  ${exeName} -i invoice.xml -t invoice --qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" --qrCode2 "https://qr.ksef.mf.gov.pl/certificate/Nip/1111111111/{nip}/01F20A5D352AE590/..." --html

  # Generowanie UPO
  ${exeName} -i upo.xml -t upo -o output.pdf
  ${exeName} -i upo.xml -t upo -o output.html --html
`);
}

/**
 * Oblicza SHA256 hash i zwraca go w formacie Base64URL
 */
function calculateSHA256Base64URL(data: string): string {
  const hash = createHash('sha256').update(data, 'utf8').digest('base64');
  // Konwersja Base64 na Base64URL: zamiana + na -, / na _, usunięcie padding =

  return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Wyciąga wartość NIP z parsowanego XML
 */
function extractNIP(xml: any): string | null {
  const nip = xml?.Faktura?.Podmiot1?.DaneIdentyfikacyjne?.NIP;

  if (!nip) {
    return null;
  }
  // NIP może być stringiem lub obiektem z _text
  return typeof nip === 'string' ? nip : nip._text || null;
}

/**
 * Wyciąga wartość P_1 z parsowanego XML i formatuje na dd-mm-yyyy
 */
function extractP1Formatted(xml: any): string | null {
  const p1 = xml?.Faktura?.Fa?.P_1;

  if (!p1) {
    return null;
  }

  // P_1 może być stringiem lub obiektem z _text
  const dateStr = typeof p1 === 'string' ? p1 : p1._text || null;

  if (!dateStr) {
    return null;
  }

  // Format wejściowy: yyyy-mm-dd (może zawierać czas, więc bierzemy tylko część daty)
  const dateMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!dateMatch) {
    return dateStr; // Jeśli format nie pasuje, zwróć oryginalną wartość
  }

  // Format wyjściowy: dd-mm-yyyy
  const [, year, month, day] = dateMatch;

  return `${day}-${month}-${year}`;
}

/**
 * Podmienia placeholdery w qrCode na wartości z XML
 */
function processQRCodeTemplate(qrCodeTemplate: string, xmlContent: string, xml: any): string {
  let result = qrCodeTemplate;

  // {hash} - SHA256 Base64URL całego XML
  if (result.includes('{hash}')) {
    const hash = calculateSHA256Base64URL(xmlContent);

    result = result.replace(/{hash}/g, hash);
  }

  // {nip} - NIP z Podmiot1
  if (result.includes('{nip}')) {
    const nip = extractNIP(xml);

    if (nip) {
      result = result.replace(/{nip}/g, nip);
    } else {
      throw new Error('Nie można znaleźć pola NIP w pliku XML (Faktura.Podmiot1.DaneIdentyfikacyjne.NIP)');
    }
  }

  // {p1} - P_1 w formacie dd-mm-yyyy
  if (result.includes('{p1}')) {
    const p1 = extractP1Formatted(xml);

    if (p1) {
      result = result.replace(/{p1}/g, p1);
    } else {
      throw new Error('Nie można znaleźć pola P_1 w pliku XML (Faktura.Fa.P_1)');
    }
  }

  return result;
}

async function main(): Promise<void> {
  try {
    const args = parseArgs();
    let inputContent: string;

    if (!args.input) {
      process.stderr.write('Błąd: W trybie plikowym wymagany jest argument --input\n');
      process.exit(1);
    }

    try {
      inputContent = readFileSync(args.input, 'utf-8');
    } catch (error) {
      process.stderr.write(`Błąd: Nie można odczytać pliku ${args.input}: ${error}\n`);
      process.exit(1);
    }

    let parsedXml: any;

    try {
      parsedXml = parseXMLString(inputContent);
    } catch (error) {
      process.stderr.write(`Błąd podczas parsowania XML: ${error}\n`);
      process.exit(1);
    }

    if (args.type === 'invoice') {
      if (!args.nrKSeF || !args.qrCode) {
        process.stderr.write(
          'Błąd: Dla faktur wymagane są parametry --nrKSeF i --qrCode lub --qrCode i --qrCode2\n'
        );
        process.exit(1);
      }

      // Przetwórz qrCode - podmień placeholdery
      let processedQRCode: string;

      try {
        processedQRCode = processQRCodeTemplate(args.qrCode, inputContent, parsedXml);
      } catch (error) {
        process.stderr.write(`Błąd podczas przetwarzania qrCode: ${error}\n`);
        process.exit(1);
      }

      let processedQR2Code: string;

      if (args.qr2Code) {
        try {
          processedQR2Code = processQRCodeTemplate(args.qr2Code, inputContent, parsedXml);
        } catch (_error) {
          process.stderr.write(`Błąd podczas przetwarzania qr2Code: ${_error}\n`);
          process.exit(1);
        }
      } else {
        processedQR2Code = '';
      }

      const additionalData: AdditionalDataTypes = {
        nrKSeF: args.nrKSeF,
        qrCode: processedQRCode,
        qr2Code: processedQR2Code,
      };

      process.stdout.write(`Generowanie ${args.html ? 'HTML' : 'PDF'} faktury...\n`);
      let outBuffer: any;

      if (args.html) {
        outBuffer = await generateInvoice(parsedXml, additionalData, 'html');
      } else {
        outBuffer = await generateInvoice(parsedXml, additionalData, 'blob');
      }

      let outputPath = args.output;

      if (!outputPath) {
        const inputDir = dirname(args.input!);
        const inputBase = basename(args.input!, '.xml');

        outputPath = join(inputDir, `${inputBase}.${args.html ? 'html' : 'pdf'}`);
      }
      writeFileSync(outputPath, Buffer.from(await outBuffer.arrayBuffer()));
      process.stdout.write(`✓ ${args.html ? 'HTML' : 'PDF'} został wygenerowany: ${outputPath}\n`);
    } else if (args.type === 'upo') {
      process.stdout.write(`Generowanie ${args.html ? 'HTML' : 'PDF'} UPO...\n`);

      let outBuffer: any;

      if (args.html) {
        outBuffer = await generateUPO(parsedXml, 'html');
      } else {
        outBuffer = await generateUPO(parsedXml, 'blob');
      }

      let outputPath = args.output;

      if (!outputPath) {
        const inputDir = dirname(args.input!);
        const inputBase = basename(args.input!, '.xml');

        outputPath = join(inputDir, `${inputBase}.${args.html ? 'html' : 'pdf'}`);
      }
      writeFileSync(outputPath, Buffer.from(await outBuffer.arrayBuffer()));
      process.stdout.write(`✓ ${args.html ? 'HTML' : 'PDF'} został wygenerowany: ${outputPath}\n`);
    }
  } catch (error) {
    process.stderr.write(`Błąd podczas generowania ${args.html ? 'HTML' : 'PDF'}: ${error}\n`);
    process.exit(1);
  }
}

main();
