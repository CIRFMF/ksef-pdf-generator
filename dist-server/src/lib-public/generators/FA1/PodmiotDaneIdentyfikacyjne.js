"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaneIdentyfikacyjne = generateDaneIdentyfikacyjne;
const PDF_functions_1 = require("../../../shared/PDF-functions");
function generateDaneIdentyfikacyjne(daneIdentyfikacyjne) {
    const result = [];
    result.push((0, PDF_functions_1.createLabelText)('NIP: ', daneIdentyfikacyjne.NIP));
    if ((0, PDF_functions_1.hasValue)(daneIdentyfikacyjne.ImiePierwsze) || (0, PDF_functions_1.hasValue)(daneIdentyfikacyjne.Nazwisko)) {
        result.push((0, PDF_functions_1.createLabelText)('Imię i nazwisko: ', `${(0, PDF_functions_1.getValue)(daneIdentyfikacyjne.ImiePierwsze)} ${(0, PDF_functions_1.getValue)(daneIdentyfikacyjne.Nazwisko)}`));
    }
    if (daneIdentyfikacyjne.PelnaNazwa) {
        result.push((0, PDF_functions_1.createLabelText)('Pełna nazwa: ', daneIdentyfikacyjne.PelnaNazwa));
    }
    if (daneIdentyfikacyjne.Nazwisko) {
        result.push((0, PDF_functions_1.createLabelText)('Nazwa handlowa: ', daneIdentyfikacyjne.NazwaHandlowa));
    }
    return result;
}
