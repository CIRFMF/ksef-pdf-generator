"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePdf = generateInvoicePdf;
exports.generateUpoPdf = generateUpoPdf;
exports.closeBrowser = closeBrowser;
// src/server/pdfService.ts
// WAŻNE: Import polyfills MUSI być PIERWSZY
require("./browser-polyfills");
const lib_public_1 = require("../lib-public");
/**
 * Generates invoice PDF from XML string
 * Uses the ORIGINAL KSeF library (with browser polyfills)
 */
async function generateInvoicePdf(xml, additionalData) {
    try {
        console.log(`[${new Date().toISOString()}] Generating invoice PDF (${xml.length} bytes)`);
        // 1. Convert XML string to File (browser-compatible)
        const file = new File([xml], 'invoice.xml', { type: 'text/xml' });
        // 2. Additional data (KSeF number, QR code) z fallbackiem
        const defaultAdditionalData = {
            nrKSeF: 'Numer faktury nie został przydzielony',
            qrCode: '' // Pusty string lub undefined
        };
        // Użyj przekazanych danych, ale sprawdź czy są niepuste
        const data = {
            nrKSeF: additionalData?.nrKSeF && additionalData.nrKSeF.trim() !== ''
                ? additionalData.nrKSeF
                : defaultAdditionalData.nrKSeF,
            qrCode: additionalData?.qrCode && additionalData.qrCode.trim() !== ''
                ? additionalData.qrCode
                : defaultAdditionalData.qrCode
        };
        // const defaultAdditionalData: AdditionalDataTypes = {
        // nrKSeF: '5555555555-20250808-9231003CA67B-BE',
        // qrCode: 'https://qr-test.ksef.mf.gov.pl/invoice/5265877635/26-10-2025/HS5E1zrA8WVjDNq_xMVIN5SD6nyRymmQ-BcYHReUAa0'
        // };
        //const data = additionalData || defaultAdditionalData;
        // Log KSeF details
        console.log(`[${new Date().toISOString()}] Using KSeF data:`);
        console.log(`  • nrKSeF: ${data.nrKSeF || '(not provided)'}`);
        console.log(`  • qrCode: ${data.qrCode ? data.qrCode.substring(0, 60) + '...' : '(not provided)'}`);
        // 3. Call ORIGINAL library function (same as frontend)
        const blob = await (0, lib_public_1.generateInvoice)(file, data, 'blob');
        // 4. Convert Blob to Uint8Array
        const arrayBuffer = await blob.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        console.log(`[${new Date().toISOString()}] Invoice PDF generated: ${pdfBytes.length} bytes`);
        return pdfBytes;
    }
    catch (err) {
        console.error('Error generating invoice PDF:', err);
        throw new Error(`Invoice PDF generation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
}
/**
 * Generates UPO PDF from XML string
 */
async function generateUpoPdf(xml) {
    try {
        console.log(`[${new Date().toISOString()}] Generating UPO PDF (${xml.length} bytes)`);
        const file = new File([xml], 'upo.xml', { type: 'text/xml' });
        const blob = await (0, lib_public_1.generatePDFUPO)(file);
        const arrayBuffer = await blob.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        console.log(`[${new Date().toISOString()}] UPO PDF generated: ${pdfBytes.length} bytes`);
        return pdfBytes;
    }
    catch (err) {
        console.error('Error generating UPO PDF:', err);
        throw new Error(`UPO PDF generation failed: ${err instanceof Error ? err.message : String(err)}`);
    }
}
/**
 * Stub - no cleanup needed
 */
async function closeBrowser() {
    console.log('No browser to close - using pdfMake');
}
