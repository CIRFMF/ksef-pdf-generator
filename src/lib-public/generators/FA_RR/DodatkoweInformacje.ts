import {Content} from 'pdfmake/interfaces';
import {createHeader, createSection, createSubHeader, getContentTable, getTable,} from '../../../shared/PDF-functions';
import {HeaderDefine} from '../../../shared/types/pdf-types';
import {DodatkowyOpi, DokumentZaplaty, FakturaRR as Fa} from '../../types/FaRR.types';
import FormatTyp from '../../../shared/enums/common.enum';
import i18n from "i18next";

export function generateDodatkoweInformacje(fa: Fa): Content[] {
    const table: Content[] = [
        ...createHeader('invoice.additionalInformation.additionalInformationLabel'),
        ...generateDokumentyZaplaty(fa.DokumentZaplaty),
        ...generateDodatkowyOpis(fa.DodatkowyOpis),
    ];

    return table.length > 1 ? createSection(table, true) : [];
}

function generateDokumentyZaplaty(dokumentZaplaty: DokumentZaplaty[] | undefined): Content[] {
    if (!dokumentZaplaty) {
        return [];
    }
    const dokumentZaplatyTable = getTable(dokumentZaplaty)?.map((item, index) => ({
        ...item,
        lp: {_text: index + 1},
    }));
    const table: Content[] = createSubHeader(i18n.t('invoice.additionalInformation.paymentDocuments'), [0, 0, 0, 4]);

    const dokumentZaplatyHeader: HeaderDefine[] = [
        {
            name: 'lp',
            title: i18n.t('invoice.additionalInformation.ordinalNumber'),
            format: FormatTyp.Default,
            width: 'auto',
        },
        {
            name: 'NrDokumentu',
            title: i18n.t('invoice.additionalInformation.documentNumber'),
            format: FormatTyp.Default,
            width: '*',
        },
        {
            name: 'DataDokumentu',
            title: i18n.t('invoice.additionalInformation.documentDate'),
            format: FormatTyp.Date,
            width: 'auto',
        },
    ];
    const dokumentZaplatyTableContent = getContentTable<(typeof dokumentZaplatyTable)[0]>(
        dokumentZaplatyHeader,
        dokumentZaplatyTable,
        '*',
        [0, 0, 0, 0]
    );

    if (dokumentZaplatyTableContent.content) {
        table.push(dokumentZaplatyTableContent.content);
    }
    return table;
}

function generateDodatkowyOpis(dodatkowyOpis: DodatkowyOpi[] | undefined): Content[] {
    if (!dodatkowyOpis) {
        return [];
    }
    const dodatkowyOpisTable = getTable(dodatkowyOpis)?.map((item, index) => ({
        ...item,
        lp: {_text: index + 1},
    }));
    const table: Content[] = createSubHeader(i18n.t('invoice.additionalInformation.additionalDescription'));

    const dodatkowyOpisHeader: HeaderDefine[] = [
        {
            name: 'lp',
            title: i18n.t('invoice.additionalInformation.ordinalNumber'),
            format: FormatTyp.Default,
            width: 'auto',
        },
        {
            name: 'NrWiersza',
            title: i18n.t('invoice.additionalInformation.rowNumber'),
            format: FormatTyp.Default,
            width: 'auto',
        },
        {
            name: 'Klucz',
            title: i18n.t('invoice.additionalInformation.infoType'),
            format: FormatTyp.Default,
            width: 'auto',
        },
        {
            name: 'Wartosc',
            title: i18n.t('invoice.additionalInformation.infoContent'),
            format: FormatTyp.Default,
            width: '*',
        },
    ];
    const dodatkowyOpisTableContent = getContentTable<(typeof dodatkowyOpisTable)[0]>(
        dodatkowyOpisHeader,
        dodatkowyOpisTable,
        '*',
        [0, 0, 0, 0]
    );

    if (dodatkowyOpisTableContent.content) {
        table.push(dodatkowyOpisTableContent.content);
    }
    return table;
}
