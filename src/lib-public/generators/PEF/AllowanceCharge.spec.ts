import { beforeEach, describe, it, vi, expect } from 'vitest';
import { generateAllowanceCharge } from './AllowanceCharge';
import { SectionType } from '../../../shared/enums/pef-invoice.enum';
import { i18nReady } from '../../i18n/i18n-init';

describe(generateAllowanceCharge.name, () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await i18nReady;
  });

  it('should return empty array when AllowanceCharge is missing', () => {
    const result = generateAllowanceCharge({} as any, SectionType.Basic);
    expect(result).toEqual([]);
  });

  it('should generate only allowance section when ChargeIndicator is true', () => {
    const result = generateAllowanceCharge(
      {
        DocumentCurrencyCode: { _text: 'XYZ' },
        AllowanceCharge: [
          {
            ChargeIndicator: { _text: 'true' },
            AllowanceChargeReasonCode: { _text: 'ABC' },
            AllowanceChargeReason: [{ _text: 'Testowe' }],
            BaseAmount: { _text: '10,01' },
            Amount: { _text: '2000' },
            TaxCategory: [
              {
                TaxScheme: {
                  ID: { _text: 'VAT' },
                },
                ID: { _text: 'S' },
                Percent: { _text: '55' },
              },
            ],
          },
        ],
      } as any,
      SectionType.Basic
    );

    const tableNameHeader = (result[0] as any).stack[0].stack[0].table.body[0][0];
    const tableheader = (result[0] as any).stack[0].stack[1].table.body[0];
    const tablerow = (result[0] as any).stack[0].stack[1].table.body[1];
    const tablesummary = (result[0] as any).stack[0].stack[1].table.body[2];

    expect(tableNameHeader.stack[0].text).toEqual('Obciążenia na poziomie dokumentu');
    expect(tableheader[0].text).toEqual('Kod przyczyny obciążenia');
    expect(tablerow[0][0].text).toEqual('ABC');
    expect(tablesummary[0][0].text).toEqual('Suma');
  });

  it('should use generateTaxRateLabel when tax category id is E for allowance', () => {
    const result = generateAllowanceCharge(
      {
        DocumentCurrencyCode: { _text: 'XYZ' },
        AllowanceCharge: [
          {
            ChargeIndicator: { _text: 'true' },
            BaseAmount: { _text: '10,01' },
            TaxCategory: [
              {
                TaxScheme: {
                  ID: { _text: 'VAT' },
                },
                ID: { _text: 'E' },
                Percent: { _text: '55' },
              },
            ],
          },
        ],
      } as any,
      SectionType.Basic
    );

    const tableNameHeader = (result[0] as any).stack[0].stack[0].table.body[0][0];
    const tableheader = (result[0] as any).stack[0].stack[1].table.body[0];
    const tablerow = (result[0] as any).stack[0].stack[1].table.body[1];
    expect(tableNameHeader.stack[0].text).toEqual('Obciążenia na poziomie dokumentu');
    expect(tableheader[2].text).toEqual('Rodzaj i stawka podatku');
    expect(tablerow[2][0].text.text).toEqual('VAT: E (Zwolniony), 55%');
    expect(tableheader[3].text).toEqual('Podstawa obliczenia');
    expect(tablerow[3][0].text[0].text).toEqual('10,01');
    expect(tablerow[3][0].text[1].text).toEqual('\nXYZ');
  });

  it('should generate only charge section when ChargeIndicator is false', () => {
    const result = generateAllowanceCharge(
      {
        DocumentCurrencyCode: { _text: 'XYZ' },
        AllowanceCharge: [
          {
            ChargeIndicator: { _text: 'false' },
            AllowanceChargeReasonCode: { _text: 'TEST' },
            AllowanceChargeReason: [{ _text: 'Aplikacja' }],
            BaseAmount: { _text: '20,00' },
            Amount: { _text: '5555' },
            TaxCategory: [
              {
                TaxScheme: {
                  ID: { _text: 'VAT' },
                },
                ID: { _text: 'S' },
                Percent: { _text: '55' },
              },
            ],
          },
        ],
      } as any,
      SectionType.Basic
    );

    const tableNameHeader = (result[0] as any).stack[0].stack[0].table.body[0][0];
    const tableheader = (result[0] as any).stack[0].stack[1].table.body[0];
    const tablerow = (result[0] as any).stack[0].stack[1].table.body[1];
    expect(tableNameHeader.stack[0].text).toEqual('Upusty na poziomie dokumentu');
    expect(tableheader[2].text).toEqual('Rodzaj i stawka podatku');
    expect(tablerow[2][0].text.text).toEqual('VAT: S, 55%');
    expect(tableheader[3].text).toEqual('Podstawa obliczenia');
    expect(tablerow[3][0].text[0].text).toEqual('20,00');
    expect(tablerow[3][0].text[1].text).toEqual('\nXYZ');
  });

  it('should use generateTaxRateLabel when tax category id is E for charge', () => {
    const result = generateAllowanceCharge(
      {
        DocumentCurrencyCode: { _text: 'XYZ' },
        AllowanceCharge: [
          {
            ChargeIndicator: { _text: 'false' },
            BaseAmount: { _text: '10,01' },
            TaxCategory: [
              {
                TaxScheme: {
                  ID: { _text: 'VAT' },
                },
                ID: { _text: 'E' },
                Percent: { _text: '55' },
              },
            ],
          },
        ],
      } as any,
      SectionType.Basic
    );

    const tableNameHeader = (result[0] as any).stack[0].stack[0].table.body[0][0];
    const tableheader = (result[0] as any).stack[0].stack[1].table.body[0];
    const tablerow = (result[0] as any).stack[0].stack[1].table.body[1];
    expect(tableNameHeader.stack[0].text).toEqual('Upusty na poziomie dokumentu');
    expect(tableheader[2].text).toEqual('Rodzaj i stawka podatku');
    expect(tablerow[2][0].text.text).toEqual('VAT: E (Zwolniony), 55%');
    expect(tableheader[3].text).toEqual('Podstawa obliczenia');
    expect(tablerow[3][0].text[0].text).toEqual('10,01');
    expect(tablerow[3][0].text[1].text).toEqual('\nXYZ');
  });

  it('should generate allowance and charge section', () => {
    const result = generateAllowanceCharge(
      {
        DocumentCurrencyCode: { _text: 'XYZ' },
        AllowanceCharge: [
          {
            ChargeIndicator: { _text: 'false' },
            AllowanceChargeReasonCode: { _text: 'TEST' },
            AllowanceChargeReason: [{ _text: 'Aplikacja' }],
            BaseAmount: { _text: '20,00' },
            Amount: { _text: '5555' },
            TaxCategory: [
              {
                TaxScheme: {
                  ID: { _text: 'VAT' },
                },
                ID: { _text: 'S' },
                Percent: { _text: '55' },
              },
            ],
          },
          {
            ChargeIndicator: { _text: 'true' },
            AllowanceChargeReasonCode: { _text: 'ABC' },
            AllowanceChargeReason: [{ _text: 'Testowe' }],
            BaseAmount: { _text: '10,01' },
            Amount: { _text: '2000' },
            TaxCategory: [
              {
                TaxScheme: {
                  ID: { _text: 'VAT' },
                },
                ID: { _text: 'S' },
                Percent: { _text: '55' },
              },
            ],
          },
        ],
      } as any,
      SectionType.Basic
    );

    const allowanceTableNameHeader = (result[0] as any).stack[0].stack[0].table.body[0][0];
    const allowanceTableheader = (result[0] as any).stack[0].stack[1].table.body[0];
    const allowanceTablerow = (result[0] as any).stack[0].stack[1].table.body[1];
    expect(allowanceTableNameHeader.stack[0].text).toEqual('Upusty na poziomie dokumentu');
    expect(allowanceTableheader[2].text).toEqual('Rodzaj i stawka podatku');
    expect(allowanceTablerow[2][0].text.text).toEqual('VAT: S, 55%');
    expect(allowanceTableheader[3].text).toEqual('Podstawa obliczenia');
    expect(allowanceTablerow[3][0].text[0].text).toEqual('20,00');
    expect(allowanceTablerow[3][0].text[1].text).toEqual('\nXYZ');

    const chargeTableNameHeader = (result[0] as any).stack[1].stack[0].table.body[0][0];
    const chargeTableheader = (result[0] as any).stack[1].stack[1].table.body[0];
    const chargeTablerow = (result[0] as any).stack[1].stack[1].table.body[1];
    expect(chargeTableNameHeader.stack[0].text).toEqual('Obciążenia na poziomie dokumentu');
    expect(chargeTableheader[2].text).toEqual('Rodzaj i stawka podatku');
    expect(chargeTablerow[2][0].text.text).toEqual('VAT: S, 55%');
    expect(chargeTableheader[3].text).toEqual('Podstawa obliczenia');
    expect(chargeTablerow[3][0].text[0].text).toEqual('10,01');
    expect(chargeTablerow[3][0].text[1].text).toEqual('\nXYZ');
  });
});
