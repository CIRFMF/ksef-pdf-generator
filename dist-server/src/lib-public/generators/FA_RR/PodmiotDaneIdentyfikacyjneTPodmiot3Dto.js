"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaneIdentyfikacyjneTPodmiot3Dto = generateDaneIdentyfikacyjneTPodmiot3Dto;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateDaneIdentyfikacyjneTPodmiot3Dto(daneIdentyfikacyjne) {
    if (!daneIdentyfikacyjne) {
        return [];
    }
    const result = [];
    if ((0, PDF_functions_1.hasValue)(daneIdentyfikacyjne.NIP)) {
        result.push((0, PDF_functions_1.createLabelText)('NIP: ', daneIdentyfikacyjne.NIP, common_enum_1.default.Default));
    }
    else if ((0, PDF_functions_1.hasValue)(daneIdentyfikacyjne.IDWew)) {
        result.push((0, PDF_functions_1.createLabelText)('Identyfikator wewnętrzny: ', daneIdentyfikacyjne.IDWew, common_enum_1.default.Default));
    }
    else if ((0, PDF_functions_1.getValue)(daneIdentyfikacyjne.BrakID) === '1') {
        result.push((0, PDF_functions_1.createLabelText)('Brak identyfikatora', ' ', common_enum_1.default.Default));
    }
    if ((0, PDF_functions_1.hasValue)(daneIdentyfikacyjne.Nazwa)) {
        result.push((0, PDF_functions_1.createLabelText)('Nazwa: ', daneIdentyfikacyjne.Nazwa, common_enum_1.default.Default));
    }
    return result;
}
