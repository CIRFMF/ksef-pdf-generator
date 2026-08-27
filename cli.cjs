#!/usr/bin/env node
const fs = require('fs');
const { readFile, writeFile } = fs.promises;
const path = require('path');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.self = global;
global.File = dom.window.File;
global.Blob = dom.window.Blob;
global.FileReader = dom.window.FileReader;

const pdfMake = require('pdfmake/build/pdfmake.js');
const vfs = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = vfs;
global.pdfMake = pdfMake;

const { generateInvoice, generatePDFUPO } = require('./dist/ksef-fe-invoice-converter.umd.cjs');

const [documentType, inputXmlPath, outputPdfPath, additionalDataJson] = process.argv.slice(2);
if (['-h','--help'].includes(documentType)) {
    console.log('Usage: ksef-pdf-generator <invoice|faktura|upo> <inputXml> <outputPdf> [additionalDataJson]');
    process.exit(0);
}
if (!documentType || !inputXmlPath || !outputPdfPath) {
    console.error('Użycie: node ksef-pdf-generator <invoice|faktura|upo> <inputXml> <outputPdf> [additionalDataJson]');
    process.exit(1);
}
const allowedTypes = ['invoice', 'faktura', 'upo'];
if (!allowedTypes.includes(documentType.toLowerCase())) {
    console.error(`Invalid document type "${documentType}". Allowed: ${allowedTypes.join(', ')}`);
    process.exit(1);
}

(async function main() {
    try {
        const xmlBuffer = await readFile(inputXmlPath);
        const xmlFile = new File([xmlBuffer], path.basename(inputXmlPath), { type: 'application/xml' });

        const docType = documentType.toLowerCase();
        const isInvoice = docType === 'invoice' || docType === 'faktura';

        let additionalData = additionalDataJson ? JSON.parse(additionalDataJson) : {};

        // Jeśli nie podano kodu QR, spróbuj automatycznie go wygenerować na podstawie nrKSeF z nazwy pliku i danych z XML
        if (isInvoice && (!additionalData.qrCode || !additionalData.nrKSeF)) {
            const fileName = path.basename(inputXmlPath).replace(/\.xml$/i, '');
            // Struktura numeru KSeF: 10-cyfrowy NIP - 8-cyfrowa data - 12-znakowa część techniczna - 2-cyfrowa suma kontrolna
            const ksefRegex = /^\d{10}-\d{8}-[A-Z0-9]{12}-[A-Z0-9]{2}$/i;

            if (ksefRegex.test(fileName)) {
                if (!additionalData.nrKSeF) {
                    additionalData.nrKSeF = fileName;
                }

                if (!additionalData.qrCode) {
                    const xmlString = xmlBuffer.toString();
                    const nipMatch = xmlString.match(/<NIP>([^<]+)<\/NIP>/i);
                    const dataMatch = xmlString.match(/<P_1>([^<]+)<\/P_1>/i);

                    const nip = nipMatch ? nipMatch[1] : '';
                    let data = dataMatch ? dataMatch[1] : '';

                    // Zamień format daty z RRRR-MM-DD na DD-MM-RRRR
                    if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
                        const [yyyy, mm, dd] = data.split('-');
                        data = `${dd}-${mm}-${yyyy}`;
                    }

                    if (nip && data) {
                        const crypto = require('crypto');
                        const hash = crypto.createHash('sha256').update(xmlString).digest('base64url');
                        additionalData.qrCode = `https://qr.ksef.mf.gov.pl/invoice/${nip}/${data}/${hash}`;
                    }
                }
            }
        }

        const pdfBlob = isInvoice
            ? await generateInvoice(xmlFile, additionalData, 'blob')
            : await generatePDFUPO(xmlFile);

      const buffer = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(Buffer.from(reader.result));
          reader.onerror = reject;
          reader.readAsArrayBuffer(pdfBlob);
      });

      await writeFile(outputPdfPath, buffer);
      console.log(`PDF wygenerowano: ${outputPdfPath}`);
  } catch (error) {
      console.error('Błąd:', error.message);
      process.exit(1);
  }
})();
