"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZalaczniki = generateZalaczniki;
exports.chunkArray = chunkArray;
const FA_const_1 = require("../../../shared/consts/FA.const");
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateZalaczniki(zalacznik) {
    if (!(0, PDF_functions_1.getTable)(zalacznik?.BlokDanych).length) {
        return [];
    }
    const result = [];
    const definedHeader = [
        { name: 'PelnaNazwa', title: 'Pełna nazwa', format: common_enum_1.default.Default },
        { name: 'KRS', title: 'KRS', format: common_enum_1.default.Default },
        { name: 'REGON', title: 'REGON', format: common_enum_1.default.Default },
        { name: 'BDO', title: 'BDO', format: common_enum_1.default.Default },
    ];
    const faWiersze = (0, PDF_functions_1.getTable)(zalacznik?.BlokDanych ?? []);
    const content = (0, PDF_functions_1.getContentTable)([...definedHeader], faWiersze, '*');
    result.push((0, PDF_functions_1.createHeader)('Załącznik do Faktury VAT'));
    (0, PDF_functions_1.getTable)(zalacznik?.BlokDanych).forEach((blok, index) => {
        result.push((0, PDF_functions_1.createSubHeader)(`Szczegółowe dane załącznika (${index + 1})`));
        if (blok.ZNaglowek) {
            result.push((0, PDF_functions_1.createLabelText)('Nagłówek bloku danych: ', blok.ZNaglowek, common_enum_1.default.Value, { marginBottom: 8 }));
        }
        if ((0, PDF_functions_1.getTable)(blok.MetaDane)?.length) {
            result.push(generateKluczWartosc((0, PDF_functions_1.getTable)(blok.MetaDane)));
        }
        if (blok.Tekst?.Akapit) {
            result.push((0, PDF_functions_1.createLabelText)('Opis: ', ' '));
            (0, PDF_functions_1.getTable)(blok.Tekst.Akapit).forEach((text) => {
                if ((0, PDF_functions_1.hasValue)(text)) {
                    result.push((0, PDF_functions_1.formatText)(text._text, common_enum_1.default.Value));
                }
            });
        }
        if ((0, PDF_functions_1.getTable)(blok.Tabela).length) {
            (0, PDF_functions_1.getTable)(blok.Tabela).forEach((tabela, index) => {
                if (blok.ZNaglowek?._text) {
                    result.push((0, PDF_functions_1.createSubHeader)(`${blok.ZNaglowek?._text} ${index + 1}`));
                }
                if ((0, PDF_functions_1.getTable)(tabela.TMetaDane)?.length) {
                    result.push({
                        stack: generateKluczWartosc((0, PDF_functions_1.getTable)(tabela.TMetaDane).map((item) => ({
                            ZKlucz: item.TKlucz,
                            ZWartosc: item.TWartosc,
                        }))),
                        margin: [0, 8, 0, 0],
                    });
                }
                if (tabela.Opis) {
                    result.push((0, PDF_functions_1.createLabelText)('Opis: ', tabela.Opis));
                }
                if ((0, PDF_functions_1.getTable)(tabela.TNaglowek?.Kol).length) {
                    result.push((0, PDF_functions_1.formatText)('Tabela', [common_enum_1.default.GrayBoldTitle, common_enum_1.default.LabelSmallMargin]));
                    result.push(generateTable(tabela));
                }
                if ((0, PDF_functions_1.getTable)(tabela.Suma?.SKom).length) {
                    result.push(generateSuma((0, PDF_functions_1.getTable)(tabela.Suma?.SKom)));
                }
            });
        }
    });
    if (content.fieldsWithValue.length && content.content) {
        result.push(content.content);
    }
    return (0, PDF_functions_1.createSection)(result, false);
}
function generateKluczWartosc(data) {
    const result = [];
    const definedHeader = [
        { name: 'ZKlucz', title: 'Klucz', format: common_enum_1.default.Default },
        { name: 'ZWartosc', title: 'Wartość', format: common_enum_1.default.Default },
    ];
    const faWiersze = (0, PDF_functions_1.getTable)(data ?? []);
    const content = (0, PDF_functions_1.getContentTable)([...definedHeader], faWiersze, '*');
    if (content.fieldsWithValue.length && content.content) {
        result.push(content.content);
    }
    return result;
}
function generateTable(tabela) {
    if (!tabela.TNaglowek?.Kol?.length) {
        return [];
    }
    const result = [];
    const Kol = (0, PDF_functions_1.getTable)(tabela.TNaglowek.Kol);
    const cutedTableHeader = chunkArray(Kol);
    cutedTableHeader.forEach((table, index) => {
        result.push(createTable(table, tabela.Wiersz ?? [], index, Kol.length));
    });
    return result;
}
function createTable(cols, rows, subTableIndex, totalLength) {
    const definedHeader = cols.map((item) => (0, PDF_functions_1.formatText)((0, PDF_functions_1.makeBreakable)(item.NKom?._text), common_enum_1.default.GrayBoldTitle));
    const tableBody = [];
    (0, PDF_functions_1.getTable)(rows).forEach((item) => {
        const WKom = (0, PDF_functions_1.getTable)(item.WKom);
        while (WKom.length < totalLength) {
            WKom.push({ _text: '' });
        }
        const cuttedRows = chunkArray(WKom ?? []);
        if (cuttedRows.length >= subTableIndex + 1) {
            tableBody.push(cuttedRows[subTableIndex].map((subItem, index) => {
                let formatType = common_enum_1.default.Value;
                const typeKey = cols[index]._attributes?.Typ;
                const formatTypeAttribute = typeKey ? FA_const_1.TableDataType[typeKey] : undefined;
                if (formatTypeAttribute && ![common_enum_1.default.Date, common_enum_1.default.DateTime].includes(formatTypeAttribute)) {
                    formatType = formatTypeAttribute;
                }
                return (0, PDF_functions_1.formatText)(subItem._text ? (0, PDF_functions_1.makeBreakable)(subItem._text) : '', formatType);
            }));
        }
    });
    const widths = definedHeader.map((_, i) => {
        if (i === 0) {
            return '*';
        }
        return 'auto';
    });
    return {
        table: {
            headerRows: 1,
            widths: [...widths],
            body: [[...definedHeader], ...tableBody],
        },
        layout: FA_const_1.DEFAULT_TABLE_LAYOUT,
        margin: [0, 8, 0, 0],
    };
}
function generateSuma(data) {
    const result = [];
    const definedHeader = [
        { name: '', title: 'Podsumowanie tabeli', format: common_enum_1.default.Default },
    ];
    const faWiersze = (0, PDF_functions_1.getTable)(data ?? []);
    const content = (0, PDF_functions_1.getContentTable)([...definedHeader], faWiersze, '*', [0, 8, 0, 0]);
    if (content.fieldsWithValue.length && content.content) {
        result.push(content.content);
    }
    return result;
}
function chunkArray(columns) {
    if (!Array.isArray(columns)) {
        return [];
    }
    const n = columns.length;
    if (n <= 7) {
        return [columns];
    }
    else if (n >= 8 && n <= 14) {
        const half = Math.floor(n / 2);
        if (n % 2 === 0) {
            return [columns.slice(0, half), [columns[0], ...columns.slice(half)]];
        }
        else {
            return [columns.slice(0, half + 1), [columns[0], ...columns.slice(half + 1)]];
        }
    }
    else {
        const base = Math.floor(n / 3);
        const remainder = n % 3;
        const splits = [base, base, base];
        for (let i = 0; i < remainder; i++) {
            splits[i] += 1;
        }
        const result = [];
        let idx = 0;
        for (const size of splits) {
            result.push(columns.slice(idx, idx + size));
            idx += size;
        }
        result[1].unshift(columns[0]);
        result[2].unshift(columns[0]);
        return result;
    }
}
