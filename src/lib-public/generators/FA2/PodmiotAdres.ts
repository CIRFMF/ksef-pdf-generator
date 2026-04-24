import { Content, Margins } from 'pdfmake/interfaces';
import { createHeader, createSubHeader } from '../../../shared/PDF-functions';
import { Adres } from '../../types/fa2.types';
import { generateAdres } from './Adres';
import i18n from 'i18next';

export function generatePodmiotAdres(
  podmiotAdres: Adres | undefined,
  headerTitle = i18n.t('invoice.subject1.address'),
  isSubheader = false,
  headerMargin?: Margins
): Content[] {
  if (!podmiotAdres) {
    return [];
  }
  return [
    ...(isSubheader ? createSubHeader(headerTitle, headerMargin) : createHeader(headerTitle, headerMargin)),
    ...generateAdres(podmiotAdres),
  ];
}
