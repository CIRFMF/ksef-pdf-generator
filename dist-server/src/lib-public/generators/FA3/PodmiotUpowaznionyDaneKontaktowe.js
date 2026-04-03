"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiotUpowaznionyDaneKontaktowe = generatePodmiotUpowaznionyDaneKontaktowe;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generatePodmiotUpowaznionyDaneKontaktowe(daneKontaktoweSource) {
    if (!daneKontaktoweSource) {
        return [];
    }
    const result = [(0, PDF_functions_1.formatText)('Dane kontaktowe', common_enum_1.default.Description)];
    const daneKontaktowe = (0, PDF_functions_1.getTable)(daneKontaktoweSource);
    if (daneKontaktowe.length === 0) {
        return [];
    }
    daneKontaktowe.forEach((kontakt) => {
        if ((0, PDF_functions_1.hasValue)(kontakt.EmailPU)) {
            result.push((0, PDF_functions_1.createLabelText)('E-mail: ', kontakt.EmailPU));
        }
        if ((0, PDF_functions_1.hasValue)(kontakt.TelefonPU)) {
            result.push((0, PDF_functions_1.createLabelText)('Tel.: ', kontakt.TelefonPU));
        }
        result.push((0, PDF_functions_1.verticalSpacing)(1));
    });
    return result;
}
