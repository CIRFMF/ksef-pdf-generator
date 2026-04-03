"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlatnosc = generatePlatnosc;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const RachunekBankowy_1 = require("./RachunekBankowy");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generatePlatnosc(platnosc) {
    if (!platnosc) {
        return [];
    }
    const table = [(0, PDF_functions_1.generateLine)(), ...(0, PDF_functions_1.createHeader)('Płatność')];
    if ((0, PDF_functions_1.hasValue)(platnosc.FormaPlatnosci)) {
        table.push((0, PDF_functions_1.createLabelText)('Forma zapłaty: ', 'Przelew'));
    }
    else {
        if ((0, PDF_functions_1.hasValue)(platnosc.OpisPlatnosci)) {
            table.push((0, PDF_functions_1.createLabelText)('Forma zapłaty: ', 'Inna'));
            table.push((0, PDF_functions_1.createLabelText)('Opis: ', platnosc.OpisPlatnosci));
        }
    }
    if ((0, PDF_functions_1.hasValue)(platnosc.LinkDoPlatnosci)) {
        table.push((0, PDF_functions_1.formatText)('Link do płatności bezgotówkowej: ', common_enum_1.default.Label));
        table.push({
            text: (0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(platnosc.LinkDoPlatnosci), common_enum_1.default.Link),
            link: (0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(platnosc.LinkDoPlatnosci), common_enum_1.default.Link),
        });
    }
    if ((0, PDF_functions_1.hasValue)(platnosc.IPKSeF)) {
        table.push((0, PDF_functions_1.createLabelText)('Identyfikator płatności Krajowego Systemu e-Faktur: ', platnosc.IPKSeF));
    }
    const rachunekBankowy1 = (0, PDF_functions_1.getTable)(platnosc.RachunekBankowy1).map((rachunek) => (0, RachunekBankowy_1.generujRachunekBankowy)([rachunek], 'Rachunek bankowy rolnika'));
    const rachunekBankowy2 = (0, PDF_functions_1.getTable)(platnosc.RachunekBankowy2).map((rachunek) => (0, RachunekBankowy_1.generujRachunekBankowy)([rachunek], 'Rachunek bankowy nabywcy'));
    const rachunekBankowy = [...rachunekBankowy1, ...rachunekBankowy2];
    if (rachunekBankowy.length > 0) {
        rachunekBankowy.forEach((rachunek, index) => {
            if (index % 2 === 0) {
                table.push((0, PDF_functions_1.generateTwoColumns)(rachunek, rachunekBankowy[index + 1] ?? []));
            }
        });
    }
    table.push({ margin: [0, 8, 0, 0], text: '' });
    return table;
}
