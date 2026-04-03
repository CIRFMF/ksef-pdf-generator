"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStopka = generateStopka;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const Zalaczniki_1 = require("./Zalaczniki");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
function generateStopka(additionalData, stopka, naglowek, wz, zalacznik) {
    const wzty = generateWZ(wz);
    const rejestry = generateRejestry(stopka);
    const informacje = generateInformacje(stopka);
    const qrCode = generateQRCodeData(additionalData);
    const qr2Code = generateQR2CodeData(additionalData);
    const zalaczniki = !additionalData?.isMobile ? (0, Zalaczniki_1.generateZalaczniki)(zalacznik) : [];
    const result = [
        (0, PDF_functions_1.verticalSpacing)(1),
        ...(wzty.length ? [(0, PDF_functions_1.generateLine)()] : []),
        ...(wzty.length ? [(0, PDF_functions_1.generateTwoColumns)(wzty, [])] : []),
        ...(rejestry.length || informacje.length ? [(0, PDF_functions_1.generateLine)()] : []),
        ...rejestry,
        ...informacje,
        ...(zalaczniki.length ? zalaczniki : []),
        { stack: [...qrCode], unbreakable: true },
        { stack: [...qr2Code], unbreakable: true },
        (0, PDF_functions_1.createSection)([
            {
                stack: (0, PDF_functions_1.createLabelText)('Wytworzona w: ', naglowek?.SystemInfo),
                margin: [0, 8, 0, 0],
            },
        ], false, [0, 0, 0, 0]),
    ];
    return (0, PDF_functions_1.createSection)(result, false);
}
function generateWZ(wz) {
    const result = [];
    const definedHeader = [{ name: '', title: 'Numer WZ', format: common_enum_1.default.Default }];
    const faWiersze = (0, PDF_functions_1.getTable)(wz ?? []);
    const content = (0, PDF_functions_1.getContentTable)([...definedHeader], faWiersze, '*');
    if (content.fieldsWithValue.length && content.content) {
        result.push((0, PDF_functions_1.createSubHeader)('Numery dokumentów magazynowych WZ', [0, 8, 0, 4]));
        result.push(content.content);
    }
    return result;
}
function generateRejestry(stopka) {
    const result = [];
    const definedHeader = [
        { name: 'PelnaNazwa', title: 'Pełna nazwa', format: common_enum_1.default.Default },
        { name: 'KRS', title: 'KRS', format: common_enum_1.default.Default },
        { name: 'REGON', title: 'REGON', format: common_enum_1.default.Default },
        { name: 'BDO', title: 'BDO', format: common_enum_1.default.Default },
    ];
    const faWiersze = (0, PDF_functions_1.getTable)(stopka?.Rejestry ?? []);
    const content = (0, PDF_functions_1.getContentTable)([...definedHeader], faWiersze, '*', undefined, 30);
    if (content.fieldsWithValue.length && content.content) {
        result.push((0, PDF_functions_1.createHeader)('Rejestry'));
        result.push(content.content);
    }
    return result;
}
function generateInformacje(stopka) {
    const result = [];
    const definedHeader = [
        { name: 'StopkaFaktury', title: 'Stopka faktury', format: common_enum_1.default.Default },
    ];
    const faWiersze = (0, PDF_functions_1.getTable)(stopka?.Informacje ?? []);
    const content = (0, PDF_functions_1.getContentTable)([...definedHeader], faWiersze, '*');
    if (content.fieldsWithValue.length && content.content) {
        result.push((0, PDF_functions_1.createHeader)('Pozostałe informacje'));
        result.push(content.content);
    }
    return result;
}
function generateQRCodeData(additionalData) {
    const result = [];
    if (additionalData?.qrCode && additionalData.nrKSeF) {
        const qrCode = (0, PDF_functions_1.generateQRCode)(additionalData.qrCode);
        result.push((0, PDF_functions_1.createHeader)('Sprawdź, czy Twoja faktura znajduje się w KSeF!'));
        if (qrCode) {
            result.push({
                columns: [
                    {
                        stack: [
                            qrCode,
                            {
                                stack: [(0, PDF_functions_1.formatText)(additionalData.nrKSeF, common_enum_1.default.Default)],
                                width: 'auto',
                                alignment: 'left',
                                marginLeft: 0,
                                marginRight: 10,
                                marginTop: 10,
                            },
                        ],
                        width: 150,
                    },
                    {
                        stack: [
                            (0, PDF_functions_1.formatText)('Nie możesz zeskanować kodu z obrazka? Kliknij w link weryfikacyjny i przejdź do weryfikacji faktury!', common_enum_1.default.Label),
                            {
                                stack: [(0, PDF_functions_1.formatText)(additionalData.qrCode, common_enum_1.default.Link)],
                                marginTop: 5,
                                link: additionalData.qrCode,
                            },
                        ],
                        margin: [10, (qrCode.fit ?? 120) / 2 - 30, 0, 0],
                        width: 'auto',
                    },
                ],
            });
        }
    }
    return (0, PDF_functions_1.createSection)(result, true);
}
function generateQR2CodeData(additionalData) {
    const result = [];
    if (additionalData?.qr2Code) {
        const qrCode = (0, PDF_functions_1.generateQRCode)(additionalData.qr2Code);
        result.push((0, PDF_functions_1.createHeader)('Zweryfikuj dostawcę faktury'));
        if (qrCode) {
            result.push({
                columns: [
                    {
                        stack: [
                            qrCode,
                            {
                                stack: [(0, PDF_functions_1.formatText)('CERTYFIKAT', common_enum_1.default.Default)],
                                width: 'auto',
                                alignment: 'left',
                                marginLeft: 0,
                                marginRight: 10,
                                marginTop: 10,
                            },
                        ],
                        width: 150,
                    },
                    {
                        stack: [
                            (0, PDF_functions_1.formatText)('Nie możesz zeskanować kodu z obrazka? Kliknij w link weryfikacyjny i przejdź do weryfikacji wystawcy faktury!', common_enum_1.default.Label),
                            {
                                stack: [(0, PDF_functions_1.formatText)(additionalData.qr2Code, common_enum_1.default.Link)],
                                marginTop: 5,
                                link: additionalData.qrCode,
                            },
                        ],
                        margin: [10, (qrCode.fit ?? 120) / 2 - 30, 0, 0],
                        width: 'auto',
                    },
                ],
            });
        }
    }
    return (0, PDF_functions_1.createSection)(result, true);
}
