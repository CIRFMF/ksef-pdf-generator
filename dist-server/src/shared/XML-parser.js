"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripPrefix = stripPrefix;
exports.parseXML = parseXML;
const xml_js_1 = require("xml-js");
function stripPrefix(key) {
    return key.includes(':') ? key.split(':')[1] : key;
}
function parseXML(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const xmlStr = e.target?.result;
                const jsonDoc = (0, xml_js_1.xml2js)(xmlStr, {
                    compact: true,
                    cdataKey: '_text',
                    trim: true,
                    elementNameFn: stripPrefix,
                    attributeNameFn: stripPrefix,
                });
                resolve(jsonDoc);
            }
            catch (error) {
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}
