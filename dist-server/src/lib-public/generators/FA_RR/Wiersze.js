"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWiersze = generateWiersze;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importStar(require("../../../shared/enums/common.enum"));
function generateWiersze(fa) {
    const table = [];
    const faWiersze = (0, PDF_functions_1.getTable)(fa.FakturaRRWiersz).map((wiersz) => {
        if ((0, PDF_functions_1.getValue)(wiersz.P_9)) {
            wiersz.P_9._text = (0, PDF_functions_1.getTStawkaPodatku)((0, PDF_functions_1.getValue)(wiersz.P_9), 'RR');
        }
        return { ...wiersz };
    });
    const definedHeaderLp = [
        { name: 'NrWierszaFa', title: 'Lp.', format: common_enum_1.default.Default, width: 'auto' },
    ];
    const definedHeader1 = [
        { name: 'P_5', title: 'Nazwa', format: common_enum_1.default.Default, width: '*' },
        { name: 'P_6A', title: 'Miara', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_6B', title: 'Ilość', format: common_enum_1.default.Number, width: 'auto' },
        { name: 'P_6C', title: 'Opis klasy lub jakości', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_7', title: 'Cena jedn.', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'P_8', title: 'Wartość bez ZZP', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'P_9', title: 'Stawka ZZP', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_10', title: 'Kwota ZZP', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'P_11', title: 'Wartość z ZZP', format: common_enum_1.default.Currency, width: 'auto' },
    ];
    if ((0, PDF_functions_1.getDifferentColumnsValue)('KursWaluty', faWiersze).length !== 1) {
        definedHeader1.push({
            name: 'KursWaluty',
            title: 'Kurs waluty',
            format: common_enum_1.default.Currency6,
            width: 'auto',
        });
    }
    definedHeader1.push({ name: 'StanPrzed', title: 'Stan przed', format: common_enum_1.default.Boolean, width: 'auto' });
    const definedHeader2 = [
        { name: 'P_4AA', title: 'Data dokonania nabycia', format: common_enum_1.default.Date, width: 'auto' },
        { name: 'GTIN', title: 'GTIN', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'PKWiU', title: 'PKWiU', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'CN', title: 'CN', format: common_enum_1.default.Default, width: 'auto' },
    ];
    let content = (0, PDF_functions_1.getContentTable)([...definedHeaderLp, ...definedHeader1, ...definedHeader2], faWiersze, 'auto');
    const opis = {
        stack: [
            {
                stack: [
                    (0, PDF_functions_1.createLabelTextArray)([
                        {
                            value: 'Wartość nabytych produktów rolnych lub wykonanych usług rolniczych: ',
                        },
                        {
                            value: (0, PDF_functions_1.getValue)(fa.P_11_1),
                            formatTyp: [common_enum_1.default.Currency, common_enum_1.default.Value],
                            currency: (0, PDF_functions_1.getValue)(fa.KodWaluty)?.toString() ?? '',
                        },
                    ]),
                ],
                margin: [0, 0, 0, 8],
            },
            {
                stack: [
                    (0, PDF_functions_1.createLabelTextArray)([
                        {
                            value: 'Kwota zryczałtowanego zwrotu podatku: ',
                            formatTyp: [common_enum_1.default.LabelMargin, common_enum_1.default.Label],
                        },
                        {
                            value: (0, PDF_functions_1.getValue)(fa.P_11_2),
                            formatTyp: [common_enum_1.default.Currency, common_enum_1.default.Value, common_enum_1.default.LabelMargin],
                            currency: (0, PDF_functions_1.getValue)(fa.KodWaluty)?.toString() ?? '',
                        },
                    ]),
                ],
                margin: [0, 0, 0, 8],
            },
            {
                stack: [
                    (0, PDF_functions_1.createLabelTextArray)([
                        {
                            value: 'Kwota należności ogółem: ',
                            formatTyp: [common_enum_1.default.LabelGreater, common_enum_1.default.LabelMargin],
                        },
                        {
                            value: (0, PDF_functions_1.getValue)(fa.P_12_1),
                            formatTyp: [common_enum_1.default.Currency, common_enum_1.default.ValueMedium, common_enum_1.default.LabelMargin],
                            currency: (0, PDF_functions_1.getValue)(fa.KodWaluty)?.toString() ?? '',
                        },
                        (0, PDF_functions_1.getValue)(fa.KodWaluty)?.toString() === 'PLN'
                            ? { value: '' }
                            : {
                                value: ` (${(0, PDF_functions_1.getValue)(fa.P_12_1W)} PLN)`,
                                formatTyp: [common_enum_1.default.Currency, common_enum_1.default.ValueMedium, common_enum_1.default.LabelMargin],
                            },
                    ]),
                ],
                margin: [0, 0, 0, 8],
            },
            (0, PDF_functions_1.createLabelTextArray)([
                { value: 'Słownie: ', formatTyp: [common_enum_1.default.LabelMargin, common_enum_1.default.Label] },
                {
                    value: (0, PDF_functions_1.getValue)(fa.P_12_2),
                    formatTyp: [common_enum_1.default.Value],
                },
            ]),
        ],
        alignment: common_enum_1.Position.RIGHT,
        margin: [0, 8, 0, 0],
    };
    if (content.fieldsWithValue.length <= 8 && content.content) {
        table.push(content.content);
    }
    else {
        content = (0, PDF_functions_1.getContentTable)([...definedHeaderLp, ...definedHeader1], faWiersze, '*');
        if (content.content) {
            table.push(content.content);
        }
        content = (0, PDF_functions_1.getContentTable)([...definedHeaderLp, ...definedHeader2], faWiersze, '*');
        if (content.content && content.fieldsWithValue.length > 1) {
            table.push('\n');
            table.push(content.content);
        }
    }
    if (table.length < 1) {
        return [];
    }
    return (0, PDF_functions_1.createSection)([...(0, PDF_functions_1.createHeader)('Pozycje'), ...table, opis], true);
}
