import { Content } from 'pdfmake/interfaces';
import {
  createHeader,
  createLabelText,
  createSection,
  createSubHeader,
  generateTwoColumns,
  getTable,
  hasValue,
} from '../../../shared/PDF-functions';
import { Transport } from '../../types/fa1.types';
import { getDateTimeWithoutSeconds, translateMap } from '@shared/generators/common/functions';
import { generateAdres } from './Adres';
import { generatePrzewoznik } from './Przewoznik';
import { RodzajTransportu, TypLadunku } from '@shared/consts/FA.const';
import i18n from 'i18next';

export function generateTransport(transport: Transport, index?: number | null): Content {
  const table: Content[] = [];
  const columns = {
    transport: [] as Content[],
    dane: [] as Content[],
    wysylkaZ: [] as Content[],
    wysylkaDo: [] as Content[],
    wysylkaPrzez: [] as Content[],
  };

  table.push(
    createHeader(index ? `${i18n.t('invoice.transport.header')} ${index}` : i18n.t('invoice.transport.header'))
  );
  if (transport.RodzajTransportu?._text) {
    columns.transport.push(
      createLabelText(i18n.t('invoice.transport.type'), translateMap(transport.RodzajTransportu, RodzajTransportu))
    );
  } else if (transport.TransportInny?._text == '1' && transport.OpisInnegoTransportu?._text) {
    columns.transport.push(createLabelText(i18n.t('invoice.transport.type'), i18n.t('invoice.transport.otherType')));
    columns.transport.push(
      createLabelText(i18n.t('invoice.transport.otherTypeDescription'), transport.OpisInnegoTransportu)
    );
  }
  columns.dane.push(createLabelText(i18n.t('invoice.transport.orderNumber'), transport.NrZleceniaTransportu));
  if (hasValue(transport.OpisLadunku)) {
    columns.dane.push(
      createLabelText(
        i18n.t('invoice.transport.cargoDescription'),
        translateMap(transport.OpisLadunku, TypLadunku)
      )
    );
    if (transport.LadunekInny?._text === '1' && transport.OpisInnegoLadunku?._text) {
      columns.dane.push(
        createLabelText(i18n.t('invoice.transport.cargoDescription'), i18n.t('invoice.transport.otherCargo'))
      );
      columns.dane.push(
        createLabelText(i18n.t('invoice.transport.otherCargoDescription'), transport.OpisInnegoLadunku)
      );
    }
  }
  columns.dane.push(createLabelText(i18n.t('invoice.transport.packageUnit'), transport.JednostkaOpakowania));
  columns.dane.push(
    createLabelText(
      i18n.t('invoice.transport.startDateTime'),
      getDateTimeWithoutSeconds(transport.DataGodzRozpTransportu)
    )
  );
  columns.dane.push(
    createLabelText(
      i18n.t('invoice.transport.endDateTime'),
      getDateTimeWithoutSeconds(transport.DataGodzZakTransportu)
    )
  );
  if (columns.dane.length > 0) {
    columns.dane.unshift(createSubHeader(i18n.t('invoice.transport.dataHeader'), [0, 0, 0, 0]));
  }
  table.push(generateTwoColumns(columns.transport, columns.dane));

  table.push(generatePrzewoznik(transport.Przewoznik));

  if (transport.WysylkaZ) {
    columns.wysylkaZ.push(createSubHeader(i18n.t('invoice.transport.shipFrom'), [0, 0, 0, 0]));
    columns.wysylkaZ.push(generateAdres(transport.WysylkaZ));
  }

  if (transport.WysylkaDo) {
    columns.wysylkaDo.push(createSubHeader(i18n.t('invoice.transport.shipTo'), [0, 0, 0, 0]));
    columns.wysylkaDo.push(generateAdres(transport.WysylkaDo));
  }

  const wysylkaPrzez = getTable(transport.WysylkaPrzez);

  wysylkaPrzez.forEach((adres, index) => {
    if (index) {
      columns.wysylkaPrzez.push('\n');
    }
    columns.wysylkaPrzez.push(createSubHeader(i18n.t('invoice.transport.intermediateAddress'), [0, 4, 0, 0]));
    columns.wysylkaPrzez.push(generateAdres(adres));
  });

  if (transport.WysylkaZ || transport.WysylkaDo || transport.WysylkaPrzez?.length) {
    table.push(createHeader(i18n.t('invoice.transport.shipmentHeader')));
    table.push(generateTwoColumns(columns.wysylkaZ, columns.wysylkaDo));
    table.push(generateTwoColumns(columns.wysylkaPrzez, []));
  }
  return createSection(table, true);
}
