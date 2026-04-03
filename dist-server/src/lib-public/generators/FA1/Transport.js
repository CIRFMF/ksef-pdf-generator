"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransport = generateTransport;
const PDF_functions_1 = require("../../../shared/PDF-functions");
const functions_1 = require("../../../shared/generators/common/functions");
const Adres_1 = require("./Adres");
const Przewoznik_1 = require("./Przewoznik");
const FA_const_1 = require("../../../shared/consts/FA.const");
function generateTransport(transport, index) {
    const table = [];
    const columns = {
        transport: [],
        dane: [],
        wysylkaZ: [],
        wysylkaDo: [],
        wysylkaPrzez: [],
    };
    table.push((0, PDF_functions_1.createHeader)(index ? `Transport ${index}` : 'Transport'));
    if (transport.RodzajTransportu?._text) {
        columns.transport.push((0, PDF_functions_1.createLabelText)('Rodzaj transportu: ', (0, functions_1.translateMap)(transport.RodzajTransportu, FA_const_1.RodzajTransportu)));
    }
    else if (transport.TransportInny?._text == '1' && transport.OpisInnegoTransportu?._text) {
        columns.transport.push((0, PDF_functions_1.createLabelText)('Rodzaj transportu: ', 'Transport inny'));
        columns.transport.push((0, PDF_functions_1.createLabelText)('Opis innego rodzaju transportu: ', transport.OpisInnegoTransportu));
    }
    columns.dane.push((0, PDF_functions_1.createLabelText)('Numer zlecenia transportu: ', transport.NrZleceniaTransportu));
    if ((0, PDF_functions_1.hasValue)(transport.OpisLadunku)) {
        columns.dane.push((0, PDF_functions_1.createLabelText)('Opis ładunku: ', (0, functions_1.translateMap)(transport.OpisLadunku, FA_const_1.TypLadunku)));
        if (transport.LadunekInny?._text === '1' && transport.OpisInnegoLadunku?._text) {
            columns.dane.push((0, PDF_functions_1.createLabelText)('Opis ładunku: ', 'Ładunek inny'));
            columns.dane.push((0, PDF_functions_1.createLabelText)('Opis innego ładunku: ', transport.OpisInnegoLadunku));
        }
    }
    columns.dane.push((0, PDF_functions_1.createLabelText)('Jednostka opakowania: ', transport.JednostkaOpakowania));
    columns.dane.push((0, PDF_functions_1.createLabelText)('Data i godzina rozpoczęcia transportu: ', (0, functions_1.getDateTimeWithoutSeconds)(transport.DataGodzRozpTransportu)));
    columns.dane.push((0, PDF_functions_1.createLabelText)('Data i godzina zakończenia transportu: ', (0, functions_1.getDateTimeWithoutSeconds)(transport.DataGodzZakTransportu)));
    if (columns.dane.length > 0) {
        columns.dane.unshift((0, PDF_functions_1.createSubHeader)('Dane transportu', [0, 0, 0, 0]));
    }
    table.push((0, PDF_functions_1.generateTwoColumns)(columns.transport, columns.dane));
    table.push((0, Przewoznik_1.generatePrzewoznik)(transport.Przewoznik));
    if (transport.WysylkaZ) {
        columns.wysylkaZ.push((0, PDF_functions_1.createSubHeader)('Adres miejsca wysyłki', [0, 0, 0, 0]));
        columns.wysylkaZ.push((0, Adres_1.generateAdres)(transport.WysylkaZ));
    }
    if (transport.WysylkaDo) {
        columns.wysylkaDo.push((0, PDF_functions_1.createSubHeader)('Adres miejsca docelowego, do którego został zlecony transport', [0, 0, 0, 0]));
        columns.wysylkaDo.push((0, Adres_1.generateAdres)(transport.WysylkaDo));
    }
    const wysylkaPrzez = (0, PDF_functions_1.getTable)(transport.WysylkaPrzez);
    wysylkaPrzez.forEach((adres, index) => {
        if (index) {
            columns.wysylkaPrzez.push('\n');
        }
        columns.wysylkaPrzez.push((0, PDF_functions_1.createSubHeader)('Adres pośredni wysyłki', [0, 4, 0, 0]));
        columns.wysylkaPrzez.push((0, Adres_1.generateAdres)(adres));
    });
    if (transport.WysylkaZ || transport.WysylkaDo || transport.WysylkaPrzez?.length) {
        table.push((0, PDF_functions_1.createHeader)('Wysyłka'));
        table.push((0, PDF_functions_1.generateTwoColumns)(columns.wysylkaZ, columns.wysylkaDo));
        table.push((0, PDF_functions_1.generateTwoColumns)(columns.wysylkaPrzez, []));
    }
    return (0, PDF_functions_1.createSection)(table, true);
}
