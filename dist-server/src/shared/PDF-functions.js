"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatText = formatText;
exports.generateTable = generateTable;
exports.normalizeCurrencySeparator = normalizeCurrencySeparator;
exports.replaceDotWithCommaIfNeeded = replaceDotWithCommaIfNeeded;
exports.hasValue = hasValue;
exports.getValue = getValue;
exports.getNumber = getNumber;
exports.getNumberRounded = getNumberRounded;
exports.createLabelTextArray = createLabelTextArray;
exports.createLabelText = createLabelText;
exports.createSection = createSection;
exports.createHeader = createHeader;
exports.createSubHeader = createSubHeader;
exports.generateStyle = generateStyle;
exports.getTable = getTable;
exports.getRowTable = getRowTable;
exports.hasColumnsValue = hasColumnsValue;
exports.getDifferentColumnsValue = getDifferentColumnsValue;
exports.getContentTable = getContentTable;
exports.generateTwoColumns = generateTwoColumns;
exports.generateColumns = generateColumns;
exports.generateQRCode = generateQRCode;
exports.verticalSpacing = verticalSpacing;
exports.getKraj = getKraj;
exports.getTStawkaPodatku = getTStawkaPodatku;
exports.generateLine = generateLine;
exports.makeBreakable = makeBreakable;
const FA_const_1 = require("./consts/FA.const");
const functions_1 = require("./generators/common/functions");
const common_enum_1 = __importStar(require("./enums/common.enum"));
const FARR_const_1 = require("./consts/FARR.const");
function formatText(value, format = null, options = {}, currency = '') {
    if (!value) {
        return '';
    }
    const result = { text: value.toString() };
    Object.assign(result, options);
    if (format) {
        result.style = format;
        if (!Array.isArray(format)) {
            formatValue(format, result, value, currency);
        }
        else {
            format.forEach((item) => {
                formatValue(item, result, value, currency);
            });
        }
    }
    return result;
}
function generateTable(array, keys) {
    const faRows = getTable(array);
    const headers = Object.entries(keys).map(([key, value], index) => {
        return {
            name: key,
            title: value,
            format: common_enum_1.default.Default,
            ...(index === 0 ? { width: 'auto' } : {}),
        };
    });
    const table = getContentTable(headers, faRows, '*', undefined, 15);
    return table.content ?? [];
}
function formatValue(item, result, value, currency = '') {
    switch (item) {
        case common_enum_1.default.Currency:
            result.text = isNaN(Number(value))
                ? value
                : `${normalizeCurrencySeparator(value)} ${currency}`;
            result.alignment = common_enum_1.Position.RIGHT;
            break;
        case common_enum_1.default.CurrencyAbs:
            result.text = isNaN(Number(value))
                ? value
                : `${dotToComma(Math.abs(Number(value)).toFixed(2))} ${currency}`;
            result.alignment = common_enum_1.Position.RIGHT;
            break;
        case common_enum_1.default.CurrencyGreater:
            result.text = isNaN(Number(value))
                ? value
                : `${dotToComma(Number(value).toFixed(2))} ${currency}`;
            result.fontSize = 10;
            break;
        case common_enum_1.default.Currency6:
            result.text = isNaN(Number(value))
                ? value
                : `${dotToComma(Number(value).toFixed(6))} ${currency}`;
            result.alignment = common_enum_1.Position.RIGHT;
            break;
        case common_enum_1.default.DateTime:
            result.text = (0, functions_1.formatDateTime)(value);
            break;
        case common_enum_1.default.Date:
            result.text = (0, functions_1.formatDateTime)(value, false, true);
            break;
        case common_enum_1.default.Time:
            result.text = (0, functions_1.formatTime)(value);
            break;
        case common_enum_1.default.FormOfPayment:
            result.text = (0, functions_1.translateMap)({ _text: value }, FA_const_1.FormaPlatnosci);
            break;
        case common_enum_1.default.Boolean:
            result.text = value?.trim() === '1' ? common_enum_1.Answer.TRUE : common_enum_1.Answer.FALSE;
            break;
        case common_enum_1.default.Percentage:
            result.text = `${value}%`;
            break;
        case common_enum_1.default.Number:
            result.text = replaceDotWithCommaIfNeeded(value);
            result.alignment = common_enum_1.Position.RIGHT;
            break;
    }
}
function normalizeCurrencySeparator(value) {
    if (!value) {
        return '';
    }
    const numberWithComma = dotToComma(typeof value === 'string' ? value : value.toString());
    if (numberWithComma.includes(',')) {
        const parts = numberWithComma.split(',');
        return parts[1].length > 1 ? numberWithComma : numberWithComma + '0';
    }
    else {
        return numberWithComma + ',00';
    }
}
function replaceDotWithCommaIfNeeded(value) {
    let copyValue = '';
    if (typeof value === 'number') {
        copyValue = value.toString();
    }
    if (typeof value === 'string') {
        copyValue = value;
    }
    return copyValue.includes('.') ? dotToComma(copyValue) : copyValue;
}
function dotToComma(value) {
    return value.replace('.', ',');
}
function hasValue(value) {
    return (!!((typeof value !== 'object' && value) || (typeof value === 'object' && value._text)) || value === 0);
}
function getValue(value) {
    if (typeof value === 'object') {
        return value._text;
    }
    return value;
}
function getNumber(value) {
    const text = getValue(value);
    if (!text) {
        return 0;
    }
    if (typeof text === 'number') {
        return text;
    }
    return parseFloat(text.toString());
}
function getNumberRounded(value) {
    const number = getNumber(value);
    return Math.round(number * 100) / 100;
}
function createLabelTextArray(data) {
    return [
        {
            text: data.map((textEl) => formatText(getValue(textEl.value) ?? '', textEl.formatTyp ?? common_enum_1.default.Label, {}, textEl.currency)),
        },
    ];
}
function createLabelText(label, value, formatTyp = common_enum_1.default.Value, style = {}) {
    if (!value || (typeof value === 'object' && !value._text)) {
        return [];
    }
    if (typeof value === 'object') {
        return [
            {
                text: [formatText(label, common_enum_1.default.Label), formatText(value._text, formatTyp)],
                ...style,
            },
        ];
    }
    return [
        {
            text: [formatText(label, common_enum_1.default.Label), formatText(value, formatTyp)],
            ...style,
        },
    ];
}
function createSection(content, isLineOnTop, margin) {
    return [
        {
            stack: [
                ...(content.length
                    ? [...(isLineOnTop ? [{ stack: [generateLine()], margin: [0, 8, 0, 0] }] : []), content]
                    : []),
            ],
            margin: margin ?? [0, 0, 0, 8],
        },
    ];
}
function createHeader(text, margin) {
    return [
        {
            stack: [formatText(text, common_enum_1.default.HeaderContent)],
            margin: margin ?? [0, 8, 0, 8],
        },
    ];
}
function createSubHeader(text, margin) {
    return [
        {
            stack: [formatText(text, common_enum_1.default.SubHeaderContent)],
            margin: margin ?? [0, 4, 0, 4],
        },
    ];
}
function generateStyle() {
    return {
        styles: {
            columnMarginLeft: {
                margin: [4, 0, 0, 0],
            },
            columnMarginRight: {
                margin: [0, 0, 4, 0],
            },
            GrayBoldTitle: {
                fillColor: '#F6F7FA',
                bold: true,
            },
            GrayTitle: {
                fillColor: '#F6F7FA',
            },
            Label: {
                color: '#343A40',
                bold: true,
            },
            LabelMargin: {
                margin: [0, 12, 0, 1.3],
            },
            LabelSmallMargin: {
                margin: [0, 6, 0, 1.3],
            },
            LabelMedium: {
                color: '#343A40',
                bold: true,
                fontSize: 9,
            },
            LabelGreater: {
                color: '#343A40',
                bold: true,
                fontSize: 10,
            },
            Value: {
                color: '#343A40',
            },
            ValueMedium: {
                color: '#343A40',
                fontSize: 9,
            },
            Bold: {
                fontSize: 9,
                bold: true,
            },
            Description: {
                color: 'blue',
                bold: false,
            },
            HeaderPosition: {
                fontSize: 16,
                bold: true,
            },
            Right: {
                alignment: common_enum_1.Position.RIGHT,
            },
            header: {
                fontSize: 12,
                bold: true,
                margin: [0, 12, 0, 5],
            },
            HeaderContent: {
                fontSize: 10,
                bold: true,
                color: '#343A40',
            },
            SubHeaderContent: {
                fontSize: 7,
                bold: true,
                color: '#343A40',
            },
            TitleContent: {
                fontSize: 10,
                bold: true,
            },
            Link: {
                color: 'blue',
            },
            MarginBottom4: {
                marginBottom: 4,
            },
            MarginBottom8: {
                marginBottom: 8,
            },
            MarginTop4: {
                marginTop: 4,
            },
        },
        defaultStyle: {
            font: 'Roboto',
            fontSize: 7,
            lineHeight: 1.2,
        },
    };
}
function getTable(data) {
    if (!data) {
        return [];
    }
    if (Array.isArray(data)) {
        return data;
    }
    return [data];
}
function getRowTable(data, formatColumn) {
    return data.map((el, index) => {
        if (Array.isArray(formatColumn)) {
            return formatText(el, formatColumn[index] ?? common_enum_1.default.Default);
        }
        return formatText(el, formatColumn ?? common_enum_1.default.Default);
    });
}
function hasColumnsValue(name, data) {
    return data.some((el) => {
        return hasValue(el[name]);
    });
}
function getDifferentColumnsValue(name, data) {
    const result = [];
    data.forEach((el) => {
        const val = getValue(el[name]);
        if (val) {
            const index = result.findIndex((el) => el.value === val);
            if (index < 0) {
                result.push({ value: val, count: 1 });
            }
            else {
                result[index].count++;
            }
        }
    });
    return result;
}
function getContentTable(headers, data, defaultWidths, margin, wordBreak) {
    const fieldsWithValue = headers.filter((header) => {
        return data.some((d) => {
            const name = header.name;
            if (name === '' && d?._text) {
                return true;
            }
            if (name === '') {
                return false;
            }
            if (typeof d[name] === 'object' && d[name]?._text) {
                return true;
            }
            return !!(typeof d[name] !== 'object' && d[name]);
        });
    });
    if (fieldsWithValue.length < 1) {
        return { content: null, fieldsWithValue: [] };
    }
    const headerRow = getRowTable(fieldsWithValue.map((header) => header.title), common_enum_1.default.GrayBoldTitle);
    const tableBody = data.map((row) => {
        return fieldsWithValue.map((header) => {
            const fp = (header.name ? row[header.name] : row);
            const value = typeof fp === 'object' ? fp?._text : fp;
            return formatText(makeBreakable(header.mappingData && value ? header.mappingData[value] : (value ?? ''), wordBreak ?? 40), header.format ?? common_enum_1.default.Default, { rowSpan: fp?._rowSpan ?? 1 });
        });
    });
    return {
        fieldsWithValue: fieldsWithValue.map((el) => el.name),
        content: {
            table: {
                headerRows: 1,
                keepWithHeaderRows: 1,
                widths: fieldsWithValue.map((header) => header.width ?? defaultWidths),
                body: [headerRow, ...tableBody],
            },
            margin: margin ?? [0, 0, 0, 8],
            layout: FA_const_1.DEFAULT_TABLE_LAYOUT,
        },
    };
}
function generateTwoColumns(kol1, kol2, margin) {
    return {
        columns: [
            { stack: [kol1], width: '50%' },
            { stack: [kol2], width: '50%' },
        ],
        margin: margin ?? [0, 0, 0, 0],
        columnGap: 20,
        unbreakable: true,
    };
}
function generateColumns(contents, style = undefined) {
    const width = (100 / contents.length).toFixed(0) + '%';
    const columns = contents.map((content) => ({ stack: content, width }));
    const columnStyle = style ? { ...style } : { columnGap: 20 };
    return {
        columns,
        ...columnStyle,
    };
}
function generateQRCode(qrCode) {
    return qrCode
        ? {
            qr: qrCode,
            fit: 150,
            foreground: 'black',
            background: 'white',
            eccLevel: 'M',
        }
        : undefined;
}
function verticalSpacing(height) {
    return { text: '\n', fontSize: height };
}
function getKraj(code) {
    if (FA_const_1.Kraj[code]) {
        return FA_const_1.Kraj[code];
    }
    return code;
}
function getTStawkaPodatku(code, version, P_PMarzy) {
    let TStawkaPodatkuVersioned = {};
    switch (version) {
        case 1:
            TStawkaPodatkuVersioned = FA_const_1.TStawkaPodatku_FA1;
            break;
        case 2:
            TStawkaPodatkuVersioned = FA_const_1.TStawkaPodatku_FA2;
            break;
        case 3:
            TStawkaPodatkuVersioned = FA_const_1.TStawkaPodatku_FA3;
            break;
        case 'RR':
            TStawkaPodatkuVersioned = FARR_const_1.TStawkaPodatku_FARR;
            break;
    }
    if (!code && P_PMarzy === '1') {
        return 'marża';
    }
    if (TStawkaPodatkuVersioned[code]) {
        return TStawkaPodatkuVersioned[code];
    }
    return code;
}
function generateLine() {
    return {
        table: {
            widths: ['*'],
            body: [[{ text: ' ', fontSize: 1 }]],
        },
        layout: {
            hLineWidth: (i) => (i === 0 ? 1 : 0),
            vLineWidth: () => 0,
            hLineColor: function () {
                return '#c0bfc1';
            },
            paddingTop: () => 0,
            paddingBottom: () => 0,
        },
    };
}
function makeBreakable(value, wordBreak = 40) {
    if (typeof value === 'string') {
        return value.replace(new RegExp(`(.{${wordBreak}})`, 'g'), '$1\u200B');
    }
    return value;
}
