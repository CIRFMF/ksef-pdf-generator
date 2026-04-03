"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmioty = generatePodmioty;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const Podmiot1_1 = require("./Podmiot1");
const Podmiot1Podmiot1K_1 = require("./Podmiot1Podmiot1K");
const Podmiot2_1 = require("./Podmiot2");
const Podmiot3_1 = require("./Podmiot3");
const Podmiot3Podmiot2k_1 = require("./Podmiot3Podmiot2k");
const PodmiotUpowazniony_1 = require("./PodmiotUpowazniony");
const Podmiot2Podmiot2k_1 = require("./Podmiot2Podmiot2k");
function generatePodmioty(invoice) {
    const result = [];
    const podmiot2KTable = (0, PDF_functions_1.getTable)(invoice.Fa?.Podmiot2K);
    const podmiot3 = (0, PDF_functions_1.getTable)(invoice.Podmiot3);
    if (invoice.Fa?.Podmiot1K || podmiot2KTable.length > 0) {
        if (invoice.Fa?.Podmiot1K) {
            result.push((0, Podmiot1Podmiot1K_1.generatePodmiot1Podmiot1K)(invoice.Podmiot1 ?? {}, invoice.Fa?.Podmiot1K));
        }
        else if (invoice.Podmiot1 != null) {
            result.push((0, Podmiot1_1.generatePodmiot1)(invoice.Podmiot1));
        }
        if (invoice.Fa?.Podmiot2K) {
            const podmiot2K = podmiot2KTable.find((podmiot) => (0, PDF_functions_1.getValue)(podmiot.IDNabywcy) === (0, PDF_functions_1.getValue)(invoice.Podmiot2?.IDNabywcy));
            if (podmiot2K) {
                result.push((0, Podmiot2Podmiot2k_1.generatePodmiot2Podmiot2K)(invoice.Podmiot2 ?? {}, podmiot2K));
            }
            else {
                result.push((0, PDF_functions_1.createSection)((0, Podmiot2_1.generatePodmiot2)(invoice.Podmiot2), true));
            }
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
        const podmiot3Podmiot2KDto = getPodmiot3Podmiot2KDto(podmiot2KTable, podmiot3);
        podmiot3Podmiot2KDto.filter((podmiot3Podmiot2) => podmiot3Podmiot2.fakturaPodmiotNDto.IDNabywcy === invoice.Podmiot2?.IDNabywcy);
        if (podmiot3Podmiot2KDto.length > 0) {
            podmiot3Podmiot2KDto.forEach((pdm2KDto, i) => {
                if (pdm2KDto.podmiot2KDto) {
                    result.push((0, Podmiot3Podmiot2k_1.generateDaneIdentyfikacyjneTPodmiot3Dto)(pdm2KDto, i));
                }
                else {
                    result.push((0, Podmiot3_1.generatePodmiot3)(pdm2KDto.fakturaPodmiotNDto, i));
                }
                if (i < podmiot3Podmiot2KDto.length - 1) {
                    result.push({ margin: [0, 8, 0, 0], text: '' });
                }
            });
        }
        else {
            podmiot3.forEach((podmiot, index) => {
                result.push((0, Podmiot3_1.generatePodmiot3)(podmiot, index));
                if (index < podmiot3.length - 1) {
                    result.push({ margin: [0, 8, 0, 0], text: '' });
                }
            });
        }
    }
    result.push((0, PodmiotUpowazniony_1.generatePodmiotUpowazniony)(invoice.PodmiotUpowazniony));
    return (0, PDF_functions_1.createSection)(result, true, [0, 0, 0, 0]);
}
function getPodmiot3Podmiot2KDto(podmioty2K, podmioty3) {
    const result = [];
    if (podmioty3.filter((p) => (0, PDF_functions_1.getValue)(p.Rola) === '4').length > 0) {
        podmioty3.forEach((podmiot3) => {
            if ((0, PDF_functions_1.getValue)(podmiot3.Rola) === '4') {
                result.push({
                    fakturaPodmiotNDto: podmiot3,
                    podmiot2KDto: podmioty2K.find((podmiot) => (0, PDF_functions_1.getValue)(podmiot.IDNabywcy) === (0, PDF_functions_1.getValue)(podmiot3.IDNabywcy)),
                });
            }
            else {
                result.push({
                    fakturaPodmiotNDto: podmiot3,
                });
            }
        });
    }
    return result;
}
