"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDFUPO = generatePDFUPO;
const pdfmake_1 = __importDefault(require("pdfmake/build/pdfmake"));
const PDF_functions_1 = require("../shared/PDF-functions");
const XML_parser_1 = require("../shared/XML-parser");
const common_enum_1 = require("../shared/enums/common.enum");
const Dokumenty_1 = require("./generators/UPO4_3/Dokumenty");
const Naglowek_1 = require("./generators/UPO4_3/Naglowek");
async function generatePDFUPO(file) {
    const upo = (await (0, XML_parser_1.parseXML)(file));
    const docDefinition = {
        content: [(0, Naglowek_1.generateNaglowekUPO)(upo.Potwierdzenie), (0, Dokumenty_1.generateDokumentUPO)(upo.Potwierdzenie)],
        ...(0, PDF_functions_1.generateStyle)(),
        pageSize: 'A4',
        pageOrientation: 'landscape',
        footer: function (currentPage, pageCount) {
            return {
                text: currentPage.toString() + ' z ' + pageCount,
                alignment: common_enum_1.Position.RIGHT,
                margin: [0, 0, 20, 0],
            };
        },
    };
    return new Promise((resolve, reject) => {
        pdfmake_1.default.createPdf(docDefinition).getBlob((blob) => {
            if (blob) {
                resolve(blob);
            }
            else {
                reject('Error');
            }
        });
    });
}
