"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot2 = generatePodmiot2;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const Adres_1 = require("./Adres");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const FA_const_1 = require("../../../shared/consts/FA.const");
const PodmiotDaneIdentyfikacyjneTPodmiot2Dto_1 = require("./PodmiotDaneIdentyfikacyjneTPodmiot2Dto");
function generatePodmiot2(podmiot2) {
    const result = (0, PDF_functions_1.createHeader)('Nabywca');
    if (podmiot2.DaneIdentyfikacyjne) {
        result.push(...(0, PodmiotDaneIdentyfikacyjneTPodmiot2Dto_1.generateDaneIdentyfikacyjneTPodmiot2Dto)(podmiot2.DaneIdentyfikacyjne));
    }
    if (podmiot2.Adres) {
        result.push((0, PDF_functions_1.formatText)('Adres', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), (0, Adres_1.generateAdres)(podmiot2.Adres));
    }
    if (podmiot2.AdresKoresp) {
        result.push((0, PDF_functions_1.formatText)('Adres do korespondencji', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), ...(0, Adres_1.generateAdres)(podmiot2.AdresKoresp));
    }
    if (podmiot2.DaneKontaktowe) {
        result.push((0, PDF_functions_1.formatText)('Dane kontaktowe', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), ...(0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot2.DaneKontaktowe));
    }
    if ((0, PDF_functions_1.hasValue)(podmiot2.StatusInfoPodatnika)) {
        const statusInfo = FA_const_1.TAXPAYER_STATUS[(0, PDF_functions_1.getValue)(podmiot2.StatusInfoPodatnika)];
        result.push((0, PDF_functions_1.createLabelText)('Status podatnika: ', statusInfo));
    }
    return result;
}
