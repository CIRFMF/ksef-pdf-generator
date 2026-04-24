import { Content } from 'pdfmake/interfaces';
import { createLabelText } from '../../../shared/PDF-functions';
import { Adres, FP } from '../../types/fa1.types';
import i18n from 'i18next';

export function generateAdres(adres: Adres): Content[] {
  const result: Content[] = [];

  if (adres.AdresZagr) {
    const adresZagr: Record<string, FP> = adres.AdresZagr;

    if (adresZagr.KodKraju) {
      result.push(createLabelText(i18n.t('invoice.address.countryName'), adresZagr.KodKraju));
    }
    if (adresZagr.Ulica) {
      result.push(createLabelText(i18n.t('invoice.address.streetName'), adresZagr.Ulica));
    }
    if (adresZagr.NrDomu) {
      result.push(createLabelText(i18n.t('invoice.address.houseNumber'), adresZagr.NrDomu));
    }
    if (adresZagr.NrLokalu) {
      result.push(createLabelText(i18n.t('invoice.address.apartmentNumber'), adresZagr.NrLokalu));
    }
    if (adresZagr.KodPocztowy) {
      result.push(createLabelText(i18n.t('invoice.address.zipCode'), adresZagr.KodPocztowy));
    }
    if (adresZagr.Miejscowosc) {
      result.push(createLabelText(i18n.t('invoice.address.townName'), adresZagr.Miejscowosc));
    }
    if (adresZagr.GLN) {
      result.push(createLabelText(i18n.t('invoice.address.GLN'), adresZagr.GLN));
    }
  }

  if (adres.AdresPol) {
    const adresPol: Record<string, FP> = adres.AdresPol;

    if (adresPol.Wojewodztwo) {
      result.push(createLabelText(i18n.t('invoice.address.voivodeshipName'), adresPol.Wojewodztwo));
    }
    if (adresPol.Powiat) {
      result.push(createLabelText(i18n.t('invoice.address.districtName'), adresPol.Powiat));
    }
    if (adresPol.Gmina) {
      result.push(createLabelText(i18n.t('invoice.address.communeName'), adresPol.Gmina));
    }
    if (adresPol.Ulica) {
      result.push(createLabelText(i18n.t('invoice.address.streetName'), adresPol.Ulica));
    }
    if (adresPol.NrDomu) {
      result.push(createLabelText(i18n.t('invoice.address.houseNumber'), adresPol.NrDomu));
    }
    if (adresPol.NrLokalu) {
      result.push(createLabelText(i18n.t('invoice.address.apartmentNumber'), adresPol.NrLokalu));
    }
    if (adresPol.KodPocztowy) {
      result.push(createLabelText(i18n.t('invoice.address.zipCode'), adresPol.KodPocztowy));
    }
    if (adresPol.Miejscowosc) {
      result.push(createLabelText(i18n.t('invoice.address.townName'), adresPol.Miejscowosc));
    }
    if (adresPol.Poczta) {
      result.push(createLabelText(i18n.t('invoice.address.postName'), adresPol.Poczta));
    }
    if (adresPol.GLN) {
      result.push(createLabelText(i18n.t('invoice.address.GLN'), adresPol.GLN));
    }
  }
  return result;
}
