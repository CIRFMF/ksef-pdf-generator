"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodmiotUpowazniony = generatePodmiotUpowazniony;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const PodmiotAdres_1 = require("./PodmiotAdres");
const PodmiotDaneIdentyfikacyjne_1 = require("./PodmiotDaneIdentyfikacyjne");
const PodmiotDaneKontaktowe_1 = require("./PodmiotDaneKontaktowe");
const functions_1 = require("../../../shared/generators/common/functions");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePodmiotUpowazniony(podmiot) {
    if (!podmiot) {
        return [];
    }
    const result = (0, PDF_functions_1.createHeader)('Podmiot upoważniony');
    const columnLeft = [];
    const columnRight = [];
    if ((0, PDF_functions_1.hasValue)(podmiot.RolaPU)) {
        columnLeft.push((0, PDF_functions_1.createLabelText)('Rola: ', (0, functions_1.translateMap)(podmiot.RolaPU, FA_const_1.TRolaPodmiotuUpowaznionegoFA1)));
    }
    if ((0, PDF_functions_1.hasValue)(podmiot.NrEORI)) {
        columnLeft.push((0, PDF_functions_1.createLabelText)('Numer EORI: ', podmiot.NrEORI));
    }
    if (podmiot.DaneIdentyfikacyjne) {
        if ((0, PDF_functions_1.hasValue)(podmiot.DaneIdentyfikacyjne.NrID)) {
            columnLeft.push((0, PDF_functions_1.createLabelText)('Identyfikator podatkowy inny: ', podmiot.DaneIdentyfikacyjne.NrID));
        }
        if ((0, PDF_functions_1.getValue)(podmiot.DaneIdentyfikacyjne.BrakID) === '1') {
            columnLeft.push((0, PDF_functions_1.createLabelText)('Brak identyfikatora ', ' '));
        }
        columnLeft.push((0, PodmiotDaneIdentyfikacyjne_1.generateDaneIdentyfikacyjne)(podmiot.DaneIdentyfikacyjne));
    }
    if (podmiot.Adres) {
        columnRight.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot.Adres, 'Adres', true));
    }
    if (podmiot.AdresKoresp) {
        columnRight.push((0, PodmiotAdres_1.generatePodmiotAdres)(podmiot.AdresKoresp, 'Adres do korespondencji', true));
    }
    if (podmiot.EmailPU || podmiot.TelefonPU) {
        columnRight.push((0, PDF_functions_1.formatText)('Dane kontaktowe', [common_enum_1.default.Label]), ...(0, PodmiotDaneKontaktowe_1.generateDaneKontaktowe)(podmiot.EmailPU, (0, PDF_functions_1.getTable)(podmiot.TelefonPU)));
    }
    result.push((0, PDF_functions_1.generateTwoColumns)(columnLeft, columnRight));
    return result;
}
