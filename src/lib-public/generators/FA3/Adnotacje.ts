import { Content, ContentTable, TableCell } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateColumns,
  getTable,
  getValue,
  hasValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import FormatTyp from '../../../shared/enums/common.enum';
import { Adnotacje, NoweSrodkiTransportu } from '../../types/fa3.types';
import i18n from 'i18next';

export function generateAdnotacje(adnotacje?: Adnotacje): Content[] {
  const result: Content[] = [];
  const firstColumn: Content[] = [];
  const secondColumn: Content[] = [];

  if (adnotacje) {
    const zwolnienie = adnotacje.Zwolnienie;

    if (zwolnienie?.P_19?._text === '1') {
      addToColumn(
        firstColumn,
        secondColumn,
        {
          text: i18n.t('invoice.annotations.noTaxDelivery'),
        },
        true
      );
      if (zwolnienie.P_19A?._text) {
        addToColumn(
          firstColumn,
          secondColumn,
          createLabelText(
            i18n.t('invoice.annotations.noTaxBase'),
            i18n.t('invoice.annotations.noTaxBaseDocument')
          ),
          true
        );
        addToColumn(
          firstColumn,
          secondColumn,
          createLabelText(i18n.t('invoice.annotations.law'), zwolnienie.P_19A._text),
          true
        );
      }
      if (zwolnienie.P_19B?._text) {
        addToColumn(
          firstColumn,
          secondColumn,
          createLabelText(
            i18n.t('invoice.annotations.noTaxBase'),
            i18n.t('invoice.annotations.noTaxBaseDocument2')
          ),
          true
        );
        addToColumn(
          firstColumn,
          secondColumn,
          createLabelText(i18n.t('invoice.annotations.directiveLaw'), zwolnienie.P_19B._text),
          true
        );
      }
      if (zwolnienie.P_19C?._text) {
        addToColumn(
          firstColumn,
          secondColumn,
          createLabelText(
            i18n.t('invoice.annotations.noTaxBase'),
            i18n.t('invoice.annotations.noTaxBaseDocument3')
          ),
          true
        );
        addToColumn(
          firstColumn,
          secondColumn,
          createLabelText(i18n.t('invoice.annotations.otherLaw'), zwolnienie.P_19C._text),
          true
        );
      }
    }

    if (
      adnotacje.NoweSrodkiTransportu?.P_42_5?._text === '1' ||
      adnotacje.NoweSrodkiTransportu?.P_42_5?._text === '2'
    ) {
      let obowiazekVAT: Content[] = [];
      let value = ' ';

      if (adnotacje.NoweSrodkiTransportu.P_42_5?._text === '1') {
        value = i18n.t('invoice.annotations.vat22DocumentRequired');
      } else if (adnotacje.NoweSrodkiTransportu.P_42_5?._text === '2') {
        value = i18n.t('invoice.annotations.vat22DocumentNotRequired');
      }
      obowiazekVAT = [
        ...createLabelText(`${i18n.t('invoice.annotations.newTransportsDelivery')}: `, value ?? ''),
      ];
      if (obowiazekVAT) {
        addToColumn(firstColumn, secondColumn, obowiazekVAT, true);
      }
    }

    if (adnotacje.P_18A?._text === '1') {
      addToColumn(firstColumn, secondColumn, { text: i18n.t('invoice.annotations.partialPayMechanism') });
    }
    if (adnotacje.P_16?._text === '1') {
      addToColumn(firstColumn, secondColumn, { text: i18n.t('invoice.annotations.cashMethod') });
    }
    if (adnotacje.P_18?._text === '1') {
      addToColumn(firstColumn, secondColumn, { text: i18n.t('invoice.annotations.reverseTax') });
    }
    if (adnotacje.P_23?._text === '1') {
      addToColumn(firstColumn, secondColumn, { text: i18n.t('invoice.annotations.threePartsSimplerMethod') });
    }
    if (adnotacje.PMarzy?.P_PMarzy?._text === '1') {
      let valueMarzy = '';

      if (adnotacje.PMarzy.P_PMarzy_3_1?._text === '1') {
        valueMarzy = i18n.t('invoice.annotations.usedGoods');
      } else if (adnotacje.PMarzy.P_PMarzy_3_2?._text === '1') {
        valueMarzy = i18n.t('invoice.annotations.artPieces');
      } else if (adnotacje.PMarzy.P_PMarzy_2?._text === '1') {
        valueMarzy = i18n.t('invoice.annotations.travelAgencies');
      } else if (adnotacje.PMarzy.P_PMarzy_3_3?._text === '1') {
        valueMarzy = i18n.t('invoice.annotations.antiques');
      }
      addToColumn(
        firstColumn,
        secondColumn,
        createLabelText(i18n.t('invoice.annotations.marginProcedure'), valueMarzy)
      );
    }
    if (adnotacje.P_17?._text === '1') {
      addToColumn(firstColumn, secondColumn, { text: i18n.t('invoice.annotations.selfInvoice') });
    }
    if (firstColumn.length || secondColumn.length) {
      result.push(generateColumns([firstColumn, secondColumn]));
    }

    if (result.length) {
      result.unshift(verticalSpacing(1));
      result.unshift(createHeader(i18n.t('invoice.annotations.header')));
      result.unshift(verticalSpacing(1));
      result.push(verticalSpacing(1));
    }

    if (
      adnotacje.NoweSrodkiTransportu?.P_42_5?._text === '1' ||
      adnotacje.NoweSrodkiTransportu?.P_42_5?._text === '2'
    ) {
      result.push(generateDostawy(adnotacje.NoweSrodkiTransportu));
    }
  }
  return result;
}

