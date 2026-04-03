"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmioty = generatePodmioty;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const Podmiot1_1 = require("./Podmiot1");
const Podmiot2_1 = require("./Podmiot2");
const Podmiot3_1 = require("./Podmiot3");
const Podmiot1Podmiot1K_1 = require("./Podmiot1Podmiot1K");
const Podmiot2Podmiot2k_1 = require("./Podmiot2Podmiot2k");
function generatePodmioty(invoice) {
    const result = [];
    const podmiot3 = (0, PDF_functions_1.getTable)(invoice.Podmiot3);
    if (invoice.FakturaRR?.Podmiot1K || invoice.FakturaRR?.Podmiot2K) {
        if (invoice.FakturaRR?.Podmiot1K) {
            result.push((0, Podmiot1Podmiot1K_1.generatePodmiot1Podmiot1K)(invoice.Podmiot1 ?? {}, invoice.FakturaRR?.Podmiot1K));
        }
        else if (invoice.Podmiot1 != null) {
            result.push((0, Podmiot1_1.generatePodmiot1)(invoice.Podmiot1));
        }
        if (invoice.FakturaRR?.Podmiot2K) {
            result.push((0, Podmiot2Podmiot2k_1.generatePodmiot2Podmiot2K)(invoice.Podmiot2 ?? {}, invoice.FakturaRR?.Podmiot2K));
        }
        else if (invoice.Podmiot2) {
            result.push((0, PDF_functions_1.createSection)((0, Podmiot2_1.generatePodmiot2)(invoice.Podmiot2), true));
        }
    }
    else {
        result.push([
            (0, PDF_functions_1.generateColumns)([(0, Podmiot1_1.generatePodmiot1)(invoice.Podmiot1), (0, Podmiot2_1.generatePodmiot2)(invoice.Podmiot2)], {
                margin: [0, 0, 0, 8],
                columnGap: 20,
            }),
        ]);
    }
    if (podmiot3.length > 0) {
        podmiot3.forEach((podmiot, index) => {
            result.push((0, Podmiot3_1.generatePodmiot3)(podmiot, index));
            if (index < podmiot3.length - 1) {
                result.push({ margin: [0, 8, 0, 0], text: '' });
            }
        });
    }
    return (0, PDF_functions_1.createSection)(result, true, [0, 0, 0, 0]);
}
