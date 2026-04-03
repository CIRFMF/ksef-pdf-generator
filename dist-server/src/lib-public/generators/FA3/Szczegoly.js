"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSzczegoly = generateSzczegoly;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const FA_const_1 = require("../../../shared/consts/FA.const");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const functions_1 = require("../../../shared/generators/common/functions");
function generateSzczegoly(faVat) {
    const faWiersze = (0, PDF_functions_1.getTable)(faVat.FaWiersz);
    const zamowieniaWiersze = (0, PDF_functions_1.getTable)(faVat.Zamowienie?.ZamowienieWiersz);
    const LabelP_6 = faVat.RodzajFaktury == FA_const_1.TRodzajFaktury.ZAL || faVat.RodzajFaktury == FA_const_1.TRodzajFaktury.KOR_ZAL
        ? 'Data otrzymania zapłaty: '
        : 'Data dokonania lub zakończenia dostawy towarów lub wykonania usługi: ';
    const P_6Scope = generateP_6Scope(faVat.OkresFa?.P_6_Od, faVat.OkresFa?.P_6_Do);
    const cenyLabel1 = [];
    const cenyLabel2 = [];
    if ((0, PDF_functions_1.hasValue)(faVat.KodWaluty)) {
        cenyLabel2.push((0, PDF_functions_1.createLabelText)('Kod waluty: ', faVat.KodWaluty));
    }
    const P_12_XIILabel = [];
    if ((0, PDF_functions_1.hasColumnsValue)('P_12_XII', faWiersze) || (0, PDF_functions_1.hasColumnsValue)('P_12_XII', zamowieniaWiersze)) {
        P_12_XIILabel.push((0, PDF_functions_1.createLabelText)('Procedura One Stop Shop', ' '));
    }
    const kodWalutyLabel1 = [];
    const kodWalutyLabel2 = [];
    if ((0, PDF_functions_1.hasValue)(faVat.KodWaluty) && (0, PDF_functions_1.getValue)(faVat.KodWaluty) != 'PLN') {
        if ((0, PDF_functions_1.hasValue)(faVat.KursWalutyZ)) {
            kodWalutyLabel1.push((0, PDF_functions_1.createLabelText)('Kurs waluty wspólny dla wszystkich wierszy faktury', ' '));
            kodWalutyLabel2.push((0, PDF_functions_1.createLabelText)('Kurs waluty: ', faVat.KursWalutyZ, common_enum_1.default.Currency6));
        }
        else {
            const Common_KursWaluty = (0, PDF_functions_1.getDifferentColumnsValue)('KursWaluty', faWiersze);
            if (Common_KursWaluty.length === 1) {
                kodWalutyLabel1.push((0, PDF_functions_1.createLabelText)('Kurs waluty wspólny dla wszystkich wierszy faktury', ' '));
                kodWalutyLabel2.push((0, PDF_functions_1.createLabelText)('Kurs waluty: ', Common_KursWaluty[0].value, common_enum_1.default.Currency6));
            }
        }
    }
    const tpLabel1 = [];
    const tpLabel2 = [];
    const forColumns = [
        (0, PDF_functions_1.createLabelText)('Data wystawienia, z zastrzeżeniem art. 106na ust. 1 ustawy: ', faVat.P_1, common_enum_1.default.Date),
        (0, PDF_functions_1.createLabelText)('Miejsce wystawienia: ', faVat.P_1M),
        (0, PDF_functions_1.createLabelText)('Okres, którego dotyczy rabat: ', faVat.OkresFaKorygowanej),
        (0, PDF_functions_1.createLabelText)(LabelP_6, faVat.P_6, common_enum_1.default.Date),
        P_6Scope,
        cenyLabel1,
        cenyLabel2,
        P_12_XIILabel,
        kodWalutyLabel1,
        kodWalutyLabel2,
        tpLabel1,
        tpLabel2,
    ].filter((el) => el.length > 0);
    const columns1 = [];
    const columns2 = [];
    forColumns.forEach((tab, index) => {
        if (index % 2) {
            columns2.push(tab);
        }
        else {
            columns1.push(tab);
        }
    });
    const table = [
        ...(0, PDF_functions_1.createHeader)('Szczegóły'),
        (0, PDF_functions_1.generateTwoColumns)(columns1, columns2),
        ...generateZaliczkaCzesciowa(faVat.ZaliczkaCzesciowa),
        ...generateFakturaZaliczkowa(faVat.FakturaZaliczkowa),
    ];
    return (0, PDF_functions_1.createSection)(table, true);
}
function generateP_6Scope(P_6_Od, P_6_Do) {
    const table = [];
    if ((0, PDF_functions_1.hasValue)(P_6_Od) && (0, PDF_functions_1.hasValue)(P_6_Do)) {
        table.push((0, PDF_functions_1.createLabelTextArray)([
            {
                value: 'Data dokonania lub zakończenia dostawy towarów lub wykonania usługi: od ',
            },
            { value: (0, functions_1.formatDateTime)((0, PDF_functions_1.getValue)(P_6_Od), true, true), formatTyp: common_enum_1.default.Value },
            { value: ' do ' },
            { value: (0, functions_1.formatDateTime)((0, PDF_functions_1.getValue)(P_6_Do), true, true), formatTyp: common_enum_1.default.Value },
        ]));
    }
    else if ((0, PDF_functions_1.hasValue)(P_6_Od)) {
        table.push((0, PDF_functions_1.createLabelText)('Data dokonania lub zakończenia dostawy towarów lub wykonania usługi: od ', (0, functions_1.formatDateTime)((0, PDF_functions_1.getValue)(P_6_Od), true, true)));
    }
    else if ((0, PDF_functions_1.hasValue)(P_6_Do)) {
        table.push((0, PDF_functions_1.createLabelText)('Data dokonania lub zakończenia dostawy towarów lub wykonania usługi: do ', (0, functions_1.formatDateTime)((0, PDF_functions_1.getValue)(P_6_Do), true, true)));
    }
    return table;
}
function generateZaliczkaCzesciowa(zaliczkaCzesciowaData) {
    if (!zaliczkaCzesciowaData) {
        return [];
    }
    const zaplataCzesciowa = (0, PDF_functions_1.getTable)(zaliczkaCzesciowaData);
    const table = [];
    const zaplataCzesciowaHeader = [
        { name: 'P_6Z', title: 'Data otrzymania płatności', format: common_enum_1.default.Date },
        { name: 'P_15Z', title: 'Kwota płatności', format: common_enum_1.default.Default },
        { name: 'KursWalutyZW', title: 'Kurs waluty', format: common_enum_1.default.Currency6 },
    ];
    const tableZaliczkaCzesciowa = (0, PDF_functions_1.getContentTable)(zaplataCzesciowaHeader, zaplataCzesciowa, 'auto');
    if (tableZaliczkaCzesciowa.content) {
        table.push(tableZaliczkaCzesciowa.content);
    }
    return table;
}
function generateFakturaZaliczkowa(fakturaZaliczkowaData) {
    if (!fakturaZaliczkowaData) {
        return [];
    }
    const fakturaZaliczkowa = (0, PDF_functions_1.getTable)(fakturaZaliczkowaData);
    const fakturaZaliczkowaMapped = fakturaZaliczkowa.map((item) => {
        if ('NrFaZaliczkowej' in item && item.NrFaZaliczkowej) {
            return { ...item, NrFaZaliczkowej: item.NrFaZaliczkowej };
        }
        if ('NrKSeFFaZaliczkowej' in item && item.NrKSeFFaZaliczkowej) {
            return { ...item, NrFaZaliczkowej: item.NrKSeFFaZaliczkowej };
        }
        return { ...item, NrFaZaliczkowej: { _text: '' } };
    });
    const table = [];
    const fakturaZaliczkowaHeader = [
        {
            name: 'NrFaZaliczkowej',
            title: 'Numery wcześniejszych faktur zaliczkowych',
            format: common_enum_1.default.Default,
        },
    ];
    const tableFakturaZaliczkowa = (0, PDF_functions_1.getContentTable)(fakturaZaliczkowaHeader, fakturaZaliczkowaMapped, 'auto', [0, 4, 0, 0]);
    if (tableFakturaZaliczkowa.content) {
        table.push(tableFakturaZaliczkowa.content);
    }
    return table;
}
