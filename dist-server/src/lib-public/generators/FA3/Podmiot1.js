"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot1 = generatePodmiot1;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const Adres_1 = require("./Adres");
const PodmiotDaneIdentyfikacyjneTPodmiot1Dto_1 = require("./PodmiotDaneIdentyfikacyjneTPodmiot1Dto");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePodmiot1(podmiot1) {
    const result = (0, PDF_functions_1.createHeader)('Sprzedawca');
    result.push((0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot1.NrEORI), (0, PDF_functions_1.createLabelText)('Prefiks VAT: ', podmiot1.PrefiksPodatnika));
    if (podmiot1.DaneIdentyfikacyjne) {
        result.push(...(0, PodmiotDaneIdentyfikacyjneTPodmiot1Dto_1.generateDaneIdentyfikacyjneTPodmiot1Dto)(podmiot1.DaneIdentyfikacyjne));
    }
    if (podmiot1.Adres) {
        result.push((0, PDF_functions_1.formatText)('Adres', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), (0, Adres_1.generateAdres)(podmiot1.Adres));
    }
    if (podmiot1.AdresKoresp) {
        result.push((0, PDF_functions_1.formatText)('Adres do korespondencji', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), ...(0, Adres_1.generateAdres)(podmiot1.AdresKoresp));
    }
    if (podmiot1.DaneKontaktowe) {
        result.push((0, PDF_functions_1.formatText)('Dane kontaktowe', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), ...(0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot1.DaneKontaktowe));
    }
    if ((0, PDF_functions_1.hasValue)(podmiot1.StatusInfoPodatnika)) {
        const statusInfo = FA_const_1.TAXPAYER_STATUS[(0, PDF_functions_1.getValue)(podmiot1.StatusInfoPodatnika)];
        result.push((0, PDF_functions_1.createLabelText)('Status podatnika: ', statusInfo));
    }
    return result;
}
