"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaneIdentyfikacyjneTPodmiot3Dto = generateDaneIdentyfikacyjneTPodmiot3Dto;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const functions_1 = require("../../../shared/generators/common/functions");
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjne_1 = require("./PodmiotDaneIdentyfikacyjne");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generateDaneIdentyfikacyjneTPodmiot3Dto(podmiot2KDto, index) {
    if (!podmiot2KDto) {
        return [];
    }
    const podmiot1 = podmiot2KDto.fakturaPodmiotNDto;
    const podmiot1K = podmiot2KDto.podmiot2KDto;
    const result = (0, PDF_functions_1.createHeader)(`Podmiot inny ${index + 1}`);
    if ((0, PDF_functions_1.hasValue)(podmiot1.NrEORI) ||
        (0, PDF_functions_1.hasValue)(podmiot1.Rola) ||
        (0, PDF_functions_1.hasValue)(podmiot1.OpisRoli) ||
        (0, PDF_functions_1.hasValue)(podmiot1?.Udzial)) {
        result.push(...(0, PDF_functions_1.createSubHeader)('Dane identyfikacyjne'), (0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot1.NrEORI), (0, PDF_functions_1.createLabelText)('Rola: ', (0, functions_1.translateMap)(podmiot1.Rola, FA_const_1.FA1RolaPodmiotu3)), (0, PDF_functions_1.createLabelText)('Rola inna: ', podmiot1.OpisRoli), (0, PDF_functions_1.createLabelText)('Udział: ', podmiot1.Udzial, common_enum_1.default.Percentage));
    }
    if (podmiot1.Email || podmiot1.Telefon) {
        result.push((0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot1.Email, (0, PDF_functions_1.getTable)(podmiot1.Telefon)));
    }
    if ((0, PDF_functions_1.hasValue)(podmiot1.NrKlienta)) {
        result.push((0, PDF_functions_1.createLabelText)('Numer klienta: ', podmiot1.NrKlienta));
    }
    const columns1 = [...(0, PDF_functions_1.createSubHeader)('Treść korygowana')];
    if ((0, PDF_functions_1.hasValue)(podmiot1K?.DaneIdentyfikacyjne?.NrID)) {
        columns1.push((0, PDF_functions_1.createLabelText)('Identyfikator podatkowy inny: ', podmiot1K?.DaneIdentyfikacyjne?.NrID));
    }
    if ((0, PDF_functions_1.getValue)(podmiot1K?.DaneIdentyfikacyjne?.BrakID) === '1') {
        columns1.push((0, PDF_functions_1.createLabelText)('Brak identyfikatora ', ' '));
    }
    if (podmiot1K?.DaneIdentyfikacyjne) {
        columns1.push((0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot1K.DaneIdentyfikacyjne));
    }
    if (podmiot1K?.Adres) {
        columns1.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot1K.Adres, 'Adres', true));
    }
    const columns2 = [...(0, PDF_functions_1.createSubHeader)('Treść korygująca')];
    if ((0, PDF_functions_1.hasValue)(podmiot1.DaneIdentyfikacyjne?.NrID)) {
        columns2.push((0, PDF_functions_1.createLabelText)('Identyfikator podatkowy inny: ', podmiot1.DaneIdentyfikacyjne?.NrID));
    }
    if ((0, PDF_functions_1.getValue)(podmiot1.DaneIdentyfikacyjne?.BrakID) === '1') {
        columns2.push((0, PDF_functions_1.createLabelText)('Brak identyfikatora ', ' '));
    }
    if (podmiot1?.DaneIdentyfikacyjne) {
        columns2.push((0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot1.DaneIdentyfikacyjne));
    }
    if (podmiot1?.Adres) {
        columns2.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot1.Adres, 'Adres', true));
    }
    if (podmiot1.AdresKoresp != null) {
        columns2.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot1.AdresKoresp, 'Adres korespondencyjny', true));
    }
    result.push((0, PDF_functions_1.generateTwoColumns)(columns1, columns2));
    return result;
}
