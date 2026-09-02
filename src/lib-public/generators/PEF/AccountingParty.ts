import { Content } from 'pdfmake/interfaces';
import i18n from 'i18next';

import { generateColumns, getTable, getText, hasValue } from '@shared/PDF-functions';
import {
  borderedBox,
  createInlineLabelValue,
  createPefHeader,
  createPEFSectionTitle,
  createPEFSubHeader,
} from '@shared/functions-pef';
import { AccountingType } from 'src/lib-public/types/pef.types';
import { createContact } from './shared/contact';
import { createAddress } from './shared/address';
import { Party, PartyPartyLegalEntity, PartyPartyTaxScheme } from '../../types/pef-invoice.types';

export function generateAccountingParty(party: Party | undefined, type: AccountingType): Content[] {
  const result: Content[] = [];

  if (party && Object.keys(party).length) {
    const address: Content[] = [];
    const data: Content[] = [];
    const contact: Content[] = [];
    const { PostalAddress, Contact, EndpointID } = party;
    const PartyTaxScheme = getTable(party?.PartyTaxScheme)[0];
    const PartyLegalEntity = getTable(party?.PartyLegalEntity)[0];

    if (PostalAddress) {
      address.push(createAddress(PostalAddress));
    }

    if (PartyLegalEntity || PartyTaxScheme) {
      const register = createRegister(PartyLegalEntity, PartyTaxScheme);

      data.push([createPEFSectionTitle(i18n.t('pef.registration.title')), ...register]);
    }

    if (Contact || EndpointID) {
      contact.push(createContact(Contact, EndpointID));
    }
    const PartyName = getTable(party.PartyName)[0];

    result.push(
      borderedBox([
        createPefHeader(i18n.t(`pef.${type.toLowerCase()}.header`)),
        createPEFSubHeader(getText(PartyName?.Name)),
        generateColumns([address, data, contact]),
      ])
    );
  }

  return result;
}

function createRegister(legalEntity?: PartyPartyLegalEntity, taxScheme?: PartyPartyTaxScheme): Content[] {
  if (!legalEntity && !taxScheme) {
    return [];
  }

  const taxValue = prepareTaxValue(taxScheme);

  const registerField = [
    [legalEntity?.CompanyID?._text ?? '', i18n.t('pef.registration.id')],
    [getText(legalEntity?.RegistrationName)],
    [...taxValue],
  ];

  return registerField
    .filter(([key]) => key)
    .map(([key, value], index, array) => {
      return createInlineLabelValue(key, value, index === array.length - 1 ? [0, 0, 0, 0] : undefined);
    });
}

function prepareTaxValue(taxScheme?: PartyPartyTaxScheme): string[] {
  if (!hasValue(taxScheme?.CompanyID) && !hasValue(taxScheme?.TaxScheme?.ID)) {
    return [];
  }

  return [
    `${getText(taxScheme?.CompanyID)} [${getText(taxScheme?.TaxScheme?.ID)}]`,
    i18n.t('pef.registration.identifier', { id: getText(taxScheme?.TaxScheme?.ID) }),
  ];
}
