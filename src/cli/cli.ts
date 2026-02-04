#!/usr/bin/env node

import { generateInvoiceFromFile } from './generate-invoice-cli';
import { generateUPOFromFile } from './generate-upo-cli';
import { AdditionalDataTypes } from '../lib-public/types/common.types';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
KSeF PDF Generator - CLI Tool

Użycie:
  ksef-pdf-generator <ścieżka-do-pliku.xml> [opcje]

Opcje:
  -o, --output <ścieżka>     Ścieżka do pliku wyjściowego PDF (opcjonalne)
  -k, --ksef <numer>         Numer KSeF (opcjonalne, tylko dla faktur)
  -q, --qrcode <url>         URL QR Code (opcjonalne, tylko dla faktur)
  -h, --help                 Wyświetl pomoc

Przykłady:
  ksef-pdf-generator faktura.xml
  ksef-pdf-generator faktura.xml -o wynik.pdf
  ksef-pdf-generator upo.xml
  ksef-pdf-generator faktura.xml -k "5555555555-20250808-9231003CA67B-BE" -q "https://ksef.mf.gov.pl/..."
    `);
    process.exit(0);
  }

  const xmlFilePath = resolve(args[0]);

  if (!existsSync(xmlFilePath)) {
    console.error(`Błąd: Plik nie istnieje: ${xmlFilePath}`);
    process.exit(1);
  }

  let outputPath: string | undefined;
  let nrKSeF: string | undefined;
  let qrCode: string | undefined;

  // Parse arguments
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '-o' || args[i] === '--output') {
      outputPath = resolve(args[++i]);
    } else if (args[i] === '-k' || args[i] === '--ksef') {
      nrKSeF = args[++i];
    } else if (args[i] === '-q' || args[i] === '--qrcode') {
      qrCode = args[++i];
    }
  }

  try {
    // Read XML to detect type
    const xmlContent = readFileSync(xmlFilePath, 'utf-8');
    const isUPO = xmlContent.includes('<Potwierdzenie');
    const isInvoice = xmlContent.includes('<Faktura');

    let pdfPath: string;

    if (isUPO) {
      pdfPath = await generateUPOFromFile(xmlFilePath, outputPath);
      console.log(pdfPath);
    } else if (isInvoice) {
      const additionalData: AdditionalDataTypes = {
        nrKSeF: nrKSeF || '',
        qrCode: qrCode || '',
      };
      pdfPath = await generateInvoiceFromFile(xmlFilePath, additionalData, outputPath);
      console.log(pdfPath);
    } else {
      console.error('Błąd: Nierozpoznany typ dokumentu XML. Oczekiwano Faktury lub UPO.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Błąd podczas generowania PDF:', error);
    process.exit(1);
  }
}

main();
