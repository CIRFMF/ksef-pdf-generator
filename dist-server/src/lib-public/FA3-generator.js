"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFA3 = generateFA3;
const pdfmake_1 = __importDefault(require("pdfmake/build/pdfmake"));
const vfs_fonts_1 = __importDefault(require("pdfmake/build/vfs_fonts"));
const PDF_functions_1 = require("../shared/PDF-functions");
const FA_const_1 = require("../shared/consts/FA.const");
const Adnotacje_1 = require("./generators/FA3/Adnotacje");
const DodatkoweInformacje_1 = require("./generators/FA3/DodatkoweInformacje");
const Platnosc_1 = require("./generators/FA3/Platnosc");
const Podmioty_1 = require("./generators/FA3/Podmioty");
const PodsumowanieStawekPodatkuVat_1 = require("./generators/FA3/PodsumowanieStawekPodatkuVat");
const Rabat_1 = require("./generators/FA3/Rabat");
const Szczegoly_1 = require("./generators/FA3/Szczegoly");
const WarunkiTransakcji_1 = require("./generators/FA3/WarunkiTransakcji");
const Wiersze_1 = require("./generators/FA3/Wiersze");
const Zamowienie_1 = require("./generators/FA3/Zamowienie");
const DaneFaKorygowanej_1 = require("./generators/common/DaneFaKorygowanej");
const Naglowek_1 = require("./generators/common/Naglowek");
const Rozliczenie_1 = require("./generators/common/Rozliczenie");
const Stopka_1 = require("./generators/common/Stopka");
const invoice_enums_1 = require("./enums/invoice.enums");
const common_enum_1 = require("../shared/enums/common.enum");
pdfmake_1.default.vfs = vfs_fonts_1.default.vfs;
function generateFA3(invoice, additionalData) {
    const isKOR_RABAT = invoice.Fa?.RodzajFaktury?._text == FA_const_1.TRodzajFaktury.KOR && (0, PDF_functions_1.hasValue)(invoice.Fa?.OkresFaKorygowanej);
    const rabatOrRowsInvoice = isKOR_RABAT ? (0, Rabat_1.generateRabat)(invoice.Fa) : (0, Wiersze_1.generateWiersze)(invoice.Fa);
    const docDefinition = {
        content: [
            ...(0, Naglowek_1.generateNaglowek)(invoice.Fa, additionalData, invoice.Zalacznik),
            (0, DaneFaKorygowanej_1.generateDaneFaKorygowanej)(invoice.Fa),
            ...(0, Podmioty_1.generatePodmioty)(invoice),
            (0, Szczegoly_1.generateSzczegoly)(invoice.Fa),
            rabatOrRowsInvoice,
            (0, Zamowienie_1.generateZamowienie)(invoice.Fa?.Zamowienie, invoice_enums_1.ZamowienieKorekta.Order, invoice.Fa?.P_15?._text ?? '', invoice.Fa?.RodzajFaktury?._text ?? '', invoice.Fa?.KodWaluty?._text ?? '', (0, PDF_functions_1.getValue)(invoice.Fa?.Adnotacje?.PMarzy?.P_PMarzy)),
            (0, PodsumowanieStawekPodatkuVat_1.generatePodsumowanieStawekPodatkuVat)(invoice),
            (0, Adnotacje_1.generateAdnotacje)(invoice.Fa?.Adnotacje),
            (0, DodatkoweInformacje_1.generateDodatkoweInformacje)(invoice.Fa),
            (0, Rozliczenie_1.generateRozliczenie)(invoice.Fa?.Rozliczenie, invoice.Fa?.KodWaluty?._text ?? ''),
            (0, Platnosc_1.generatePlatnosc)(invoice.Fa?.Platnosc),
            (0, WarunkiTransakcji_1.generateWarunkiTransakcji)(invoice.Fa?.WarunkiTransakcji),
            ...(0, Stopka_1.generateStopka)(additionalData, invoice.Stopka, invoice.Naglowek, invoice.Fa?.WZ, invoice.Zalacznik),
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
