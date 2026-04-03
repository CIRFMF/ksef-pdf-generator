"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generujRachunekBankowy = void 0;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const generujRachunekBankowy = (accounts, title) => {
    const result = [];
    if (!accounts?.length) {
        return [];
    }
    accounts.forEach((account, index) => {
        const table = [];
        const base = (0, PDF_functions_1.createHeader)(title ? `${title} ${accounts?.length > 1 ? ++index : ''}` : '', [0, 8, 0, 8]);
        table.push([
            (0, PDF_functions_1.formatText)('Pełny numer rachunku', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(account.NrRB), common_enum_1.default.Default),
        ]);
        table.push([
            (0, PDF_functions_1.formatText)('Kod SWIFT', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.getValue)(account.SWIFT), common_enum_1.default.Default),
        ]);
        table.push([
            (0, PDF_functions_1.formatText)('Nazwa banku', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.hasValue)(account.NazwaBanku)
                ? (0, PDF_functions_1.makeBreakable)((0, PDF_functions_1.getValue)(account.NazwaBanku), 20)
                : (0, PDF_functions_1.getValue)(account.NazwaBanku), common_enum_1.default.Default),
        ]);
        table.push([
            (0, PDF_functions_1.formatText)('Opis rachunku', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)((0, PDF_functions_1.hasValue)(account.OpisRachunku)
                ? (0, PDF_functions_1.makeBreakable)((0, PDF_functions_1.getValue)(account.OpisRachunku), 20)
                : (0, PDF_functions_1.getValue)(account.OpisRachunku), common_enum_1.default.Default),
        ]);
        result.push([
            ...base,
            {
                unbreakable: true,
                table: {
                    body: table,
                    widths: ['auto', '*'],
                },
                layout: {
                    hLineWidth: () => 1,
                    hLineColor: () => '#BABABA',
                    vLineWidth: () => 1,
                    vLineColor: () => '#BABABA',
                },
            },
        ]);
    });
    return (0, PDF_functions_1.createSection)(result, false, [0, 0, 0, 0]);
};
exports.generujRachunekBankowy = generujRachunekBankowy;
