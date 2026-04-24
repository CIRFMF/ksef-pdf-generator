import { Content } from 'pdfmake/interfaces';
import { Potwierdzenie } from '../../types/upo-v4_3.types';
import { createLabelText, generateTwoColumns } from '../../../shared/PDF-functions';
import { Position } from '../../../shared/enums/common.enum';
import i18n from "i18next";

export function generateNaglowekUPO(potwierdzenie: Potwierdzenie): Content[] {
  return [
    generateTwoColumns(
      {
        text: [
          { text: i18n.t('invoice.header.ksefPart1'), fontSize: 18 },
          { text:  i18n.t('invoice.header.ksefPart2'), color: 'red', bold: true, fontSize: 18 },
          { text:  i18n.t('invoice.header.ksefPart3'), bold: true, fontSize: 18 },
        ],
      },
      [
        {
          text: createLabelText(
            i18n.t('invoice.upo.entityFullName'),
            potwierdzenie!.NazwaPodmiotuPrzyjmujacego
          ),
          alignment: Position.RIGHT,
        },
        {
          text: createLabelText(
              i18n.t('invoice.upo.documentInfo'),
              i18n.t('invoice.upo.registeredInMF'),
          ),
          alignment: Position.RIGHT,
        },
      ]
    ),
  ];
}
