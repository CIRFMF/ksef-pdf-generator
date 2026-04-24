import { Content } from 'pdfmake/interfaces';
import {
  formatText,
  generateLine,
  getContentTable,
  getTable,
  getValue,
  hasValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { Dokument, IDKontekstu, Potwierdzenie } from '../../types/upo-v4_2.types';
import FormatTyp from '../../../shared/enums/common.enum';
import { FormContentState } from '../../../shared/types/additional-data.types';
import { DEFAULT_TABLE_LAYOUT } from '../../../shared/consts/FA.const';
import i18n from "i18next";

export function generateDokumnetUPO(potwierdzenie: Potwierdzenie): Content[] {
  const dokumenty: Dokument[] = getTable(potwierdzenie.Dokument);

  const result: Content[] = [];
  const table: Content[] = [];

  result.push(verticalSpacing(4));
  result.push(generateLine());
  result.push(verticalSpacing(8));
  result.push(
      formatText(i18n.t('invoice.upo.upoKsef'), FormatTyp.HeaderPosition));
  result.push(verticalSpacing(8));
  if (hasValue(potwierdzenie.NumerReferencyjnySesji)) {
    table.push([
      formatText(i18n.t('invoice.upo.sessionReferenceNumber'), FormatTyp.GrayBoldTitle),
      formatText(potwierdzenie.NumerReferencyjnySesji?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(potwierdzenie.OpisPotwierdzenia?.Strona)) {
    table.push([
      formatText(i18n.t('invoice.upo.upoPage'), FormatTyp.GrayBoldTitle),
      formatText(potwierdzenie.OpisPotwierdzenia?.Strona?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(potwierdzenie.OpisPotwierdzenia?.LiczbaStron)) {
    table.push([
      formatText(i18n.t('invoice.upo.upoPageTotal'), FormatTyp.GrayBoldTitle),
      formatText(potwierdzenie.OpisPotwierdzenia?.LiczbaStron?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(potwierdzenie.OpisPotwierdzenia?.ZakresDokumentowOd)) {
    table.push([
      formatText(i18n.t('invoice.upo.documentRangeFrom'), FormatTyp.GrayBoldTitle),
      formatText(potwierdzenie.OpisPotwierdzenia?.ZakresDokumentowOd?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(potwierdzenie.OpisPotwierdzenia?.ZakresDokumentowDo)) {
    table.push([
      formatText(i18n.t('invoice.upo.documentRangeTo'), FormatTyp.GrayBoldTitle),
      formatText(potwierdzenie.OpisPotwierdzenia?.ZakresDokumentowDo?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(potwierdzenie.OpisPotwierdzenia?.CalkowitaLiczbaDokumentow)) {
    table.push([
      formatText(i18n.t('invoice.upo.documentsTotal'), FormatTyp.GrayBoldTitle),
      formatText(potwierdzenie.OpisPotwierdzenia?.CalkowitaLiczbaDokumentow?._text, FormatTyp.Default),
    ]);
  }
  const idKontekstu: IDKontekstu | undefined = potwierdzenie?.Uwierzytelnienie?.IdKontekstu;

  if (idKontekstu) {
    let typKontekstu: string = '';
    let id: string | number | undefined;

    if (hasValue(idKontekstu.IdDostawcyUslugPeppol)) {
      typKontekstu = i18n.t('invoice.upo.peppolId');
      id = getValue(idKontekstu.IdDostawcyUslugPeppol);
    }

    if (hasValue(idKontekstu.Nip)) {
      typKontekstu = i18n.t('invoice.subjectIdentificationData.nip');
      id = getValue(idKontekstu.Nip);
    }

    if (hasValue(idKontekstu.IdWewnetrzny)) {
      typKontekstu = i18n.t('invoice.upo.internalId');
      id = getValue(idKontekstu.IdWewnetrzny);
    }

    if (hasValue(idKontekstu.IdZlozonyVatUE)) {
      typKontekstu = i18n.t('invoice.upo.complexId');
      id = getValue(idKontekstu.IdZlozonyVatUE);
    }
    table.push([
      formatText(i18n.t('invoice.upo.contextType'), FormatTyp.GrayBoldTitle),
      formatText(typKontekstu, FormatTyp.Default),
    ]);
    table.push([
      formatText(i18n.t('invoice.upo.contextAuthorizationId'), FormatTyp.GrayBoldTitle),
      formatText(id, FormatTyp.Default),
    ]);
  }
  if (hasValue(potwierdzenie.Uwierzytelnienie?.SkrotDokumentuUwierzytelniajacego)) {
    table.push([
      formatText(i18n.t('invoice.upo.authorizationDocumentShortcut'), FormatTyp.GrayBoldTitle),
      formatText(potwierdzenie.Uwierzytelnienie?.SkrotDokumentuUwierzytelniajacego?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(potwierdzenie.NazwaStrukturyLogicznej)) {
    table.push([
      formatText(
          i18n.t('invoice.upo.xsdFileLogicName'),
        FormatTyp.GrayBoldTitle
      ),
      formatText(potwierdzenie.NazwaStrukturyLogicznej?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(potwierdzenie.KodFormularza)) {
    table.push([
      formatText(i18n.t('invoice.upo.eDocumentFormCode'), FormatTyp.GrayBoldTitle),
      formatText(potwierdzenie.KodFormularza?._text, FormatTyp.Default),
    ]);
  }
  result.push([
    {
      unbreakable: true,
      table: {
        body: table,
        widths: ['auto', '*'],
      },
      layout: DEFAULT_TABLE_LAYOUT,
    } as Content,
  ]);
  result.push(verticalSpacing(8));
  const definedHeader: HeaderDefine[] = [
    { name: 'lp', title:  i18n.t('invoice.additionalInformation.ordinalNumber'), format: FormatTyp.Default },
    {
      name: 'NumerKSeFDokumentu',
      title: i18n.t('invoice.additionalInformation.ksefDocumentNumber'),
      format: FormatTyp.Default,
    },
    { name: 'NumerFaktury', title:  i18n.t('invoice.details.invoiceNumber'), format: FormatTyp.Default },
    { name: 'NipSprzedawcy', title: i18n.t('invoice.upo.vendorNIP'), format: FormatTyp.Default },
    {
      name: 'DataWystawieniaFaktury',
      title: i18n.t('invoice.details.invoiceDate'),
      format: FormatTyp.Date,
    },
    {
      name: 'DataPrzeslaniaDokumentu',
      title: i18n.t('invoice.details.invoiceDateSentToKsef'),
      format: FormatTyp.DateTime,
    },
    {
      name: 'DataNadaniaNumeruKSeF',
      title: i18n.t('invoice.details.assignKsefNumberDate'),
      format: FormatTyp.DateTime,
    },
    {
      name: 'SkrotDokumentu',
      title: i18n.t('invoice.upo.functionValueShortcut'),
      format: FormatTyp.Default,
      width: '*',
    },
  ];
  const documentData: Dokument[] =
    dokumenty.map((doc: Dokument, index: number): Dokument => {
      return { ...doc, lp: index + 1 };
    }) ?? [];

  const tabDocument: FormContentState = getContentTable<(typeof documentData)[0]>(
    definedHeader,
    documentData,
    'auto'
  );

  if (tabDocument.content) {
    result.push(tabDocument.content);
  }
  return result;
}
