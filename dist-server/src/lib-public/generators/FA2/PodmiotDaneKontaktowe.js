"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaneKontaktowe = generateDaneKontaktowe;
const PDF_functions_1 = require("../../../shared/PDF-functions");
function generateDaneKontaktowe(daneKontaktowe) {
    return (0, PDF_functions_1.getTable)(daneKontaktowe)?.map((daneKontaktowe) => {
        return [
            (0, PDF_functions_1.createLabelText)('E-mail: ', daneKontaktowe.Email),
            (0, PDF_functions_1.createLabelText)('Tel.: ', daneKontaktowe.Telefon),
        ];
    });
}
