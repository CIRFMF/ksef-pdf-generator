"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrzewoznik = generatePrzewoznik;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjne_1 = require("./PodmiotDaneIdentyfikacyjne");
function generatePrzewoznik(przewoznik) {
    if (!przewoznik) {
        return [];
    }
    return [
        ...(0, PDF_functions_1.createHeader)('Przewoźnik'),
        [
            (0, PDF_functions_1.generateTwoColumns)((0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(przewoznik.DaneIdentyfikacyjne), (0, PodmiotAdres_1.generatePodmiotAdres)(przewoznik.AdresPrzewoznika, 'Adres przewoźnika', true, [0, 0, 0, 0]), [0, 0, 0, 8]),
        ],
    ];
}
