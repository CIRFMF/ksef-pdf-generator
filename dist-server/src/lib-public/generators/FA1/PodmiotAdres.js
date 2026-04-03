"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiotAdres = generatePodmiotAdres;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const Adres_1 = require("./Adres");
function generatePodmiotAdres(podmiotAdres, headerTitle = 'Adres', isSubheader = false, headerMargin) {
    if (!podmiotAdres) {
        return [];
    }
    return [
        ...(isSubheader ? (0, PDF_functions_1.createSubHeader)(headerTitle, headerMargin) : (0, PDF_functions_1.createHeader)(headerTitle, headerMargin)),
        ...(0, Adres_1.generateAdres)(podmiotAdres),
    ];
}
