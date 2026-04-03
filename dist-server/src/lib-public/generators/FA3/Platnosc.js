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
    const terminPlatnosci = (0, PDF_functions_1.getTable)(platnosc.TerminPlatnosci);
    const zaplataCzesciowaHeader = [
        {
            name: 'Termin',
            title: 'Termin płatności',
            format: common_enum_1.default.Date,
        },
    ];
    if (terminPlatnosci.some((termin) => termin.TerminOpis)) {
        zaplataCzesciowaHeader.push({ name: 'TerminOpis', title: 'Opis płatności', format: common_enum_1.default.Date });
    }
    const table = [(0, PDF_functions_1.generateLine)(), ...(0, PDF_functions_1.createHeader)('Płatność')];
    //  TODO: Add to FA2 and FA1? (KSEF20-15289)
    if ((0, PDF_functions_1.getValue)(platnosc.Zaplacono) === '1') {
        table.push((0, PDF_functions_1.createLabelText)('Informacja o płatności: ', 'Zapłacono'));
        table.push((0, PDF_functions_1.createLabelText)('Data zapłaty: ', platnosc.DataZaplaty, common_enum_1.default.Date));
    }
    else if ((0, PDF_functions_1.getValue)(platnosc.ZnacznikZaplatyCzesciowej) === '1' ||
        (0, PDF_functions_1.getValue)(platnosc.ZnacznikZaplatyCzesciowej) === '2') {
        table.push((0, PDF_functions_1.createLabelText)('Informacja o płatności: ', 'Zapłata częściowa'));
        table.push((0, PDF_functions_1.createLabelText)('Informacja o płatności (kontynuacja): ', (0, PDF_functions_1.getValue)(platnosc.ZnacznikZaplatyCzesciowej) === '1'
            ? 'Zapłacono w części'
            : 'Zapłacono całość w częściach'));
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
    const zaplataCzesciowa = (0, PDF_functions_1.getTable)(platnosc.ZaplataCzesciowa);
    const tableZaplataCzesciowa = prepareContentTable();
    function prepareContentTable() {
        const definedHeader = [
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.makeBreakable)('Data zapłaty częściowej', 20), common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.makeBreakable)('Kwota zapłaty częściowej', 20), common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.makeBreakable)('Forma płatności', 20), common_enum_1.default.GrayBoldTitle),
        ];
        const defineTableBody = zaplataCzesciowa.map((item) => {
            const value = [];
            value.push((0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(item.DataZaplatyCzesciowej), common_enum_1.default.Date), (0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(item.KwotaZaplatyCzesciowej), common_enum_1.default.Currency));
            if (item.PlatnoscInna) {
                value.push((0, PDF_functions_1.formatText)((0, PDF_functions_1.makeBreakable)((0, PDF_functions_1.getValue)(item.OpisPlatnosci) ?? '', 20), common_enum_1.default.Default));
            }
            else {
                value.push((0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(item.FormaPlatnosci), common_enum_1.default.FormOfPayment));
            }
            return value;
        });
        return {
            content: {
                table: {
                    headerRows: 1,
                    keepWithHeaderRows: 1,
                    widths: ['*', '*', '*'],
                    body: [definedHeader, ...defineTableBody],
                },
                margin: [0, 0, 0, 8],
                layout: FA_const_1.DEFAULT_TABLE_LAYOUT,
            },
        };
    }
    const terminPatnosciContent = terminPlatnosci.map((platnosc) => {
        if (!terminPlatnosci.some((termin) => termin.TerminOpis)) {
            return platnosc;
        }
        else {
            return {
                ...platnosc,
                TerminOpis: {
                    _text: `${platnosc.TerminOpis?.Ilosc?._text ?? ''} ${platnosc.TerminOpis?.Jednostka?._text ?? ''} ${platnosc.TerminOpis?.ZdarzeniePoczatkowe?._text ?? ''}`,
                },
            };
        }
    });
    const tableTerminPlatnosci = (0, PDF_functions_1.getContentTable)(zaplataCzesciowaHeader, terminPatnosciContent, '*', undefined, 20);
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
    if (platnosc.LinkDoPlatnosci) {
        table.push((0, PDF_functions_1.formatText)('Link do płatności bezgotówkowej: ', common_enum_1.default.Label));
        table.push({
            text: (0, PDF_functions_1.formatText)(platnosc.LinkDoPlatnosci._text, common_enum_1.default.Link),
            link: (0, PDF_functions_1.formatText)(platnosc.LinkDoPlatnosci._text, common_enum_1.default.Link),
        });
    }
    if (platnosc.IPKSeF?._text) {
        table.push((0, PDF_functions_1.createLabelText)('Identyfikator płatności Krajowego Systemu e-Faktur: ', platnosc.IPKSeF));
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
