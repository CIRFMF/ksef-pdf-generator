import { Content } from 'pdfmake/interfaces';
import { createLabelText, getTable } from '../../../shared/PDF-functions.js';
import { Podmiot1DaneKontaktowe } from '../../types/fa2.types';

export function generateDaneKontaktowe(daneKontaktowe: Podmiot1DaneKontaktowe[]): Content[] {
  return getTable(daneKontaktowe)?.map((daneKontaktowe) => {
    return [
      createLabelText('Email: ', daneKontaktowe.Email),
      createLabelText('Tel.: ', daneKontaktowe.Telefon),
    ];
  });
}
