export interface FaRR {
  _attributes?: FaRRAttributes;
  Naglowek?: Naglowek;
  Podmiot1?: Podmiot1Class;
  Podmiot2?: Podmiot1Class;
  Podmiot3?: Podmiot3[];
  FakturaRR?: FakturaRR;
  Stopka?: Stopka;
}

export interface FakturaRR {
  KodWaluty?: FP;
  P_1M?: FP;
  P_4A?: FP;
  P_4B?: FP;
  P_4C?: FP;
  P_11_1?: FP;
  P_11_1W?: FP;
  P_11_2?: FP;
  P_11_2W?: FP;
  P_12_1?: FP;
  P_12_1W?: FP;
  P_12_2?: FP;
  RodzajFaktury?: FP;
  PrzyczynaKorekty?: FP;
  TypKorekty?: FP;
  DaneFaKorygowanej?: DaneFaKorygowanej[];
  NrFaKorygowany?: FP;
  Podmiot1K?: Podmiot1KClass;
  Podmiot2K?: Podmiot1KClass;
  DokumentZaplaty?: DokumentZaplaty[];
  DodatkowyOpis?: DodatkowyOpi[];
  FakturaRRWiersz?: Record<string, FP>[];
  Rozliczenie?: Rozliczenie;
  Platnosc?: Platnosc;
}

export interface DaneFaKorygowanej {
  DataWystFaKorygowanej?: FP;
  NrFaKorygowanej?: FP;
  NrKSeFFaKorygowanej?: FP;
}

export interface FP {
  _text?: string;
}

export interface DodatkowyOpi {
  NrWiersza?: FP;
  Klucz?: FP;
  Wartosc?: FP;
}

export interface DokumentZaplaty {
  NrDokumentu?: FP;
  DataDokumentu?: FP;
}

export interface Platnosc {
  FormaPlatnosci?: FP;
  PlatnoscInna?: FP;
  OpisPlatnosci?: FP;
  RachunekBankowy1?: RachunekBankowy[];
  RachunekBankowy2?: RachunekBankowy[];
  IPKSeF?: FP;
  LinkDoPlatnosci?: FP;
}

export interface RachunekBankowy {
  NrRB?: FP;
  SWIFT?: FP;
  NazwaBanku?: FP;
  OpisRachunku?: FP;
}

export interface Podmiot1KClass {
  DaneIdentyfikacyjne?: Podmiot1KDaneIdentyfikacyjne;
  Adres?: Adres;
}

export interface Adres {
  KodKraju?: FP;
  AdresL1?: FP;
  AdresL2?: FP;
  GLN?: FP;
}

export interface Podmiot1KDaneIdentyfikacyjne {
  NIP?: FP;
  Nazwa?: FP;
}

export interface Rozliczenie {
  Obciazenia?: Zenia[];
  SumaObciazen?: FP;
  Odliczenia?: Zenia[];
  SumaOdliczen?: FP;
  DoZaplaty?: FP;
  DoRozliczenia?: FP;
}

export interface Zenia {
  Kwota?: FP;
  Powod?: FP;
}

export interface Naglowek {
  KodFormularza?: KodFormularza;
  WariantFormularza?: FP;
  DataWytworzeniaFa?: FP;
  SystemInfo?: FP;
}

export interface KodFormularza {
  _attributes?: KodFormularzaAttributes;
  _text?: string;
}

export interface KodFormularzaAttributes {
  kodSystemowy?: string;
  wersjaSchemy?: string;
}

export interface Podmiot1Class {
  DaneIdentyfikacyjne?: Podmiot1KDaneIdentyfikacyjne;
  Adres?: Adres;
  AdresKoresp?: Adres;
  DaneKontaktowe?: DaneKontaktowe[];
  NrKontrahenta?: FP;
  StatusInfoPodatnika?: FP;
}

export interface DaneKontaktowe {
  Email?: FP;
  Telefon?: FP;
}

export interface Podmiot3 {
  DaneIdentyfikacyjne?: Podmiot3DaneIdentyfikacyjne;
  Adres?: Adres;
  AdresKoresp?: Adres;
  DaneKontaktowe?: DaneKontaktowe[];
  Rola?: FP;
  RolaInna?: FP;
  OpisRoli?: FP;
}

export interface Podmiot3DaneIdentyfikacyjne {
  NIP?: FP;
  IDWew?: FP;
  BrakID?: FP;
  Nazwa?: FP;
}

export interface Stopka {
  Informacje?: Informacje[];
  Rejestry?: Rejestry[];
}

export interface Informacje {
  StopkaFaktury?: FP;
}

export interface Rejestry {
  PelnaNazwa?: FP;
  KRS?: FP;
  REGON?: FP;
  BDO?: FP;
}

export interface FaRRAttributes {
  tns?: string;
  xsi?: string;
  schemaLocation?: string;
}
