"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSzczegoly = generateSzczegoly;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateSzczegoly(fa) {
    const faWiersze = (0, PDF_functions_1.getTable)(fa.FakturaRRWiersz);
    const kursWalutyLabel = [];
    if ((0, PDF_functions_1.hasValue)(fa.KodWaluty) && (0, PDF_functions_1.getValue)(fa.KodWaluty) != 'PLN') {
        const Common_KursWaluty = (0, PDF_functions_1.getDifferentColumnsValue)('KursWaluty', faWiersze);
        if (Common_KursWaluty.length === 1) {
            kursWalutyLabel.push((0, PDF_functions_1.createLabelText)('Kurs waluty: ', Common_KursWaluty[0].value, common_enum_1.default.Currency6));
        }
    }
    const columns1 = [
        (0, PDF_functions_1.createLabelText)('Data wystawienia: ', fa.P_4B, common_enum_1.default.Date),
        (0, PDF_functions_1.createLabelText)('Data dokonania nabycia: ', fa.P_4A, common_enum_1.default.Date),
        kursWalutyLabel,
    ].filter((el) => el.length > 0);
    const columns2 = [(0, PDF_functions_1.createLabelText)('Miejsce wystawienia: ', fa.P_1M)].filter((el) => el.length > 0);
    const table = [...(0, PDF_functions_1.createHeader)('Szczegóły'), (0, PDF_functions_1.generateTwoColumns)(columns1, columns2)];
    return (0, PDF_functions_1.createSection)(table, true);
}