export function generateDostawy(noweSrodkiTransportu: NoweSrodkiTransportu): Content[] {
  const nowySrodekTransportu = getTable(noweSrodkiTransportu.NowySrodekTransportu);
  let tableBody: TableCell[] = [];
  const table: ContentTable = {
    table: {
      headerRows: 1,
      widths: [100, '*'],
      body: [] as TableCell[][],
    },
    layout: {
      hLineWidth: () => 1,
      hLineColor: () => '#BABABA',
      vLineWidth: () => 1,
      vLineColor: () => '#BABABA',
    },
    marginTop: 4,
  };

  if (nowySrodekTransportu?.length) {
    const definedHeader: Content[] = [
      { text: i18n.t('invoice.annotations.usePermissionDate'), style: FormatTyp.GrayBoldTitle },
      { text: i18n.t('invoice.annotations.description'), style: FormatTyp.GrayBoldTitle },
    ];

    tableBody = nowySrodekTransportu.map((item) => {
      const value: string[] = [];
      const anyP22B =
        hasValue(item.P_22B) ||
        hasValue(item.P_22BT) ||
        hasValue(item.P_22B1) ||
        hasValue(item.P_22B2) ||
        hasValue(item.P_22B3) ||
        hasValue(item.P_22B4);
      const anyP22C = hasValue(item.P_22C) || hasValue(item.P_22C1);
      const anyP22D = hasValue(item.P_22D) || hasValue(item.P_22D1);
      const anyP22N =
        hasValue(item.P_22B1) || hasValue(item.P_22B2) || hasValue(item.P_22B3) || hasValue(item.P_22B4);

      if (item.P_NrWierszaNST?._text) {
        value.push(item.P_NrWierszaNST._text);
      }
      if (anyP22B) {
        value.push(i18n.t('invoice.annotations.landDelivery'));
      } else if (anyP22C) {
        value.push(i18n.t('invoice.annotations.boatDelivery'));
      } else if (anyP22D) {
        value.push(i18n.t('invoice.annotations.airDelivery'));
      }

      const transportProperties = [
        getValue(item.P_22BMK),
        getValue(item.P_22BMD),
        getValue(item.P_22BK),
        getValue(item.P_22BNR),
        getValue(item.P_22BRP),
      ].filter((prop) => !!prop);

      if (transportProperties.length) {
        value.push(transportProperties.join(', '));
      }

      if (item.DetailsString?._text) {
        value.push(item.DetailsString._text);
      }
      if (anyP22B || anyP22C || anyP22D) {
        value.push(item.P_22B?._text ?? item.P_22C?._text ?? item.P_22D?._text ?? '');
      }
      if (item.P_22C1?._text) {
        value.push(`${i18n.t('invoice.annotations.hullNumber')}: ${item.P_22C1._text}`);
      }
      if (item.P_22D1?._text) {
        value.push(`${i18n.t('invoice.annotations.factoryNumber')}: ${item.P_22D1._text}`);
      }
      if (anyP22N) {
        if (item.P_22B1?._text) {
          value.push(`${i18n.t('invoice.annotations.vin')}: ${item.P_22B1._text}`);
        }
        if (item.P_22B2?._text) {
          value.push(`${i18n.t('invoice.annotations.bodyNumber')}: ${item.P_22B2._text}`);
        }
        if (item.P_22B3?._text) {
          value.push(`${i18n.t('invoice.annotations.chassisNumber')}: ${item.P_22B3._text}`);
        }
        if (item.P_22B4?._text) {
          value.push(`${i18n.t('invoice.annotations.frameNumber')}: ${item.P_22B4._text}`);
        }
      }
      if (item.P_22BT?._text) {
        value.push(item.P_22BT._text);
      }
      return [formatText(item.P_22A?._text), { text: value.join('\n') }];
    });
    table.table.body = [[...definedHeader], ...tableBody] as TableCell[][];
  }

  return tableBody.length ? [table, verticalSpacing(1)] : [];
}

function addToColumn(
  firstColumn: Content[],
  secondColumn: Content[],
  content: Content,
  isFirstColumn?: boolean
): void {
  if (firstColumn.length > secondColumn.length && isFirstColumn) {
    secondColumn.push(content);
    return;
  }
  firstColumn.push(content);
}
