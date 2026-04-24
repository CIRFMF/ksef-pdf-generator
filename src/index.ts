import i18next from 'i18next';

export { generateInvoice, generatePDFUPO } from './lib-public';
export { generateFA1 } from './lib-public/FA1-generator';
export { generateFA2 } from './lib-public/FA2-generator';
export { generateFA3 } from './lib-public/FA3-generator';
export { generateFARR } from './lib-public/FARR-generator';
export { generateNaglowekUPO } from './lib-public/generators/UPO4_3/Naglowek';
export { generateDokumentUPO } from './lib-public/generators/UPO4_3/Dokumenty';
export { generateStyle } from './shared/PDF-functions';
export * from './shared/enums/common.enum';
export { i18next };
export { initI18next } from './lib-public/i18n/i18n-init';
