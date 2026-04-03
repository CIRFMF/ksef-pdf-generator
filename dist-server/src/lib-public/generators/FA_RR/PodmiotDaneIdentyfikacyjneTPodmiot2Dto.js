"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaneIdentyfikacyjneTPodmiot2Dto = generateDaneIdentyfikacyjneTPodmiot2Dto;
const PDF_functions_1 = require("../../../shared/PDF-functions");
function generateDaneIdentyfikacyjneTPodmiot2Dto(daneIdentyfikacyjne) {
    return [
        (0, PDF_functions_1.createLabelText)('NIP: ', daneIdentyfikacyjne.NIP),
        (0, PDF_functions_1.createLabelText)('Nazwa: ', daneIdentyfikacyjne.Nazwa),
    ];
}
