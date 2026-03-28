import { Content } from 'pdfmake/interfaces';
import { createSection, generateColumns, getTable } from '../../../shared/PDF-functions';
import { generatePodmiot1 } from './Podmiot1';
import { generatePodmiot2 } from './Podmiot2';
import { FaRR, Podmiot3 } from '../../types/FaRR.types';
import { generatePodmiot3 } from './Podmiot3';
import { generatePodmiot1Podmiot1K } from './Podmiot1Podmiot1K';
import { generatePodmiot2Podmiot2K } from './Podmiot2Podmiot2k';

export function generatePodmioty(invoice: FaRR): Content[] {
  const result: Content[] = [];
  const podmiot3: Podmiot3[] = getTable(invoice.Podmiot3);

  if (invoice.FakturaRR?.Podmiot1K || invoice.FakturaRR?.Podmiot2K) {
    if (invoice.FakturaRR?.Podmiot1K) {
      result.push(generatePodmiot1Podmiot1K(invoice.Podmiot1 ?? {}, invoice.FakturaRR?.Podmiot1K));
    } else if (invoice.Podmiot1 != null) {
      result.push(generatePodmiot1(invoice.Podmiot1));
    }

    if (invoice.FakturaRR?.Podmiot2K) {
      result.push(generatePodmiot2Podmiot2K(invoice.Podmiot2 ?? {}, invoice.FakturaRR?.Podmiot2K));
    } else if (invoice.Podmiot2) {
      result.push(createSection(generatePodmiot2(invoice.Podmiot2!), true));
    }
  } else {
    result.push([
      generateColumns([generatePodmiot1(invoice.Podmiot1!), generatePodmiot2(invoice.Podmiot2!)], {
        margin: [0, 0, 0, 8],
        columnGap: 20,
      }),
    ]);
  }

  if (podmiot3.length > 0) {
    podmiot3.forEach((podmiot, index) => {
      result.push(generatePodmiot3(podmiot, index));
      if (index < podmiot3.length - 1) {
        result.push({ margin: [0, 8, 0, 0], text: '' });
      }
    });
  }

  return createSection(result, true, [0, 0, 0, 0]);
}
