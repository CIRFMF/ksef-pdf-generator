import { Content } from 'pdfmake/interfaces';
import { createLabelText, getTable } from '../../../shared/PDF-functions';
import { DaneKontaktowe } from '../../types/FaRR.types';

export function generateDaneKontaktowe(daneKontaktowe: DaneKontaktowe[]): Content[] {
  return getTable(daneKontaktowe)?.map((daneKontaktowe) => {
    return [
      createLabelText('E-mail: ', daneKontaktowe.Email),
      createLabelText('Tel.: ', daneKontaktowe.Telefon),
    ];
  });
}
