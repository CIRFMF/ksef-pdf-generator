import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generatePayment } from './Payment';
import { PEFBasicInvoice } from 'src/lib-public/types/pef-invoice.types';
import { ContentTable } from 'pdfmake/interfaces';

let payment = {
  PaymentMeans: [
    {
      CardAccount: {
        HolderName: {
          _text: 'Imię Nazwisko',
        },
        NetworkID: {
          _text: 'VISA',
        },
        PrimaryAccountNumberID: {
          _text: '123455',
        },
      },
      PayeeFinancialAccount: {
        FinancialInstitutionBranch: {
          ID: {
            _text: 'ABCD',
          },
        },
        ID: {
          _text: 'PL12123412341234121212121212',
        },
        Name: {
          _text: 'Konto dla płatnosci',
        },
      },
      PaymentMeansCode: {
        _attributes: {
          name: 'Tekst opisowy',
        },
        _text: '31',
      },
      PaymentID: {
        _text: 'Payref1',
      },
      PaymentMandate: {
        PayerFinancialAccount: {
          ID: {
            _text: 'PL12123412341234121212121212',
          },
        },
        ID: {
          _text: 'M01',
        },
      },
    },
  ],
  PaymentTerms: {
    Note: {
      _text: '2 % upustu przy płatności do 2 dni',
    },
  },
};

describe(generatePayment.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generate payment', () => {
    const result = generatePayment(payment as unknown as Partial<PEFBasicInvoice>);

    expect(((result[0] as ContentTable)?.table.body[0][0] as any).stack[0].text).toEqual(
      'Instrukcje płatności'
    );
    expect(((result[0] as ContentTable)?.table.body[0][0] as any).stack[1].text[1].text).toEqual(
      ' 2 % upustu przy płatności do 2 dni'
    );
    // FIRST TABLE
    //HEADER
    expect((result[1] as any)?.stack[0][0].table.body[0][0].text).toEqual('Kod typu płatności');
    expect((result[1] as any)?.stack[0][0].table.body[0][1].text).toEqual(
      'Identyfikator dostawcy usługi płatniczej'
    );
    expect((result[1] as any)?.stack[0][0].table.body[0][2].text).toEqual('Numer konta odbioru płatności');
    //ROW
    expect((result[1] as any)?.stack[0][0].table.body[1][0]).toEqual('31 (Tekst opisowy)');
    expect((result[1] as any)?.stack[0][0].table.body[1][1]).toEqual('ABCD');
    expect((result[1] as any)?.stack[0][0].table.body[1][2]).toEqual('PL12123412341234121212121212');

    //SECOND TABLE
    //HEADER
    expect((result[1] as any)?.stack[0][1].table.body[0][0].text).toEqual('Kod typu płatności');
    expect((result[1] as any)?.stack[0][1].table.body[0][1].text).toEqual(
      'Identyfikator sieci obsługi karty'
    );
    expect((result[1] as any)?.stack[0][1].table.body[0][2].text).toEqual('Numer konta karty płatniczej');
    //ROW
    expect((result[1] as any)?.stack[0][1].table.body[1][0]).toEqual('31 (Tekst opisowy)');
    expect((result[1] as any)?.stack[0][1].table.body[1][1]).toEqual('Imię Nazwisko');
    expect((result[1] as any)?.stack[0][1].table.body[1][2]).toEqual('VISA');

    //THIRD TABLE
    //HEADER
    expect((result[1] as any)?.stack[0][2].table.body[0][0].text).toEqual('Kod typu płatności');
    expect((result[1] as any)?.stack[0][2].table.body[0][1].text).toEqual('Identyfikator obciążanego konta');
    expect((result[1] as any)?.stack[0][2].table.body[0][2].text).toEqual('Identyfikator polecenia zapłaty');
    //ROW
    expect((result[1] as any)?.stack[0][2].table.body[1][0]).toEqual('31 (Tekst opisowy)');
    expect((result[1] as any)?.stack[0][2].table.body[1][1]).toEqual('PL12123412341234121212121212');
    expect((result[1] as any)?.stack[0][2].table.body[1][2].text).toEqual('M01');
  });
});
