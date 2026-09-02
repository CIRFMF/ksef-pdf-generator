import FormatTyp from '@shared/enums/common.enum';
import { ExtensionContent, InvoiceLine, PEFCorrectiveInvoice, UBLExtension } from './pef-invoice-corrective.types';
import { getTable } from '@shared/PDF-functions';
import { PEFSpecInvoice } from './pef-invoice-spec.types';
import { PEFBasicInvoice } from './pef-invoice.types';
import { SectionType } from '@shared/enums/pef-invoice.enum';

export enum PEFType {
  Basic = 1, // Basic
  Corrective = 2, // Corrective
  Specialized = 3, // Specialized
}

export type AccountingType = 'Supplier' | 'Customer' | 'Issuer';

export type PEFTable = Record<string, PEFTableCell[] | PEFTableCell[][]>;

export interface PEFTableCell {
  value: PEFTextCell[];
  style: CellStyle;
  colSpan?: number;
  rowSpan?: number;
}

export interface PEFTextCell {
  text: string;
  currency?: string;
  format?: FormatTyp | FormatTyp[];
}

export type CellStyle = 'inline' | 'valueLabel' | 'labelValueInline';

export type ExtensionOne = ExtensionContent;
export type ExtensionTwo = ExtensionContent;
export type ExtensionThree = ExtensionContent;
export type ExtensionFour = ExtensionContent;

export function getUBLExtensionArray(invoice: PEFCorrectiveInvoice | PEFSpecInvoice): UBLExtension[] {
  return getTable(invoice.UBLExtensions?.UBLExtension);
}

// EXTENSION PART 2 (Część Faktury korygującej zawierająca dane z faktury korygowanej)
export function getExtensionOne(UBLExtensionArray: UBLExtension[]): ExtensionOne | undefined {
  return UBLExtensionArray.find((el) => {
    return !!el?.ExtensionContent?.OriginalInvoiceData;
  })?.ExtensionContent as ExtensionOne | undefined;
}

// EXTENSION 3 Część Faktury korekty zawierająca różnice wartości wynikające z dokonanych korekt
export function getExtensionTwo(UBLExtensionArray: UBLExtension[]): ExtensionTwo | undefined {
  return UBLExtensionArray.find((el) => {
    return !!el?.ExtensionContent?.InvoiceCorrection;
  })?.ExtensionContent as ExtensionTwo | undefined;
}

// EXTENSION 4 Część Faktury korygującej zawierająca wartości brutto po dokonanych korektach
export function getExtensionThree(UBLExtensionArray: UBLExtension[]): ExtensionThree | undefined {
  return UBLExtensionArray.find((el) => {
    return !!el?.ExtensionContent?.AdditionalInvoiceGrossData;
  })?.ExtensionContent as ExtensionTwo | undefined;
}

// EXTENSION 5 Część Faktury korygującej zawierająca wartości brutto po dokonanych korektach
export function getExtensionFour(UBLExtensionArray: UBLExtension[]): ExtensionFour | undefined {
  return UBLExtensionArray.find((el) => {
    return !!el?.ExtensionContent?.AdditionalAddressData;
  })?.ExtensionContent as ExtensionFour | undefined;
}

export interface ColumnDef<T> {
  key: keyof PEFTable;
  isVisible: (invoice: PEFCorrectiveInvoice | PEFSpecInvoice | PEFBasicInvoice) => boolean;
  render: (
    row: T,
    metaData: {
      invoice: PEFCorrectiveInvoice | PEFSpecInvoice | PEFBasicInvoice;
      sectionType: SectionType;
      grossData: InvoiceLine | undefined;
    }
  ) => any;
}
