import { generateFA1 } from './FA1-generator';
import { Faktura as Faktura1 } from './types/fa1.types';
import { generateFA2 } from './FA2-generator';
import { Faktura as Faktura2 } from './types/fa2.types';
import { generateFA3 } from './FA3-generator';
import { Faktura as Faktura3 } from './types/fa3.types';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import { AdditionalDataTypes } from './types/common.types';
import { generateFARR } from './FARR-generator';
import { FaRR } from './types/FaRR.types';
import { parseXML } from '@shared/XML-parser';
import { i18nReady } from './i18n/i18n-init';
import { generateCorrectivePEF } from './PEF-corrective-generator';
import { generateBasicPEF } from './PEF-basic-generator';
import { PEFBasicInvoice } from './types/pef-invoice.types';
import { PEFCorrectiveInvoice } from './types/pef-invoice-corrective.types';
import { PEFSpecInvoice } from './types/pef-invoice-spec.types';
import { generateSpecPEF } from './PEF-spec-generator';

export async function generateInvoice(
  file: File,
  additionalData: AdditionalDataTypes,
  formatType: 'blob'
): Promise<Blob>;
export async function generateInvoice(
  file: File,
  additionalData: AdditionalDataTypes,
  formatType: 'base64'
): Promise<string>;
export async function generateInvoice(
  file: File,
  additionalData: AdditionalDataTypes,
  formatType: FormatType = 'blob'
): Promise<FormatTypeResult> {
  const xml: unknown = await parseXML(file);

  const wersjaFa: any = (xml as any)?.Faktura?.Naglowek?.KodFormularza?._attributes?.kodSystemowy;
  const wersjaPef: any =
    (xml as any)?.Invoice?.ProfileID?._text ?? (xml as any)?.CreditNote?.ProfileID?._text;

  const wersja = wersjaFa ?? wersjaPef;

  let pdf: TCreatedPdf;

  await i18nReady;

  switch (wersja) {
    case 'FA (1)':
      pdf = generateFA1((xml as any).Faktura as Faktura1, additionalData);
      break;
    case 'FA (2)':
      pdf = generateFA2((xml as any).Faktura as Faktura2, additionalData);
      break;
    case 'FA (3)':
      pdf = generateFA3((xml as any).Faktura as Faktura3, additionalData);
      break;
    case 'FA_RR (1)':
    case 'FA_RR(1)':
      pdf = generateFARR((xml as any).Faktura as FaRR, additionalData);
      break;
    case 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0':
      pdf = generateBasicPEF((xml as any).Invoice as PEFBasicInvoice, additionalData);
      break;
    case 'urn:fdc:www.efaktura.gov.pl:ver2.0:corr_inv:ver4.0':
      pdf = generateCorrectivePEF((xml as any).CreditNote as PEFCorrectiveInvoice, additionalData);
      break;
    case 'urn:fdc:www.efaktura.gov.pl:ver2.0:plinv:ver1.4':
      pdf = generateSpecPEF((xml as any).Invoice as PEFSpecInvoice, additionalData);
      break;
    default:
      throw new Error(`Unknown XML Version: ${wersja}`);
  }

switch (formatType) {
     case 'blob':
       return new Promise<Blob>((resolve, reject) => {
         pdf.getBlob(resolve);
       });
     case 'base64':
     default:
       return new Promise<string>((resolve, reject) => {
         pdf.getBase64(resolve);
       });
   }
}

type FormatType = 'blob' | 'base64';
type FormatTypeResult = Blob | string;
