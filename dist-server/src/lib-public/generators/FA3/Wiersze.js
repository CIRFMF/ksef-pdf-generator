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
const FA_const_1 = require("../../../shared/consts/FA.const");
const common_enum_1 = __importStar(require("../../../shared/enums/common.enum"));
const Wiersze_1 = require("../common/Wiersze");
function generateWiersze(faVat) {
    const table = [];
    const rodzajFaktury = (0, PDF_functions_1.getValue)(faVat.RodzajFaktury);
    const isP_PMarzy = Boolean(Number((0, PDF_functions_1.getValue)(faVat.Adnotacje?.PMarzy?.P_PMarzy)));
    const faWiersze = (0, PDF_functions_1.getTable)(faVat.FaWiersz).map((wiersz) => {
        const marza = (0, Wiersze_1.addMarza)(rodzajFaktury, isP_PMarzy, wiersz);
        if ((0, PDF_functions_1.getValue)(wiersz.P_12)) {
            wiersz.P_12._text = (0, PDF_functions_1.getTStawkaPodatku)((0, PDF_functions_1.getValue)(wiersz.P_12), 3);
        }
        return { ...wiersz, ...marza };
    });
    const definedHeaderLp = [
        { name: 'NrWierszaFa', title: 'Lp.', format: common_enum_1.default.Default, width: 'auto' },
    ];
    const definedHeader1 = [
        { name: 'UU_ID', title: 'Unikalny numer wiersza', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_7', title: 'Nazwa towaru lub usługi', format: common_enum_1.default.Default, width: '*' },
        { name: 'P_9A', title: 'Cena jedn. netto', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'P_9B', title: 'Cena jedn. brutto', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'P_8B', title: 'Ilość', format: common_enum_1.default.Number, width: 'auto' },
        { name: 'P_8A', title: 'Miara', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_10', title: 'Rabat', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'P_12', title: 'Stawka podatku', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_12_XII', title: 'Stawka podatku OSS', format: common_enum_1.default.Percentage, width: 'auto' },
        {
            name: 'P_12_Zal_15',
            title: 'Znacznik dla towaru lub usługi z zał. nr 15 do ustawy',
            format: common_enum_1.default.Default,
            width: 'auto',
        },
        { name: 'P_11', title: 'Wartość sprzedaży netto', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'P_11A', title: 'Wartość sprzedaży brutto', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'P_11Vat', title: 'Wartość sprzedaży vat', format: common_enum_1.default.Currency, width: 'auto' },
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
        { name: 'GTIN', title: 'GTIN', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'PKWiU', title: 'PKWiU', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'CN', title: 'CN', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'PKOB', title: 'PKOB', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'KwotaAkcyzy', title: 'Kwota podatku akcyzowego', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'GTU', title: 'GTU', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'Procedura', title: 'Procedura', format: common_enum_1.default.Default, width: '*' },
        { name: 'P_6A', title: 'Data dostawy / wykonania', format: common_enum_1.default.Date, width: 'auto' },
        { name: 'Indeks', title: 'Indeks', format: common_enum_1.default.Default, width: 'auto' },
    ];
    let content = (0, PDF_functions_1.getContentTable)([...definedHeaderLp, ...definedHeader1, ...definedHeader2], faWiersze, 'auto');
    const ceny = (0, PDF_functions_1.formatText)(`Faktura wystawiona w walucie ${faVat.KodWaluty?._text}`, [
        common_enum_1.default.Label,
        common_enum_1.default.MarginBottom8,
    ]);
    const p_15 = (0, PDF_functions_1.getValue)(faVat.P_15);
    let opis = '';
    if (rodzajFaktury == FA_const_1.TRodzajFaktury.ROZ && Number(p_15) !== 0) {
        opis = {
            stack: (0, PDF_functions_1.createLabelTextArray)([
                { value: 'Kwota pozostała do zapłaty: ', formatTyp: common_enum_1.default.LabelGreater },
                {
                    value: p_15,
                    formatTyp: common_enum_1.default.CurrencyGreater,
                    currency: (0, PDF_functions_1.getValue)(faVat.KodWaluty)?.toString() ?? '',
                },
            ]),
            alignment: common_enum_1.Position.RIGHT,
            margin: [0, 8, 0, 0],
        };
    }
    else if ((rodzajFaktury == FA_const_1.TRodzajFaktury.VAT ||
        rodzajFaktury == FA_const_1.TRodzajFaktury.KOR ||
        rodzajFaktury == FA_const_1.TRodzajFaktury.KOR_ROZ ||
        rodzajFaktury == FA_const_1.TRodzajFaktury.UPR) &&
        Number(p_15) !== 0) {
        opis = {
            stack: (0, PDF_functions_1.createLabelTextArray)([
                { value: 'Kwota należności ogółem: ', formatTyp: common_enum_1.default.LabelGreater },
                {
                    value: p_15,
                    formatTyp: [common_enum_1.default.CurrencyGreater, common_enum_1.default.HeaderContent, common_enum_1.default.Value],
                    currency: (0, PDF_functions_1.getValue)(faVat.KodWaluty)?.toString() ?? '',
                },
            ]),
            alignment: common_enum_1.Position.RIGHT,
            margin: [0, 8, 0, 0],
        };
    }
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
    return (0, PDF_functions_1.createSection)([...(0, PDF_functions_1.createHeader)('Pozycje'), ceny, ...table, opis], true);
}
