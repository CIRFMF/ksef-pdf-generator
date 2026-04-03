"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDodatkoweInformacje = generateDodatkoweInformacje;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateDodatkoweInformacje(fa) {
    const table = [
        ...(0, PDF_functions_1.createHeader)('Dodatkowe informacje'),
        ...generateDokumentyZaplaty(fa.DokumentZaplaty),
        ...generateDodatkowyOpis(fa.DodatkowyOpis),
    ];
    return table.length > 1 ? (0, PDF_functions_1.createSection)(table, true) : [];
}
function generateDokumentyZaplaty(dokumentZaplaty) {
    if (!dokumentZaplaty) {
        return [];
    }
    const dokumentZaplatyTable = (0, PDF_functions_1.getTable)(dokumentZaplaty)?.map((item, index) => ({
        ...item,
        lp: { _text: index + 1 },
    }));
    const table = (0, PDF_functions_1.createSubHeader)('Dokumenty Zapłaty', [0, 0, 0, 4]);
    const dokumentZaplatyHeader = [
        {
            name: 'lp',
            title: 'Lp.',
            format: common_enum_1.default.Default,
            width: 'auto',
        },
        {
            name: 'NrDokumentu',
            title: 'Numer dokumentu',
            format: common_enum_1.default.Default,
            width: '*',
        },
        {
            name: 'DataDokumentu',
            title: 'Data dokumentu',
            format: common_enum_1.default.Date,
            width: 'auto',
        },
    ];
    const dokumentZaplatyTableContent = (0, PDF_functions_1.getContentTable)(dokumentZaplatyHeader, dokumentZaplatyTable, '*', [0, 0, 0, 0]);
    if (dokumentZaplatyTableContent.content) {
        table.push(dokumentZaplatyTableContent.content);
    }
    return table;
}
function generateDodatkowyOpis(dodatkowyOpis) {
    if (!dodatkowyOpis) {
        return [];
    }
    const dodatkowyOpisTable = (0, PDF_functions_1.getTable)(dodatkowyOpis)?.map((item, index) => ({
        ...item,
        lp: { _text: index + 1 },
    }));
    const table = (0, PDF_functions_1.createSubHeader)('Dodatkowy opis');
    const dodatkowyOpisHeader = [
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
    const dodatkowyOpisTableContent = (0, PDF_functions_1.getContentTable)(dodatkowyOpisHeader, dodatkowyOpisTable, '*', [0, 0, 0, 0]);
    if (dodatkowyOpisTableContent.content) {
        table.push(dodatkowyOpisTableContent.content);
    }
    return table;
}
