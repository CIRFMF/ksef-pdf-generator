"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWarunkiTransakcji = generateWarunkiTransakcji;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const Transport_1 = require("./Transport");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateWarunkiTransakcji(warunkiTransakcji) {
    if (!warunkiTransakcji) {
        return [];
    }
    const table = [];
    const Kolumny = { umowy: [], zamowienia: [] };
    const umowy = (0, PDF_functions_1.getTable)(warunkiTransakcji?.Umowy);
    const zamowienia = (0, PDF_functions_1.getTable)(warunkiTransakcji?.Zamowienia);
    const partiaTowaru = (0, PDF_functions_1.getTable)(warunkiTransakcji?.NrPartiiTowaru);
    const definedHeaderUmowy = [
        { name: 'DataUmowy', title: 'Data umowy', format: common_enum_1.default.Date },
        { name: 'NrUmowy', title: 'Numer umowy', format: common_enum_1.default.Default },
    ];
    const definedHeaderZamowienia = [
        { name: 'DataZamowienia', title: 'Data zamówienia', format: common_enum_1.default.Date },
        { name: 'NrZamowienia', title: 'Numer zamówienia', format: common_enum_1.default.Default },
    ];
    const definedHeaderPartiaTowaru = [
        { name: '', title: 'Numer partii towaru', format: common_enum_1.default.Default },
    ];
    table.push((0, PDF_functions_1.createHeader)('Warunki transakcji', [0, 8, 0, 4]));
    if (umowy.length > 0) {
        const tabUmowy = (0, PDF_functions_1.getContentTable)(definedHeaderUmowy, umowy, '*', undefined, 20);
        if (tabUmowy.content) {
            Kolumny.umowy = [(0, PDF_functions_1.createSubHeader)('Umowa'), tabUmowy.content];
        }
    }
    if (zamowienia.length > 0) {
        const tabZamowienia = (0, PDF_functions_1.getContentTable)(definedHeaderZamowienia, zamowienia, '*', undefined, 20);
        if (tabZamowienia.content && tabZamowienia.fieldsWithValue.length > 0) {
            Kolumny.zamowienia = [(0, PDF_functions_1.createSubHeader)('Zamówienie'), tabZamowienia.content];
        }
    }
    if (Kolumny.zamowienia.length > 0 || Kolumny.umowy.length > 0) {
        table.push((0, PDF_functions_1.generateTwoColumns)(Kolumny.umowy, Kolumny.zamowienia));
    }
    if (warunkiTransakcji.WalutaUmowna?._text || warunkiTransakcji.KursUmowny?._text) {
        table.push((0, PDF_functions_1.createHeader)('Waluta umowna i kurs umowny', [0, 8, 0, 4]));
        table.push((0, PDF_functions_1.createLabelText)('Waluta umowna: ', warunkiTransakcji.WalutaUmowna));
        table.push((0, PDF_functions_1.createLabelText)('Kurs umowny: ', warunkiTransakcji.KursUmowny));
    }
    if (partiaTowaru.length > 0) {
        const tabPartiaTowaru = (0, PDF_functions_1.getContentTable)(definedHeaderPartiaTowaru, partiaTowaru, '*', [0, 4]);
        if (tabPartiaTowaru.content) {
            table.push((0, PDF_functions_1.generateTwoColumns)(tabPartiaTowaru.content, ''));
        }
    }
    table.push((0, PDF_functions_1.createLabelText)('Warunki dostawy towarów: ', warunkiTransakcji.WarunkiDostawy, common_enum_1.default.MarginTop4));
    if (warunkiTransakcji.PodmiotPosredniczacy?._text === '1') {
        table.push((0, PDF_functions_1.formatText)('Dostawa dokonana przez podmiot, o którym mowa w art. 22 ust. 2d ustawy. Pole dotyczy sytuacji, w której podmiot uczestniczy w transakcji łańcuchowej innej niż procedura trójstronna uproszczona, o której mowa w art. 135 ust. 1 pkt 4 ustawy', [common_enum_1.default.Label, common_enum_1.default.MarginTop4]));
    }
    if (warunkiTransakcji.Transport) {
        (0, PDF_functions_1.getTable)(warunkiTransakcji.Transport).forEach((transport, index) => {
            table.push((0, Transport_1.generateTransport)(transport, (0, PDF_functions_1.getTable)(warunkiTransakcji.Transport).length !== 0 ? index + 1 : null));
        });
    }
    return (0, PDF_functions_1.createSection)(table, true);
}
