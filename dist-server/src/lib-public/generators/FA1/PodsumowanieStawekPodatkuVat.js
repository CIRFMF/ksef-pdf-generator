"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePodsumowanieStawekPodatkuVat = generatePodsumowanieStawekPodatkuVat;
exports.getSummaryTaxRate = getSummaryTaxRate;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const FA_const_1 = require("../../../shared/consts/FA.const");
function generatePodsumowanieStawekPodatkuVat(faktura) {
    const AnyP13P14_5Diff0 = (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_1) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_2) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_3) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_4) ||
        ((0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_5) && (!(0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_5) || (0, PDF_functions_1.getValue)(faktura.Fa?.P_14_5) == 0)) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_6) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_7);
    const AnyP13 = (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_1) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_2) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_3) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_4) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_5) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_13_7);
    const AnyP_14xW = (0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_1W) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_2W) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_3W) ||
        (0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_4W);
    let tableBody = [];
    const table = {
        table: {
            headerRows: 1,
            widths: [],
            body: [],
        },
        layout: FA_const_1.DEFAULT_TABLE_LAYOUT,
    };
    const definedHeader = [
        ...[{ text: 'Lp.', style: common_enum_1.default.GrayBoldTitle }],
        ...(AnyP13P14_5Diff0 || (0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_5)
            ? [
                {
                    text: 'Stawka podatku',
                    style: common_enum_1.default.GrayBoldTitle,
                },
            ]
            : []),
        ...(AnyP13 ? [{ text: 'Kwota netto', style: common_enum_1.default.GrayBoldTitle }] : []),
        ...(AnyP13P14_5Diff0 || (0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_5)
            ? [
                {
                    text: 'Kwota podatku',
                    style: common_enum_1.default.GrayBoldTitle,
                },
            ]
            : []),
        ...(AnyP13 ? [{ text: 'Kwota brutto', style: common_enum_1.default.GrayBoldTitle }] : []),
        ...(AnyP_14xW ? [{ text: 'Kwota podatku PLN', style: common_enum_1.default.GrayBoldTitle }] : []),
    ];
    const widths = [
        ...['auto'],
        ...(AnyP13P14_5Diff0 || (0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_5) ? ['*'] : []),
        ...(AnyP13 ? ['*'] : []),
        ...(AnyP13P14_5Diff0 || (0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_5) ? ['*'] : []),
        ...(AnyP13 ? ['*'] : []),
        ...(AnyP_14xW ? ['*'] : []),
    ];
    if (faktura?.Fa) {
        const summary = getSummaryTaxRate(faktura.Fa);
        tableBody = summary.map((item) => {
            const data = [];
            data.push(item.no);
            if (AnyP13P14_5Diff0) {
                if (item.taxRateString) {
                    data.push(item.taxRateString);
                }
                else if ((0, PDF_functions_1.getValue)(faktura.Fa?.P_13_5)) {
                    data.push('OSS');
                }
                else {
                    data.push('');
                }
            }
            else if ((0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_5)) {
                data.push('OSS');
            }
            if (AnyP13) {
                data.push((0, PDF_functions_1.formatText)(item.net, common_enum_1.default.Currency));
            }
            if (AnyP13P14_5Diff0) {
                data.push((0, PDF_functions_1.formatText)(item.tax, common_enum_1.default.Currency));
            }
            else if ((0, PDF_functions_1.hasValue)(faktura.Fa?.P_14_5)) {
                data.push((0, PDF_functions_1.getValue)(faktura.Fa?.P_14_5));
            }
            if (AnyP13) {
                data.push((0, PDF_functions_1.formatText)(item.gross, common_enum_1.default.Currency));
            }
            if (AnyP_14xW) {
                data.push((0, PDF_functions_1.formatText)(item.taxPLN, common_enum_1.default.Currency));
            }
            return data;
        });
    }
    table.table.body = [[...definedHeader], ...tableBody];
    table.table.widths = [...widths];
    return tableBody.length
        ? (0, PDF_functions_1.createSection)([...(0, PDF_functions_1.createHeader)('Podsumowanie stawek podatku', [0, 0, 0, 8]), table], false)
        : [];
}
function getSummaryTaxRate(fa) {
    const summary = [];
    const AnyP13_1P14_1P14_1WDiff0 = hasValueAndDiff0(fa?.P_13_1) || hasValueAndDiff0(fa?.P_14_1) || hasValueAndDiff0(fa?.P_14_1W);
    const AnyP13_2P14_2P14_2WDiff0 = hasValueAndDiff0(fa?.P_13_2) || hasValueAndDiff0(fa?.P_14_2) || hasValueAndDiff0(fa?.P_14_2W);
    const AnyP13_3P14_3P14_3WDiff0 = hasValueAndDiff0(fa?.P_13_3) || hasValueAndDiff0(fa?.P_14_3) || hasValueAndDiff0(fa?.P_14_3W);
    const AnyP13_4P14_4P14_4WDiff0 = hasValueAndDiff0(fa?.P_13_4) || hasValueAndDiff0(fa?.P_14_4) || hasValueAndDiff0(fa?.P_14_4W);
    const AnyP13_5P14_5Diff0 = hasValueAndDiff0(fa?.P_13_5) || hasValueAndDiff0(fa?.P_14_5);
    const AnyP13_7Diff0 = hasValueAndDiff0(fa?.P_13_7);
    let no = 1;
    if (AnyP13_1P14_1P14_1WDiff0) {
        summary.push({
            no,
            net: (0, PDF_functions_1.getNumberRounded)(fa.P_13_1).toFixed(2),
            gross: ((0, PDF_functions_1.getNumberRounded)(fa.P_13_1) + (0, PDF_functions_1.getNumberRounded)(fa.P_14_1)).toFixed(2),
            tax: (0, PDF_functions_1.getNumberRounded)(fa.P_14_1).toFixed(2),
            taxPLN: (0, PDF_functions_1.getNumberRounded)(fa.P_14_1W).toFixed(2),
            taxRateString: '23% lub 22%',
        });
        no++;
    }
    if (AnyP13_2P14_2P14_2WDiff0) {
        summary.push({
            no,
            net: (0, PDF_functions_1.getNumberRounded)(fa.P_13_2).toFixed(2),
            gross: ((0, PDF_functions_1.getNumberRounded)(fa.P_13_2) + (0, PDF_functions_1.getNumberRounded)(fa.P_14_2)).toFixed(2),
            tax: (0, PDF_functions_1.getNumberRounded)(fa.P_14_2).toFixed(2),
            taxPLN: (0, PDF_functions_1.getNumberRounded)(fa.P_14_2W).toFixed(2),
            taxRateString: '8% lub 7%',
        });
        no++;
    }
    if (AnyP13_3P14_3P14_3WDiff0) {
        summary.push({
            no,
            net: (0, PDF_functions_1.getNumberRounded)(fa.P_13_3).toFixed(2),
            gross: ((0, PDF_functions_1.getNumberRounded)(fa.P_13_3) + (0, PDF_functions_1.getNumberRounded)(fa.P_14_3)).toFixed(2),
            tax: (0, PDF_functions_1.getNumberRounded)(fa.P_14_3).toFixed(2),
            taxPLN: (0, PDF_functions_1.getNumberRounded)(fa.P_14_3W).toFixed(2),
            taxRateString: '5%',
        });
        no++;
    }
    if (AnyP13_4P14_4P14_4WDiff0) {
        summary.push({
            no,
            net: (0, PDF_functions_1.getNumberRounded)(fa.P_13_4).toFixed(2),
            gross: ((0, PDF_functions_1.getNumberRounded)(fa.P_13_4) + (0, PDF_functions_1.getNumberRounded)(fa.P_14_4)).toFixed(2),
            tax: (0, PDF_functions_1.getNumberRounded)(fa.P_14_4).toFixed(2),
            taxPLN: (0, PDF_functions_1.getNumberRounded)(fa.P_14_4W).toFixed(2),
            taxRateString: '4% lub 3%',
        });
        no++;
    }
    if (AnyP13_5P14_5Diff0) {
        summary.push({
            no,
            net: (0, PDF_functions_1.getNumberRounded)(fa.P_13_5).toFixed(2),
            gross: ((0, PDF_functions_1.getNumberRounded)(fa.P_13_5) + (0, PDF_functions_1.getNumberRounded)(fa.P_14_5)).toFixed(2),
            tax: (0, PDF_functions_1.getNumberRounded)(fa.P_14_5).toFixed(2),
            taxPLN: '',
            taxRateString: (0, PDF_functions_1.getValue)(fa.P_14_5) != 0 ? 'OSS' : '',
        });
        no++;
    }
    if (AnyP13_7Diff0) {
        summary.push({
            no,
            net: (0, PDF_functions_1.getNumberRounded)(fa.P_13_7).toFixed(2),
            gross: (0, PDF_functions_1.getNumberRounded)(fa.P_13_7).toFixed(2),
            tax: '0.00',
            taxPLN: '',
            taxRateString: 'zwolnione z opodatkowania',
        });
        no++;
    }
    return summary;
}
function hasValueAndDiff0(value) {
    return (0, PDF_functions_1.hasValue)(value) && (0, PDF_functions_1.getValue)(value) != 0;
}
