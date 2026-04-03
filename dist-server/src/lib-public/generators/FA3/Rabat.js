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
exports.generateRabat = generateRabat;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const common_enum_1 = __importStar(require("../../../shared/enums/common.enum"));
function generateRabat(invoice) {
    const faRows = (0, PDF_functions_1.getTable)(invoice.FaWiersz);
    const result = [];
    const definedHeader = [
        { name: 'NrWierszaFa', title: 'Lp.', format: common_enum_1.default.Default, width: 'auto' },
        { name: 'P_7', title: 'Nazwa towaru lub usługi', format: common_enum_1.default.Default },
        { name: 'P_8B', title: 'Ilość', format: common_enum_1.default.Default },
        { name: 'P_8A', title: 'Miara', format: common_enum_1.default.Default },
    ];
    const tabRabat = (0, PDF_functions_1.getContentTable)(definedHeader, faRows, '*');
    const isNrWierszaFa = tabRabat.fieldsWithValue.includes('NrWierszaFa');
    result.push(...(0, PDF_functions_1.createHeader)('Rabat'), ...(0, PDF_functions_1.createLabelText)('Wartość rabatu ogółem: ', invoice.P_15, common_enum_1.default.Currency, {
        alignment: common_enum_1.Position.RIGHT,
    }), (0, PDF_functions_1.generateTwoColumns)((0, PDF_functions_1.formatText)(`Rabat ${isNrWierszaFa ? 'nie ' : ''}dotyczy wszystkich dostaw towarów i wykonanych usług na rzecz tego nabywcy w danym okresie.`, common_enum_1.default.Default), ''));
    if (tabRabat.fieldsWithValue.length > 0 && tabRabat.content) {
        result.push(tabRabat.content);
    }
    return (0, PDF_functions_1.createSection)(result, true);
}
