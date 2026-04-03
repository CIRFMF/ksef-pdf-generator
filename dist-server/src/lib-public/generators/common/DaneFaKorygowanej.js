"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDaneFaKorygowanej = generateDaneFaKorygowanej;
const FA_const_1 = require("../../../shared/consts/FA.const");
const FARR_const_1 = require("../../../shared/consts/FARR.const");
const PDF_functions_1 = require("../../../shared/PDF-functions");
function generateDaneFaKorygowanej(invoice) {
    const result = [];
    let firstColumn = [];
    let secondColumn = [];
    let previousSection = false;
    if (invoice) {
        const daneFakturyKorygowanej = (0, PDF_functions_1.getTable)(invoice.DaneFaKorygowanej ?? []);
        if (invoice.NrFaKorygowany) {
            firstColumn.push((0, PDF_functions_1.createLabelText)('Poprawny numer faktury korygowanej: ', invoice.NrFaKorygowany));
        }
        if (invoice.PrzyczynaKorekty) {
            firstColumn.push((0, PDF_functions_1.createLabelText)('Przyczyna korekty dla faktur korygujących: ', invoice.PrzyczynaKorekty));
        }
        if (invoice.TypKorekty?._text) {
            const isFaRR = [FA_const_1.TRodzajFaktury.VAT_RR, FA_const_1.TRodzajFaktury.KOR_VAT_RR].includes((0, PDF_functions_1.getValue)(invoice?.RodzajFaktury));
            const typKorekty = (0, PDF_functions_1.getValue)(invoice.TypKorekty);
            firstColumn.push((0, PDF_functions_1.createLabelText)('Typ skutku korekty: ', isFaRR ? FARR_const_1.FARRTypKorekty[typKorekty] : FA_const_1.TypKorekty[typKorekty]));
        }
        if (firstColumn.length) {
            firstColumn.unshift((0, PDF_functions_1.createHeader)('Dane faktury korygowanej'));
        }
        if (daneFakturyKorygowanej?.length === 1) {
            secondColumn.push((0, PDF_functions_1.createHeader)('Dane identyfikacyjne faktury korygowanej'));
            generateCorrectiveData(daneFakturyKorygowanej[0], secondColumn);
            if (firstColumn.length > 0 || secondColumn.length) {
                if (firstColumn.length) {
                    result.push((0, PDF_functions_1.generateTwoColumns)(firstColumn, secondColumn));
                }
                else {
                    result.push((0, PDF_functions_1.generateTwoColumns)(secondColumn, []));
                }
                previousSection = true;
            }
            firstColumn = [];
            secondColumn = [];
        }
        else {
            if (firstColumn.length > 1) {
                result.push((0, PDF_functions_1.generateTwoColumns)(firstColumn, []));
                previousSection = true;
            }
            firstColumn = [];
            daneFakturyKorygowanej?.forEach((item, index) => {
                if (index % 2 === 0) {
                    firstColumn.push((0, PDF_functions_1.createHeader)(`Dane identyfikacyjne faktury korygowanej ${index + 1}`));
                    generateCorrectiveData(item, firstColumn);
                }
                else {
                    secondColumn.push((0, PDF_functions_1.createHeader)(`Dane identyfikacyjne faktury korygowanej ${index + 1}`));
                    generateCorrectiveData(item, secondColumn);
                }
            });
        }
    }
    if (firstColumn.length && secondColumn.length) {
        result.push((0, PDF_functions_1.createSection)([(0, PDF_functions_1.generateTwoColumns)(firstColumn, secondColumn)], previousSection));
    }
    return (0, PDF_functions_1.createSection)(result, true);
}
function generateCorrectiveData(data, column) {
    if (data.DataWystFaKorygowanej) {
        column.push((0, PDF_functions_1.createLabelText)('Data wystawienia faktury, której dotyczy faktura korygująca: ', data.DataWystFaKorygowanej));
    }
    if (data.NrFaKorygowanej) {
        column.push((0, PDF_functions_1.createLabelText)('Numer faktury korygowanej: ', data.NrFaKorygowanej));
    }
    if (data.NrKSeFFaKorygowanej) {
        column.push((0, PDF_functions_1.createLabelText)('Numer KSeF faktury korygowanej: ', data.NrKSeFFaKorygowanej));
    }
}
