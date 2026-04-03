"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot1 = generatePodmiot1;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjne_1 = require("./PodmiotDaneIdentyfikacyjne");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePodmiot1(podmiot1) {
    const result = (0, PDF_functions_1.createHeader)('Sprzedawca');
    result.push((0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot1.NrEORI), (0, PDF_functions_1.createLabelText)('Prefiks VAT: ', podmiot1.PrefiksPodatnika));
    if (podmiot1.DaneIdentyfikacyjne) {
        result.push(...(0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot1.DaneIdentyfikacyjne));
    }
    if (podmiot1.Adres) {
        result.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot1.Adres, 'Adres', true, [0, 12, 0, 1.3]));
    }
    if (podmiot1.AdresKoresp) {
        result.push(...(0, PodmiotAdres_1.generatePodmiotAdres)(podmiot1.AdresKoresp, 'Adres do korespondencji', true, [0, 12, 0, 1.3]));
    }
    if (podmiot1.Email || podmiot1.Telefon) {
        result.push((0, PDF_functions_1.formatText)('Dane kontaktowe', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), ...(0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot1.Email, (0, PDF_functions_1.getTable)(podmiot1.Telefon)));
    }
    if ((0, PDF_functions_1.hasValue)(podmiot1.StatusInfoPodatnika)) {
        const statusInfo = FA_const_1.TAXPAYER_STATUS[(0, PDF_functions_1.getValue)(podmiot1.StatusInfoPodatnika)];
        result.push((0, PDF_functions_1.createLabelText)('Status podatnika: ', statusInfo));
    }
    return result;
}
