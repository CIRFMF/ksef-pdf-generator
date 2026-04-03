"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNaglowekUPO = generateNaglowekUPO;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = require("../../../shared/enums/common.enum");
function generateNaglowekUPO(potwierdzenie) {
    return [
        (0, PDF_functions_1.generateTwoColumns)({
            text: [
                { text: 'Krajowy System ', fontSize: 18 },
                { text: 'e', color: 'red', bold: true, fontSize: 18 },
                { text: '-Faktur', bold: true, fontSize: 18 },
            ],
        }, [
            {
                text: (0, PDF_functions_1.createLabelText)('Nazwa pełna podmiotu, któremu doręczono dokument elektroniczny: ', potwierdzenie.NazwaPodmiotuPrzyjmujacego),
                alignment: common_enum_1.Position.RIGHT,
            },
            {
                text: (0, PDF_functions_1.createLabelText)('Informacja o dokumencie: ', 'Dokument został zarejestrowany w systemie teleinformatycznym Ministerstwa Finansów'),
                alignment: common_enum_1.Position.RIGHT,
            },
        ]),
    ];
}
