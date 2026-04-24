import { Content, ContentTable } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  formatText,
  generateColumns,
  hasValue,
  verticalSpacing,
} from '../../../shared/PDF-functions';
import { Adnotacje } from '../../types/fa1.types';
import FormatTyp from '../../../shared/enums/common.enum';
import { DEFAULT_TABLE_LAYOUT } from '../../../shared/consts/FA.const';
import i18n from 'i18next';

export function generateAdnotacje(adnotacje?: Adnotacje): Content[] {
  const result: Content[] = [];
  let firstColumn: Content[] = [];
  const secondColumn: Content[] = [];

  if (adnotacje) {
    if (adnotacje?.P_19?._text === '1') {
      addToColumn(
        firstColumn,
        secondColumn,
        {
          text: i18n.t('invoice.annotations.noTaxDelivery'),
        },
        true
      );
      if (adnotacje.P_19A?._text) {
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
          createLabelText(i18n.t('invoice.annotations.law'), adnotacje.P_19A._text),
          true
        );
      }
      if (adnotacje.P_19B?._text) {
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
          createLabelText(i18n.t('invoice.annotations.directiveLaw'), adnotacje.P_19B._text),
          true
        );
      }
      if (adnotacje.P_19C?._text) {
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
          createLabelText(i18n.t('invoice.annotations.otherLaw'), adnotacje.P_19C._text),
          true
        );
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

    if (adnotacje.P_PMarzy?._text === '1') {
      let valueMarzy = '';

      if (adnotacje.P_PMarzy_3_1?._text === '1') {
        valueMarzy = i18n.t('invoice.annotations.usedGoods');
      } else if (adnotacje.P_PMarzy_3_2?._text === '1') {
        valueMarzy = i18n.t('invoice.annotations.artPieces');
      } else if (adnotacje.P_PMarzy_2?._text === '1') {
        valueMarzy = i18n.t('invoice.annotations.travelAgencies');
      } else if (adnotacje.P_PMarzy_3_3?._text === '1') {
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

    if (adnotacje.P_22?._text === '1') {
      let obowiazekVAT: Content[] = [];
      obowiazekVAT = [...createLabelText(i18n.t('invoice.annotations.newTransportsDelivery'), ' ')];
      if (obowiazekVAT) {
        firstColumn = [firstColumn, ...obowiazekVAT];
      }
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

    if (adnotacje.P_22?._text === '1') {
      result.push(generateDostawy(adnotacje));
    }
  }
  return result;
}

export function generateDostawy(adnotacje: Adnotacje): Content[] {
  const result: Content[] = [];
  const table: Content[][] = [];
  const anyP22B =
    hasValue(adnotacje.P_22B) ||
    hasValue(adnotacje.P_22BT) ||
    hasValue(adnotacje.P_22B1) ||
    hasValue(adnotacje.P_22B2) ||
    hasValue(adnotacje.P_22B3) ||
    hasValue(adnotacje.P_22B4);
  const anyP22C: boolean = hasValue(adnotacje.P_22C) || hasValue(adnotacje.P_22C1);
  const anyP22D: boolean = hasValue(adnotacje.P_22D) || hasValue(adnotacje.P_22D1);

  if (hasValue(adnotacje.P_22A)) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportApprovalDate'), FormatTyp.GrayBoldTitle),
      formatText(adnotacje.P_22A?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(adnotacje.P_22BMK)) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportBrand'), FormatTyp.GrayBoldTitle),
      formatText(adnotacje.P_22BMK?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(adnotacje.P_22BMD)) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportModel'), FormatTyp.GrayBoldTitle),
      formatText(adnotacje.P_22BMD?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(adnotacje.P_22BK)) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportColor'), FormatTyp.GrayBoldTitle),
      formatText(adnotacje.P_22BK?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(adnotacje.P_22BNR)) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportRegistrationNumber'), FormatTyp.GrayBoldTitle),
      formatText(adnotacje.P_22BNR?._text, FormatTyp.Default),
    ]);
  }
  if (hasValue(adnotacje.P_22BRP)) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportProductionYear'), FormatTyp.GrayBoldTitle),
      formatText(adnotacje.P_22BRP?._text, FormatTyp.Default),
    ]);
  }
  if (anyP22B) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportType'), FormatTyp.GrayBoldTitle),
      formatText(i18n.t('invoice.annotations.landDelivery'), FormatTyp.Default),
    ]);
    if (hasValue(adnotacje.P_22B)) {
      table.push([
        formatText(i18n.t('invoice.annotations.transportMileage'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22B?._text, FormatTyp.Default),
      ]);
    }
    if (hasValue(adnotacje.P_22B1)) {
      table.push([
        formatText(i18n.t('invoice.annotations.vin'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22B1?._text, FormatTyp.Default),
      ]);
    }
    if (hasValue(adnotacje.P_22B2)) {
      table.push([
        formatText(i18n.t('invoice.annotations.bodyNumber'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22B2?._text, FormatTyp.Default),
      ]);
    }
    if (hasValue(adnotacje.P_22B3)) {
      table.push([
        formatText(i18n.t('invoice.annotations.chassisNumber'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22B3?._text, FormatTyp.Default),
      ]);
    }
    if (hasValue(adnotacje.P_22B4)) {
      table.push([
        formatText(i18n.t('invoice.annotations.frameNumber'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22B4?._text, FormatTyp.Default),
      ]);
    }
    if (hasValue(adnotacje.P_22BT)) {
      table.push([
        formatText(i18n.t('invoice.annotations.newTransportType'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22BT?._text, FormatTyp.Default),
      ]);
    }
  } else if (anyP22C) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportType'), FormatTyp.GrayBoldTitle),
      formatText(i18n.t('invoice.annotations.boatDelivery'), FormatTyp.Default),
    ]);
    if (hasValue(adnotacje.P_22C)) {
      table.push([
        formatText(i18n.t('invoice.annotations.transportMileage'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22C?._text, FormatTyp.Default),
      ]);
    }
    if (hasValue(adnotacje.P_22C1)) {
      table.push([
        formatText(i18n.t('invoice.annotations.hullNumber'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22C1?._text, FormatTyp.Default),
      ]);
    }
  } else if (anyP22D) {
    table.push([
      formatText(i18n.t('invoice.annotations.transportType'), FormatTyp.GrayBoldTitle),
      formatText(i18n.t('invoice.annotations.airDelivery'), FormatTyp.Default),
    ]);
    if (hasValue(adnotacje.P_22D)) {
      table.push([
        formatText(i18n.t('invoice.annotations.transportMileage'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22D?._text, FormatTyp.Default),
      ]);
    }
    if (hasValue(adnotacje.P_22D1)) {
      table.push([
        formatText(i18n.t('invoice.annotations.factoryNumber'), FormatTyp.GrayBoldTitle),
        formatText(adnotacje.P_22D1?._text, FormatTyp.Default),
      ]);
    }
  }

  if (table.length) {
    result.push([
      {
        unbreakable: true,
        table: {
          body: table,
          widths: ['*', '*'],
        },
        layout: DEFAULT_TABLE_LAYOUT,
      } as ContentTable,
    ]);
  }
  return result;
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
