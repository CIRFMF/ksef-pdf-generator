import { Content } from 'pdfmake/interfaces';
import { TRodzajFaktury, TypKorekty } from '../../../shared/consts/FA.const';
import { FARRTypKorekty } from '../../../shared/consts/FARR.const';
import {
  createHeader,
  createLabelText,
  createSection,
  generateTwoColumns,
  getTable,
  getValue,
} from '../../../shared/PDF-functions';
import { DaneFaKorygowanej, Fa as Fa1 } from '../../types/fa1.types';
import { Fa as Fa2 } from '../../types/fa2.types';
import { Fa as Fa3 } from '../../types/fa3.types';
import { FakturaRR as FaRR } from '../../types/FaRR.types';
import i18n from 'i18next';

export function generateDaneFaKorygowanej(invoice?: Fa1 | Fa2 | Fa3 | FaRR): Content[] {
  const result: Content[] = [];
  let firstColumn: Content[] = [];
  let secondColumn: Content[] = [];
  let previousSection = false;

  if (invoice) {
    const daneFakturyKorygowanej: DaneFaKorygowanej[] = getTable(invoice.DaneFaKorygowanej ?? []);

    if (invoice.NrFaKorygowany) {
      firstColumn.push(
        createLabelText(i18n.t('invoice.correctedInvoice.correctInvoiceNumber'), invoice.NrFaKorygowany)
      );
    }

    if (invoice.PrzyczynaKorekty) {
      firstColumn.push(
        createLabelText(i18n.t('invoice.correctedInvoice.correctionReason'), invoice.PrzyczynaKorekty)
      );
    }

    if (invoice.TypKorekty?._text) {
      const isFaRR = [TRodzajFaktury.VAT_RR, TRodzajFaktury.KOR_VAT_RR].includes(
        getValue(invoice?.RodzajFaktury) as string
      );
      const typKorekty = getValue(invoice.TypKorekty) as string;
      firstColumn.push(
        createLabelText(i18n.t('invoice.correctedInvoice.correctionEffectType'), i18n.t(isFaRR ? FARRTypKorekty[typKorekty] : TypKorekty[typKorekty]))
      );
    }

    if (firstColumn.length) {
      firstColumn.unshift(createHeader(i18n.t('invoice.correctedInvoice.sectionHeader')));
    }

    if (daneFakturyKorygowanej?.length === 1) {
      secondColumn.push(createHeader(i18n.t('invoice.correctedInvoice.identificationHeader')));
      generateCorrectiveData(daneFakturyKorygowanej[0], secondColumn);
      if (firstColumn.length > 0 || secondColumn.length) {
        if (firstColumn.length) {
          result.push(generateTwoColumns(firstColumn, secondColumn));
        } else {
          result.push(generateTwoColumns(secondColumn, []));
        }
        previousSection = true;
      }
      firstColumn = [];
      secondColumn = [];
    } else {
      if (firstColumn.length > 1) {
        result.push(generateTwoColumns(firstColumn, []));
        previousSection = true;
      }
      firstColumn = [];
      daneFakturyKorygowanej?.forEach((item: DaneFaKorygowanej, index: number): void => {
        if (index % 2 === 0) {
          firstColumn.push(
            createHeader(i18n.t('invoice.correctedInvoice.identificationHeaderIndexed', { index: index + 1 }))
          );
          generateCorrectiveData(item, firstColumn);
        } else {
          secondColumn.push(
            createHeader(i18n.t('invoice.correctedInvoice.identificationHeaderIndexed', { index: index + 1 }))
          );
          generateCorrectiveData(item, secondColumn);
        }
      });
    }
  }

  if (firstColumn.length && secondColumn.length) {
    result.push(
      createSection([generateTwoColumns(firstColumn, secondColumn, undefined, false)], previousSection)
    );
  }
  return createSection(result, true);
}

function generateCorrectiveData(data: DaneFaKorygowanej, column: Content[]): void {
  if (data.DataWystFaKorygowanej) {
    column.push(createLabelText(i18n.t('invoice.correctedInvoice.issueDate'), data.DataWystFaKorygowanej));
  }
  if (data.NrFaKorygowanej) {
    column.push(createLabelText(i18n.t('invoice.correctedInvoice.invoiceNumber'), data.NrFaKorygowanej));
  }
  if (data.NrKSeFFaKorygowanej) {
    column.push(createLabelText(i18n.t('invoice.correctedInvoice.ksefNumber'), data.NrKSeFFaKorygowanej));
  }
}
