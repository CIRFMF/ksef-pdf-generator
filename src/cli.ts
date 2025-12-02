#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, resolve, dirname, basename } from 'path';
import { generateInvoiceNode, generatePDFUPONode } from './node-helpers';
import { AdditionalDataTypes } from './lib-public/types/common.types';

interface CliArgs {
  input?: string;
  output?: string;
  type: 'invoice' | 'upo';
  nrKSeF?: string;
  qrCode?: string;
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
  console.log(`
KSEF PDF Generator - Generator PDF dla faktur i UPO

Użycie:
  node cli.js [opcje]

Opcje:
  -i, --input <ścieżka>      Ścieżka do pliku XML wejściowego (wymagane w trybie plikowym)
  -o, --output <ścieżka>     Ścieżka do pliku PDF wyjściowego (opcjonalne, tylko w trybie plikowym)
  -t, --type <typ>           Typ dokumentu: 'invoice' lub 'upo' (wymagane)
  --nrKSeF <wartość>         Numer KSeF (wymagane dla faktur)
  --qrCode <url>             URL kodu QR (wymagane dla faktur)
  --stream                   Tryb strumieniowy: XML ze stdin, PDF do stdout
  -h, --help                 Wyświetla tę pomoc

Przykłady:
  # Generowanie faktury (tryb plikowy)
  node cli.js -i invoice.xml -t invoice --nrKSeF "123-2025-ABC" --qrCode "https://example.com/qr"

  # Generowanie UPO (tryb plikowy)
  node cli.js -i upo.xml -t upo -o output.pdf

  # Generowanie faktury (tryb strumieniowy)
  cat invoice.xml | node cli.js --stream -t invoice --nrKSeF "123-2025-ABC" --qrCode "https://example.com/qr" > output.pdf
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
        process.stderr.write('Błąd: Dla faktur wymagane są parametry --nrKSeF i --qrCode\n');
        process.exit(1);
      }

      const additionalData: AdditionalDataTypes = {
        nrKSeF: args.nrKSeF,
        qrCode: args.qrCode,
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

