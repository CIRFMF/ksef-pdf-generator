import { Content } from 'pdfmake';
import i18n from 'i18next';
import { createInlineLabelValue, createPEFSectionTitle } from '@shared/functions-pef';
import { getTable, getText } from '@shared/PDF-functions';
import { PartyPostalAddress } from '../../../types/pef-invoice.types';

export function createAddress(postalAddress?: PartyPostalAddress): Content[] {
  if (!postalAddress) {
    return [];
  }

  const addressData = [
    prepareStreetInfo(
      getText(postalAddress.StreetName),
      getText(postalAddress.AdditionalStreetName),
      getText(getTable(postalAddress?.AddressLine)?.[0]?.Line)
    ),
    getText(postalAddress.CountrySubentity),
    prepareZone(getText(postalAddress.PostalZone), getText(postalAddress.CityName)),
    prepareCountry(getText(postalAddress.Country?.IdentificationCode)),
  ].filter((data): data is string => Boolean(data));

  return [
    createPEFSectionTitle(i18n.t('pef.postal.address')),
    ...addressData.map((data, index) =>
      createInlineLabelValue(data, undefined, index === addressData.length - 1 ? [0, 0, 0, 0] : undefined)
    ),
  ];
}

function prepareStreetInfo(
  name?: string,
  additionalName?: string,
  additionalInfo?: string
): string | undefined {
  const street = [name, additionalName].filter(Boolean).join(' ');

  return [street, additionalInfo].filter(Boolean).join(', ') || undefined;
}

function prepareZone(zone?: string, city?: string): string | undefined {
  return [zone, city].filter(Boolean).join(' ') || undefined;
}

function prepareCountry(code: string): string | undefined {
  return code ? `${i18n.t('const.countries.' + code)} (${code})` : undefined;
}
