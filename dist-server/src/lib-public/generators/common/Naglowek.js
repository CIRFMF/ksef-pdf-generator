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
exports.generateNaglowek = generateNaglowek;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const FA_const_1 = require("../../../shared/consts/FA.const");
const common_enum_1 = __importStar(require("../../../shared/enums/common.enum"));
function generateNaglowek(fa, additionalData, zalacznik) {
    let invoiceName = '';
    switch ((0, PDF_functions_1.getValue)(fa?.RodzajFaktury)) {
        case FA_const_1.TRodzajFaktury.VAT:
            invoiceName = 'Faktura podstawowa';
            break;
        case FA_const_1.TRodzajFaktury.ZAL:
            invoiceName = 'Faktura zaliczkowa';
            break;
        case FA_const_1.TRodzajFaktury.ROZ:
            invoiceName = 'Faktura rozliczeniowa';
            break;
        case FA_const_1.TRodzajFaktury.KOR_ROZ:
            invoiceName = 'Faktura korygująca rozliczeniową';
            break;
        case FA_const_1.TRodzajFaktury.KOR_ZAL:
            invoiceName = 'Faktura korygująca zaliczkową';
            break;
        case FA_const_1.TRodzajFaktury.KOR:
            if (fa?.OkresFaKorygowanej != null) {
                invoiceName = 'Faktura korygująca zbiorcza (rabat)';
            }
            else {
                invoiceName = 'Faktura korygująca';
            }
            break;
        case FA_const_1.TRodzajFaktury.UPR:
            invoiceName = 'Faktura uproszczona';
            break;
    }
    return [
        {
            text: [
                { text: 'Krajowy System ', fontSize: 18 },
                { text: 'e', color: 'red', bold: true, fontSize: 18 },
                { text: '-Faktur', bold: true, fontSize: 18 },
            ],
        },
        { ...(0, PDF_functions_1.formatText)('Numer Faktury:', common_enum_1.default.ValueMedium), alignment: common_enum_1.Position.RIGHT },
        {
            ...(0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(fa?.P_2), common_enum_1.default.HeaderPosition),
            alignment: common_enum_1.Position.RIGHT,
        },
        {
            ...(0, PDF_functions_1.formatText)(invoiceName, [common_enum_1.default.ValueMedium, common_enum_1.default.Default]),
            alignment: common_enum_1.Position.RIGHT,
        },
        ...(additionalData?.nrKSeF
            ? [
                {
                    text: [
                        (0, PDF_functions_1.formatText)('Numer KSEF:', common_enum_1.default.LabelMedium),
                        (0, PDF_functions_1.formatText)(additionalData?.nrKSeF, common_enum_1.default.ValueMedium),
                    ],
                    alignment: common_enum_1.Position.RIGHT,
                },
            ]
            : []),
        ...(additionalData?.isMobile && zalacznik
            ? [
                { stack: [(0, PDF_functions_1.generateLine)()], margin: [0, 8, 0, 8] },
                {
                    text: [
                        (0, PDF_functions_1.formatText)('Uwaga, faktura zawiera załącznik, jednak ze względu na ograniczenia wizualizacji, nie został on uwzględniony w pliku PDF', common_enum_1.default.Bold),
                    ],
                },
            ]
            : []),
    ];
}
