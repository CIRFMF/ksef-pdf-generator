import {
  borderedBox,
  createInlineLabelValue,
  createPefHeader,
  createPEFSubHeader,
} from '@shared/functions-pef';
import { Content } from 'pdfmake/interfaces';
import { EParty } from '../../types/pef-invoice.types';
import i18n from 'i18next';
import { getTable, getText, hasValue } from '@shared/PDF-functions';

export function generatePayeeParty(payeeParty?: EParty): Content[] {
  const result: Content[] = [];

  if (!payeeParty) {
    return result;
  }
  const { PartyName, PartyIdentification, PartyLegalEntity } = payeeParty;

  result.push(
    borderedBox([
      createPefHeader(i18n.t('pef.payeeparty.header')),
      createPEFSubHeader(getText(getTable(PartyName)[0]?.Name)),
      createInlineLabelValue(
        getText(getTable(PartyIdentification)[0]?.ID),
        i18n.t('pef.payeeparty.partyIdentificationID')
      ),
      ...(hasValue(getTable(PartyLegalEntity)[0]?.CompanyID)
        ? [
            createInlineLabelValue(
              getText(getTable(PartyLegalEntity)[0]?.CompanyID),
              i18n.t('pef.payeeparty.companyID')
            ),
          ]
        : []),
    ])
  );
  return result;
}
