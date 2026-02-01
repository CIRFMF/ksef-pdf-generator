#!/usr/bin/env node
const fs = require('fs');
const { readFile, writeFile } = fs.promises;
const path = require('path');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
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
    console.error('Użycie: node generate-pdf-wrapper.mjs <invoice|faktura|upo> <inputXml> <outputPdf> [additionalDataJson]');
    process.exit(1);
}
const allowedTypes = ['invoice', 'faktura', 'upo'];
if (!allowedTypes.includes(documentType.toLowerCase())) {
    console.error(`Invalid document type "${type}". Allowed: ${allowedTypes.join(', ')}`);
    process.exit(1);
}

(async function main() {
  try {
      const xmlBuffer = await readFile(inputXmlPath);
      const xmlFile = new File([xmlBuffer], inputXmlPath.split(/[/\\]/).pop() || 'input.xml', { type: 'application/xml' });

      const docType = documentType.toLowerCase();
      const isInvoice = docType === 'invoice' || docType === 'faktura';
      
      const pdfBlob = isInvoice
          ? await generateInvoice(xmlFile, additionalDataJson ? JSON.parse(additionalDataJson) : {}, 'blob')
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
