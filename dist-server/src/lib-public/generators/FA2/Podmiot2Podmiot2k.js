"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot2Podmiot2K = generatePodmiot2Podmiot2K;
exports.generateCorrectedContent = generateCorrectedContent;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const Adres_1 = require("./Adres");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const PodmiotDaneIdentyfikacyjneTPodmiot2Dto_1 = require("./PodmiotDaneIdentyfikacyjneTPodmiot2Dto");
function generatePodmiot2Podmiot2K(podmiot2, podmiot2K) {
    const result = [];
    result.push((0, PDF_functions_1.generateLine)());
    result.push((0, PDF_functions_1.createHeader)('Nabywca'));
    let firstColumn = [];
    let secondColumn = [];
    firstColumn.push((0, PDF_functions_1.createHeader)('Dane identyfikacyjne'), (0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot2.NrEORI));
    if (podmiot2.DaneIdentyfikacyjne) {
        firstColumn.push(...(0, PodmiotDaneIdentyfikacyjneTPodmiot2Dto_1.generateDaneIdentyfikacyjneTPodmiot2Dto)(podmiot2.DaneIdentyfikacyjne));
    }
    if (podmiot2.DaneKontaktowe) {
        firstColumn.push((0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)((0, PDF_functions_1.getTable)(podmiot2.DaneKontaktowe)));
    }
    if (podmiot2.NrKlienta) {
        firstColumn.push((0, PDF_functions_1.createLabelText)('Numer klienta: ', podmiot2.NrKlienta));
    }
    if (firstColumn.length) {
        result.push({
            columns: [firstColumn, []],
            columnGap: 20,
        });
    }
    if (podmiot2K.DaneIdentyfikacyjne) {
        firstColumn = generateCorrectedContent(podmiot2K, 'Treść korygowana');
        secondColumn = generateCorrectedContent(podmiot2, 'Treść korygująca');
    }
    if (podmiot2.AdresKoresp) {
        secondColumn.push((0, PDF_functions_1.formatText)('Adres do korespondencji', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), (0, Adres_1.generateAdres)(podmiot2.AdresKoresp));
    }
    if (firstColumn.length || secondColumn.length) {
        result.push((0, PDF_functions_1.generateColumns)([firstColumn, secondColumn]));
    }
    if (result.length) {
        result.push((0, PDF_functions_1.verticalSpacing)(1));
    }
    return result;
}
function generateCorrectedContent(podmiot, header) {
    const result = [];
    result.push((0, PDF_functions_1.createHeader)(header));
    if ((0, PDF_functions_1.hasValue)(podmiot.IDNabywcy)) {
        result.push((0, PDF_functions_1.createLabelText)('Identyfikator nabywcy: ', podmiot.IDNabywcy));
    }
    if (podmiot.DaneIdentyfikacyjne) {
        result.push(...(0, PodmiotDaneIdentyfikacyjneTPodmiot2Dto_1.generateDaneIdentyfikacyjneTPodmiot2Dto)(podmiot.DaneIdentyfikacyjne));
    }
    if (podmiot.Adres) {
        result.push((0, PDF_functions_1.formatText)('Adres', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), (0, Adres_1.generateAdres)(podmiot.Adres));
    }
    return result;
}
