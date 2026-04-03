"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDodatkoweInformacje = generateDodatkoweInformacje;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateDodatkoweInformacje(faVat) {
    const tpLabel = [];
    if ((0, PDF_functions_1.getValue)(faVat.TP) === '1') {
        tpLabel.push((0, PDF_functions_1.formatText)('- Istniejące powiązania między nabywcą a dokonującym dostawy towarów lub usługodawcą'));
    }
    const fpLabel = [];
    if ((0, PDF_functions_1.getValue)(faVat.FP) === '1') {
        fpLabel.push((0, PDF_functions_1.formatText)('- Faktura, o której mowa w art. 109 ust. 3d ustawy'));
    }
    const zwrotAkcyzyLabel = [];
    if ((0, PDF_functions_1.getValue)(faVat.ZwrotAkcyzy) === '1') {
        zwrotAkcyzyLabel.push((0, PDF_functions_1.formatText)('- Informacja dodatkowa związana ze zwrotem podatku akcyzowego zawartego w cenie oleju napędowego'));
    }
    const labels = [tpLabel, fpLabel, zwrotAkcyzyLabel].filter((el) => el.length > 0);
    const table = [
        ...(0, PDF_functions_1.createHeader)('Dodatkowe informacje'),
        ...labels,
        ...generateDodatkowyOpis(faVat.DodatkowyOpis),
    ];
    return table.length > 1 ? (0, PDF_functions_1.createSection)(table, true) : [];
}
function generateDodatkowyOpis(fakturaZaliczkowaData) {
    if (!fakturaZaliczkowaData) {
        return [];
    }
    const fakturaZaliczkowa = (0, PDF_functions_1.getTable)(fakturaZaliczkowaData)?.map((item, index) => ({
        ...item,
        lp: { _text: index + 1 },
    }));
    const table = (0, PDF_functions_1.createSubHeader)('Dodatkowy opis');
    const fakturaZaliczkowaHeader = [
        {
            name: 'lp',
            title: 'Lp.',
            format: common_enum_1.default.Default,
            width: 'auto',
        },
        {
            name: 'NrWiersza',
            title: 'Numer wiersza',
            format: common_enum_1.default.Default,
            width: 'auto',
        },
        {
            name: 'Klucz',
            title: 'Rodzaj informacji',
            format: common_enum_1.default.Default,
            width: 'auto',
        },
        {
            name: 'Wartosc',
            title: 'Treść informacji',
            format: common_enum_1.default.Default,
            width: '*',
        },
    ];
    const tableFakturaZaliczkowa = (0, PDF_functions_1.getContentTable)(fakturaZaliczkowaHeader, fakturaZaliczkowa, '*', [0, 0, 0, 0]);
    if (tableFakturaZaliczkowa.content) {
        table.push(tableFakturaZaliczkowa.content);
    }
    return table;
}
