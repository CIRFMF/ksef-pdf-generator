import { Content } from 'pdfmake/interfaces';
import i18n from 'i18next';

import { generateColumns, getTable, getText } from '@shared/PDF-functions';
import {
  borderedBox,
  createInlineLabelValue,
  createPefHeader,
  createPEFSectionTitle,
  createPEFSubHeader,
} from '@shared/functions-pef';
import { createAddress } from './shared/address';
import { PayeePartyPartyTaxScheme, PEFBasicInvoice } from '../../types/pef-invoice.types';
import { PEFCorrectiveInvoice } from '../../types/pef-invoice-corrective.types';

export function generateTaxRepresentativeParty(invoice: PEFBasicInvoice | PEFCorrectiveInvoice): Content[] {
  const result: Content[] = [];
  const address: Content[] = [];
  const data: Content[] = [];

  const PostalAddress = invoice.TaxRepresentativeParty?.PostalAddress;
  const PartyTaxScheme = getTable(invoice.TaxRepresentativeParty?.PartyTaxScheme)[0];
  const PartyName = getTable(invoice.TaxRepresentativeParty?.PartyName)[0];

  if (PostalAddress || PartyTaxScheme || PartyName) {
    if (PostalAddress) {
      address.push(createAddress(PostalAddress));
    }

    if (PartyTaxScheme) {
      data.push(creteData(PartyTaxScheme));
    }

    result.push(
      borderedBox([
        createPefHeader(i18n.t('pef.taxRepresentative.header')),
        createPEFSubHeader(getText(PartyName?.Name)),
        generateColumns([address, data, []]),
      ])
    );
  }

  return result;
}

function creteData(taxScheme?: PayeePartyPartyTaxScheme): Content[] {
  if (taxScheme && Object.keys(taxScheme).length) {
    const taxValue = [
      `${getText(taxScheme.CompanyID)} [${getText(taxScheme?.TaxScheme?.ID)}]`,
      i18n.t('pef.registration.identifier', { id: getText(taxScheme.TaxScheme?.ID) }),
    ];

    return [
      createPEFSectionTitle(i18n.t('pef.registration.title')),
      ...(taxValue ? [createInlineLabelValue(taxValue[0], taxValue[1], [0, 0, 0, 0])] : []),
    ];
  }

  return [];
}
