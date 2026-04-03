"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFARR = generateFARR;
const pdfmake_1 = __importDefault(require("pdfmake/build/pdfmake"));
const vfs_fonts_1 = __importDefault(require("pdfmake/build/vfs_fonts"));
const PDF_functions_1 = require("../shared/PDF-functions");
const Naglowek_1 = require("./generators/FA_RR/Naglowek");
const Podmioty_1 = require("./generators/FA_RR/Podmioty");
const DaneFaKorygowanej_1 = require("./generators/common/DaneFaKorygowanej");
const Szczegoly_1 = require("./generators/FA_RR/Szczegoly");
const Wiersze_1 = require("./generators/FA_RR/Wiersze");
const DodatkoweInformacje_1 = require("./generators/FA_RR/DodatkoweInformacje");
const Rozliczenie_1 = require("./generators/common/Rozliczenie");
const Platnosc_1 = require("./generators/FA_RR/Platnosc");
const Stopka_1 = require("./generators/common/Stopka");
const common_enum_1 = require("../shared/enums/common.enum");
pdfmake_1.default.vfs = vfs_fonts_1.default.vfs;
function generateFARR(invoice, additionalData) {
    const docDefinition = {
        content: [
            ...(0, Naglowek_1.generateNaglowek)(invoice.FakturaRR, additionalData),
            (0, DaneFaKorygowanej_1.generateDaneFaKorygowanej)(invoice.FakturaRR),
            ...(0, Podmioty_1.generatePodmioty)(invoice),
            (0, Szczegoly_1.generateSzczegoly)(invoice.FakturaRR),
            (0, Wiersze_1.generateWiersze)(invoice.FakturaRR),
            (0, DodatkoweInformacje_1.generateDodatkoweInformacje)(invoice.FakturaRR),
            (0, Rozliczenie_1.generateRozliczenie)(invoice.FakturaRR?.Rozliczenie, invoice.FakturaRR?.KodWaluty?._text ?? ''),
            (0, Platnosc_1.generatePlatnosc)(invoice.FakturaRR?.Platnosc),
            ...(0, Stopka_1.generateStopka)(additionalData, invoice.Stopka, invoice.Naglowek),
        ],
        footer: (currentPage, pageCount) => {
            return {
                text: currentPage.toString() + ' z ' + pageCount,
                alignment: common_enum_1.Position.RIGHT,
                margin: [0, 0, 40, 0],
            };
        },
        ...(0, PDF_functions_1.generateStyle)(),
    };
    return pdfmake_1.default.createPdf(docDefinition);
}
