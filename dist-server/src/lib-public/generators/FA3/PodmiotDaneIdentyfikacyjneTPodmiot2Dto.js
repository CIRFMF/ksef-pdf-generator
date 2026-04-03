"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaneIdentyfikacyjneTPodmiot2Dto = generateDaneIdentyfikacyjneTPodmiot2Dto;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateDaneIdentyfikacyjneTPodmiot2Dto(daneIdentyfikacyjne) {
    const result = [];
    result.push((0, PDF_functions_1.createLabelText)('NIP: ', daneIdentyfikacyjne.NIP));
    if (daneIdentyfikacyjne.NrVatUE?._text) {
        result.push((0, PDF_functions_1.createLabelTextArray)([
            { value: 'Numer VAT-UE: ', formatTyp: common_enum_1.default.Label },
            { value: daneIdentyfikacyjne.KodUE, formatTyp: common_enum_1.default.Value },
            { value: ' ' },
            { value: daneIdentyfikacyjne.NrVatUE, formatTyp: common_enum_1.default.Value },
        ]));
    }
    if (daneIdentyfikacyjne.NrID?._text) {
        result.push((0, PDF_functions_1.createLabelTextArray)([
            { value: 'Identyfikator podatkowy inny: ', formatTyp: common_enum_1.default.Label },
            { value: daneIdentyfikacyjne.KodKraju || '', formatTyp: common_enum_1.default.Value },
            { value: ' ' },
            { value: daneIdentyfikacyjne.NrID, formatTyp: common_enum_1.default.Value },
        ]));
    }
    if (daneIdentyfikacyjne.BrakID?._text === '1') {
        result.push((0, PDF_functions_1.formatText)('Brak identyfikatora', common_enum_1.default.Label));
    }
    result.push((0, PDF_functions_1.createLabelText)('Nazwa: ', daneIdentyfikacyjne.Nazwa));
    return result;
}
