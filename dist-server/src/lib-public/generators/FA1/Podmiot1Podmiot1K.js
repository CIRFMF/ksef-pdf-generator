"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot1Podmiot1K = generatePodmiot1Podmiot1K;
exports.generateCorrectedContent = generateCorrectedContent;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjne_1 = require("./PodmiotDaneIdentyfikacyjne");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePodmiot1Podmiot1K(podmiot1, podmiot1K) {
    const result = (0, PDF_functions_1.createHeader)('Sprzedawca');
    let firstColumn = [];
    let secondColumn = [];
    firstColumn.push((0, PDF_functions_1.createSubHeader)('Dane identyfikacyjne'), (0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot1.NrEORI));
    if (podmiot1.DaneIdentyfikacyjne) {
        firstColumn.push(...(0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot1.DaneIdentyfikacyjne));
    }
    if (podmiot1.Email || podmiot1.Telefon) {
        firstColumn.push((0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot1.Email, (0, PDF_functions_1.getTable)(podmiot1.Telefon)));
    }
    if (podmiot1.StatusInfoPodatnika) {
        const statusInfo = FA_const_1.TAXPAYER_STATUS[(0, PDF_functions_1.getValue)(podmiot1.StatusInfoPodatnika)];
        firstColumn.push((0, PDF_functions_1.createLabelText)('Status podatnika: ', statusInfo));
    }
    if (firstColumn.length) {
        result.push(firstColumn);
    }
    firstColumn = generateCorrectedContent(podmiot1K, 'Treść korygowana');
    secondColumn = generateCorrectedContent(podmiot1, 'Treść korygująca');
    if (podmiot1.AdresKoresp) {
        secondColumn.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot1.AdresKoresp, 'Adres do korespondencji', true, [0, 12, 0, 1.3]));
    }
    if (firstColumn.length || secondColumn.length) {
        result.push((0, PDF_functions_1.generateColumns)([firstColumn, secondColumn]));
    }
    if (result.length) {
        result.push((0, PDF_functions_1.verticalSpacing)(1));
    }
    return result;
}
function generateCorrectedContent(podmiot, headerText) {
    const result = [];
    result.push((0, PDF_functions_1.createSubHeader)(headerText));
    if (podmiot.PrefiksPodatnika?._text) {
        result.push((0, PDF_functions_1.createLabelText)('Prefiks VAT: ', podmiot.PrefiksPodatnika));
    }
    if (podmiot.DaneIdentyfikacyjne) {
        result.push(...(0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot.DaneIdentyfikacyjne));
    }
    if (podmiot.Adres) {
        result.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot.Adres, 'Adres', true, [0, 12, 0, 1.3]));
    }
    return result;
}
