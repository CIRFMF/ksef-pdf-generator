"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlatnosc = generatePlatnosc;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const RachunekBankowy_1 = require("./RachunekBankowy");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const functions_1 = require("../../../shared/generators/common/functions");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePlatnosc(platnosc) {
    if (!platnosc) {
        return [];
    }
    const terminPlatnosci = (0, PDF_functions_1.getTable)(platnosc.TerminyPlatnosci);
    const zaplataCzesciowaHeader = [
        {
            name: 'TerminPlatnosci',
            title: 'Termin płatności',
            format: common_enum_1.default.Date,
        },
    ];
    if (terminPlatnosci.some((termin) => termin.TerminPlatnosciOpis)) {
        zaplataCzesciowaHeader.push({
            name: 'TerminPlatnosciOpis',
            title: 'Opis płatności',
            format: common_enum_1.default.Date,
        });
    }
    const zaplataCzesciowaNaglowek = [
        {
            name: 'DataZaplatyCzesciowej',
            title: 'Data zapłaty częściowej',
            format: common_enum_1.default.Date,
        },
        { name: 'KwotaZaplatyCzesciowej', title: 'Kwota zapłaty częściowej', format: common_enum_1.default.Currency },
        { name: 'FormaPlatnosci', title: 'Forma płatności', format: common_enum_1.default.FormOfPayment },
    ];
    const table = [(0, PDF_functions_1.generateLine)(), ...(0, PDF_functions_1.createHeader)('Płatność')];
    if (platnosc.Zaplacono?._text === '1') {
        table.push((0, PDF_functions_1.createLabelText)('Informacja o płatności: ', 'Zapłacono'));
        table.push((0, PDF_functions_1.createLabelText)('Data zapłaty: ', platnosc.DataZaplaty, common_enum_1.default.Date));
    }
    else if (platnosc.ZaplataCzesciowa?._text === '1') {
        table.push((0, PDF_functions_1.createLabelText)('Informacja o płatności: ', 'Zapłata częściowa'));
    }
    else {
        table.push((0, PDF_functions_1.createLabelText)('Informacja o płatności: ', 'Brak zapłaty'));
    }
    if ((0, PDF_functions_1.hasValue)(platnosc.FormaPlatnosci)) {
        table.push((0, PDF_functions_1.createLabelText)('Forma płatności: ', (0, functions_1.translateMap)(platnosc.FormaPlatnosci, FA_const_1.FormaPlatnosci)));
    }
    else {
        if (platnosc.OpisPlatnosci?._text) {
            table.push((0, PDF_functions_1.createLabelText)('Forma płatności: ', 'Płatność inna'));
            table.push((0, PDF_functions_1.createLabelText)('Opis płatności innej: ', platnosc.OpisPlatnosci));
        }
    }
    const zaplataCzesciowa = (0, PDF_functions_1.getTable)(platnosc.PlatnosciCzesciowe);
    const tableZaplataCzesciowa = (0, PDF_functions_1.getContentTable)(zaplataCzesciowaNaglowek, zaplataCzesciowa, '*');
    const terminPatnosciContent = terminPlatnosci.map((platnosc) => {
        if (!terminPlatnosci.some((termin) => termin.TerminPlatnosciOpis)) {
            return platnosc;
        }
        else {
            return {
                ...platnosc,
                TerminPlatnosciOpis: {
                    _text: `${platnosc.TerminPlatnosciOpis?._text ?? ''}`,
                },
            };
        }
    });
    const tableTerminPlatnosci = (0, PDF_functions_1.getContentTable)(zaplataCzesciowaHeader, terminPatnosciContent, '*');
    if (zaplataCzesciowa.length > 0 && terminPlatnosci.length > 0) {
        table.push((0, PDF_functions_1.generateTwoColumns)(tableZaplataCzesciowa.content ?? [], tableTerminPlatnosci.content ?? [], [0, 4, 0, 0]));
    }
    else if (terminPlatnosci.length > 0) {
        if (tableTerminPlatnosci.content) {
            table.push((0, PDF_functions_1.generateTwoColumns)([], tableTerminPlatnosci.content));
        }
    }
    else if (zaplataCzesciowa.length > 0 && tableZaplataCzesciowa.content) {
        table.push(tableZaplataCzesciowa.content);
    }
    const rachunekBankowy = (0, PDF_functions_1.getTable)(platnosc.RachunekBankowy).map((rachunek) => (0, RachunekBankowy_1.generujRachunekBankowy)([rachunek], 'Numer rachunku bankowego'));
    const rachunekBankowyFaktora = (0, PDF_functions_1.getTable)(platnosc.RachunekBankowyFaktora).map((rachunek) => (0, RachunekBankowy_1.generujRachunekBankowy)([rachunek], 'Numer rachunku bankowego faktora'));
    const rachunkiBankowe = [...rachunekBankowy, ...rachunekBankowyFaktora];
    if (rachunkiBankowe.length > 0) {
        rachunkiBankowe.forEach((rachunek, index) => {
            if (index % 2 === 0) {
                table.push((0, PDF_functions_1.generateTwoColumns)(rachunek, rachunkiBankowe[index + 1] ?? []));
            }
        });
    }
    if (platnosc.Skonto) {
        table.push((0, PDF_functions_1.createHeader)('Skonto', [0, 0]));
        table.push((0, PDF_functions_1.createLabelText)('Warunki skonta: ', platnosc.Skonto.WarunkiSkonta));
        table.push((0, PDF_functions_1.createLabelText)('Wysokość skonta: ', platnosc.Skonto.WysokoscSkonta));
    }
    return table;
}
