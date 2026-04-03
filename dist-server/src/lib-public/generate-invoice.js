"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoice = generateInvoice;
const FA1_generator_1 = require("./FA1-generator");
const FA2_generator_1 = require("./FA2-generator");
const FA3_generator_1 = require("./FA3-generator");
const XML_parser_1 = require("../shared/XML-parser");
const FARR_generator_1 = require("./FARR-generator");
async function generateInvoice(file, additionalData, formatType = 'blob') {
    const xml = await (0, XML_parser_1.parseXML)(file);
    const wersja = xml?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;
    let pdf;
    return new Promise((resolve) => {
        switch (wersja) {
            case 'FA (1)':
                pdf = (0, FA1_generator_1.generateFA1)(xml.Faktura, additionalData);
                break;
            case 'FA (2)':
                pdf = (0, FA2_generator_1.generateFA2)(xml.Faktura, additionalData);
                break;
            case 'FA (3)':
                pdf = (0, FA3_generator_1.generateFA3)(xml.Faktura, additionalData);
                break;
            case 'FA_RR (1)':
            case 'FA_RR(1)':
                pdf = (0, FARR_generator_1.generateFARR)(xml.Faktura, additionalData);
                break;
        }
        switch (formatType) {
            case 'blob':
                pdf.getBlob((blob) => {
                    resolve(blob);
                });
                break;
            case 'base64':
            default:
                pdf.getBase64((base64) => {
                    resolve(base64);
                });
        }
    });
}
