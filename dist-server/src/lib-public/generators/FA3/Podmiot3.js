"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot3 = generatePodmiot3;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const PodmiotDaneIdentyfikacyjneTPodmiot3Dto_1 = require("./PodmiotDaneIdentyfikacyjneTPodmiot3Dto");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const functions_1 = require("../../../shared/generators/common/functions");
const Adres_1 = require("../FA2/Adres");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePodmiot3(podmiot, index) {
    const result = [];
    result.push((0, PDF_functions_1.generateLine)());
    const column1 = [
        ...(0, PDF_functions_1.createHeader)(`Podmiot inny ${index + 1}`),
        (0, PDF_functions_1.createLabelText)('Identyfikator nabywcy: ', podmiot.IDNabywcy),
        (0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot.NrEORI),
        ...(0, PodmiotDaneIdentyfikacyjneTPodmiot3Dto_1.generateDaneIdentyfikacyjneTPodmiot3Dto)(podmiot.DaneIdentyfikacyjne),
        (0, PDF_functions_1.createLabelText)('Rola: ', (0, functions_1.translateMap)(podmiot.Rola, FA_const_1.FA3RolaPodmiotu3)),
        (0, PDF_functions_1.createLabelText)('Rola inna: ', podmiot.OpisRoli),
        (0, PDF_functions_1.createLabelText)('Udział: ', podmiot.Udzial, [common_enum_1.default.Percentage]),
    ];
    const column2 = [];
    if (podmiot.Adres) {
        column2.push((0, PDF_functions_1.formatText)('Adres', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), (0, Adres_1.generateAdres)(podmiot.Adres));
    }
    if (podmiot.AdresKoresp) {
        column2.push((0, PDF_functions_1.formatText)('Adres do korespondencji', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), ...(0, Adres_1.generateAdres)(podmiot.AdresKoresp));
    }
    if (podmiot.DaneKontaktowe || podmiot.NrKlienta) {
        column2.push((0, PDF_functions_1.formatText)('Dane kontaktowe', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]));
        if (podmiot.DaneKontaktowe) {
            column2.push(...(0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot.DaneKontaktowe));
        }
        if (podmiot.NrKlienta) {
            column2.push((0, PDF_functions_1.createLabelText)('Numer klienta: ', podmiot.NrKlienta));
        }
    }
    result.push((0, PDF_functions_1.generateTwoColumns)(column1, column2));
    return result;
}
