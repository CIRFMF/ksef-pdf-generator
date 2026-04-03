"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdres = generateAdres;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateAdres(adres) {
    const result = [];
    if (adres?.AdresL1) {
        result.push((0, PDF_functions_1.formatText)(adres.AdresL1._text, common_enum_1.default.Value));
    }
    if (adres?.AdresL2) {
        result.push((0, PDF_functions_1.formatText)(adres.AdresL2._text, common_enum_1.default.Value));
    }
    if (adres?.KodKraju) {
        result.push((0, PDF_functions_1.formatText)((0, PDF_functions_1.getKraj)(adres.KodKraju._text ?? ''), common_enum_1.default.Value));
    }
    result.push(...(0, PDF_functions_1.createLabelText)('GLN: ', adres.GLN));
    return result;
}
