import { Content } from 'pdfmake/interfaces';
import { createSection, generateColumns, getTable, getValue } from '../../../shared/PDF-functions';
import { Faktura, Podmiot2K, Podmiot3 } from '../../types/fa3.types';
import { Podmiot3Podmiot2KDto } from '../../types/fa2-additional-types';
import { generatePodmiot1 } from './Podmiot1';
import { generatePodmiot1Podmiot1K } from './Podmiot1Podmiot1K';
import { generatePodmiot2 } from './Podmiot2';
import { generatePodmiot3 } from './Podmiot3';
import { generateDaneIdentyfikacyjneTPodmiot3Dto } from './Podmiot3Podmiot2k';
import { generatePodmiotUpowazniony } from './PodmiotUpowazniony';
import { Adres } from '../../types/fa1.types';
import { generatePodmiot2Podmiot2K } from './Podmiot2Podmiot2k';

export function generatePodmioty(invoice: Faktura): Content[] {
  const result: Content[] = [];
  const podmiot2KTable: Podmiot2K[] = getTable(invoice.Fa?.Podmiot2K);
  const podmiot3: Podmiot3[] = getTable(invoice.Podmiot3);

  if (invoice.Fa?.Podmiot1K || podmiot2KTable.length > 0) {
    if (invoice.Fa?.Podmiot1K) {
      result.push(generatePodmiot1Podmiot1K(invoice.Podmiot1 ?? {}, invoice.Fa?.Podmiot1K));
    } else if (invoice.Podmiot1 != null) {
      result.push(generatePodmiot1(invoice.Podmiot1));
    }

    if (invoice.Fa?.Podmiot2K) {
      const podmiot2K = podmiot2KTable.find(
        (podmiot) => getValue(podmiot.IDNabywcy) === getValue(invoice.Podmiot2?.IDNabywcy)
      );

      if (podmiot2K) {
        result.push(generatePodmiot2Podmiot2K(invoice.Podmiot2 ?? {}, podmiot2K));
      } else {
        result.push(createSection(generatePodmiot2(invoice.Podmiot2!), true));
      }
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
    const podmiot3Podmiot2KDto = getPodmiot3Podmiot2KDto(podmiot2KTable, podmiot3);

    podmiot3Podmiot2KDto.filter(
      (podmiot3Podmiot2) => podmiot3Podmiot2.fakturaPodmiotNDto.IDNabywcy === invoice.Podmiot2?.IDNabywcy
    );

    if (podmiot3Podmiot2KDto.length > 0) {
      podmiot3Podmiot2KDto.forEach((pdm2KDto, i) => {
        if (pdm2KDto.podmiot2KDto) {
          result.push(generateDaneIdentyfikacyjneTPodmiot3Dto(pdm2KDto, i));
        } else {
          result.push(generatePodmiot3(pdm2KDto.fakturaPodmiotNDto, i));
        }
        if (i < podmiot3Podmiot2KDto.length - 1) {
          result.push({ margin: [0, 8, 0, 0], text: '' });
        }
      });
    } else {
      podmiot3.forEach((podmiot, index) => {
        result.push(generatePodmiot3(podmiot, index));
        if (index < podmiot3.length - 1) {
          result.push({ margin: [0, 8, 0, 0], text: '' });
        }
      });
    }
  }

  result.push(generatePodmiotUpowazniony(invoice.PodmiotUpowazniony));
  return createSection(result, true, [0, 0, 0, 0]);
}

function getPodmiot3Podmiot2KDto(podmioty2K: Podmiot2K[], podmioty3: Podmiot3[]): Podmiot3Podmiot2KDto[] {
  const result: Podmiot3Podmiot2KDto[] = [];

  if (podmioty3.filter((p: Podmiot3): boolean => getValue(p.Rola) === '4').length > 0) {
    podmioty3.forEach((podmiot3: Podmiot3): void => {
      if (getValue(podmiot3.Rola) === '4') {
        result.push({
          fakturaPodmiotNDto: podmiot3,
          podmiot2KDto: podmioty2K.find(
            (podmiot) => getValue(podmiot.IDNabywcy) === getValue(podmiot3.IDNabywcy)
          ) as Podmiot2K[] & {
            Adres: Adres;
          },
        });
      } else {
        result.push({
          fakturaPodmiotNDto: podmiot3,
        });
      }
    });
  }
  return result;
}
