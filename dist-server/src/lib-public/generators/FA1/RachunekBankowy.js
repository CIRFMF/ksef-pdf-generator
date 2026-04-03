"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generujRachunekBankowy = void 0;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const FA_const_1 = require("../../../shared/consts/FA.const");
const functions_1 = require("../../../shared/generators/common/functions");
const generujRachunekBankowy = (accounts, title) => {
    const result = [];
    if (!accounts?.length) {
        return [];
    }
    accounts.forEach((account, index) => {
        const table = [];
        const base = (0, PDF_functions_1.createHeader)(title ? `${title} ${accounts?.length > 1 ? ++index : ''}` : '', [0, 12, 0, 8]);
        if ((0, PDF_functions_1.hasValue)(account.NrRBZagr)) {
            table.push([
                (0, PDF_functions_1.formatText)('Format rachunku', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)('Zagraniczny', common_enum_1.default.Default),
            ]);
        }
        else if ((0, PDF_functions_1.hasValue)(account.NrRBPL)) {
            table.push([
                (0, PDF_functions_1.formatText)('Format rachunku', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)('Polski', common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(account.NrRBPL)) {
            table.push([
                (0, PDF_functions_1.formatText)('Pełny numer rachunku w standardzie NRB', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(account.NrRBPL), common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(account.NrRBZagr)) {
            table.push([
                (0, PDF_functions_1.formatText)('Pełny numer rachunku zagranicznego', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(account.NrRBZagr), common_enum_1.default.Default),
            ]);
        }
        table.push([
            (0, PDF_functions_1.formatText)('Kod SWIFT', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(account.SWIFT), common_enum_1.default.Default),
        ]);
        table.push([
            (0, PDF_functions_1.formatText)('Rachunek własny banku', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.makeBreakable)((0, functions_1.translateMap)(account.RachunekWlasnyBanku, FA_const_1.TypRachunkowWlasnych), 20), common_enum_1.default.Default),
        ]);
        table.push([
            (0, PDF_functions_1.formatText)('Nazwa banku', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.makeBreakable)((0, PDF_functions_1.getValue)(account.NazwaBanku), 20), common_enum_1.default.Default),
        ]);
        result.push([
            ...base,
            {
                unbreakable: true,
                table: {
                    body: table,
                    widths: ['auto', '*'],
                },
                layout: FA_const_1.DEFAULT_TABLE_LAYOUT,
            },
        ]);
    });
    return (0, PDF_functions_1.createSection)(result, false);
};
exports.generujRachunekBankowy = generujRachunekBankowy;
