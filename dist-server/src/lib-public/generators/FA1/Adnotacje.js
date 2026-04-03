"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdnotacje = generateAdnotacje;
exports.generateDostawy = generateDostawy;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const FA_const_1 = require("../../../shared/consts/FA.const");
function generateAdnotacje(adnotacje) {
    const result = [];
    let firstColumn = [];
    const secondColumn = [];
    if (adnotacje) {
        if (adnotacje?.P_19?._text === '1') {
            addToColumn(firstColumn, secondColumn, {
                text: 'Dostawa towarów lub świadczenie usług zwolnionych od podatku na podstawie art. 43 ust. 1, art. 113 ust. 1 i 9 albo przepisów wydanych na podstawie art. 82 ust. 3 lub na podstawie innych przepisów',
            }, true);
            if (adnotacje.P_19A?._text) {
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Podstawa zwolnienia od podatku: ', 'Przepis ustawy albo aktu wydanego na podstawie ustawy, na podstawie którego podatnik stosuje adnotacje od podatku'), true);
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Przepis ustawy albo aktu wydanego na podstawie ustawy: ', adnotacje.P_19A._text), true);
            }
            if (adnotacje.P_19B?._text) {
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Podstawa zwolnienia od podatku: ', 'Przepis dyrektywy 2006/112/WE, który zwalnia od podatku taką dostawę towarów lub takie świadczenie usług'), true);
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Przepis dyrektywy: ', adnotacje.P_19B._text), true);
            }
            if (adnotacje.P_19C?._text) {
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Podstawa zwolnienia od podatku: ', 'Inna podstawa prawna wskazującą na to, że dostawa towarów lub świadczenie usług korzysta ze zwolnienia'), true);
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Inna podstawa prawna: ', adnotacje.P_19C._text), true);
            }
        }
        if (adnotacje.P_18A?._text === '1') {
            addToColumn(firstColumn, secondColumn, { text: 'Mechanizm podzielonej płatności' });
        }
        if (adnotacje.P_16?._text === '1') {
            addToColumn(firstColumn, secondColumn, { text: 'Metoda kasowa' });
        }
        if (adnotacje.P_18?._text === '1') {
            addToColumn(firstColumn, secondColumn, { text: 'Odwrotne obciążenie' });
        }
        if (adnotacje.P_23?._text === '1') {
            addToColumn(firstColumn, secondColumn, { text: 'Procedura trójstronna uproszczona' });
        }
        if (adnotacje.P_PMarzy?._text === '1') {
            let valueMarzy = '';
            if (adnotacje.P_PMarzy_3_1?._text === '1') {
                valueMarzy = 'towary używane';
            }
            else if (adnotacje.P_PMarzy_3_2?._text === '1') {
                valueMarzy = 'dzieła sztuki';
            }
            else if (adnotacje.P_PMarzy_2?._text === '1') {
                valueMarzy = 'biura podróży';
            }
            else if (adnotacje.P_PMarzy_3_3?._text === '1') {
                valueMarzy = 'przedmioty kolekcjonerskie i antyki';
            }
            addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Procedura marży: ', valueMarzy));
        }
        if (adnotacje.P_17?._text === '1') {
            addToColumn(firstColumn, secondColumn, { text: 'Samofakturowanie' });
        }
        if (adnotacje.P_22?._text === '1') {
            let obowiazekVAT = [];
            obowiazekVAT = [...(0, PDF_functions_1.createLabelText)('Wewnątrzwspólnotowe dostawy nowych środków transportu', ' ')];
            if (obowiazekVAT) {
                firstColumn = [firstColumn, ...obowiazekVAT];
            }
        }
        if (firstColumn.length || secondColumn.length) {
            result.push((0, PDF_functions_1.generateColumns)([firstColumn, secondColumn]));
        }
        if (result.length) {
            result.unshift((0, PDF_functions_1.verticalSpacing)(1));
            result.unshift((0, PDF_functions_1.createHeader)('Adnotacje'));
            result.unshift((0, PDF_functions_1.verticalSpacing)(1));
            result.push((0, PDF_functions_1.verticalSpacing)(1));
        }
        if (adnotacje.P_22?._text === '1') {
            result.push(generateDostawy(adnotacje));
        }
    }
    return result;
}
function generateDostawy(adnotacje) {
    const result = [];
    const table = [];
    const anyP22B = (0, PDF_functions_1.hasValue)(adnotacje.P_22B) ||
        (0, PDF_functions_1.hasValue)(adnotacje.P_22BT) ||
        (0, PDF_functions_1.hasValue)(adnotacje.P_22B1) ||
        (0, PDF_functions_1.hasValue)(adnotacje.P_22B2) ||
        (0, PDF_functions_1.hasValue)(adnotacje.P_22B3) ||
        (0, PDF_functions_1.hasValue)(adnotacje.P_22B4);
    const anyP22C = (0, PDF_functions_1.hasValue)(adnotacje.P_22C) || (0, PDF_functions_1.hasValue)(adnotacje.P_22C1);
    const anyP22D = (0, PDF_functions_1.hasValue)(adnotacje.P_22D) || (0, PDF_functions_1.hasValue)(adnotacje.P_22D1);
    if ((0, PDF_functions_1.hasValue)(adnotacje.P_22A)) {
        table.push([
            (0, PDF_functions_1.formatText)('Data dopuszczenia nowego środka transportu do użytku', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(adnotacje.P_22A?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(adnotacje.P_22BMK)) {
        table.push([
            (0, PDF_functions_1.formatText)('Marka nowego środka transportu', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(adnotacje.P_22BMK?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(adnotacje.P_22BMD)) {
        table.push([
            (0, PDF_functions_1.formatText)('Model nowego środka transportu', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(adnotacje.P_22BMD?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(adnotacje.P_22BK)) {
        table.push([
            (0, PDF_functions_1.formatText)('Kolor nowego środka transportu', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(adnotacje.P_22BK?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(adnotacje.P_22BNR)) {
        table.push([
            (0, PDF_functions_1.formatText)('Numer rejestracyjny nowego środka transportu', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(adnotacje.P_22BNR?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(adnotacje.P_22BRP)) {
        table.push([
            (0, PDF_functions_1.formatText)('Rok produkcji nowego środka transportu', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(adnotacje.P_22BRP?._text, common_enum_1.default.Default),
        ]);
    }
    if (anyP22B) {
        table.push([
            (0, PDF_functions_1.formatText)('Rodzaj pojazdu', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)('Dostawa dotyczy pojazdów lądowych, o których mowa w art. 2 pkt 10 lit. a ustawy', common_enum_1.default.Default),
        ]);
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22B)) {
            table.push([
                (0, PDF_functions_1.formatText)('Przebieg pojazdu', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22B?._text, common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22B1)) {
            table.push([
                (0, PDF_functions_1.formatText)('Numer VIN', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22B1?._text, common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22B2)) {
            table.push([
                (0, PDF_functions_1.formatText)('Numer nadwozia', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22B2?._text, common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22B3)) {
            table.push([
                (0, PDF_functions_1.formatText)('Numer podwozia', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22B3?._text, common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22B4)) {
            table.push([
                (0, PDF_functions_1.formatText)('Numer ramy', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22B4?._text, common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22BT)) {
            table.push([
                (0, PDF_functions_1.formatText)('Typ nowego środka transportu', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22BT?._text, common_enum_1.default.Default),
            ]);
        }
    }
    else if (anyP22C) {
        table.push([
            (0, PDF_functions_1.formatText)('Rodzaj pojazdu', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)('Dostawa dotyczy jednostek pływających, o których mowa w art. 2 pkt 10 lit. b ustawy', common_enum_1.default.Default),
        ]);
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22C)) {
            table.push([
                (0, PDF_functions_1.formatText)('Przebieg pojazdu', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22C?._text, common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22C1)) {
            table.push([
                (0, PDF_functions_1.formatText)('Numer kadłuba nowego środka transportu', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22C1?._text, common_enum_1.default.Default),
            ]);
        }
    }
    else if (anyP22D) {
        table.push([
            (0, PDF_functions_1.formatText)('Rodzaj pojazdu', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)('Dostawa dotyczy statków powietrznych, o których mowa w art. 2 pkt 10 lit. c ustawy', common_enum_1.default.Default),
        ]);
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22D)) {
            table.push([
                (0, PDF_functions_1.formatText)('Przebieg pojazdu', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22D?._text, common_enum_1.default.Default),
            ]);
        }
        if ((0, PDF_functions_1.hasValue)(adnotacje.P_22D1)) {
            table.push([
                (0, PDF_functions_1.formatText)('Numer fabryczny nowego środka transportu<', common_enum_1.default.GrayBoldTitle),
                (0, PDF_functions_1.formatText)(adnotacje.P_22D1?._text, common_enum_1.default.Default),
            ]);
        }
    }
    if (table.length) {
        result.push([
            {
                unbreakable: true,
                table: {
                    body: table,
                    widths: ['*', '*'],
                },
                layout: FA_const_1.DEFAULT_TABLE_LAYOUT,
            },
        ]);
    }
    return result;
}
function addToColumn(firstColumn, secondColumn, content, isFirstColumn) {
    if (firstColumn.length > secondColumn.length && isFirstColumn) {
        secondColumn.push(content);
        return;
    }
    firstColumn.push(content);
}
