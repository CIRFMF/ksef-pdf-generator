import {Content, ContentTable,ContentText, TableCell } from 'pdfmake/interfaces';
import {
    createHeader,
    createLabelText,
    formatText,
    generateLine,
    generateTwoColumns,
    getContentTable,
    getTable,
    getValue,
    hasValue,
  makeBreakable,
} from '../../../shared/PDF-functions';
import { HeaderDefine } from '../../../shared/types/pdf-types';
import { Platnosc } from '../../types/fa3.types';
import { generujRachunekBankowy } from './RachunekBankowy';
import FormatTyp, {Position} from '../../../shared/enums/common.enum';
import { translateMap } from '@shared/generators/common/functions';
import { DEFAULT_TABLE_LAYOUT, FormaPlatnosci } from '@shared/consts/FA.const';
import i18n from "i18next";

export function generatePlatnosc(platnosc: Platnosc | undefined): Content {
    if (!platnosc) {
        return [];
    }
    const terminPlatnosci = getTable(platnosc.TerminPlatnosci);

    const zaplataCzesciowaHeader: HeaderDefine[] = [
        {
            name: 'Termin',
            title: i18n.t('invoice.payment.maturityDate'),
            format: FormatTyp.Date,
        },
    ];

    if (terminPlatnosci.some((termin) => termin.TerminOpis)) {
        zaplataCzesciowaHeader.push({
            name: 'TerminOpis',
            title: i18n.t('invoice.payment.paymentDescription'),
            format: FormatTyp.Date
        });
    }

  const table: Content[] = [generateLine(), ...createHeader(i18n.t('invoice.payment.payment'))];

    //  TODO: Add to FA2 and FA1? (KSEF20-15289)
    if (getValue(platnosc.Zaplacono) === '1') {
        table.push(createLabelText(i18n.t('invoice.payment.paymentInformation'), i18n.t('invoice.payment.paidStatus')));
        table.push(createLabelText(i18n.t('invoice.payment.paymentDate'), platnosc.DataZaplaty, FormatTyp.Date));
    } else if (
        getValue(platnosc.ZnacznikZaplatyCzesciowej) === '1' ||
        getValue(platnosc.ZnacznikZaplatyCzesciowej) === '2'
    ) {
        table.push(createLabelText(i18n.t('invoice.payment.paymentInformation'), i18n.t('invoice.payment.partialPayment')));
        table.push(
            createLabelText(
                i18n.t('invoice.payment.paymentInformationContinued'),
                getValue(platnosc.ZnacznikZaplatyCzesciowej) === '1'
                    ? i18n.t('invoice.payment.paidInPart')
                    : i18n.t('invoice.payment.paidAllInParts')
            )
        );
    } else {
        table.push(createLabelText(i18n.t('invoice.payment.paymentInformation'), i18n.t('invoice.payment.noPayment')));
    }

    if (hasValue(platnosc.FormaPlatnosci)) {
        table.push(createLabelText(i18n.t('invoice.payment.paymentMethod2'), translateMap(platnosc.FormaPlatnosci, FormaPlatnosci)));
    } else {
        if (platnosc.OpisPlatnosci?._text) {
            table.push(createLabelText(i18n.t('invoice.payment.paymentMethod2'), i18n.t('invoice.payment.paymentDifferent')));
            table.push(createLabelText(i18n.t('invoice.payment.otherPaymentDescription'), platnosc.OpisPlatnosci));
        }
    }

  const zaplataCzesciowa = getTable(platnosc.ZaplataCzesciowa);
  const tableZaplataCzesciowa = prepareContentTable();

  function prepareContentTable(): { content: ContentTable } {
    const definedHeader: Content[] = [
      formatText(makeBreakable(i18n.t('invoice.payment.partialPaymentDate'), 20), FormatTyp.GrayBoldTitle),
      formatText(makeBreakable(i18n.t('invoice.payment.partialPaymentAmount'), 20), FormatTyp.GrayBoldTitle),
      formatText(makeBreakable(i18n.t('invoice.payment.paymentMethod'), 20), FormatTyp.GrayBoldTitle),
    ];

    const defineTableBody: TableCell[] = zaplataCzesciowa.map((item) => {
      const value = [];

      value.push(
        formatText(getValue(item.DataZaplatyCzesciowej), FormatTyp.Date),
        formatText(getValue(item.KwotaZaplatyCzesciowej), FormatTyp.Currency)
      );

      if (item.PlatnoscInna) {
        value.push(formatText(makeBreakable(getValue(item.OpisPlatnosci) ?? '', 20), FormatTyp.Default));
      } else {
        value.push(formatText(getValue(item.FormaPlatnosci), FormatTyp.FormOfPayment));
      }

      return value;
    });

    return {
      content: {
        table: {
          headerRows: 1,
          keepWithHeaderRows: 1,
          widths: ['*', '*', '*'],
          body: [definedHeader, ...defineTableBody] as TableCell[][],
        },
        margin: [0, 0, 0, 8],
        layout: DEFAULT_TABLE_LAYOUT,
        alignment: Position.LEFT,
      },
    };
  }

  const terminPatnosciContent = terminPlatnosci.map((platnosc) => {
    if (!terminPlatnosci.some((termin) => termin.TerminOpis)) {
      return platnosc;
    } else {
      return {
        ...platnosc,
        TerminOpis: {
          _text: `${platnosc.TerminOpis?.Ilosc?._text ?? ''} ${platnosc.TerminOpis?.Jednostka?._text ?? ''} ${platnosc.TerminOpis?.ZdarzeniePoczatkowe?._text ?? ''}`,
        } as any,
      };
    }
  });

    const tableTerminPlatnosci = getContentTable<(typeof terminPlatnosci)[0]>(
        zaplataCzesciowaHeader,
        terminPatnosciContent,
        '*',
        undefined,
        20
    );

    if (zaplataCzesciowa.length > 0 && terminPlatnosci.length > 0) {
        table.push(
            generateTwoColumns(
                tableZaplataCzesciowa.content ?? [],
                tableTerminPlatnosci.content ?? [],
                [0, 4, 0, 0]
            )
        );
    } else if (terminPlatnosci.length > 0) {
        if (tableTerminPlatnosci.content) {
            table.push(generateTwoColumns(tableTerminPlatnosci.content, []));
        }
    } else if (zaplataCzesciowa.length > 0 && tableZaplataCzesciowa.content) {
        table.push(tableZaplataCzesciowa.content);
    }

    if (platnosc.LinkDoPlatnosci) {
        table.push(formatText(i18n.t('invoice.payment.moneylessLink'), FormatTyp.Label));
        table.push({
            text: formatText(platnosc.LinkDoPlatnosci._text, FormatTyp.Link),
            link: formatText(platnosc.LinkDoPlatnosci._text, FormatTyp.Link),
        } as ContentText);
    }
    if (platnosc.IPKSeF?._text) {
        table.push(createLabelText(i18n.t('invoice.payment.ksefTransferId'), platnosc.IPKSeF));
    }

    const rachunekBankowy: Content[][] = getTable(platnosc.RachunekBankowy).map((rachunek) =>
        generujRachunekBankowy([rachunek], i18n.t('invoice.payment.bankAccountNumber'))
    );
    const rachunekBankowyFaktora: Content[][] = getTable(platnosc.RachunekBankowyFaktora).map((rachunek) =>
        generujRachunekBankowy([rachunek], i18n.t('invoice.payment.factorsBankAccountNumber'))
    );
    const rachunkiBankowe: Content[][] = [...rachunekBankowy, ...rachunekBankowyFaktora];

    if (rachunkiBankowe.length > 0) {
        rachunkiBankowe.forEach((rachunek, index) => {
            if (index % 2 === 0) {
                table.push(generateTwoColumns(rachunek, rachunkiBankowe[index + 1] ?? []));
            }
        });
    }

    if (platnosc.Skonto) {
        table.push(createHeader(i18n.t('invoice.payment.conditionalDiscount'), [0, 0]));
        table.push(createLabelText(i18n.t('invoice.payment.discountConditions'), platnosc.Skonto.WarunkiSkonta));
        table.push(createLabelText(i18n.t('invoice.payment.discountAmount'), platnosc.Skonto.WysokoscSkonta));
    }
    return table;
}
