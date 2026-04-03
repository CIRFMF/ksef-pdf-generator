"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiotUpowazniony = generatePodmiotUpowazniony;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjneTPodmiot1Dto_1 = require("./PodmiotDaneIdentyfikacyjneTPodmiot1Dto");
const PodmiotUpowaznionyDaneKontaktowe_1 = require("./PodmiotUpowaznionyDaneKontaktowe");
const functions_1 = require("../../../shared/generators/common/functions");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePodmiotUpowazniony(podmiotUpowazniony) {
    if (!podmiotUpowazniony) {
        return [];
    }
    const result = (0, PDF_functions_1.createHeader)('Podmiot upoważniony');
    if ((0, PDF_functions_1.hasValue)(podmiotUpowazniony.RolaPU)) {
        result.push((0, PDF_functions_1.createLabelText)('Rola: ', (0, functions_1.translateMap)(podmiotUpowazniony.RolaPU, FA_const_1.TRolaPodmiotuUpowaznionegoFA2)));
    }
    if ((0, PDF_functions_1.hasValue)(podmiotUpowazniony.NrEORI)) {
        result.push((0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiotUpowazniony.NrEORI));
    }
    if (podmiotUpowazniony.DaneIdentyfikacyjne) {
        result.push((0, PodmiotDaneIdentyfikacyjneTPodmiot1Dto_1.generateDaneIdentyfikacyjneTPodmiot1Dto)(podmiotUpowazniony.DaneIdentyfikacyjne));
    }
    result.push([
        ...(0, PodmiotAdres_1.generatePodmiotAdres)(podmiotUpowazniony.Adres),
        ...(0, PodmiotAdres_1.generatePodmiotAdres)(podmiotUpowazniony.AdresKoresp, 'Adres korespondencyjny'),
        ...(0, PodmiotUpowaznionyDaneKontaktowe_1.generatePodmiotUpowaznionyDaneKontaktowe)(podmiotUpowazniony.DaneKontaktowe),
    ]);
    return result;
}
