import { Content } from 'pdfmake/interfaces';
import i18n from 'i18next';

import { createContact } from './shared/contact';
import { generateColumns, getValue } from '@shared/PDF-functions';
import { borderedBox, createPefHeader, createPEFSubHeader } from '@shared/functions-pef';
import { createAddress } from './shared/address';
import { ReceiverParty } from '../../types/pef-invoice-corrective.types';

export function generateReceiverParty(receiverParty: ReceiverParty | undefined): Content[] {
  const result: Content[] = [];

  if (receiverParty && Object.keys(receiverParty).length) {
    const address: Content[] = [];
    const contact: Content[] = [];
    const { PostalAddress, PartyName, Contact } = receiverParty.Party;
    const subHeader = getValue(PartyName?.Name)?.toString();

    if (Contact) {
      contact.push(createContact({ ...Contact }));
    }
    if (PostalAddress) {
      address.push(createAddress(PostalAddress));
    }

    result.push(
      borderedBox([
        createPefHeader(i18n.t('pef.receiverParty.header')),
        ...(subHeader ? [createPEFSubHeader(subHeader)] : []),
        generateColumns([address, contact]),
      ])
    );
  }

  return result;
}
