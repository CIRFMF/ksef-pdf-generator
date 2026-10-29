import packageInfo from '../../../package.json';
import i18n from 'i18next';

export function generateInfo(creator: string | undefined): { creator: string; producer: string } | undefined {
  return {
    creator: creator ?? i18n.t('noData'),
    producer: `${i18n.t('generatorName')}/${packageInfo.version}`,
  };
}
