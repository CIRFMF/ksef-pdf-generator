"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot1Podmiot1K = generatePodmiot1Podmiot1K;
exports.generateCorrectedContent = generateCorrectedContent;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const PodmiotDaneIdentyfikacyjneTPodmiot1Dto_1 = require("./PodmiotDaneIdentyfikacyjneTPodmiot1Dto");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const Adres_1 = require("./Adres");
function generatePodmiot1Podmiot1K(podmiot1, podmiot1K) {
    const result = (0, PDF_functions_1.createHeader)('Sprzedawca');
    let firstColumn = [];
    let secondColumn = [];
    if (podmiot1.DaneIdentyfikacyjne) {
        firstColumn.push((0, PDF_functions_1.createHeader)('Dane identyfikacyjne'), ...(0, PodmiotDaneIdentyfikacyjneTPodmiot1Dto_1.generateDaneIdentyfikacyjneTPodmiot1Dto)(podmiot1.DaneIdentyfikacyjne));
    }
    if (podmiot1.DaneKontaktowe) {
        const daneKontaktowe = (0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)((0, PDF_functions_1.getTable)(podmiot1.DaneKontaktowe));
        if (daneKontaktowe.length) {
            firstColumn.push((0, PDF_functions_1.createHeader)('Dane kontaktowe'));
            firstColumn.push(daneKontaktowe);
        }
    }
    if ((0, PDF_functions_1.hasValue)(podmiot1.NrKontrahenta)) {
        firstColumn.push((0, PDF_functions_1.createLabelText)('Numer kontrahenta: ', (0, PDF_functions_1.getValue)(podmiot1.NrKontrahenta)));
    }
    if (firstColumn.length) {
        result.push({
            columns: [firstColumn, []],
            columnGap: 20,
        });
    }
    firstColumn = generateCorrectedContent(podmiot1K, 'Treść korygowana');
    secondColumn = generateCorrectedContent(podmiot1, 'Treść korygująca');
    if (podmiot1.AdresKoresp) {
        secondColumn.push((0, PDF_functions_1.formatText)('Adres do korespondencji', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), (0, Adres_1.generateAdres)(podmiot1.AdresKoresp));
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
    if (podmiot.DaneIdentyfikacyjne) {
        result.push(...(0, PodmiotDaneIdentyfikacyjneTPodmiot1Dto_1.generateDaneIdentyfikacyjneTPodmiot1Dto)(podmiot.DaneIdentyfikacyjne));
    }
    if (podmiot.Adres) {
        result.push((0, PDF_functions_1.formatText)('Adres', [common_enum_1.default.Label, common_enum_1.default.LabelMargin]), (0, Adres_1.generateAdres)(podmiot.Adres));
    }
    return result;
}
