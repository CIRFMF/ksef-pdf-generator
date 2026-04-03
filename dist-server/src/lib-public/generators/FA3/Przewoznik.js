"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrzewoznik = generatePrzewoznik;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjneTPodmiot2Dto_1 = require("./PodmiotDaneIdentyfikacyjneTPodmiot2Dto");
function generatePrzewoznik(przewoznik) {
    if (!przewoznik) {
        return [];
    }
    return [
        ...(0, PDF_functions_1.createHeader)('Przewoźnik'),
        [
            (0, PDF_functions_1.generateTwoColumns)((0, PodmiotDaneIdentyfikacyjneTPodmiot2Dto_1.generateDaneIdentyfikacyjneTPodmiot2Dto)(przewoznik.DaneIdentyfikacyjne), (0, PodmiotAdres_1.generatePodmiotAdres)(przewoznik.AdresPrzewoznika, 'Adres przewoźnika', true, [0, 0, 0, 0]), [0, 0, 0, 8]),
        ],
    ];
}
