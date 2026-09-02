import {
  createInlineLabelValue,
  createPefTableHeader,
  displayValueOrDash,
} from '../../../shared/functions-pef';
import { Content, TableCell } from 'pdfmake/interfaces';
import i18n from 'i18next';
import { PEFBasicInvoice, PEFInvoicePaymentMean } from '../../types/pef-invoice.types';
import { getTable, getText, hasValue } from '../../../shared/PDF-functions';
import { PEFCorrectiveInvoice } from 'src/lib-public/types/pef-invoice-corrective.types';
import { PEFSpecInvoice } from 'src/lib-public/types/pef-invoice-spec.types';

export function generatePayment(invoice: PEFBasicInvoice | PEFCorrectiveInvoice | PEFSpecInvoice): Content[] {
  const result: Content[] = [];

  if (invoice) {
    const PaymentTermsNote = getTable(getTable(invoice.PaymentTerms)[0]?.Note)[0];

    if (hasValue(PaymentTermsNote)) {
      const description: Content = createInlineLabelValue(
        getText(PaymentTermsNote),
        i18n.t('pef.payment.paymentTerms'),
        [0, 0, 0, 6]
      );

      result.push(createPefTableHeader(i18n.t('pef.payment.title'), description));
    } else {
      result.push(createPefTableHeader(i18n.t('pef.payment.title')));
    }

    const paymentMeans: Content[] = getTable(invoice.PaymentMeans).map((paymentMean) => {
      return addPaymentMeansTable(paymentMean);
    });

    result.push({
      stack: paymentMeans,
      margin: [0, 0, 0, 12],
    });
  }

  return result;
}

export function addPaymentMeansTable(paymentMeans: PEFInvoicePaymentMean): Content[] {
  const paymentMeansTable: Content[] = [];
  const { PayeeFinancialAccount, CardAccount, PaymentMandate } = paymentMeans;
  const paymentMeansCodeName = paymentMeans?.PaymentMeansCode?._attributes?.name;
  const paymentMeansCodeDescription = paymentMeansCodeName ? `(${paymentMeansCodeName})` : '';
  if (
    hasValue(PayeeFinancialAccount?.FinancialInstitutionBranch?.ID) ||
    hasValue(PayeeFinancialAccount?.ID) ||
    hasValue(PayeeFinancialAccount?.Name)
  ) {
    paymentMeansTable.push(
      createPaymentTable([
        [
          { text: i18n.t('pef.payment.paymentTypeCode'), bold: true },
          { text: i18n.t('pef.payment.paymentServiceProviderId'), bold: true },
          { text: i18n.t('pef.payment.paymentRecipientAccountNumber'), bold: true },
          { text: i18n.t('pef.payment.paymentRecipientAccountName'), bold: true },
          { text: i18n.t('pef.payment.paymentIdentification'), bold: true },
        ],
        [
          displayValueOrDash(`${getText(paymentMeans.PaymentMeansCode)} ${paymentMeansCodeDescription}`),
          displayValueOrDash(getText(paymentMeans.PayeeFinancialAccount?.FinancialInstitutionBranch?.ID)),
          displayValueOrDash(getText(paymentMeans.PayeeFinancialAccount?.ID)),
          displayValueOrDash(getText(paymentMeans.PayeeFinancialAccount?.Name)),
          displayValueOrDash(getText(getTable(paymentMeans.PaymentID)[0])),
        ],
      ])
    );
  }

  if (
    hasValue(CardAccount?.HolderName) ||
    hasValue(CardAccount?.NetworkID) ||
    hasValue(CardAccount?.PrimaryAccountNumberID)
  ) {
    paymentMeansTable.push(
      createPaymentTable([
        [
          { text: i18n.t('pef.payment.paymentTypeCode'), bold: true },
          { text: i18n.t('pef.payment.cardNetworkId'), bold: true },
          { text: i18n.t('pef.payment.paymentCardAccountNumber'), bold: true },
          { text: i18n.t('pef.payment.paymentCardHolderName'), bold: true },
          { text: i18n.t('pef.payment.paymentIdentification'), bold: true },
        ],
        [
          displayValueOrDash(`${getText(paymentMeans.PaymentMeansCode)} ${paymentMeansCodeDescription}`),
          displayValueOrDash(getText(paymentMeans.CardAccount?.HolderName)),
          displayValueOrDash(getText(paymentMeans.CardAccount?.NetworkID)),
          displayValueOrDash(getText(paymentMeans.CardAccount?.PrimaryAccountNumberID)),
          displayValueOrDash(getText(getTable(paymentMeans.PaymentID)[0])),
        ],
      ])
    );
  }

  if (hasValue(PaymentMandate?.PayerFinancialAccount?.ID) || hasValue(PaymentMandate?.ID)) {
    paymentMeansTable.push(
      createPaymentTable([
        [
          { text: i18n.t('pef.payment.paymentTypeCode'), bold: true },
          { text: i18n.t('pef.payment.debitedAccountId'), bold: true },
          { text: i18n.t('pef.payment.directDebitId'), colSpan: 2, bold: true },
          {},
          { text: i18n.t('pef.payment.paymentIdentification'), bold: true },
        ],
        [
          displayValueOrDash(`${getText(paymentMeans.PaymentMeansCode)} ${paymentMeansCodeDescription}`),
          displayValueOrDash(getText(paymentMeans.PaymentMandate?.PayerFinancialAccount?.ID)),
          { text: displayValueOrDash(getText(paymentMeans.PaymentMandate?.ID)), colSpan: 2 },
          {},
          displayValueOrDash(getText(getTable(paymentMeans.PaymentID)[0])),
        ],
      ])
    );
  }
  return paymentMeansTable;
}

function createPaymentTable(table: TableCell[][]): Content {
  return {
    table: {
      body: table,
      widths: ['20%', '20%', '20%', '20%', '20%'],
      dontBreakRows: true,
    },
    layout: {
      hLineWidth: (i) => {
        if (i === 0) return null;
        if (i === 1) {
          return 1;
        } else {
          return 0.75;
        }
      },
      fillColor: (i) => {
        if (i === 0) {
          return '#F2F2F2';
        }
        return null;
      },
      vLineWidth: () => 0,
      hLineColor: (i) => {
        if (i === 1) {
          return '#242424';
        } else {
          return '#E3E3E3';
        }
      },
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 6,
      paddingBottom: () => 6,
    },
  };
}
