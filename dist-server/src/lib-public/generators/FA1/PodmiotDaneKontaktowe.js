"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaneKontaktowe = generateDaneKontaktowe;
const PDF_functions_1 = require("../../../shared/PDF-functions");
function generateDaneKontaktowe(email, telefon) {
    const result = [];
    if (email) {
        result.push((0, PDF_functions_1.createLabelText)('Email: ', email));
    }
    if (telefon) {
        telefon.forEach((item) => {
            result.push((0, PDF_functions_1.createLabelText)('Tel.: ', `${item._text}\n`));
        });
    }
    return result;
}
