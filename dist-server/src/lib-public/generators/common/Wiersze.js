"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMarza = addMarza;
const FA_const_1 = require("../../../shared/consts/FA.const");
const PDF_functions_1 = require("../../../shared/PDF-functions");
function addMarza(rodzajFaktury, isP_PMarzy, wiersz) {
    if (typeof rodzajFaktury === 'string') {
        const isVATType = [
            FA_const_1.TRodzajFaktury.VAT,
            FA_const_1.TRodzajFaktury.KOR,
            FA_const_1.TRodzajFaktury.ROZ,
            FA_const_1.TRodzajFaktury.KOR_ROZ,
        ].includes(rodzajFaktury);
        const isZALType = [FA_const_1.TRodzajFaktury.ZAL, FA_const_1.TRodzajFaktury.KOR_ZAL].includes(rodzajFaktury);
        if (isP_PMarzy) {
            if (isVATType && !(0, PDF_functions_1.getValue)(wiersz.P_12) && !(0, PDF_functions_1.getValue)(wiersz.P_12_XII)) {
                return { P_12: { _text: 'marża' } };
            }
            else if (isZALType && !(0, PDF_functions_1.getValue)(wiersz.P_12Z) && !(0, PDF_functions_1.getValue)(wiersz.P_12Z_XII)) {
                return { P_12Z: { _text: 'marża' } };
            }
            else {
                return {};
            }
        }
    }
    return {};
}
