"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDokumentUPO = generateDokumentUPO;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importDefault(require("../../../shared/enums/common.enum"));
const FA_const_1 = require("../../../shared/consts/FA.const");
function generateDokumentUPO(potwierdzenie) {
    const dokumenty = (0, PDF_functions_1.getTable)(potwierdzenie.Dokument);
    const result = [];
    const table = [];
    result.push((0, PDF_functions_1.verticalSpacing)(4));
    result.push((0, PDF_functions_1.generateLine)());
    result.push((0, PDF_functions_1.verticalSpacing)(8));
    result.push((0, PDF_functions_1.formatText)('Urzędowe poświadczenie odbioru dokumentu elektronicznego KSeF', common_enum_1.default.HeaderPosition));
    result.push((0, PDF_functions_1.verticalSpacing)(8));
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.NumerReferencyjnySesji)) {
        table.push([
            (0, PDF_functions_1.formatText)('Numer referencyjny sesji: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.NumerReferencyjnySesji?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.OpisPotwierdzenia?.Strona)) {
        table.push([
            (0, PDF_functions_1.formatText)('Strona dokumentu UPO: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.OpisPotwierdzenia?.Strona?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.OpisPotwierdzenia?.LiczbaStron)) {
        table.push([
            (0, PDF_functions_1.formatText)('Całkowita liczba stron dokumentu UPO: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.OpisPotwierdzenia?.LiczbaStron?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.OpisPotwierdzenia?.ZakresDokumentowOd)) {
        table.push([
            (0, PDF_functions_1.formatText)('Zakres dokumentów od: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.OpisPotwierdzenia?.ZakresDokumentowOd?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.OpisPotwierdzenia?.ZakresDokumentowDo)) {
        table.push([
            (0, PDF_functions_1.formatText)('Zakres dokumentów do: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.OpisPotwierdzenia?.ZakresDokumentowDo?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.OpisPotwierdzenia?.CalkowitaLiczbaDokumentow)) {
        table.push([
            (0, PDF_functions_1.formatText)('Całkowita liczba dokumentów: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.OpisPotwierdzenia?.CalkowitaLiczbaDokumentow?._text, common_enum_1.default.Default),
        ]);
    }
    const idKontekstu = potwierdzenie?.Uwierzytelnienie?.IdKontekstu;
    if (idKontekstu) {
        let typKontekstu = '';
        let id;
        if ((0, PDF_functions_1.hasValue)(idKontekstu.IdDostawcyUslugPeppol)) {
            typKontekstu = 'Identyfikator Peppol';
            id = (0, PDF_functions_1.getValue)(idKontekstu.IdDostawcyUslugPeppol);
        }
        if ((0, PDF_functions_1.hasValue)(idKontekstu.Nip)) {
            typKontekstu = 'NIP';
            id = (0, PDF_functions_1.getValue)(idKontekstu.Nip);
        }
        if ((0, PDF_functions_1.hasValue)(idKontekstu.IdWewnetrzny)) {
            typKontekstu = 'Identyfikator wewnętrzny';
            id = (0, PDF_functions_1.getValue)(idKontekstu.IdWewnetrzny);
        }
        if ((0, PDF_functions_1.hasValue)(idKontekstu.IdZlozonyVatUE)) {
            typKontekstu = 'Identyfikator złożony';
            id = (0, PDF_functions_1.getValue)(idKontekstu.IdZlozonyVatUE);
        }
        table.push([
            (0, PDF_functions_1.formatText)('Typ kontekstu: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(typKontekstu, common_enum_1.default.Default),
        ]);
        table.push([
            (0, PDF_functions_1.formatText)('Identyfikator kontekstu uwierzytelnienia: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(id, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.Uwierzytelnienie?.SkrotDokumentuUwierzytelniajacego)) {
        table.push([
            (0, PDF_functions_1.formatText)('Skrót dokumentu uwierzytelniającego: ', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.Uwierzytelnienie?.SkrotDokumentuUwierzytelniajacego?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.NazwaStrukturyLogicznej)) {
        table.push([
            (0, PDF_functions_1.formatText)('Nazwa pliku XSD struktury logicznej dotycząca przesłanego dokumentu:', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.NazwaStrukturyLogicznej?._text, common_enum_1.default.Default),
        ]);
    }
    if ((0, PDF_functions_1.hasValue)(potwierdzenie.KodFormularza)) {
        table.push([
            (0, PDF_functions_1.formatText)('Kod formularza przedłożonego dokumentu elektronicznego:', common_enum_1.default.GrayBoldTitle),
            (0, PDF_functions_1.formatText)(potwierdzenie.KodFormularza?._text, common_enum_1.default.Default),
        ]);
    }
    result.push([
        {
            unbreakable: true,
            table: {
                body: table,
                widths: ['auto', '*'],
            },
            layout: FA_const_1.DEFAULT_TABLE_LAYOUT,
        },
    ]);
    result.push((0, PDF_functions_1.verticalSpacing)(8));
    const definedHeader = [
        { name: 'lp', title: 'Lp.', format: common_enum_1.default.Default },
        {
            name: 'NumerKSeFDokumentu',
            title: 'Numer identyfikujący fakturę w KSeF',
            format: common_enum_1.default.Default,
        },
        { name: 'NumerFaktury', title: 'Numer faktury', format: common_enum_1.default.Default },
        { name: 'NipSprzedawcy', title: 'NIP Sprzedawcy', format: common_enum_1.default.Default },
        {
            name: 'DataWystawieniaFaktury',
            title: 'Data wystawienia faktury',
            format: common_enum_1.default.Date,
        },
        {
            name: 'DataPrzeslaniaDokumentu',
            title: 'Data przesłania do KSeF',
            format: common_enum_1.default.DateTime,
        },
        {
            name: 'DataNadaniaNumeruKSeF',
            title: 'Data nadania numeru KSeF',
            format: common_enum_1.default.DateTime,
        },
        {
            name: 'SkrotDokumentu',
            title: 'Wartość funkcji skrótu złożonego dokumentu',
            format: common_enum_1.default.Default,
        },
        {
            name: 'TrybWysylki',
            title: 'Tryb wysyłki',
            format: common_enum_1.default.Default,
            width: '*',
        },
    ];
    const documentData = dokumenty.map((doc, index) => {
        return { ...doc, lp: index + 1 };
    }) ?? [];
    const tabDocument = (0, PDF_functions_1.getContentTable)(definedHeader, documentData, 'auto');
    if (tabDocument.content) {
        result.push(tabDocument.content);
    }
    return result;
}
