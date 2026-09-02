import { createInlineLabelValue, createPEFSectionTitle } from '@shared/functions-pef';
import { Content } from 'pdfmake';
import i18n from 'i18next';
import { Contact } from '../../../types/pef-invoice.types';
import { getText, hasValue } from '@shared/PDF-functions';
import { CustomizationID } from 'src/lib-public/types/pef-invoice-corrective.types';

export function createContact(contact?: Contact, EndpointID?: CustomizationID): Content[] {
  if (!contact) {
    return [];
  }
  if (Object.keys(contact).length) {
    const result: Content[] = [createPEFSectionTitle(i18n.t('pef.contact.title'))];

    if (hasValue(contact.Name)) {
      result.push(
        createInlineLabelValue(getText(contact.Name), i18n.t('pef.contact.nameAndSurname'), [0, 0, 0, 0])
      );
    }

    if (hasValue(contact.Telephone)) {
      result.push(
        createInlineLabelValue(getText(contact.Telephone), i18n.t('pef.contact.phoneNumber'), [0, 0, 0, 0])
      );
    }

    if (hasValue(contact.ElectronicMail)) {
      result.push(
        createInlineLabelValue(getText(contact.ElectronicMail), i18n.t('pef.contact.mail'), [0, 0, 0, 0])
      );
    }

    if (hasValue(EndpointID)) {
      result.push(
        createInlineLabelValue(
          EndpointID?._attributes?.schemeID
            ? `${getText(EndpointID!)} [${EndpointID._attributes.schemeID}]`
            : getText(EndpointID!),
          i18n.t('pef.contact.pefId'),
          [0, 0, 0, 0]
        )
      );
    }
    return result;
  }

  return [];
}
