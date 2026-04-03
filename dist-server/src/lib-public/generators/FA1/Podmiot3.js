"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot3 = generatePodmiot3;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjne_1 = require("./PodmiotDaneIdentyfikacyjne");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const functions_1 = require("../../../shared/generators/common/functions");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePodmiot3(podmiot, index) {
    const result = [];
    const column1 = [
        ...(0, PDF_functions_1.createHeader)(`Podmiot inny ${index + 1}`),
        (0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot.NrEORI),
    ];
    if ((0, PDF_functions_1.hasValue)(podmiot.DaneIdentyfikacyjne?.NrID)) {
        column1.push((0, PDF_functions_1.createLabelText)('Identyfikator podatkowy inny: ', podmiot.DaneIdentyfikacyjne?.NrID));
    }
    if ((0, PDF_functions_1.getValue)(podmiot.DaneIdentyfikacyjne?.BrakID) === '1') {
        column1.push((0, PDF_functions_1.createLabelText)('Brak identyfikatora ', ' '));
    }
    if (podmiot.DaneIdentyfikacyjne) {
        column1.push(...(0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot.DaneIdentyfikacyjne));
    }
    column1.push([
        (0, PDF_functions_1.createLabelText)('Rola: ', (0, functions_1.translateMap)(podmiot.Rola, FA_const_1.FA1RolaPodmiotu3)),
        (0, PDF_functions_1.createLabelText)('Rola inna: ', podmiot.OpisRoli),
        (0, PDF_functions_1.createLabelText)('Udział: ', podmiot.Udzial, [common_enum_1.default.Percentage]),
    ]);
    const column2 = [];
    if (podmiot.Adres) {
        column2.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot.Adres, 'Adres', true, [0, 12, 0, 1.3]));
    }
    if (podmiot.AdresKoresp) {
        column2.push(...(0, PodmiotAdres_1.generatePodmiotAdres)(podmiot.AdresKoresp, 'Adres do korespondencji', true, [0, 12, 0, 1.3]));
    }
    if (podmiot.Email || podmiot.Telefon) {
        column2.push((0, PDF_functions_1.formatText)('Dane kontaktowe', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), ...(0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot.Email, (0, PDF_functions_1.getTable)(podmiot.Telefon)));
    }
    if (podmiot.NrKlienta) {
        column2.push((0, PDF_functions_1.createLabelText)('Numer klienta: ', podmiot.NrKlienta));
    }
    result.push((0, PDF_functions_1.generateTwoColumns)(column1, column2));
    return (0, PDF_functions_1.createSection)(result, true);
}
