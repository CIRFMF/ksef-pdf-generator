import {Content} from 'pdfmake/interfaces';
import {Kraj, RodzajTransportu, TypLadunku} from '../../../shared/consts/FA.const';
import {
    createHeader,
    createLabelText,
    createSection,
    createSubHeader,
    formatText,
    generateTwoColumns,
    getTable,
    hasValue,
} from '../../../shared/PDF-functions';
import {Transport} from '../../types/fa3.types';
import {getDateTimeWithoutSeconds, translateMap} from '@shared/generators/common/functions';
import {generatePrzewoznik} from './Przewoznik';
import FormatTyp from '../../../shared/enums/common.enum';
import i18n from "i18next";

export function generateTransport(transport: Transport, index?: number | null): Content {
    const table: Content[] = [];
    const columns = {
        transport: [] as Content[],
        dane: [] as Content[],
        wysylkaZ: [] as Content[],
        wysylkaDo: [] as Content[],
        wysylkaPrzez: [] as Content[],
    };

    const header = i18n.t('invoice.transport.header')
    table.push(createHeader(index ? `${header} ${index}` : header));
    if (transport.RodzajTransportu?._text) {
        columns.transport.push(
            createLabelText(i18n.t('invoice.transport.type'), translateMap(transport.RodzajTransportu, RodzajTransportu))
        );
    } else if (transport.TransportInny?._text == '1' && transport.OpisInnegoTransportu?._text) {
        columns.transport.push(createLabelText(i18n.t('invoice.transport.type'), i18n.t('invoice.transport.otherType')));
        columns.transport.push(
            createLabelText(i18n.t('invoice.transport.otherTypeDescription'), transport.OpisInnegoTransportu)
        );
    }
    columns.dane.push(createLabelText(i18n.t('invoice.transport.orderNumber'), transport.NrZleceniaTransportu));
    if (hasValue(transport.OpisLadunku)) {
        columns.dane.push(createLabelText(i18n.t('invoice.transport.cargoDescription'), translateMap(transport.OpisLadunku, TypLadunku)));
        if (transport.LadunekInny?._text === '1' && transport.OpisInnegoLadunku?._text) {
            columns.dane.push(createLabelText(i18n.t('invoice.transport.cargoDescription'), i18n.t('invoice.transport.otherCargo')));
            columns.dane.push(createLabelText(i18n.t('invoice.transport.otherCargoDescription'), transport.OpisInnegoLadunku));
        }
    }
    columns.dane.push(createLabelText(i18n.t('invoice.transport.packageUnit'), transport.JednostkaOpakowania));
    columns.dane.push(
        createLabelText(
            i18n.t('invoice.transport.startDateTime'),
            getDateTimeWithoutSeconds(transport.DataGodzRozpTransportu)
        )
    );
    columns.dane.push(
        createLabelText(
            i18n.t('invoice.transport.endDateTime'),
            getDateTimeWithoutSeconds(transport.DataGodzZakTransportu)
        )
    );
    if (columns.dane.length > 0) {
        columns.dane.unshift(createSubHeader(i18n.t('invoice.transport.dataHeader'), [0, 0, 0, 0]));
    }
    table.push(generateTwoColumns(columns.transport, columns.dane));

    table.push(generatePrzewoznik(transport.Przewoznik));

    if (transport.WysylkaZ?.AdresL1) {
        columns.wysylkaZ.push(createSubHeader(i18n.t('invoice.transport.shipFrom'), [0, 0, 0, 0]));
        columns.wysylkaZ.push(formatText(transport.WysylkaZ?.AdresL1?._text, FormatTyp.Default));
        columns.wysylkaZ.push(formatText(transport.WysylkaZ?.AdresL2?._text, FormatTyp.Default));
        columns.wysylkaZ.push(formatText(i18n.t(Kraj[transport.WysylkaZ?.KodKraju?._text ?? '']), FormatTyp.Default));
        columns.wysylkaZ.push(createLabelText(i18n.t('invoice.transport.gln'), transport.WysylkaZ?.GLN?._text));
    }

    if (transport.WysylkaDo?.AdresL1) {
        columns.wysylkaDo.push(
            createSubHeader(i18n.t('invoice.transport.shipTo'), [0, 0, 0, 0])
        );
        columns.wysylkaDo.push(formatText(transport.WysylkaDo?.AdresL1?._text, FormatTyp.Default));
        columns.wysylkaDo.push(formatText(transport.WysylkaDo?.AdresL2?._text, FormatTyp.Default));
        columns.wysylkaDo.push(formatText(i18n.t(Kraj[transport.WysylkaDo?.KodKraju?._text ?? '']), FormatTyp.Default));
        columns.wysylkaDo.push(createLabelText(i18n.t('invoice.transport.gln'), transport.WysylkaDo?.GLN?._text));
    }

    const wysylkaPrzez = getTable(transport.WysylkaPrzez);

    wysylkaPrzez.forEach((adres, index) => {
        if (index) {
            columns.wysylkaPrzez.push('\n');
        }
        columns.wysylkaPrzez.push(createSubHeader(i18n.t('invoice.transport.intermediateAddress'), [0, 4, 0, 0]));
        columns.wysylkaPrzez.push(formatText(adres.AdresL1?._text, FormatTyp.Default));
        columns.wysylkaPrzez.push(formatText(adres?.AdresL2?._text, FormatTyp.Default));
        columns.wysylkaPrzez.push(formatText(i18n.t(Kraj[adres?.KodKraju?._text ?? '']), FormatTyp.Default));
        columns.wysylkaPrzez.push(createLabelText(i18n.t('invoice.transport.gln'), adres?.GLN?._text));
    });

    if (transport.WysylkaZ?.AdresL1 || transport.WysylkaDo?.AdresL1 || transport.WysylkaPrzez?.length) {
        table.push(createHeader(i18n.t('invoice.transport.shipmentHeader')));
        table.push(generateTwoColumns(columns.wysylkaZ, columns.wysylkaDo));
        table.push(generateTwoColumns(columns.wysylkaPrzez, []));
    }
    return createSection(table, true);
}
