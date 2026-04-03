"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdnotacje = generateAdnotacje;
exports.generateDostawy = generateDostawy;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateAdnotacje(adnotacje) {
    const result = [];
    const firstColumn = [];
    const secondColumn = [];
    if (adnotacje) {
        const zwolnienie = adnotacje.Zwolnienie;
        if (zwolnienie?.P_19?._text === '1') {
            addToColumn(firstColumn, secondColumn, {
                text: 'Dostawa towarów lub świadczenie usług zwolnionych od podatku na podstawie art. 43 ust. 1, art. 113 ust. 1 i 9 albo przepisów wydanych na podstawie art. 82 ust. 3 lub na podstawie innych przepisów',
            }, true);
            if (zwolnienie.P_19A?._text) {
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Podstawa zwolnienia od podatku: ', 'Przepis ustawy albo aktu wydanego na podstawie ustawy, na podstawie którego podatnik stosuje zwolnienie od podatku'), true);
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Przepis ustawy albo aktu wydanego na podstawie ustawy: ', zwolnienie.P_19A._text), true);
            }
            if (zwolnienie.P_19B?._text) {
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Podstawa zwolnienia od podatku: ', 'Przepis dyrektywy 2006/112/WE, który zwalnia od podatku taką dostawę towarów lub takie świadczenie usług'), true);
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Przepis dyrektywy: ', zwolnienie.P_19B._text), true);
            }
            if (zwolnienie.P_19C?._text) {
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Podstawa zwolnienia od podatku: ', 'Inna podstawa prawna wskazującą na to, że dostawa towarów lub świadczenie usług korzysta ze zwolnienia'), true);
                addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Inna podstawa prawna: ', zwolnienie.P_19C._text), true);
            }
        }
        if (adnotacje.NoweSrodkiTransportu?.P_42_5?._text === '1' ||
            adnotacje.NoweSrodkiTransportu?.P_42_5?._text === '2') {
            let obowiazekVAT = [];
            let value = ' ';
            if (adnotacje.NoweSrodkiTransportu.P_42_5?._text === '1') {
                value = 'Istnieje obowiązek wystawienia dokumentu VAT-22';
            }
            else if (adnotacje.NoweSrodkiTransportu.P_42_5?._text === '2') {
                value = 'Nie istnieje obowiązek wystawienia dokumentu VAT-22';
            }
            obowiazekVAT = [
                ...(0, PDF_functions_1.createLabelText)('Wewnątrzwspólnotowe dostawy nowych środków transportu: ', value ?? ''),
            ];
            if (obowiazekVAT) {
                addToColumn(firstColumn, secondColumn, obowiazekVAT, true);
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
        if (adnotacje.PMarzy?.P_PMarzy?._text === '1') {
            let valueMarzy = '';
            if (adnotacje.PMarzy.P_PMarzy_3_1?._text === '1') {
                valueMarzy = 'towary używane';
            }
            else if (adnotacje.PMarzy.P_PMarzy_3_2?._text === '1') {
                valueMarzy = 'dzieła sztuki';
            }
            else if (adnotacje.PMarzy.P_PMarzy_2?._text === '1') {
                valueMarzy = 'biura podróży';
            }
            else if (adnotacje.PMarzy.P_PMarzy_3_3?._text === '1') {
                valueMarzy = 'przedmioty kolekcjonerskie i antyki';
            }
            addToColumn(firstColumn, secondColumn, (0, PDF_functions_1.createLabelText)('Procedura marży: ', valueMarzy));
        }
        if (adnotacje.P_17?._text === '1') {
            addToColumn(firstColumn, secondColumn, { text: 'Samofakturowanie' });
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
        if (adnotacje.NoweSrodkiTransportu?.P_42_5?._text === '1' ||
            adnotacje.NoweSrodkiTransportu?.P_42_5?._text === '2') {
            result.push(generateDostawy(adnotacje.NoweSrodkiTransportu));
        }
    }
    return result;
}
function generateDostawy(noweSrodkiTransportu) {
    const nowySrodekTransportu = (0, PDF_functions_1.getTable)(noweSrodkiTransportu.NowySrodekTransportu);
    let tableBody = [];
    const table = {
        table: {
            headerRows: 1,
            widths: [100, '*'],
            body: [],
        },
        layout: {
            hLineWidth: () => 1,
            hLineColor: () => '#BABABA',
            vLineWidth: () => 1,
            vLineColor: () => '#BABABA',
        },
        marginTop: 4,
    };
    if (nowySrodekTransportu?.length) {
        const definedHeader = [
            { text: 'Data dopuszczenia do użytku', style: common_enum_1.default.GrayBoldTitle },
            { text: 'Opis', style: common_enum_1.default.GrayBoldTitle },
        ];
        tableBody = nowySrodekTransportu.map((item) => {
            const value = [];
            const anyP22B = (0, PDF_functions_1.hasValue)(item.P_22B) ||
                (0, PDF_functions_1.hasValue)(item.P_22BT) ||
                (0, PDF_functions_1.hasValue)(item.P_22B1) ||
                (0, PDF_functions_1.hasValue)(item.P_22B2) ||
                (0, PDF_functions_1.hasValue)(item.P_22B3) ||
                (0, PDF_functions_1.hasValue)(item.P_22B4);
            const anyP22C = (0, PDF_functions_1.hasValue)(item.P_22C) || (0, PDF_functions_1.hasValue)(item.P_22C1);
            const anyP22D = (0, PDF_functions_1.hasValue)(item.P_22D) || (0, PDF_functions_1.hasValue)(item.P_22D1);
            const anyP22N = (0, PDF_functions_1.hasValue)(item.P_22B1) || (0, PDF_functions_1.hasValue)(item.P_22B2) || (0, PDF_functions_1.hasValue)(item.P_22B3) || (0, PDF_functions_1.hasValue)(item.P_22B4);
            if (item.P_NrWierszaNST?._text) {
                value.push(item.P_NrWierszaNST._text);
            }
            if (anyP22B) {
                value.push('Dostawa dotyczy pojazdów lądowych, o których mowa w art. 2 pkt 10 lit. a ustawy');
            }
            else if (anyP22C) {
                value.push('Dostawa dotyczy jednostek pływających, o których mowa w art. 2 pkt 10 lit. b ustawy');
            }
            else if (anyP22D) {
                value.push('Dostawa dotyczy statków powietrznych, o których mowa w art. 2 pkt 10 lit. c ustawy');
            }
            const transportProperties = [
                (0, PDF_functions_1.getValue)(item.P_22BMK),
                (0, PDF_functions_1.getValue)(item.P_22BMD),
                (0, PDF_functions_1.getValue)(item.P_22BK),
                (0, PDF_functions_1.getValue)(item.P_22BNR),
                (0, PDF_functions_1.getValue)(item.P_22BRP),
            ].filter((prop) => !!prop);
            if (transportProperties.length) {
                value.push(transportProperties.join(', '));
            }
            if (item.DetailsString?._text) {
                value.push(item.DetailsString._text);
            }
            if (anyP22B || anyP22C || anyP22D) {
                value.push(item.P_22B?._text ?? item.P_22C?._text ?? item.P_22D?._text ?? '');
            }
            if (item.P_22C1?._text) {
                value.push(`Numer kadłuba nowego środka transportu:  ${item.P_22C1._text}`);
            }
            if (item.P_22D1?._text) {
                value.push(`Numer fabryczny nowego środka transportu: ${item.P_22D1._text}`);
            }
            if (anyP22N) {
                if (item.P_22B1?._text) {
                    value.push(`Numer VIN:  ${item.P_22B1._text}`);
                }
                if (item.P_22B2?._text) {
                    value.push(`Numer nadwozia:  ${item.P_22B2._text}`);
                }
                if (item.P_22B3?._text) {
                    value.push(`Numer podwozia:  ${item.P_22B3._text}`);
                }
                if (item.P_22B4?._text) {
                    value.push(`Numer ramy:  ${item.P_22B4._text}`);
                }
            }
            if (item.P_22BT?._text) {
                value.push(item.P_22BT._text);
            }
            return [(0, PDF_functions_1.formatText)(item.P_22A?._text), { text: value.join('\n') }];
        });
        table.table.body = [[...definedHeader], ...tableBody];
    }
    return tableBody.length ? [table, (0, PDF_functions_1.verticalSpacing)(1)] : [];
}
function addToColumn(firstColumn, secondColumn, content, isFirstColumn) {
    if (firstColumn.length > secondColumn.length && isFirstColumn) {
        secondColumn.push(content);
        return;
    }
    firstColumn.push(content);
}
