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
exports.generateZamowienie = generateZamowienie;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const FA_const_1 = require("../../../shared/consts/FA.const");
const common_enum_1 = __importStar(require("../../../shared/enums/common.enum"));
const invoice_enums_1 = require("../../enums/invoice.enums");
function generateZamowienie(orderData, zamowienieKorekta, p_15, rodzajFaktury, KodWaluty, P_PMarzy) {
    if (!orderData) {
        return [];
    }
    const formatAbs = zamowienieKorekta === invoice_enums_1.ZamowienieKorekta.BeforeCorrection ? common_enum_1.default.CurrencyAbs : common_enum_1.default.Currency;
    const orderTable = (0, PDF_functions_1.getTable)(orderData?.ZamowienieWiersz).map((el, index) => {
        if (!el.NrWierszaZam._text) {
            el.NrWierszaZam._text = (index + 1).toString();
        }
        el.P_12Z = { _text: (0, PDF_functions_1.getTStawkaPodatku)((0, PDF_functions_1.getValue)(el.P_12Z), 1, P_PMarzy) };
        return el;
    });
    const definedHeaderLp = [
        { name: 'NrWierszaZam', title: 'Lp.', format: common_enum_1.default.Default, width: 'auto' },
    ];
    const definedHeader1 = [
        { name: 'UU_IDZ', title: 'Unikalny numer wiersza', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_7Z', title: 'Nazwa towaru lub usługi', format: common_enum_1.default.Default, width: '*' },
        {
            name: 'P_9AZ',
            title: 'Cena jedn. netto',
            format: formatAbs,
        },
        { name: 'P_8BZ', title: 'Ilość', format: common_enum_1.default.Right, width: 'auto' },
        { name: 'P_8AZ', title: 'Miara', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_12Z', title: 'Stawka podatku', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_12Z_XII', title: 'Stawka podatku OSS', format: common_enum_1.default.Percentage, width: 'auto' },
        { name: 'P_11NettoZ', title: 'Wartość sprzedaży netto', format: formatAbs, width: 'auto' },
        { name: 'P_11VatZ', title: 'Kwota podatku', format: formatAbs, width: 'auto' },
        { name: 'KursWalutyZ', title: 'Kwota podatku', format: formatAbs, width: 'auto' },
    ];
    const definedHeader2 = [
        { name: 'GTINZ', title: 'GTIN', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'PKWiUZ', title: 'PKWiU', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'CNZ', title: 'CN', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'PKOBZ', title: 'PKOB', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'DodatkoweInfoZ', title: 'Dodatkowe informacje', format: common_enum_1.default.Default, width: '*' },
        {
            name: 'P_12Z_Procedura',
            title: 'Procedura',
            format: common_enum_1.default.Default,
            mappingData: FA_const_1.Procedura,
            width: '*',
        },
        { name: 'KwotaAkcyzyZ', title: 'Kwota podatku akcyzowego', format: common_enum_1.default.Currency, width: 'auto' },
        { name: 'GTUZ', title: 'GTU', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'ProceduraZ', title: 'Oznaczenia dotyczące procedur', format: common_enum_1.default.Default, width: '*' },
    ];
    let content = (0, PDF_functions_1.getContentTable)([...definedHeaderLp, ...definedHeader1, ...definedHeader2], orderTable, '*');
    const table = [];
    if (content.fieldsWithValue.length <= 9) {
        if (content.content) {
            table.push(content.content);
        }
    }
    else {
        content = (0, PDF_functions_1.getContentTable)([...definedHeaderLp, ...definedHeader1], orderTable, '*');
        if (content.content) {
            table.push(content.content);
        }
        content = (0, PDF_functions_1.getContentTable)([...definedHeaderLp, ...definedHeader2], orderTable, '*');
        if (content.content && content.fieldsWithValue.length > 1) {
            table.push(content.content);
        }
    }
    const ceny = `Faktura wystawiona w walucie ${KodWaluty}`;
    let opis = '';
    if (Number(p_15) > 0 && rodzajFaktury == FA_const_1.TRodzajFaktury.ZAL) {
        opis = {
            stack: (0, PDF_functions_1.createLabelTextArray)([
                { value: 'Otrzymana kwota zapłaty (zaliczki): ', formatTyp: common_enum_1.default.LabelGreater },
                { value: p_15, formatTyp: common_enum_1.default.CurrencyGreater },
            ]),
            alignment: common_enum_1.Position.RIGHT,
            margin: [0, 8, 0, 0],
        };
    }
    else if (zamowienieKorekta !== invoice_enums_1.ZamowienieKorekta.BeforeCorrection &&
        rodzajFaktury == FA_const_1.TRodzajFaktury.KOR_ZAL &&
        Number(p_15) >= 0) {
        opis = {
            stack: (0, PDF_functions_1.createLabelTextArray)([
                { value: 'Kwota należności ogółem: ', formatTyp: common_enum_1.default.LabelGreater },
                { value: p_15, formatTyp: common_enum_1.default.CurrencyGreater },
            ]),
            alignment: common_enum_1.Position.RIGHT,
            margin: [0, 8, 0, 0],
        };
    }
    return [
        {
            stack: [
                (0, PDF_functions_1.createHeader)(zamowienieKorekta),
                ceny,
                {
                    text: [
                        'Wartość zamówienia lub umowy z uwzględnieniem kwoty podatku: ',
                        (0, PDF_functions_1.formatText)(orderData.WartoscZamowienia?._text, common_enum_1.default.Currency),
                    ],
                    marginBottom: 4,
                },
                ...table,
                opis,
            ],
        },
    ];
}
