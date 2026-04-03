"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiot2Podmiot2K = generatePodmiot2Podmiot2K;
exports.generateCorrectedContent = generateCorrectedContent;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjne_1 = require("./PodmiotDaneIdentyfikacyjne");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
function generatePodmiot2Podmiot2K(podmiot2, podmiot2K) {
    const result = [];
    result.push((0, PDF_functions_1.generateLine)());
    result.push((0, PDF_functions_1.createHeader)('Nabywca'));
    let firstColumn = [];
    let secondColumn = [];
    firstColumn.push((0, PDF_functions_1.createSubHeader)('Dane identyfikacyjne'), (0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot2.NrEORI));
    if (podmiot2.DaneIdentyfikacyjne) {
        firstColumn.push(...(0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot2.DaneIdentyfikacyjne));
    }
    if (podmiot2.Email || podmiot2.Telefon) {
        firstColumn.push((0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot2.Email, (0, PDF_functions_1.getTable)(podmiot2.Telefon)));
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
        secondColumn.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot2.AdresKoresp, 'Adres do korespondencji', true, [0, 12, 0, 1.3]));
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
    if ((0, PDF_functions_1.hasValue)(podmiot.PrefiksNabywcy)) {
        result.push((0, PDF_functions_1.createLabelText)('Prefiks VAT: ', podmiot.PrefiksNabywcy));
    }
    if (podmiot.DaneIdentyfikacyjne) {
        if ((0, PDF_functions_1.hasValue)(podmiot.DaneIdentyfikacyjne.NrID)) {
            result.push((0, PDF_functions_1.createLabelText)('Identyfikator podatkowy inny: ', podmiot.DaneIdentyfikacyjne.NrID));
        }
        if ((0, PDF_functions_1.getValue)(podmiot.DaneIdentyfikacyjne.BrakID) === '1') {
            result.push((0, PDF_functions_1.createLabelText)('Brak identyfikatora ', ' '));
        }
        result.push(...(0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot.DaneIdentyfikacyjne));
    }
    if (podmiot.Adres) {
        result.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot.Adres, 'Adres', true, [0, 12, 0, 1.3]));
    }
    return result;
}
