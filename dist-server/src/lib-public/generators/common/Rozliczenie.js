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
exports.generateRozliczenie = generateRozliczenie;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importStar(require("../../../shared/enums/common.enum"));
function generateRozliczenie(rozliczenie, KodWaluty) {
    if (!rozliczenie) {
        return [];
    }
    const obciazenia = (0, PDF_functions_1.getTable)(rozliczenie?.Obciazenia);
    const odliczenia = (0, PDF_functions_1.getTable)(rozliczenie?.Odliczenia);
    const result = [];
    const headerOdliczenia = [
        {
            title: 'Powód odliczenia',
            name: 'Powod',
            format: common_enum_1.default.Default,
            width: '*',
        },
        {
            title: 'Kwota',
            name: 'Kwota',
            format: common_enum_1.default.Currency,
            width: 'auto',
        },
    ];
    const headerObciazenia = [
        {
            name: 'Powod',
            title: 'Powód obciążenia',
            format: common_enum_1.default.Default,
            width: '*',
        },
        {
            name: 'Kwota',
            title: 'Kwota',
            format: common_enum_1.default.Currency,
            width: 'auto',
        },
    ];
    const tableObciazenia = (0, PDF_functions_1.getContentTable)(headerObciazenia, obciazenia, '*', undefined, 20);
    const tableOdliczenia = (0, PDF_functions_1.getContentTable)(headerOdliczenia, odliczenia, '*', undefined, 20);
    const SumaObciazen = (0, PDF_functions_1.createLabelText)('Suma kwot obciążenia: ', rozliczenie.SumaObciazen, common_enum_1.default.Currency, {
        alignment: common_enum_1.Position.RIGHT,
    });
    const Sumaodliczen = (0, PDF_functions_1.createLabelText)('Suma kwot odliczenia: ', rozliczenie?.SumaOdliczen, common_enum_1.default.Currency, {
        alignment: common_enum_1.Position.RIGHT,
    });
    const resultObciazenia = [
        (0, PDF_functions_1.createSubHeader)('Obciążenia'),
        tableObciazenia.content ?? [],
        SumaObciazen,
    ];
    const resultOdliczenia = [
        (0, PDF_functions_1.createSubHeader)('Odliczenia'),
        tableOdliczenia.content ?? [],
        Sumaodliczen,
    ];
    result.push((0, PDF_functions_1.createHeader)('Rozliczenie', [0, 8, 0, 4]));
    if (obciazenia.length > 0 && odliczenia.length > 0) {
        result.push((0, PDF_functions_1.generateColumns)([resultObciazenia, resultOdliczenia]));
    }
    else if (obciazenia.length > 0) {
        result.push((0, PDF_functions_1.generateTwoColumns)([resultObciazenia], []));
    }
    else if (odliczenia.length > 0) {
        result.push((0, PDF_functions_1.generateTwoColumns)([], [resultOdliczenia]));
    }
    if (rozliczenie?.DoZaplaty?._text) {
        result.push({
            stack: (0, PDF_functions_1.createLabelTextArray)([
                { value: 'Do zapłaty: ', formatTyp: common_enum_1.default.LabelGreater },
                { value: rozliczenie?.DoZaplaty, formatTyp: common_enum_1.default.CurrencyGreater, currency: KodWaluty },
            ]),
            alignment: common_enum_1.Position.RIGHT,
            margin: [0, 8, 0, 0],
        });
    }
    else if (rozliczenie?.DoRozliczenia?._text) {
        result.push({
            stack: (0, PDF_functions_1.createLabelTextArray)([
                { value: 'Do rozliczenia: ', formatTyp: common_enum_1.default.LabelGreater },
                { value: rozliczenie?.DoRozliczenia, formatTyp: common_enum_1.default.CurrencyGreater, currency: KodWaluty },
            ]),
            alignment: common_enum_1.Position.RIGHT,
            marginTop: 8,
        });
    }
    return (0, PDF_functions_1.createSection)(result, true);
}
