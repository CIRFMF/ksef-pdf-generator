#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, resolve, dirname, basename } from 'path';
import { createHash } from 'crypto';
import { generateInvoiceNode, generatePDFUPONode, parseXMLString } from './node-helpers';
import { AdditionalDataTypes } from './lib-public/types/common.types';

interface CliArgs {
  input?: string;
  output?: string;
  type: 'invoice' | 'upo';
  nrKSeF?: string;
  qrCode?: string;
  qr2Code?: string;
  stream: boolean;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const result: Partial<CliArgs> = { stream: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--stream':
        result.stream = true;
        break;
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
        	if (!result.qrCode2) 
          		result.nrKSeF = nextArg;
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

  if (!result.stream && !result.input) {
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
KSEF PDF Generator - Generator PDF dla faktur i UPO

Użycie:
  ${exeName} -t upo -i <ścieżka> -o <ścieżka>
  ${exeName} -t upo --stream
  ${exeName} -t invoice -i <ścieżka> -o <ścieżka> --nrKSeF <url> --qrCode <url>
  ${exeName} -t invoice -i <ścieżka> -o <ścieżka> --qrCode <url> --qrCode2 <url>
  ${exeName} -t invoice --nrKSeF <url> --qrCode <url> --stream
  ${exeName} -t invoice --qrCode <url> --qrCode2 <url> --stream
  ${exeName} -h

Opcje:
  -i, --input <ścieżka>      Ścieżka do pliku XML wejściowego (wymagane w trybie plikowym)
  -o, --output <ścieżka>     Ścieżka do pliku PDF wyjściowego (opcjonalne, tylko w trybie plikowym)
  -t, --type <typ>           Typ dokumentu: 'invoice' lub 'upo' (wymagane)
  --nrKSeF <wartość>         Numer KSeF (wymagane dla faktur)
  --qrCode <url>             URL kodu QR (wymagane dla faktur), obsługuje parametry {hash}, {nip}, {p1}
  --qr2Code <url>            URL kodu QR2 (wymagane dla faktur), obsługuje parametry {hash}, {nip}, {p1}
  --stream                   Tryb strumieniowy: XML ze stdin, PDF do stdout
  -h, --help                 Wyświetla tę pomoc

Przykłady:
  # Generowanie faktury (tryb plikowy)
  ${exeName} -i invoice.xml -t invoice --nrKSeF "1111111111-20251107-080080679C57-14" --qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}"

  # Generowanie faktury offline (tryb plikowy)
  ${exeName} -i invoice.xml -t invoice --qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" --qrCode2 "https://qr.ksef.mf.gov.pl/certificate/Nip/1111111111/{nip}/01F20A5D352AE590/..."

  # Generowanie UPO (tryb plikowy)
  ${exeName} -i upo.xml -t upo -o output.pdf

  # Generowanie faktury (tryb strumieniowy)
  ${exeName} --stream -t invoice --nrKSeF "1111111111-20251107-080080679C57-14" --qrCode "https://qr.ksef.mf.gov.pl/invoice/{nip}/{p1}/{hash}" < invoice.xml > output.pdf

  # Generowanie UPO (tryb strumieniowy)
  ${exeName} --stream -t upo < upo.xml > output.pdf

`);
}

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = '';
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', (chunk: string) => {
      input += chunk;
    });
    
    process.stdin.on('end', () => {
      resolve(input);
    });
    
    process.stdin.on('error', (error) => {
      reject(error);
    });
  });
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
function extractP1Formatted(xml: any): String | null {
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

    // Tryb strumieniowy - czytaj ze stdin
    if (args.stream) {
      try {
        inputContent = await readStdin();
        if (!inputContent || inputContent.trim().length === 0) {
          process.stderr.write('Błąd: Brak danych wejściowych ze stdin\n');
          process.exit(1);
        }
      } catch (error) {
        process.stderr.write(`Błąd: Nie można odczytać danych ze stdin: ${error}\n`);
        process.exit(1);
      }
    } else {
      // Tryb plikowy - czytaj z pliku
      if (!args.input) {
        process.stderr.write('Błąd: W trybie plikowym wymagany jest argument --input\n');
        process.exit(1);
      }
      
      try {
        inputContent = readFileSync(args.input, 'utf-8');
      } catch (error) {
        process.stderr.write(`Błąd: Nie można odczytać pliku ${args.input}\n`);
        process.exit(1);
      }
    }

    if (args.type === 'invoice') {
      if (!args.nrKSeF || !args.qrCode) {
        process.stderr.write('Błąd: Dla faktur wymagane są parametry --nrKSeF i --qrCode lub --qrCode i --qrCode2\n');
        process.exit(1);
      }

      // Parsuj XML dla przetworzenia qrCode
      let parsedXml: any;
      try {
        parsedXml = parseXMLString(inputContent);
      } catch (error) {
        process.stderr.write(`Błąd podczas parsowania XML: ${error}\n`);
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
	      } catch (error) {
	        process.stderr.write(`Błąd podczas przetwarzania qr2Code: ${error}\n`);
	        process.exit(1);
	      }
       }
       else
       	processedQR2Code = '';

      const additionalData: AdditionalDataTypes = {
        nrKSeF: args.nrKSeF,
        qrCode: processedQRCode,
        qr2Code: processedQR2Code,
      };

      if (!args.stream) {
        process.stdout.write('Generowanie PDF faktury...\n');
      }
      
      const pdfBuffer = await generateInvoiceNode(inputContent, additionalData);
      
      if (args.stream) {
        // Tryb strumieniowy - zapisz do stdout
        process.stdout.write(pdfBuffer);
      } else {
        // Tryb plikowy - zapisz do pliku
        let outputPath = args.output;
        if (!outputPath) {
          const inputDir = dirname(args.input!);
          const inputBase = basename(args.input!, '.xml');
          outputPath = join(inputDir, `${inputBase}.pdf`);
        }
        writeFileSync(outputPath, pdfBuffer);
        process.stdout.write(`✓ PDF został wygenerowany: ${outputPath}\n`);
      }
    } else if (args.type === 'upo') {
      if (!args.stream) {
        process.stdout.write('Generowanie PDF UPO...\n');
      }
      
      const pdfBuffer = await generatePDFUPONode(inputContent);
      
      if (args.stream) {
        // Tryb strumieniowy - zapisz do stdout
        process.stdout.write(pdfBuffer);
      } else {
        // Tryb plikowy - zapisz do pliku
        let outputPath = args.output;
        if (!outputPath) {
          const inputDir = dirname(args.input!);
          const inputBase = basename(args.input!, '.xml');
          outputPath = join(inputDir, `${inputBase}.pdf`);
        }
        writeFileSync(outputPath, pdfBuffer);
        process.stdout.write(`✓ PDF został wygenerowany: ${outputPath}\n`);
      }
    }
  } catch (error) {
    process.stderr.write(`Błąd podczas generowania PDF: ${error}\n`);
    process.exit(1);
  }
}

main();

