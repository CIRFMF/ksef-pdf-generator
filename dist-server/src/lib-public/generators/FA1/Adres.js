"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdres = generateAdres;
const PDF_functions_1 = require("../../../shared/PDF-functions");
function generateAdres(adres) {
    const result = [];
    if (adres.AdresZagr) {
        const adresZagr = adres.AdresZagr;
        if (adresZagr.KodKraju) {
            result.push((0, PDF_functions_1.createLabelText)('Kraj: ', adresZagr.KodKraju));
        }
        if (adresZagr.Ulica) {
            result.push((0, PDF_functions_1.createLabelText)('Ulica: ', adresZagr.Ulica));
        }
        if (adresZagr.NrDomu) {
            result.push((0, PDF_functions_1.createLabelText)('Numer domu: ', adresZagr.NrDomu));
        }
        if (adresZagr.NrLokalu) {
            result.push((0, PDF_functions_1.createLabelText)('Numer lokalu: ', adresZagr.NrLokalu));
        }
        if (adresZagr.KodPocztowy) {
            result.push((0, PDF_functions_1.createLabelText)('Kod pocztowy: ', adresZagr.KodPocztowy));
        }
        if (adresZagr.Miejscowosc) {
            result.push((0, PDF_functions_1.createLabelText)('Miejscowość: ', adresZagr.Miejscowosc));
        }
        if (adresZagr.GLN) {
            result.push((0, PDF_functions_1.createLabelText)('GLN: ', adresZagr.GLN));
        }
    }
    if (adres.AdresPol) {
        const adresPol = adres.AdresPol;
        if (adresPol.Wojewodztwo) {
            result.push((0, PDF_functions_1.createLabelText)('Województwo: ', adresPol.Wojewodztwo));
        }
        if (adresPol.Powiat) {
            result.push((0, PDF_functions_1.createLabelText)('Powiat: ', adresPol.Powiat));
        }
        if (adresPol.Gmina) {
            result.push((0, PDF_functions_1.createLabelText)('Gmina: ', adresPol.Gmina));
        }
        if (adresPol.Ulica) {
            result.push((0, PDF_functions_1.createLabelText)('Ulica: ', adresPol.Ulica));
        }
        if (adresPol.NrDomu) {
            result.push((0, PDF_functions_1.createLabelText)('Numer domu: ', adresPol.NrDomu));
        }
        if (adresPol.NrLokalu) {
            result.push((0, PDF_functions_1.createLabelText)('Numer lokalu: ', adresPol.NrLokalu));
        }
        if (adresPol.KodPocztowy) {
            result.push((0, PDF_functions_1.createLabelText)('Kod pocztowy: ', adresPol.KodPocztowy));
        }
        if (adresPol.Miejscowosc) {
            result.push((0, PDF_functions_1.createLabelText)('Miejscowość: ', adresPol.Miejscowosc));
        }
        if (adresPol.Poczta) {
            result.push((0, PDF_functions_1.createLabelText)('Poczta: ', adresPol.Poczta));
        }
        if (adresPol.GLN) {
            result.push((0, PDF_functions_1.createLabelText)('GLN: ', adresPol.GLN));
        }
    }
    return result;
}
