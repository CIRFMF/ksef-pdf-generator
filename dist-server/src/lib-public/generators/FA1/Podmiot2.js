"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot2 = generatePodmiot2;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjne_1 = require("./PodmiotDaneIdentyfikacyjne");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
function generatePodmiot2(podmiot2) {
    const result = (0, PDF_functions_1.createHeader)('Nabywca');
    result.push((0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot2.NrEORI));
    if ((0, PDF_functions_1.hasValue)(podmiot2.PrefiksNabywcy)) {
        result.push((0, PDF_functions_1.createLabelText)('Prefiks VAT: ', podmiot2.PrefiksNabywcy));
    }
    if (podmiot2.DaneIdentyfikacyjne) {
        if ((0, PDF_functions_1.hasValue)(podmiot2.DaneIdentyfikacyjne.NrID)) {
            result.push((0, PDF_functions_1.createLabelText)('Identyfikator podatkowy inny: ', podmiot2.DaneIdentyfikacyjne.NrID));
        }
        if ((0, PDF_functions_1.getValue)(podmiot2.DaneIdentyfikacyjne.BrakID) === '1') {
            result.push((0, PDF_functions_1.createLabelText)('Brak identyfikatora ', ' '));
        }
        result.push(...(0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot2.DaneIdentyfikacyjne));
    }
    if (podmiot2.Adres) {
        result.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot2.Adres, 'Adres', true, [0, 12, 0, 1.3]));
    }
    if (podmiot2.AdresKoresp) {
        result.push(...(0, PodmiotAdres_1.generatePodmiotAdres)(podmiot2.AdresKoresp, 'Adres do korespondencji', true, [0, 12, 0, 1.3]));
    }
    if (podmiot2.Email || podmiot2.Telefon) {
        result.push((0, PDF_functions_1.formatText)('Dane kontaktowe', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), ...(0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot2.Email, (0, PDF_functions_1.getTable)(podmiot2.Telefon)));
    }
    if (podmiot2.NrKlienta) {
        result.push((0, PDF_functions_1.createLabelText)('Numer klienta: ', podmiot2.NrKlienta));
    }
    return result;
}
