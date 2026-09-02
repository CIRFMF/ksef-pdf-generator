export interface PEFCorrectiveInvoice {
  _attributes?: PEFInvoiceAttributes;
  UBLExtensions?: UBLExtensions;
  UBLVersionID?: CustomizationID;
  CustomizationID?: CustomizationID;
  ProfileID?: CustomizationID;
  ProfileExecutionID?: CustomizationID;
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  TaxPointDate?: CopyIndicator;
  CreditNoteTypeCode?: Code;
  Note?: AccountingCost[];
  DocumentCurrencyCode?: Code;
  TaxCurrencyCode?: Code;
  PricingCurrencyCode?: Code;
  PaymentCurrencyCode?: Code;
  PaymentAlternativeCurrencyCode?: Code;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  LineCountNumeric?: LineCountNumeric;
  BuyerReference?: AccountingCost;
  InvoicePeriod?: Period[];
  DiscrepancyResponse?: DiscrepancyResponse[];
  OrderReference?: PEFInvoiceOrderReference;
  BillingReference?: PEFInvoiceBillingReference[];
  DespatchDocumentReference?: DocumentReference[];
  ReceiptDocumentReference?: DocumentReference[];
  ContractDocumentReference?: DocumentReference[];
  AdditionalDocumentReference?: DocumentReference[];
  StatementDocumentReference?: DocumentReference[];
  OriginatorDocumentReference?: DocumentReference[];
  Signature?: PEFInvoiceSignature[];
  AccountingSupplierParty?: SupplierParty;
  AccountingCustomerParty?: CustomerParty;
  PayeeParty?: EParty;
  BuyerCustomerParty?: CustomerParty;
  SellerSupplierParty?: SupplierParty;
  TaxRepresentativeParty?: EParty;
  Delivery?: PEFInvoiceDelivery[];
  DeliveryTerms?: PEFInvoiceDeliveryTerm[];
  PaymentMeans?: PEFInvoicePaymentMean[];
  PaymentTerms?: PEFInvoicePaymentTerm[];
  TaxExchangeRate?: ExchangeRate;
  PricingExchangeRate?: ExchangeRate;
  PaymentExchangeRate?: ExchangeRate;
  PaymentAlternativeExchangeRate?: ExchangeRate;
  AllowanceCharge?: PEFInvoiceAllowanceCharge[];
  TaxTotal?: PEFInvoiceTaxTotal[];
  LegalMonetaryTotal?: LegalMonetaryTotal;
  CreditNoteLine?: CreditNoteLine[];
}

export interface AccountingCost {
  _attributes?: AccountingCostAttributes;
  _text?: ListAgencyNameEnum;
}

export interface AccountingCostAttributes {
  languageID?: LanguageID;
  languageLocaleID?: LanguageLocaleIDEnum;
}

export enum LanguageID {
  EnUs = 'en-us',
}

export enum LanguageLocaleIDEnum {
  NormalizedString = 'normalizedString',
}

export enum ListAgencyNameEnum {
  String = 'String',
}

export interface Code {
  _attributes?: AccountingCostCodeAttributes;
  _text?: string;
}

export interface AccountingCostCodeAttributes {
  listID?: LanguageLocaleIDEnum;
  listAgencyID?: LanguageLocaleIDEnum;
  listAgencyName?: ListAgencyNameEnum;
  listName?: ListAgencyNameEnum;
  listVersionID?: LanguageLocaleIDEnum;
  name?: ListAgencyNameEnum;
  languageID?: LanguageID;
  listURI?: string;
  listSchemeURI?: string;
}

export interface CustomerParty {
  CustomerAssignedAccountID?: CustomizationID;
  SupplierAssignedAccountID?: CustomizationID;
  AdditionalAccountID?: CustomizationID[];
  Party?: Party;
  DeliveryContact?: Contact;
  AccountingContact?: Contact;
  BuyerContact?: Contact;
}

export interface Contact {
  ID?: CustomizationID;
  Name?: AccountingCost;
  Telephone?: AccountingCost;
  Telefax?: AccountingCost;
  ElectronicMail?: AccountingCost;
  Note?: AccountingCost[];
  OtherCommunication?: OtherCommunication[];
}

export interface CustomizationID {
  _attributes?: CustomizationIDAttributes;
  _text?: string;
}

export interface CustomizationIDAttributes {
  schemeID?: string;
  schemeName?: ListAgencyNameEnum;
  schemeAgencyID?: LanguageLocaleIDEnum;
  schemeAgencyName?: ListAgencyNameEnum;
  schemeVersionID?: LanguageLocaleIDEnum;
  schemeDataURI?: string;
  schemeURI?: string;
}

export interface OtherCommunication {
  ChannelCode?: Code;
  Channel?: AccountingCost;
  Value?: AccountingCost;
}

export interface Party {
  MarkCareIndicator?: CopyIndicator;
  MarkAttentionIndicator?: CopyIndicator;
  WebsiteURI?: CustomizationID;
  LogoReferenceID?: CustomizationID;
  EndpointID?: CustomizationID;
  IndustryClassificationCode?: Code;
  PartyIdentification?: PartyIdentification[];
  PartyName?: PartyName[];
  Language?: Language;
  PostalAddress?: ApplicableTerritoryAddressElement;
  PhysicalLocation?: PartyPhysicalLocation;
  PartyTaxScheme?: PartyPartyTaxScheme[];
  PartyLegalEntity?: PartyPartyLegalEntity[];
  Contact?: Contact;
  Person?: PartyPerson[];
  FinancialAccount?: PartyFinancialAccount;
}

export interface PartyFinancialAccount {
  ID?: CustomizationID;
  Name?: AccountingCost;
  AliasName?: AccountingCost;
  AccountTypeCode?: Code;
  AccountFormatCode?: Code;
  CurrencyCode?: Code;
  PaymentNote?: AccountingCost[];
  FinancialInstitutionBranch?: PurpleFinancialInstitution;
  Country?: Country;
}

export interface Country {
  IdentificationCode?: Code;
  Name?: AccountingCost;
}

export interface PurpleFinancialInstitution {
  ID?: CustomizationID;
  Name?: AccountingCost;
  FinancialInstitution?: FinancialInstitutionFinancialInstitution;
  Address?: LocationAddressElement;
}

export interface LocationAddressElement {
  ID?: CustomizationID;
  AddressTypeCode?: Code;
  AddressFormatCode?: Code;
  Postbox?: AccountingCost;
  Floor?: AccountingCost;
  Room?: AccountingCost;
  StreetName?: AccountingCost;
  AdditionalStreetName?: AccountingCost;
  BlockName?: AccountingCost;
  BuildingName?: AccountingCost;
  BuildingNumber?: AccountingCost;
  InhouseMail?: AccountingCost;
  Department?: AccountingCost;
  MarkAttention?: AccountingCost;
  MarkCare?: AccountingCost;
  PlotIdentification?: AccountingCost;
  CitySubdivisionName?: AccountingCost;
  CityName?: AccountingCost;
  PostalZone?: AccountingCost;
  CountrySubentity?: AccountingCost;
  CountrySubentityCode?: Code;
  Region?: AccountingCost;
  District?: AccountingCost;
  TimezoneOffset?: AccountingCost;
  AddressLine?: AddressLine[];
  Country?: AutoGeneratedForWildcard;
  LocationCoordinate?: AutoGeneratedForWildcard[];
}

export interface AddressLine {
  Line?: AccountingCost;
}

export interface AutoGeneratedForWildcard {}

export interface FinancialInstitutionFinancialInstitution {
  ID?: CustomizationID;
  Name?: AccountingCost;
  Address?: AutoGeneratedForWildcard;
  FinancialInstitution?: AutoGeneratedForWildcard;
}

export interface Language {
  ID?: CustomizationID;
  Name?: AccountingCost;
  LocaleCode?: Code;
}

export interface CopyIndicator {
  _text?: string;
}

export interface PartyIdentification {
  ID?: CustomizationID;
}

export interface PartyPartyLegalEntity {
  RegistrationName?: AccountingCost;
  CompanyID?: CustomizationID;
  RegistrationDate?: CopyIndicator;
  RegistrationExpirationDate?: CopyIndicator;
  CompanyLegalFormCode?: Code;
  CompanyLegalForm?: AccountingCost;
  SoleProprietorshipIndicator?: CopyIndicator;
  CompanyLiquidationStatusCode?: Code;
  CorporateStockAmount?: Amount;
  FullyPaidSharesIndicator?: CopyIndicator;
  RegistrationAddress?: ApplicableTerritoryAddressElement;
  CorporateRegistrationScheme?: PurpleCorporateRegistrationScheme;
  ShareholderParty?: ShareholderParty[];
}

export interface PurpleCorporateRegistrationScheme {
  ID?: CustomizationID;
  Name?: AccountingCost;
  CorporateRegistrationTypeCode?: Code;
  JurisdictionRegionAddress?: LocationAddressElement[];
}

export interface Amount {
  _attributes?: AllowanceTotalAmountAttributes;
  _text?: string;
}

export interface AllowanceTotalAmountAttributes {
  currencyCodeListVersionID?: LanguageLocaleIDEnum;
  currencyID?: LanguageLocaleIDEnum;
}

export interface ApplicableTerritoryAddressElement {
  ID?: CustomizationID;
  AddressTypeCode?: Code;
  AddressFormatCode?: Code;
  Postbox?: AccountingCost;
  Floor?: AccountingCost;
  Room?: AccountingCost;
  StreetName?: AccountingCost;
  AdditionalStreetName?: AccountingCost;
  BlockName?: AccountingCost;
  BuildingName?: AccountingCost;
  BuildingNumber?: AccountingCost;
  InhouseMail?: AccountingCost;
  Department?: AccountingCost;
  MarkAttention?: AccountingCost;
  MarkCare?: AccountingCost;
  PlotIdentification?: AccountingCost;
  CitySubdivisionName?: AccountingCost;
  CityName?: AccountingCost;
  PostalZone?: AccountingCost;
  CountrySubentity?: AccountingCost;
  CountrySubentityCode?: Code;
  Region?: AccountingCost;
  District?: AccountingCost;
  TimezoneOffset?: AccountingCost;
  AddressLine?: AddressLine[];
  Country?: Country;
  LocationCoordinate?: LocationCoordinate[];
}

export interface LocationCoordinate {
  CoordinateSystemCode?: Code;
  LatitudeDegreesMeasure?: Measure;
  LatitudeMinutesMeasure?: Measure;
  LatitudeDirectionCode?: Code;
  LongitudeDegreesMeasure?: Measure;
  LongitudeMinutesMeasure?: Measure;
  LongitudeDirectionCode?: Code;
  AltitudeMeasure?: Measure;
}

export interface Measure {
  _attributes?: DurationMeasureAttributes;
  _text?: string;
}

export interface DurationMeasureAttributes {
  unitCodeListVersionID?: LanguageLocaleIDEnum;
  unitCode?: LanguageLocaleIDEnum;
}

export interface ShareholderParty {
  PartecipationPercent?: LineCountNumeric;
}

export interface LineCountNumeric {
  _attributes?: LineCountNumericAttributes;
  _text?: string;
}

export interface LineCountNumericAttributes {
  format?: ListAgencyNameEnum;
}

export interface PartyName {
  Name?: AccountingCost;
}

export interface PartyPartyTaxScheme {
  RegistrationName?: AccountingCost;
  CompanyID?: CustomizationID;
  TaxLevelCode?: Code;
  ExemptionReasonCode?: Code;
  ExemptionReason?: AccountingCost[];
  RegistrationAddress?: ApplicableTerritoryAddressElement;
  TaxScheme?: ClassifiedTaxCategoryTaxScheme;
}

export interface ClassifiedTaxCategoryTaxScheme {
  ID?: CustomizationID;
  Name?: AccountingCost;
  TaxTypeCode?: Code;
  CurrencyCode?: Code;
  JurisdictionRegionAddress?: LocationAddressElement[];
}

export interface PartyPerson {
  ID?: CustomizationID;
  FirstName?: AccountingCost;
  FamilyName?: AccountingCost;
  Title?: AccountingCost;
  MiddleName?: AccountingCost;
  OtherName?: AccountingCost;
  NameSuffix?: AccountingCost;
  JobTitle?: AccountingCost;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: AccountingCost;
  OrganizationDepartment?: AccountingCost;
  Contact?: Contact;
  FinancialAccount?: InformationContentProviderPartyFinancialAccount;
  IdentityDocumentReference?: PurpleIdentityDocumentReference[];
  ResidenceAddress?: ApplicableTerritoryAddressElement;
}

export interface InformationContentProviderPartyFinancialAccount {
  ID?: CustomizationID;
  Name?: AccountingCost;
  AliasName?: AccountingCost;
  AccountTypeCode?: Code;
  AccountFormatCode?: Code;
  CurrencyCode?: Code;
  PaymentNote?: AccountingCost[];
  FinancialInstitutionBranch?: FinancialInstitutionFinancialInstitution;
  Country?: Country;
}

export interface PurpleIdentityDocumentReference {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: AccountingCost;
  XPath?: AccountingCost[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: AccountingCost[];
  Attachment?: ShipmentDocumentReferenceAttachment;
  ValidityPeriod?: Period;
  ResultOfVerification?: ResultOfVerification;
}

export interface ShipmentDocumentReferenceAttachment {
  EmbeddedDocumentBinaryObject?: EmbeddedDocumentBinaryObject;
  ExternalReference?: AutoGeneratedForWildcard;
}

export interface EmbeddedDocumentBinaryObject {
  _attributes?: EmbeddedDocumentBinaryObjectAttributes;
  _text?: Text;
}

export interface EmbeddedDocumentBinaryObjectAttributes {
  format?: ListAgencyNameEnum;
  encodingCode?: LanguageLocaleIDEnum;
  characterSetCode?: LanguageLocaleIDEnum;
  uri?: string;
  filename?: ListAgencyNameEnum;
  mimeCode?: LanguageLocaleIDEnum;
}

export enum Text {
  UjBsR09EbGhjZ0DTQUXNQUFBUUNBRU1TQ1P0DU1GUXhEUzhi = 'UjBsR09EbGhjZ0dTQUxNQUFBUUNBRU1tQ1p0dU1GUXhEUzhi',
}

export interface ResultOfVerification {
  ValidatorID?: CustomizationID;
  ValidationResultCode?: Code;
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidateProcess?: AccountingCost;
  ValidateTool?: AccountingCost;
  ValidateToolVersion?: AccountingCost;
  SignatoryParty?: SignatoryParty;
}

export interface SignatoryParty {
  MarkCareIndicator?: CopyIndicator;
  MarkAttentionIndicator?: CopyIndicator;
  WebsiteURI?: CustomizationID;
  LogoReferenceID?: CustomizationID;
  EndpointID?: CustomizationID;
  IndustryClassificationCode?: Code;
  PartyIdentification?: PartyIdentification[];
  PartyName?: PartyName[];
  Language?: Language;
  PostalAddress?: ApplicableTerritoryAddressElement;
  PhysicalLocation?: SignatoryPartyFreightChargeLocation;
  PartyTaxScheme?: PurplePartyTaxScheme[];
  PartyLegalEntity?: InformationContentProviderPartyPartyLegalEntity[];
  Contact?: Contact;
  Person?: PurplePerson[];
  FinancialAccount?: InformationContentProviderPartyFinancialAccount;
}

export interface InformationContentProviderPartyPartyLegalEntity {
  RegistrationName?: AccountingCost;
  CompanyID?: CustomizationID;
  RegistrationDate?: CopyIndicator;
  RegistrationExpirationDate?: CopyIndicator;
  CompanyLegalFormCode?: Code;
  CompanyLegalForm?: AccountingCost;
  SoleProprietorshipIndicator?: CopyIndicator;
  CompanyLiquidationStatusCode?: Code;
  CorporateStockAmount?: Amount;
  FullyPaidSharesIndicator?: CopyIndicator;
  RegistrationAddress?: LocationAddressElement;
  CorporateRegistrationScheme?: FluffyCorporateRegistrationScheme;
  ShareholderParty?: ShareholderParty[];
}

export interface FluffyCorporateRegistrationScheme {
  ID?: CustomizationID;
  Name?: AccountingCost;
  CorporateRegistrationTypeCode?: Code;
  JurisdictionRegionAddress?: AutoGeneratedForWildcard[];
}

export interface PurplePartyTaxScheme {
  RegistrationName?: AccountingCost;
  CompanyID?: CustomizationID;
  TaxLevelCode?: Code;
  ExemptionReasonCode?: Code;
  ExemptionReason?: AccountingCost[];
  RegistrationAddress?: LocationAddressElement;
  TaxScheme?: ApplicableTaxCategoryTaxScheme;
}

export interface ApplicableTaxCategoryTaxScheme {
  ID?: CustomizationID;
  Name?: AccountingCost;
  TaxTypeCode?: Code;
  CurrencyCode?: Code;
  JurisdictionRegionAddress?: AutoGeneratedForWildcard[];
}

export interface PurplePerson {
  ID?: CustomizationID;
  FirstName?: AccountingCost;
  FamilyName?: AccountingCost;
  Title?: AccountingCost;
  MiddleName?: AccountingCost;
  OtherName?: AccountingCost;
  NameSuffix?: AccountingCost;
  JobTitle?: AccountingCost;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: AccountingCost;
  OrganizationDepartment?: AccountingCost;
  Contact?: ContactElement;
  FinancialAccount?: ContactPartyFinancialAccount;
  ResidenceAddress?: LocationAddressElement;
}

export interface ContactElement {
  ID?: CustomizationID;
  Name?: AccountingCost;
  Telephone?: AccountingCost;
  Telefax?: AccountingCost;
  ElectronicMail?: AccountingCost;
  Note?: AccountingCost[];
  OtherCommunication?: AutoGeneratedForWildcard[];
}

export interface ContactPartyFinancialAccount {
  ID?: CustomizationID;
  Name?: AccountingCost;
  AliasName?: AccountingCost;
  AccountTypeCode?: Code;
  AccountFormatCode?: Code;
  CurrencyCode?: Code;
  PaymentNote?: AccountingCost[];
  FinancialInstitutionBranch?: AutoGeneratedForWildcard;
  Country?: AutoGeneratedForWildcard;
}

export interface SignatoryPartyFreightChargeLocation {
  ID?: CustomizationID;
  Description?: AccountingCost[];
  Conditions?: AccountingCost[];
  CountrySubentity?: AccountingCost;
  CountrySubentityCode?: Code;
  LocationTypeCode?: Code;
  InformationURI?: CustomizationID;
  Name?: AccountingCost;
  ValidityPeriod?: Period[];
  Address?: LocationAddressElement;
  LocationCoordinate?: LocationCoordinate[];
}

export interface Period {
  StartDate?: CopyIndicator;
  StartTime?: CopyIndicator;
  EndDate?: CopyIndicator;
  EndTime?: CopyIndicator;
  DurationMeasure?: Measure;
  DescriptionCode?: Code[];
  Description?: AccountingCost[];
}

export interface PartyPhysicalLocation {
  ID?: CustomizationID;
  Description?: AccountingCost[];
  Conditions?: AccountingCost[];
  CountrySubentity?: AccountingCost;
  CountrySubentityCode?: Code;
  LocationTypeCode?: Code;
  InformationURI?: CustomizationID;
  Name?: AccountingCost;
  ValidityPeriod?: Period[];
  Address?: ApplicableTerritoryAddressElement;
  LocationCoordinate?: LocationCoordinate[];
}

export interface SupplierParty {
  CustomerAssignedAccountID?: CustomizationID;
  AdditionalAccountID?: CustomizationID[];
  DataSendingCapability?: AccountingCost;
  Party?: Party;
  DespatchContact?: Contact;
  AccountingContact?: Contact;
  SellerContact?: Contact;
}

export interface DocumentReference {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: AccountingCost;
  XPath?: AccountingCost[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: AccountingCost[];
  Attachment?: AdditionalDocumentReferenceAttachment;
  ValidityPeriod?: Period;
  IssuerParty?: Party;
  ResultOfVerification?: ResultOfVerification;
}

export interface AdditionalDocumentReferenceAttachment {
  EmbeddedDocumentBinaryObject?: EmbeddedDocumentBinaryObject;
  ExternalReference?: ExternalReference;
}

export interface ExternalReference {
  URI?: CustomizationID;
  DocumentHash?: AccountingCost;
  HashAlgorithmMethod?: AccountingCost;
  ExpiryDate?: CopyIndicator;
  ExpiryTime?: CopyIndicator;
  MimeCode?: Code;
  FormatCode?: Code;
  EncodingCode?: Code;
  CharacterSetCode?: Code;
  FileName?: AccountingCost;
  Description?: AccountingCost[];
}

export interface PEFInvoiceAllowanceCharge {
  ID?: CustomizationID;
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReasonCode?: Code;
  AllowanceChargeReason?: AccountingCost[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  PerUnitAmount?: Amount;
  TaxCategory?: TaxCategory[];
  TaxTotal?: CreditNoteLineTaxTotal;
  PaymentMeans?: PurplePaymentMean[];
}

export interface PurplePaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: AccountingCost[];
  PaymentID?: CustomizationID[];
  CardAccount?: PurpleCardAccount;
  PayerFinancialAccount?: PartyFinancialAccount;
  PayeeFinancialAccount?: PartyFinancialAccount;
  CreditAccount?: CreditAccount;
  PaymentMandate?: PurplePaymentMandate;
  TradeFinancing?: PurpleTradeFinancing;
}

export interface PurpleCardAccount {
  PrimaryAccountNumberID?: CustomizationID;
  NetworkID?: CustomizationID;
  CardTypeCode?: Code;
  ValidityStartDate?: CopyIndicator;
  ExpiryDate?: CopyIndicator;
  IssuerID?: CustomizationID;
  IssueNumberID?: CustomizationID;
  CV2ID?: CustomizationID;
  CardChipCode?: Code;
  ChipApplicationID?: CustomizationID;
  HolderName?: AccountingCost;
}

export interface CreditAccount {
  AccountID?: CustomizationID;
}

export interface PurplePaymentMandate {
  ID?: CustomizationID;
  MandateTypeCode?: Code;
  MaximumPaymentInstructionsNumeric?: LineCountNumeric;
  MaximumPaidAmount?: Amount;
  SignatureID?: CustomizationID;
  PayerParty?: ContactPartyElement;
  PayerFinancialAccount?: InformationContentProviderPartyFinancialAccount;
  ValidityPeriod?: Period;
  PaymentReversalPeriod?: Period;
  Clause?: Clause[];
}

export interface Clause {
  ID?: CustomizationID;
  Content?: AccountingCost[];
}

export interface ContactPartyElement {
  MarkCareIndicator?: CopyIndicator;
  MarkAttentionIndicator?: CopyIndicator;
  WebsiteURI?: CustomizationID;
  LogoReferenceID?: CustomizationID;
  EndpointID?: CustomizationID;
  IndustryClassificationCode?: Code;
  PartyIdentification?: PartyIdentification[];
  PartyName?: PartyName[];
  Language?: Language;
  PostalAddress?: LocationAddressElement;
  PhysicalLocation?: Location;
  PartyTaxScheme?: ContactPartyPartyTaxScheme[];
  PartyLegalEntity?: ContactPartyPartyLegalEntity[];
  Contact?: ContactElement;
  Person?: ContactPartyPerson[];
  FinancialAccount?: ContactPartyFinancialAccount;
}

export interface ContactPartyPartyLegalEntity {
  RegistrationName?: AccountingCost;
  CompanyID?: CustomizationID;
  RegistrationDate?: CopyIndicator;
  RegistrationExpirationDate?: CopyIndicator;
  CompanyLegalFormCode?: Code;
  CompanyLegalForm?: AccountingCost;
  SoleProprietorshipIndicator?: CopyIndicator;
  CompanyLiquidationStatusCode?: Code;
  CorporateStockAmount?: Amount;
  FullyPaidSharesIndicator?: CopyIndicator;
  RegistrationAddress?: AutoGeneratedForWildcard;
  CorporateRegistrationScheme?: AutoGeneratedForWildcard;
  ShareholderParty?: AutoGeneratedForWildcard[];
}

export interface ContactPartyPartyTaxScheme {
  RegistrationName?: AccountingCost;
  CompanyID?: CustomizationID;
  TaxLevelCode?: Code;
  ExemptionReasonCode?: Code;
  ExemptionReason?: AccountingCost[];
  RegistrationAddress?: AutoGeneratedForWildcard;
  TaxScheme?: AutoGeneratedForWildcard;
}

export interface ContactPartyPerson {
  ID?: CustomizationID;
  FirstName?: AccountingCost;
  FamilyName?: AccountingCost;
  Title?: AccountingCost;
  MiddleName?: AccountingCost;
  OtherName?: AccountingCost;
  NameSuffix?: AccountingCost;
  JobTitle?: AccountingCost;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: AccountingCost;
  OrganizationDepartment?: AccountingCost;
  Contact?: AutoGeneratedForWildcard;
  FinancialAccount?: AutoGeneratedForWildcard;
  IdentityDocumentReference?: PartyIdentification[];
  ResidenceAddress?: AutoGeneratedForWildcard;
}

export interface Location {
  ID?: CustomizationID;
  Description?: AccountingCost[];
  Conditions?: AccountingCost[];
  CountrySubentity?: AccountingCost;
  CountrySubentityCode?: Code;
  LocationTypeCode?: Code;
  InformationURI?: CustomizationID;
  Name?: AccountingCost;
  ValidityPeriod?: AutoGeneratedForWildcard[];
  Address?: AutoGeneratedForWildcard;
  LocationCoordinate?: AutoGeneratedForWildcard[];
}

export interface PurpleTradeFinancing {
  ID?: CustomizationID;
  FinancingInstrumentCode?: Code;
  ContractDocumentReference?: CertificateContractDocumentReference;
  DocumentReference?: CertificateContractDocumentReference[];
  FinancingParty?: ContactPartyElement;
  FinancingFinancialAccount?: InformationContentProviderPartyFinancialAccount;
  Clause?: Clause[];
}

export interface CertificateContractDocumentReference {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: AccountingCost;
  XPath?: AccountingCost[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: AccountingCost[];
  Attachment?: ShipmentDocumentReferenceAttachment;
  ValidityPeriod?: Period;
  IssuerParty?: ResponsibleTransportServiceProviderPartyElement;
  ResultOfVerification?: ResultOfVerification;
}

export interface ResponsibleTransportServiceProviderPartyElement {
  MarkCareIndicator?: CopyIndicator;
  MarkAttentionIndicator?: CopyIndicator;
  WebsiteURI?: CustomizationID;
  LogoReferenceID?: CustomizationID;
  EndpointID?: CustomizationID;
  IndustryClassificationCode?: Code;
  PartyIdentification?: PartyIdentification[];
  PartyName?: PartyName[];
  Language?: AutoGeneratedForWildcard;
  PostalAddress?: AutoGeneratedForWildcard;
  PhysicalLocation?: AutoGeneratedForWildcard;
  PartyTaxScheme?: PartyTaxScheme[];
  PartyLegalEntity?: AutoGeneratedForWildcard[];
  Contact?: AutoGeneratedForWildcard;
  Person?: AutoGeneratedForWildcard[];
  FinancialAccount?: AutoGeneratedForWildcard;
}

export interface PartyTaxScheme {
  TaxScheme?: AutoGeneratedForWildcard;
}

export interface TaxCategory {
  ID?: CustomizationID;
  Name?: AccountingCost;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TaxExemptionReasonCode?: Code;
  TaxExemptionReason?: AccountingCost[];
  TierRange?: AccountingCost;
  TierRatePercent?: LineCountNumeric;
  TaxScheme?: PurpleTaxScheme;
}

export interface PurpleTaxScheme {
  ID?: CustomizationID;
  Name?: AccountingCost;
  TaxTypeCode?: Code;
  CurrencyCode?: Code;
  JurisdictionRegionAddress?: ApplicableTerritoryAddressElement[];
}

export interface CreditNoteLineTaxTotal {
  TaxAmount?: Amount;
  RoundingAmount?: Amount;
  TaxEvidenceIndicator?: CopyIndicator;
  TaxIncludedIndicator?: CopyIndicator;
  TaxSubtotal?: PurpleTaxSubtotal[];
}

export interface PurpleTaxSubtotal {
  TaxableAmount?: Amount;
  TaxAmount?: Amount;
  CalculationSequenceNumeric?: LineCountNumeric;
  TransactionCurrencyTaxAmount?: Amount;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TierRange?: AccountingCost;
  TierRatePercent?: LineCountNumeric;
  TaxCategory?: ApplicableTaxCategoryElement;
}

export interface ApplicableTaxCategoryElement {
  ID?: CustomizationID;
  Name?: AccountingCost;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TaxExemptionReasonCode?: Code;
  TaxExemptionReason?: AccountingCost[];
  TierRange?: AccountingCost;
  TierRatePercent?: LineCountNumeric;
  TaxScheme?: ApplicableTaxCategoryTaxScheme;
}

export interface PEFInvoiceBillingReference {
  InvoiceDocumentReference?: BillingReferenceOriginalDocumentReference;
  SelfBilledInvoiceDocumentReference?: BillingReferenceOriginalDocumentReference;
  CreditNoteDocumentReference?: BillingReferenceOriginalDocumentReference;
  SelfBilledCreditNoteDocumentReference?: BillingReferenceOriginalDocumentReference;
  DebitNoteDocumentReference?: BillingReferenceOriginalDocumentReference;
  ReminderDocumentReference?: BillingReferenceOriginalDocumentReference;
  AdditionalDocumentReference?: BillingReferenceOriginalDocumentReference;
  BillingReferenceLine?: PurpleBillingReferenceLine[];
}

export interface BillingReferenceOriginalDocumentReference {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: AccountingCost;
  XPath?: AccountingCost[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: AccountingCost[];
  Attachment?: AdditionalDocumentReferenceAttachment;
  ValidityPeriod?: Period;
  IssuerParty?: DocumentReferenceIssuerParty;
  ResultOfVerification?: ResultOfVerification;
}

export interface DocumentReferenceIssuerParty {
  MarkCareIndicator?: CopyIndicator;
  MarkAttentionIndicator?: CopyIndicator;
  WebsiteURI?: CustomizationID;
  LogoReferenceID?: CustomizationID;
  EndpointID?: CustomizationID;
  IndustryClassificationCode?: Code;
  PartyIdentification?: PartyIdentification[];
  PartyName?: PartyName[];
  Language?: Language;
  PostalAddress?: ApplicableTerritoryAddressElement;
  PhysicalLocation?: SignatoryPartyFreightChargeLocation;
  PartyTaxScheme?: PurplePartyTaxScheme[];
  PartyLegalEntity?: InformationContentProviderPartyPartyLegalEntity[];
  Contact?: Contact;
  Person?: InformationContentProviderPartyPerson[];
  FinancialAccount?: InformationContentProviderPartyFinancialAccount;
}

export interface InformationContentProviderPartyPerson {
  ID?: CustomizationID;
  FirstName?: AccountingCost;
  FamilyName?: AccountingCost;
  Title?: AccountingCost;
  MiddleName?: AccountingCost;
  OtherName?: AccountingCost;
  NameSuffix?: AccountingCost;
  JobTitle?: AccountingCost;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: AccountingCost;
  OrganizationDepartment?: AccountingCost;
  Contact?: ContactElement;
  FinancialAccount?: ContactPartyFinancialAccount;
  ResidenceAddress?: LocationAddressElement;
  IdentityDocumentReference?: IdentityDocumentReferenceElement[];
}

export interface IdentityDocumentReferenceElement {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: AccountingCost;
  XPath?: AccountingCost[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: AccountingCost[];
  Attachment?: AutoGeneratedForWildcard;
  ValidityPeriod?: AutoGeneratedForWildcard;
  IssuerParty?: AutoGeneratedForWildcard;
  ResultOfVerification?: AutoGeneratedForWildcard;
}

export interface PurpleBillingReferenceLine {
  ID?: CustomizationID;
  Amount?: Amount;
  AllowanceCharge?: PurpleAllowanceCharge[];
}

export interface PurpleAllowanceCharge {
  ID?: CustomizationID;
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReasonCode?: Code;
  AllowanceChargeReason?: AccountingCost[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  PerUnitAmount?: Amount;
  TaxCategory?: ApplicableTaxCategoryElement[];
  TaxTotal?: PurpleTaxTotal;
  PaymentMeans?: FluffyPaymentMean[];
}

export interface FluffyPaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: AccountingCost[];
  PaymentID?: CustomizationID[];
  CardAccount?: PurpleCardAccount;
  PayerFinancialAccount?: ContactPartyFinancialAccount;
  PayeeFinancialAccount?: ContactPartyFinancialAccount;
  CreditAccount?: CreditAccount;
  PaymentMandate?: FluffyPaymentMandate;
  TradeFinancing?: FluffyTradeFinancing;
}

export interface FluffyPaymentMandate {
  ID?: CustomizationID;
  MandateTypeCode?: Code;
  MaximumPaymentInstructionsNumeric?: LineCountNumeric;
  MaximumPaidAmount?: Amount;
  SignatureID?: CustomizationID;
  PayerParty?: AutoGeneratedForWildcard;
  PayerFinancialAccount?: AutoGeneratedForWildcard;
  ValidityPeriod?: AutoGeneratedForWildcard;
  PaymentReversalPeriod?: AutoGeneratedForWildcard;
  Clause?: AutoGeneratedForWildcard[];
}

export interface FluffyTradeFinancing {
  ID?: CustomizationID;
  FinancingInstrumentCode?: Code;
  ContractDocumentReference?: PartyIdentification;
  DocumentReference?: PartyIdentification[];
  FinancingParty?: AutoGeneratedForWildcard;
  FinancingFinancialAccount?: AutoGeneratedForWildcard;
  Clause?: AutoGeneratedForWildcard[];
}

export interface PurpleTaxTotal {
  TaxAmount?: Amount;
  RoundingAmount?: Amount;
  TaxEvidenceIndicator?: CopyIndicator;
  TaxIncludedIndicator?: CopyIndicator;
  TaxSubtotal?: FluffyTaxSubtotal[];
}

export interface FluffyTaxSubtotal {
  TaxableAmount?: Amount;
  TaxAmount?: Amount;
  CalculationSequenceNumeric?: LineCountNumeric;
  TransactionCurrencyTaxAmount?: Amount;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TierRange?: AccountingCost;
  TierRatePercent?: LineCountNumeric;
  TaxCategory?: PartyTaxScheme;
}

export interface CreditNoteLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: AccountingCost[];
  CreditedQuantity?: Quantity;
  LineExtensionAmount?: Amount;
  TaxPointDate?: CopyIndicator;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  PaymentPurposeCode?: Code;
  FreeOfChargeIndicator?: CopyIndicator;
  InvoicePeriod?: Period[];
  OrderLineReference?: CreditNoteLineOrderLineReference[];
  DiscrepancyResponse?: DiscrepancyResponse[];
  DespatchLineReference?: CreditNoteLineDespatchLineReference[];
  ReceiptLineReference?: CreditNoteLineDespatchLineReference[];
  BillingReference?: CreditNoteLineBillingReference[];
  DocumentReference?: BillingReferenceOriginalDocumentReference[];
  PricingReference?: CreditNoteLinePricingReference;
  OriginatorParty?: Party;
  Delivery?: CreditNoteLineDelivery[];
  PaymentTerms?: CreditNoteLinePaymentTerm[];
  TaxTotal?: CreditNoteLineTaxTotal[];
  AllowanceCharge?: CreditNoteLineAllowanceCharge[];
  Item?: CreditNoteLineItem;
  Price?: CreditNoteLinePrice;
  DeliveryTerms?: CreditNoteLineDeliveryTerm[];
  ItemPriceExtension?: CreditNoteLineItemPriceExtension;
}

export interface CreditNoteLineAllowanceCharge {
  ID?: CustomizationID;
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReasonCode?: Code;
  AllowanceChargeReason?: AccountingCost[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  PerUnitAmount?: Amount;
  TaxCategory?: PurpleTaxCategory[];
  TaxTotal?: FluffyTaxTotal;
  PaymentMeans?: TentacledPaymentMean[];
}

export interface TentacledPaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: AccountingCost[];
  PaymentID?: CustomizationID[];
  CardAccount?: PurpleCardAccount;
  PayerFinancialAccount?: InformationContentProviderPartyFinancialAccount;
  PayeeFinancialAccount?: InformationContentProviderPartyFinancialAccount;
  CreditAccount?: CreditAccount;
  PaymentMandate?: TentacledPaymentMandate;
  TradeFinancing?: TentacledTradeFinancing;
}

export interface TentacledPaymentMandate {
  ID?: CustomizationID;
  MandateTypeCode?: Code;
  MaximumPaymentInstructionsNumeric?: LineCountNumeric;
  MaximumPaidAmount?: Amount;
  SignatureID?: CustomizationID;
  PayerParty?: ResponsibleTransportServiceProviderPartyElement;
  PayerFinancialAccount?: ContactPartyFinancialAccount;
  ValidityPeriod?: Period;
  PaymentReversalPeriod?: Period;
  Clause?: Clause[];
}

export interface TentacledTradeFinancing {
  ID?: CustomizationID;
  FinancingInstrumentCode?: Code;
  ContractDocumentReference?: IdentityDocumentReferenceElement;
  DocumentReference?: IdentityDocumentReferenceElement[];
  FinancingParty?: ResponsibleTransportServiceProviderPartyElement;
  FinancingFinancialAccount?: ContactPartyFinancialAccount;
  Clause?: Clause[];
}

export interface PurpleTaxCategory {
  ID?: CustomizationID;
  Name?: AccountingCost;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TaxExemptionReasonCode?: Code;
  TaxExemptionReason?: AccountingCost[];
  TierRange?: AccountingCost;
  TierRatePercent?: LineCountNumeric;
  TaxScheme?: ClassifiedTaxCategoryTaxScheme;
}

export interface FluffyTaxTotal {
  TaxAmount?: Amount;
  RoundingAmount?: Amount;
  TaxEvidenceIndicator?: CopyIndicator;
  TaxIncludedIndicator?: CopyIndicator;
  TaxSubtotal?: TentacledTaxSubtotal[];
}

export interface TentacledTaxSubtotal {
  TaxableAmount?: Amount;
  TaxAmount?: Amount;
  CalculationSequenceNumeric?: LineCountNumeric;
  TransactionCurrencyTaxAmount?: Amount;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TierRange?: AccountingCost;
  TierRatePercent?: LineCountNumeric;
  TaxCategory?: ExtraAllowanceChargeTaxCategory;
}

export interface ExtraAllowanceChargeTaxCategory {
  ID?: CustomizationID;
  Name?: AccountingCost;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TaxExemptionReasonCode?: Code;
  TaxExemptionReason?: AccountingCost[];
  TierRange?: AccountingCost;
  TierRatePercent?: LineCountNumeric;
  TaxScheme?: AutoGeneratedForWildcard;
}

export interface CreditNoteLineBillingReference {
  InvoiceDocumentReference?: BillingReferenceCatalogueDocumentReference;
  SelfBilledInvoiceDocumentReference?: BillingReferenceCatalogueDocumentReference;
  CreditNoteDocumentReference?: BillingReferenceCatalogueDocumentReference;
  SelfBilledCreditNoteDocumentReference?: BillingReferenceCatalogueDocumentReference;
  DebitNoteDocumentReference?: BillingReferenceCatalogueDocumentReference;
  ReminderDocumentReference?: BillingReferenceCatalogueDocumentReference;
  AdditionalDocumentReference?: BillingReferenceCatalogueDocumentReference;
  BillingReferenceLine?: FluffyBillingReferenceLine[];
}

export interface BillingReferenceCatalogueDocumentReference {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: AccountingCost;
  XPath?: AccountingCost[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: AccountingCost[];
  Attachment?: AdditionalDocumentReferenceAttachment;
  ValidityPeriod?: Period;
  IssuerParty?: ContactPartyElement;
  ResultOfVerification?: ResultOfVerification;
}

export interface FluffyBillingReferenceLine {
  ID?: CustomizationID;
  Amount?: Amount;
  AllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
}

export interface BillingReferenceLineExtraAllowanceCharge {
  ID?: CustomizationID;
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReasonCode?: Code;
  AllowanceChargeReason?: AccountingCost[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  PerUnitAmount?: Amount;
  TaxCategory?: ExtraAllowanceChargeTaxCategory[];
  TaxTotal?: TentacledTaxTotal;
  PaymentMeans?: StickyPaymentMean[];
}

export interface StickyPaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: AccountingCost[];
  PaymentID?: CustomizationID[];
  CardAccount?: FluffyCardAccount;
  PayerFinancialAccount?: AutoGeneratedForWildcard;
  PayeeFinancialAccount?: AutoGeneratedForWildcard;
  CreditAccount?: CreditAccount;
  PaymentMandate?: AutoGeneratedForWildcard;
  TradeFinancing?: StickyTradeFinancing;
}

export interface FluffyCardAccount {
  PrimaryAccountNumberID?: CustomizationID;
  NetworkID?: CustomizationID;
}

export interface StickyTradeFinancing {
  FinancingParty?: AutoGeneratedForWildcard;
}

export interface TentacledTaxTotal {
  TaxAmount?: Amount;
  RoundingAmount?: Amount;
  TaxEvidenceIndicator?: CopyIndicator;
  TaxIncludedIndicator?: CopyIndicator;
  TaxSubtotal?: WithholdingTaxTotalTaxSubtotal[];
}

export interface WithholdingTaxTotalTaxSubtotal {
  TaxAmount?: Amount;
  TaxCategory?: PartyTaxScheme;
}

export interface Quantity {
  _attributes?: CreditedQuantityAttributes;
  _text?: string;
}

export interface CreditedQuantityAttributes {
  unitCode?: LanguageLocaleIDEnum;
  unitCodeListID?: LanguageLocaleIDEnum;
  unitCodeListAgencyID?: LanguageLocaleIDEnum;
  unitCodeListAgencyName?: ListAgencyNameEnum;
}

export interface CreditNoteLineDelivery {
  ID?: CustomizationID;
  Quantity?: Quantity;
  MinimumQuantity?: Quantity;
  MaximumQuantity?: Quantity;
  ActualDeliveryDate?: CopyIndicator;
  ActualDeliveryTime?: CopyIndicator;
  LatestDeliveryDate?: CopyIndicator;
  LatestDeliveryTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  TrackingID?: CustomizationID;
  DeliveryAddress?: ApplicableTerritoryAddressElement;
  DeliveryLocation?: PartyPhysicalLocation;
  AlternativeDeliveryLocation?: PartyPhysicalLocation;
  RequestedDeliveryPeriod?: Period;
  PromisedDeliveryPeriod?: Period;
  EstimatedDeliveryPeriod?: Period;
  CarrierParty?: DocumentReferenceIssuerParty;
  DeliveryParty?: DocumentReferenceIssuerParty;
  NotifyParty?: DocumentReferenceIssuerParty[];
  Despatch?: PurpleDespatch;
  DeliveryTerms?: PurpleDeliveryTerm[];
  MinimumDeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit;
  MaximumDeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit;
  Shipment?: PurpleShipment;
}

export interface PurpleDeliveryTerm {
  ID?: CustomizationID;
  SpecialTerms?: AccountingCost[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: AccountingCost[];
  Amount?: Amount;
  DeliveryLocation?: SignatoryPartyFreightChargeLocation;
  AllowanceCharge?: BillingReferenceLineExtraAllowanceCharge;
}

export interface PurpleDespatch {
  ID?: CustomizationID;
  RequestedDespatchDate?: CopyIndicator;
  RequestedDespatchTime?: CopyIndicator;
  EstimatedDespatchDate?: CopyIndicator;
  EstimatedDespatchTime?: CopyIndicator;
  ActualDespatchDate?: CopyIndicator;
  ActualDespatchTime?: CopyIndicator;
  GuaranteedDespatchDate?: CopyIndicator;
  GuaranteedDespatchTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  Instructions?: AccountingCost[];
  DespatchAddress?: ApplicableTerritoryAddressElement;
  DespatchLocation?: SignatoryPartyFreightChargeLocation;
  DespatchParty?: ContactPartyElement;
  CarrierParty?: ContactPartyElement;
  NotifyParty?: ContactPartyElement[];
  Contact?: Contact;
  EstimatedDespatchPeriod?: Period;
  RequestedDespatchPeriod?: Period;
}

export interface OriginalItemLocationQuantityMaximumDeliveryUnit {
  BatchQuantity?: Quantity;
  ConsumerUnitQuantity?: Quantity;
  HazardousRiskIndicator?: CopyIndicator;
}

export interface PurpleShipment {
  ID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  Information?: AccountingCost[];
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: AccountingCost[];
  DeliveryInstructions?: AccountingCost[];
  SplitConsignmentIndicator?: CopyIndicator;
  ConsignmentQuantity?: Quantity;
  Consignment?: PurpleConsignment[];
  GoodsItem?: PurpleGoodsItem[];
  ShipmentStage?: PurpleShipmentStage[];
  TransportHandlingUnit?: FluffyTransportHandlingUnit[];
  ReturnAddress?: ApplicableTerritoryAddressElement;
  OriginAddress?: ApplicableTerritoryAddressElement;
  FirstArrivalPortLocation?: SignatoryPartyFreightChargeLocation;
  LastExitPortLocation?: SignatoryPartyFreightChargeLocation;
  ExportCountry?: Country;
  FreightAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
}

export interface PurpleConsignment {
  ID?: CustomizationID;
  CarrierAssignedID?: CustomizationID;
  ConsigneeAssignedID?: CustomizationID;
  ConsignorAssignedID?: CustomizationID;
  FreightForwarderAssignedID?: CustomizationID;
  BrokerAssignedID?: CustomizationID;
  ContractedCarrierAssignedID?: CustomizationID;
  PerformingCarrierAssignedID?: CustomizationID;
  SummaryDescription?: AccountingCost[];
  TotalInvoiceAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  TariffDescription?: AccountingCost[];
  TariffCode?: Code;
  InsurancePremiumAmount?: Amount;
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  ChargeableWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  LoadingLengthMeasure?: Measure;
  Remarks?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  AnimalFoodIndicator?: CopyIndicator;
  HumanFoodIndicator?: CopyIndicator;
  LivestockIndicator?: CopyIndicator;
  BulkCargoIndicator?: CopyIndicator;
  ContainerizedIndicator?: CopyIndicator;
  GeneralCargoIndicator?: CopyIndicator;
  SpecialSecurityIndicator?: CopyIndicator;
  ThirdPartyPayerIndicator?: CopyIndicator;
  CarrierServiceInstructions?: AccountingCost[];
  CustomsClearanceServiceInstructions?: AccountingCost[];
  ForwarderServiceInstructions?: AccountingCost[];
  SpecialServiceInstructions?: AccountingCost[];
  SequenceID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  Information?: AccountingCost[];
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: AccountingCost[];
  SplitConsignmentIndicator?: CopyIndicator;
  DeliveryInstructions?: AccountingCost[];
  ConsignmentQuantity?: Quantity;
  ConsolidatableIndicator?: CopyIndicator;
  HaulageInstructions?: AccountingCost[];
  LoadingSequenceID?: CustomizationID;
  ChildConsignmentQuantity?: Quantity;
  TotalPackagesQuantity?: Quantity;
  CustomsDeclaration?: PurpleCustomsDeclaration[];
  RequestedPickupTransportEvent?: PlannedDeliveryTransportEventElement;
  RequestedDeliveryTransportEvent?: PlannedDeliveryTransportEventElement;
  PlannedPickupTransportEvent?: PlannedDeliveryTransportEventElement;
  PlannedDeliveryTransportEvent?: PlannedDeliveryTransportEventElement;
  Status?: Status[];
  ConsigneeParty?: ResponsibleTransportServiceProviderPartyElement;
  ExporterParty?: ResponsibleTransportServiceProviderPartyElement;
  ConsignorParty?: ResponsibleTransportServiceProviderPartyElement;
  ImporterParty?: ResponsibleTransportServiceProviderPartyElement;
  CarrierParty?: ResponsibleTransportServiceProviderPartyElement;
  FreightForwarderParty?: ResponsibleTransportServiceProviderPartyElement;
  NotifyParty?: ResponsibleTransportServiceProviderPartyElement;
  OriginalDespatchParty?: ResponsibleTransportServiceProviderPartyElement;
  FinalDeliveryParty?: ResponsibleTransportServiceProviderPartyElement;
  PerformingCarrierParty?: ResponsibleTransportServiceProviderPartyElement;
  SubstituteCarrierParty?: ResponsibleTransportServiceProviderPartyElement;
  LogisticsOperatorParty?: ResponsibleTransportServiceProviderPartyElement;
  TransportAdvisorParty?: ResponsibleTransportServiceProviderPartyElement;
  HazardousItemNotificationParty?: ResponsibleTransportServiceProviderPartyElement;
  InsuranceParty?: ResponsibleTransportServiceProviderPartyElement;
  MortgageHolderParty?: ResponsibleTransportServiceProviderPartyElement;
  BillOfLadingHolderParty?: ResponsibleTransportServiceProviderPartyElement;
  OriginalDepartureCountry?: Country;
  FinalDestinationCountry?: Country;
  TransitCountry?: Country[];
  TransportContract?: PurpleContract;
  TransportEvent?: PlannedDeliveryTransportEventElement[];
  OriginalDespatchTransportationService?: PurpleTransportationService;
  FinalDeliveryTransportationService?: PurpleTransportationService;
  DeliveryTerms?: InvoiceLineDeliveryTerm;
  PaymentTerms?: CollectPaymentTerms;
  CollectPaymentTerms?: CollectPaymentTerms;
  DisbursementPaymentTerms?: CollectPaymentTerms;
  PrepaidPaymentTerms?: CollectPaymentTerms;
  FreightAllowanceCharge?: FluffyAllowanceCharge[];
  ExtraAllowanceCharge?: FluffyAllowanceCharge[];
  MainCarriageShipmentStage?: FinalDeliveryTransportationServiceShipmentStage[];
  PreCarriageShipmentStage?: FinalDeliveryTransportationServiceShipmentStage[];
  OnCarriageShipmentStage?: FinalDeliveryTransportationServiceShipmentStage[];
  TransportHandlingUnit?: PurpleTransportHandlingUnit[];
  FirstArrivalPortLocation?: Location;
  LastExitPortLocation?: Location;
}

export interface CollectPaymentTerms {
  ID?: CustomizationID;
  PaymentMeansID?: CustomizationID[];
  PrepaidPaymentReferenceID?: CustomizationID;
  Note?: AccountingCost[];
  ReferenceEventCode?: Code;
  SettlementDiscountPercent?: LineCountNumeric;
  PenaltySurchargePercent?: LineCountNumeric;
  PaymentPercent?: LineCountNumeric;
  Amount?: Amount;
  SettlementDiscountAmount?: Amount;
  PenaltyAmount?: Amount;
  PaymentTermsDetailsURI?: CustomizationID;
  PaymentDueDate?: CopyIndicator;
  InstallmentDueDate?: CopyIndicator;
  InvoicingPartyReference?: AccountingCost;
  SettlementPeriod?: AutoGeneratedForWildcard;
  PenaltyPeriod?: AutoGeneratedForWildcard;
  ExchangeRate?: PurpleExchangeRate;
  ValidityPeriod?: AutoGeneratedForWildcard;
}

export interface PurpleExchangeRate {
  SourceCurrencyCode?: Code;
  TargetCurrencyCode?: Code;
}

export interface PurpleCustomsDeclaration {
  ID?: CustomizationID;
  IssuerParty?: AutoGeneratedForWildcard;
}

export interface InvoiceLineDeliveryTerm {
  ID?: CustomizationID;
  SpecialTerms?: AccountingCost[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: AccountingCost[];
  Amount?: Amount;
  DeliveryLocation?: AutoGeneratedForWildcard;
  AllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge;
}

export interface ContainingTransportEquipmentFreightAllowanceCharge {
  ChargeIndicator?: CopyIndicator;
  Amount?: Amount;
}

export interface FluffyAllowanceCharge {
  ID?: CustomizationID;
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReasonCode?: Code;
  AllowanceChargeReason?: AccountingCost[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  PerUnitAmount?: Amount;
  TaxCategory?: PartyTaxScheme[];
  TaxTotal?: ServiceAllowanceChargeTaxTotal;
  PaymentMeans?: ServiceAllowanceChargePaymentMean[];
}

export interface ServiceAllowanceChargePaymentMean {
  PaymentMeansCode?: Code;
}

export interface ServiceAllowanceChargeTaxTotal {
  TaxAmount?: Amount;
}

export interface PurpleTransportationService {
  TransportServiceCode?: Code;
  TariffClassCode?: Code;
  Priority?: AccountingCost;
  FreightRateClassCode?: Code;
  TransportationServiceDescription?: AccountingCost[];
  TransportationServiceDetailsURI?: CustomizationID;
  NominationDate?: CopyIndicator;
  NominationTime?: CopyIndicator;
  Name?: AccountingCost;
  SequenceNumeric?: LineCountNumeric;
  TransportEquipment?: AutoGeneratedForWildcard[];
  SupportedTransportEquipment?: AutoGeneratedForWildcard[];
  UnsupportedTransportEquipment?: AutoGeneratedForWildcard[];
  CommodityClassification?: AutoGeneratedForWildcard[];
  SupportedCommodityClassification?: AutoGeneratedForWildcard[];
  UnsupportedCommodityClassification?: AutoGeneratedForWildcard[];
  TotalCapacityDimension?: FloorSpaceMeasurementDimension;
  ShipmentStage?: AutoGeneratedForWildcard[];
  TransportEvent?: AutoGeneratedForWildcard[];
  ResponsibleTransportServiceProviderParty?: AutoGeneratedForWildcard;
  EnvironmentalEmission?: PurpleEnvironmentalEmission[];
  EstimatedDurationPeriod?: AutoGeneratedForWildcard;
  ScheduledServiceFrequency?: ScheduledServiceFrequency[];
}

export interface PurpleEnvironmentalEmission {
  EnvironmentalEmissionTypeCode?: Code;
  ValueMeasure?: Measure;
}

export interface ScheduledServiceFrequency {
  WeekDayCode?: Code;
}

export interface FloorSpaceMeasurementDimension {
  AttributeID?: CustomizationID;
}

export interface FinalDeliveryTransportationServiceShipmentStage {
  ID?: CustomizationID;
  TransportModeCode?: Code;
  TransportMeansTypeCode?: Code;
  TransitDirectionCode?: Code;
  PreCarriageIndicator?: CopyIndicator;
  OnCarriageIndicator?: CopyIndicator;
  EstimatedDeliveryDate?: CopyIndicator;
  EstimatedDeliveryTime?: CopyIndicator;
  RequiredDeliveryDate?: CopyIndicator;
  RequiredDeliveryTime?: CopyIndicator;
  LoadingSequenceID?: CustomizationID;
  SuccessiveSequenceID?: CustomizationID;
  Instructions?: AccountingCost[];
  DemurrageInstructions?: AccountingCost[];
  CrewQuantity?: Quantity;
  PassengerQuantity?: Quantity;
  TransitPeriod?: AutoGeneratedForWildcard;
  CarrierParty?: AutoGeneratedForWildcard[];
  TransportMeans?: AutoGeneratedForWildcard;
  LoadingPortLocation?: AutoGeneratedForWildcard;
  UnloadingPortLocation?: AutoGeneratedForWildcard;
  TransshipPortLocation?: AutoGeneratedForWildcard;
  LoadingTransportEvent?: AutoGeneratedForWildcard;
  ExaminationTransportEvent?: AutoGeneratedForWildcard;
  AvailabilityTransportEvent?: AutoGeneratedForWildcard;
  ExportationTransportEvent?: AutoGeneratedForWildcard;
  DischargeTransportEvent?: AutoGeneratedForWildcard;
  WarehousingTransportEvent?: AutoGeneratedForWildcard;
  TakeoverTransportEvent?: AutoGeneratedForWildcard;
  OptionalTakeoverTransportEvent?: AutoGeneratedForWildcard;
  DropoffTransportEvent?: AutoGeneratedForWildcard;
  ActualPickupTransportEvent?: AutoGeneratedForWildcard;
  DeliveryTransportEvent?: AutoGeneratedForWildcard;
  ReceiptTransportEvent?: AutoGeneratedForWildcard;
  StorageTransportEvent?: AutoGeneratedForWildcard;
  AcceptanceTransportEvent?: AutoGeneratedForWildcard;
  TerminalOperatorParty?: AutoGeneratedForWildcard;
  CustomsAgentParty?: AutoGeneratedForWildcard;
  EstimatedTransitPeriod?: AutoGeneratedForWildcard;
  FreightAllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
  FreightChargeLocation?: AutoGeneratedForWildcard;
  DetentionTransportEvent?: AutoGeneratedForWildcard[];
  RequestedDepartureTransportEvent?: AutoGeneratedForWildcard;
  RequestedArrivalTransportEvent?: AutoGeneratedForWildcard;
  RequestedWaypointTransportEvent?: AutoGeneratedForWildcard[];
  PlannedDepartureTransportEvent?: AutoGeneratedForWildcard;
  PlannedArrivalTransportEvent?: AutoGeneratedForWildcard;
  PlannedWaypointTransportEvent?: AutoGeneratedForWildcard[];
  ActualDepartureTransportEvent?: AutoGeneratedForWildcard;
  ActualWaypointTransportEvent?: AutoGeneratedForWildcard;
  ActualArrivalTransportEvent?: AutoGeneratedForWildcard;
  TransportEvent?: AutoGeneratedForWildcard[];
  EstimatedDepartureTransportEvent?: AutoGeneratedForWildcard;
  EstimatedArrivalTransportEvent?: AutoGeneratedForWildcard;
  PassengerPerson?: AutoGeneratedForWildcard[];
  DriverPerson?: AutoGeneratedForWildcard[];
  ReportingPerson?: AutoGeneratedForWildcard;
  CrewMemberPerson?: AutoGeneratedForWildcard[];
  SecurityOfficerPerson?: AutoGeneratedForWildcard;
  MasterPerson?: AutoGeneratedForWildcard;
  ShipsSurgeonPerson?: AutoGeneratedForWildcard;
}

export interface PlannedDeliveryTransportEventElement {
  IdentificationID?: CustomizationID;
  OccurrenceDate?: CopyIndicator;
  OccurrenceTime?: CopyIndicator;
  TransportEventTypeCode?: Code;
  Description?: AccountingCost[];
  CompletionIndicator?: CopyIndicator;
  CurrentStatus?: AutoGeneratedForWildcard[];
  Contact?: AutoGeneratedForWildcard[];
  Location?: AutoGeneratedForWildcard;
  Signature?: PartyIdentification;
  Period?: AutoGeneratedForWildcard[];
}

export interface Status {
  ConditionCode?: Code;
  ReferenceDate?: CopyIndicator;
  ReferenceTime?: CopyIndicator;
  Description?: AccountingCost[];
  StatusReasonCode?: Code;
  StatusReason?: AccountingCost[];
  SequenceID?: CustomizationID;
  Text?: AccountingCost[];
  IndicationIndicator?: CopyIndicator;
  Percent?: LineCountNumeric;
  ReliabilityPercent?: LineCountNumeric;
  Condition?: FloorSpaceMeasurementDimension[];
}

export interface PurpleContract {
  ID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  NominationDate?: CopyIndicator;
  NominationTime?: CopyIndicator;
  ContractTypeCode?: Code;
  ContractType?: AccountingCost;
  Note?: AccountingCost[];
  VersionID?: CustomizationID;
  Description?: AccountingCost[];
  ValidityPeriod?: AutoGeneratedForWildcard;
  ContractDocumentReference?: PartyIdentification[];
  NominationPeriod?: AutoGeneratedForWildcard;
  ContractualDelivery?: AutoGeneratedForWildcard;
}

export interface PurpleTransportHandlingUnit {
  ID?: CustomizationID;
  TransportHandlingUnitTypeCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  TotalGoodsItemQuantity?: Quantity;
  TotalPackageQuantity?: Quantity;
  DamageRemarks?: AccountingCost[];
  ShippingMarks?: AccountingCost[];
  TraceID?: CustomizationID;
  HandlingUnitDespatchLine?: PurpleHandlingUnitDespatchLine[];
  ActualPackage?: AutoGeneratedForWildcard[];
  ReceivedHandlingUnitReceiptLine?: PartyIdentification[];
  TransportEquipment?: AutoGeneratedForWildcard[];
  TransportMeans?: AutoGeneratedForWildcard[];
  HazardousGoodsTransit?: AutoGeneratedForWildcard[];
  MeasurementDimension?: FloorSpaceMeasurementDimension[];
  MinimumTemperature?: ContainingTransportEquipmentMaximumTemperature;
  MaximumTemperature?: ContainingTransportEquipmentMaximumTemperature;
  GoodsItem?: AutoGeneratedForWildcard[];
  FloorSpaceMeasurementDimension?: FloorSpaceMeasurementDimension;
  PalletSpaceMeasurementDimension?: FloorSpaceMeasurementDimension;
  ShipmentDocumentReference?: PartyIdentification[];
  Status?: AutoGeneratedForWildcard[];
  CustomsDeclaration?: PartyIdentification[];
  Package?: AutoGeneratedForWildcard[];
}

export interface PurpleHandlingUnitDespatchLine {
  ID?: CustomizationID;
  OrderLineReference?: OrderLineReferenceElement[];
  Item?: AutoGeneratedForWildcard;
}

export interface OrderLineReferenceElement {
  LineID?: CustomizationID;
}

export interface ContainingTransportEquipmentMaximumTemperature {
  AttributeID?: CustomizationID;
  Measure?: Measure;
}

export interface PurpleGoodsItem {
  ID?: CustomizationID;
  SequenceNumberID?: CustomizationID;
  Description?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  DeclaredCustomsValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  InsuranceValueAmount?: Amount;
  ValueAmount?: Amount;
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  ChargeableWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  Quantity?: Quantity;
  PreferenceCriterionCode?: Code;
  RequiredCustomsID?: CustomizationID;
  CustomsStatusCode?: Code;
  CustomsTariffQuantity?: Quantity;
  CustomsImportClassifiedIndicator?: CopyIndicator;
  ChargeableQuantity?: Quantity;
  ReturnableQuantity?: Quantity;
  TraceID?: CustomizationID;
  Item?: InvoiceLineItem[];
  GoodsItemContainer?: PurpleGoodsItemContainer[];
  FreightAllowanceCharge?: FluffyAllowanceCharge[];
  InvoiceLine?: PurpleInvoiceLine[];
  Temperature?: PurpleTemperature[];
  OriginAddress?: LocationAddressElement;
  Pickup?: PackagePickup;
  Despatch?: PackageDespatch;
  MeasurementDimension?: Ion[];
  ContainingPackage?: ContainingPackageElement[];
  ShipmentDocumentReference?: IdentityDocumentReferenceElement;
  MinimumTemperature?: PurpleTemperature;
  MaximumTemperature?: PurpleTemperature;
}

export interface ContainingPackageElement {
  ID?: CustomizationID;
  Quantity?: Quantity;
  ReturnableMaterialIndicator?: CopyIndicator;
  PackageLevelCode?: Code;
  PackagingTypeCode?: Code;
  PackingMaterial?: AccountingCost[];
  TraceID?: CustomizationID;
  ContainingTransportEquipment?: AutoGeneratedForWildcard;
  MeasurementDimension?: FloorSpaceMeasurementDimension[];
  DeliveryUnit?: PurpleDeliveryUnit[];
  Pickup?: AutoGeneratedForWildcard;
  Despatch?: AutoGeneratedForWildcard;
  GoodsItem?: AutoGeneratedForWildcard[];
}

export interface PurpleDeliveryUnit {
  BatchQuantity?: Quantity;
}

export interface PackageDespatch {
  ID?: CustomizationID;
  RequestedDespatchDate?: CopyIndicator;
  RequestedDespatchTime?: CopyIndicator;
  EstimatedDespatchDate?: CopyIndicator;
  EstimatedDespatchTime?: CopyIndicator;
  ActualDespatchDate?: CopyIndicator;
  ActualDespatchTime?: CopyIndicator;
  GuaranteedDespatchDate?: CopyIndicator;
  GuaranteedDespatchTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  Instructions?: AccountingCost[];
  DespatchAddress?: AutoGeneratedForWildcard;
  DespatchLocation?: AutoGeneratedForWildcard;
  DespatchParty?: AutoGeneratedForWildcard;
  CarrierParty?: AutoGeneratedForWildcard;
  NotifyParty?: AutoGeneratedForWildcard[];
  Contact?: AutoGeneratedForWildcard;
  EstimatedDespatchPeriod?: AutoGeneratedForWildcard;
  RequestedDespatchPeriod?: AutoGeneratedForWildcard;
}

export interface PurpleGoodsItemContainer {
  ID?: CustomizationID;
  Quantity?: Quantity;
  TransportEquipment?: AutoGeneratedForWildcard[];
}

export interface PurpleInvoiceLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: AccountingCost[];
  InvoicedQuantity?: Quantity;
  LineExtensionAmount?: Amount;
  TaxPointDate?: CopyIndicator;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  PaymentPurposeCode?: Code;
  FreeOfChargeIndicator?: CopyIndicator;
  InvoicePeriod?: AutoGeneratedForWildcard[];
  OrderLineReference?: OrderLineReferenceElement[];
  DespatchLineReference?: OrderLineReferenceElement[];
  ReceiptLineReference?: OrderLineReferenceElement[];
  BillingReference?: AutoGeneratedForWildcard[];
  DocumentReference?: PartyIdentification[];
  PricingReference?: AutoGeneratedForWildcard;
  OriginatorParty?: AutoGeneratedForWildcard;
  PaymentTerms?: AutoGeneratedForWildcard[];
  AllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
  TaxTotal?: ServiceAllowanceChargeTaxTotal[];
  WithholdingTaxTotal?: ServiceAllowanceChargeTaxTotal[];
  Item?: AutoGeneratedForWildcard;
  Price?: Price;
  DeliveryTerms?: AutoGeneratedForWildcard;
  ItemPriceExtension?: PurpleItemPriceExtension;
}

export interface PurpleItemPriceExtension {
  Amount?: Amount;
}

export interface Price {
  AllowanceCharge: AllowanceCharge;
  PriceAmount: Amount;
}

export interface InvoiceLineItem {
  Description?: AccountingCost[];
  PackQuantity?: Quantity;
  PackSizeNumeric?: LineCountNumeric;
  CatalogueIndicator?: CopyIndicator;
  Name?: AccountingCost;
  HazardousRiskIndicator?: CopyIndicator;
  AdditionalInformation?: AccountingCost[];
  Keyword?: AccountingCost[];
  BrandName?: AccountingCost[];
  ModelName?: AccountingCost[];
  BuyersItemIdentification?: PartyIdentification;
  SellersItemIdentification?: PartyIdentification;
  ManufacturersItemIdentification?: PartyIdentification[];
  StandardItemIdentification?: PartyIdentification;
  CatalogueItemIdentification?: PartyIdentification;
  AdditionalItemIdentification?: PartyIdentification[];
  CatalogueDocumentReference?: PartyIdentification;
  ItemSpecificationDocumentReference?: PartyIdentification[];
  OriginCountry?: AutoGeneratedForWildcard;
  CommodityClassification?: AutoGeneratedForWildcard[];
  TransactionConditions?: AutoGeneratedForWildcard[];
  HazardousItem?: AutoGeneratedForWildcard[];
  ClassifiedTaxCategory?: PartyTaxScheme[];
  AdditionalItemProperty?: PartyName[];
  ManufacturerParty?: AutoGeneratedForWildcard[];
  InformationContentProviderParty?: AutoGeneratedForWildcard;
  OriginAddress?: AutoGeneratedForWildcard[];
  ItemInstance?: AutoGeneratedForWildcard[];
  Certificate?: PurpleCertificate[];
  Dimension?: FloorSpaceMeasurementDimension[];
}

export interface PurpleCertificate {
  ID?: CustomizationID;
  CertificateTypeCode?: Code;
  CertificateType?: AccountingCost;
  IssuerParty?: AutoGeneratedForWildcard;
}

export interface PurpleTemperature {
  AttributeID?: CustomizationID;
  Measure?: Measure;
  Description?: AccountingCost[];
}

export interface Ion {
  AttributeID?: CustomizationID;
  Measure?: Measure;
  Description?: AccountingCost[];
  MinimumMeasure?: Measure;
  MaximumMeasure?: Measure;
}

export interface PackagePickup {
  ID?: CustomizationID;
  ActualPickupDate?: CopyIndicator;
  ActualPickupTime?: CopyIndicator;
  EarliestPickupDate?: CopyIndicator;
  EarliestPickupTime?: CopyIndicator;
  LatestPickupDate?: CopyIndicator;
  LatestPickupTime?: CopyIndicator;
  PickupLocation?: AutoGeneratedForWildcard;
  PickupParty?: AutoGeneratedForWildcard;
}

export interface PurpleShipmentStage {
  ID?: CustomizationID;
  TransportModeCode?: Code;
  TransportMeansTypeCode?: Code;
  TransitDirectionCode?: Code;
  PreCarriageIndicator?: CopyIndicator;
  OnCarriageIndicator?: CopyIndicator;
  EstimatedDeliveryDate?: CopyIndicator;
  EstimatedDeliveryTime?: CopyIndicator;
  RequiredDeliveryDate?: CopyIndicator;
  RequiredDeliveryTime?: CopyIndicator;
  LoadingSequenceID?: CustomizationID;
  SuccessiveSequenceID?: CustomizationID;
  Instructions?: AccountingCost[];
  DemurrageInstructions?: AccountingCost[];
  CrewQuantity?: Quantity;
  PassengerQuantity?: Quantity;
  TransitPeriod?: Period;
  CarrierParty?: ResponsibleTransportServiceProviderPartyElement[];
  TransportMeans?: TransportMeans;
  LoadingPortLocation?: Location;
  UnloadingPortLocation?: Location;
  TransshipPortLocation?: Location;
  LoadingTransportEvent?: PlannedDeliveryTransportEventElement;
  ExaminationTransportEvent?: PlannedDeliveryTransportEventElement;
  AvailabilityTransportEvent?: PlannedDeliveryTransportEventElement;
  ExportationTransportEvent?: PlannedDeliveryTransportEventElement;
  DischargeTransportEvent?: PlannedDeliveryTransportEventElement;
  WarehousingTransportEvent?: PlannedDeliveryTransportEventElement;
  TakeoverTransportEvent?: PlannedDeliveryTransportEventElement;
  OptionalTakeoverTransportEvent?: PlannedDeliveryTransportEventElement;
  DropoffTransportEvent?: PlannedDeliveryTransportEventElement;
  ActualPickupTransportEvent?: PlannedDeliveryTransportEventElement;
  DeliveryTransportEvent?: PlannedDeliveryTransportEventElement;
  ReceiptTransportEvent?: PlannedDeliveryTransportEventElement;
  StorageTransportEvent?: PlannedDeliveryTransportEventElement;
  AcceptanceTransportEvent?: PlannedDeliveryTransportEventElement;
  TerminalOperatorParty?: ResponsibleTransportServiceProviderPartyElement;
  CustomsAgentParty?: ResponsibleTransportServiceProviderPartyElement;
  EstimatedTransitPeriod?: Period;
  FreightAllowanceCharge?: FluffyAllowanceCharge[];
  FreightChargeLocation?: Location;
  DetentionTransportEvent?: PlannedDeliveryTransportEventElement[];
  RequestedDepartureTransportEvent?: PlannedDeliveryTransportEventElement;
  RequestedArrivalTransportEvent?: PlannedDeliveryTransportEventElement;
  RequestedWaypointTransportEvent?: PlannedDeliveryTransportEventElement[];
  PlannedDepartureTransportEvent?: PlannedDeliveryTransportEventElement;
  PlannedArrivalTransportEvent?: PlannedDeliveryTransportEventElement;
  PlannedWaypointTransportEvent?: PlannedDeliveryTransportEventElement[];
  ActualDepartureTransportEvent?: PlannedDeliveryTransportEventElement;
  ActualWaypointTransportEvent?: PlannedDeliveryTransportEventElement;
  ActualArrivalTransportEvent?: PlannedDeliveryTransportEventElement;
  TransportEvent?: PlannedDeliveryTransportEventElement[];
  EstimatedDepartureTransportEvent?: PlannedDeliveryTransportEventElement;
  EstimatedArrivalTransportEvent?: PlannedDeliveryTransportEventElement;
  PassengerPerson?: ContactPartyPerson[];
  DriverPerson?: ContactPartyPerson[];
  ReportingPerson?: ContactPartyPerson;
  CrewMemberPerson?: ContactPartyPerson[];
  SecurityOfficerPerson?: ContactPartyPerson;
  MasterPerson?: ContactPartyPerson;
  ShipsSurgeonPerson?: ContactPartyPerson;
}

export interface TransportMeans {
  JourneyID?: CustomizationID;
  RegistrationNationalityID?: CustomizationID;
  RegistrationNationality?: AccountingCost[];
  DirectionCode?: Code;
  TransportMeansTypeCode?: Code;
  TradeServiceCode?: Code;
  Stowage?: AutoGeneratedForWildcard;
  AirTransport?: AirTransport;
  RoadTransport?: RoadTransport;
  RailTransport?: ApplicableTransportMeansRailTransport;
  MaritimeTransport?: AutoGeneratedForWildcard;
  OwnerParty?: AutoGeneratedForWildcard;
  MeasurementDimension?: FloorSpaceMeasurementDimension[];
}

export interface AirTransport {
  AircraftID?: CustomizationID;
}

export interface ApplicableTransportMeansRailTransport {
  TrainID?: CustomizationID;
}

export interface RoadTransport {
  LicensePlateID?: CustomizationID;
}

export interface FluffyTransportHandlingUnit {
  ID?: CustomizationID;
  TransportHandlingUnitTypeCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  TotalGoodsItemQuantity?: Quantity;
  TotalPackageQuantity?: Quantity;
  DamageRemarks?: AccountingCost[];
  ShippingMarks?: AccountingCost[];
  TraceID?: CustomizationID;
  HandlingUnitDespatchLine?: FluffyHandlingUnitDespatchLine[];
  ActualPackage?: ContainingPackageElement[];
  ReceivedHandlingUnitReceiptLine?: PurpleReceivedHandlingUnitReceiptLine[];
  TransportEquipment?: TransportEquipment[];
  TransportMeans?: TransportMeans[];
  HazardousGoodsTransit?: TransportEquipmentHazardousGoodsTransit[];
  MeasurementDimension?: Ion[];
  MinimumTemperature?: PurpleTemperature;
  MaximumTemperature?: PurpleTemperature;
  GoodsItem?: PackageGoodsItem[];
  FloorSpaceMeasurementDimension?: Ion;
  PalletSpaceMeasurementDimension?: Ion;
  ShipmentDocumentReference?: IdentityDocumentReferenceElement[];
  Status?: Status[];
  CustomsDeclaration?: PurpleCustomsDeclaration[];
  Package?: ContainingPackageElement[];
}

export interface PackageGoodsItem {
  ID?: CustomizationID;
  SequenceNumberID?: CustomizationID;
  Description?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  DeclaredCustomsValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  InsuranceValueAmount?: Amount;
  ValueAmount?: Amount;
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  ChargeableWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  Quantity?: Quantity;
  PreferenceCriterionCode?: Code;
  RequiredCustomsID?: CustomizationID;
  CustomsStatusCode?: Code;
  CustomsTariffQuantity?: Quantity;
  CustomsImportClassifiedIndicator?: CopyIndicator;
  ChargeableQuantity?: Quantity;
  ReturnableQuantity?: Quantity;
  TraceID?: CustomizationID;
  Item?: AutoGeneratedForWildcard[];
  GoodsItemContainer?: PartyIdentification[];
  FreightAllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
  InvoiceLine?: FluffyInvoiceLine[];
  Temperature?: ContainingTransportEquipmentMaximumTemperature[];
  OriginAddress?: AutoGeneratedForWildcard;
  Pickup?: AutoGeneratedForWildcard;
  Despatch?: AutoGeneratedForWildcard;
  MeasurementDimension?: FloorSpaceMeasurementDimension[];
  ContainingPackage?: AutoGeneratedForWildcard[];
  ShipmentDocumentReference?: PartyIdentification;
  MinimumTemperature?: ContainingTransportEquipmentMaximumTemperature;
  MaximumTemperature?: ContainingTransportEquipmentMaximumTemperature;
  Delivery?: AutoGeneratedForWildcard;
}

export interface FluffyInvoiceLine {
  ID?: CustomizationID;
  LineExtensionAmount?: Amount;
  Item?: AutoGeneratedForWildcard;
}

export interface FluffyHandlingUnitDespatchLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: AccountingCost[];
  LineStatusCode?: Code;
  DeliveredQuantity?: Quantity;
  BackorderQuantity?: Quantity;
  BackorderReason?: AccountingCost[];
  OutstandingQuantity?: Quantity;
  OutstandingReason?: AccountingCost[];
  OversupplyQuantity?: Quantity;
  OrderLineReference?: OrderLineReferenceElement[];
  DocumentReference?: PartyIdentification[];
  Item?: AutoGeneratedForWildcard;
}

export interface TransportEquipmentHazardousGoodsTransit {
  TransportEmergencyCardCode?: Code;
  PackingCriteriaCode?: Code;
  HazardousRegulationCode?: Code;
  InhalationToxicityZoneCode?: Code;
  TransportAuthorizationCode?: Code;
  MaximumTemperature?: ContainingTransportEquipmentMaximumTemperature;
  MinimumTemperature?: ContainingTransportEquipmentMaximumTemperature;
}

export interface PurpleReceivedHandlingUnitReceiptLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: AccountingCost[];
  ReceivedQuantity?: Quantity;
  ShortQuantity?: Quantity;
  ShortageActionCode?: Code;
  RejectedQuantity?: Quantity;
  RejectReasonCode?: Code;
  RejectReason?: AccountingCost[];
  RejectActionCode?: Code;
  QuantityDiscrepancyCode?: Code;
  OversupplyQuantity?: Quantity;
  ReceivedDate?: CopyIndicator;
  TimingComplaintCode?: Code;
  TimingComplaint?: AccountingCost;
  OrderLineReference?: OrderLineReferenceElement;
  DespatchLineReference?: OrderLineReferenceElement[];
  DocumentReference?: PartyIdentification[];
  Item?: AutoGeneratedForWildcard[];
}

export interface TransportEquipment {
  ID?: CustomizationID;
  ReferencedConsignmentID?: CustomizationID[];
  TransportEquipmentTypeCode?: Code;
  ProviderTypeCode?: Code;
  OwnerTypeCode?: Code;
  SizeTypeCode?: Code;
  DispositionCode?: Code;
  FullnessIndicationCode?: Code;
  RefrigerationOnIndicator?: CopyIndicator;
  Information?: AccountingCost[];
  ReturnabilityIndicator?: CopyIndicator;
  LegalStatusIndicator?: CopyIndicator;
  AirFlowPercent?: LineCountNumeric;
  HumidityPercent?: LineCountNumeric;
  AnimalFoodApprovedIndicator?: CopyIndicator;
  HumanFoodApprovedIndicator?: CopyIndicator;
  DangerousGoodsApprovedIndicator?: CopyIndicator;
  RefrigeratedIndicator?: CopyIndicator;
  Characteristics?: AccountingCost;
  DamageRemarks?: AccountingCost[];
  Description?: AccountingCost[];
  SpecialTransportRequirements?: AccountingCost[];
  GrossWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  TareWeightMeasure?: Measure;
  TrackingDeviceCode?: Code;
  PowerIndicator?: CopyIndicator;
  TraceID?: CustomizationID;
  MeasurementDimension?: FloorSpaceMeasurementDimension[];
  TransportEquipmentSeal?: PartyIdentification[];
  MinimumTemperature?: ContainingTransportEquipmentMaximumTemperature;
  MaximumTemperature?: ContainingTransportEquipmentMaximumTemperature;
  ProviderParty?: AutoGeneratedForWildcard;
  LoadingProofParty?: AutoGeneratedForWildcard;
  SupplierParty?: AutoGeneratedForWildcard;
  OwnerParty?: AutoGeneratedForWildcard;
  OperatingParty?: AutoGeneratedForWildcard;
  LoadingLocation?: AutoGeneratedForWildcard;
  UnloadingLocation?: AutoGeneratedForWildcard;
  StorageLocation?: AutoGeneratedForWildcard;
  PositioningTransportEvent?: AutoGeneratedForWildcard[];
  QuarantineTransportEvent?: AutoGeneratedForWildcard[];
  DeliveryTransportEvent?: AutoGeneratedForWildcard[];
  PickupTransportEvent?: AutoGeneratedForWildcard[];
  HandlingTransportEvent?: AutoGeneratedForWildcard[];
  LoadingTransportEvent?: AutoGeneratedForWildcard[];
  TransportEvent?: AutoGeneratedForWildcard[];
  ApplicableTransportMeans?: AutoGeneratedForWildcard;
  HaulageTradingTerms?: AutoGeneratedForWildcard[];
  HazardousGoodsTransit?: AutoGeneratedForWildcard[];
  ServiceAllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
  FreightAllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
  Pickup?: AutoGeneratedForWildcard;
  Despatch?: AutoGeneratedForWildcard;
  ShipmentDocumentReference?: PartyIdentification[];
  Package?: AutoGeneratedForWildcard[];
  GoodsItem?: AutoGeneratedForWildcard[];
  PackagedTransportHandlingUnit?: AutoGeneratedForWildcard[];
  Delivery?: AutoGeneratedForWildcard;
}

export interface CreditNoteLineDeliveryTerm {
  ID?: CustomizationID;
  SpecialTerms?: AccountingCost[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: AccountingCost[];
  Amount?: Amount;
  DeliveryLocation?: PartyPhysicalLocation;
  AllowanceCharge?: PurpleAllowanceCharge;
}

export interface CreditNoteLineDespatchLineReference {
  LineID?: CustomizationID;
  UUID?: CustomizationID;
  LineStatusCode?: Code;
  DocumentReference?: BillingReferenceCatalogueDocumentReference;
}

export interface DiscrepancyResponse {
  ReferenceID?: CustomizationID;
  ResponseCode?: Code;
  Description?: AccountingCost[];
  EffectiveDate?: CopyIndicator;
  EffectiveTime?: CopyIndicator;
  Status?: DiscrepancyResponseStatus[];
}

export interface DiscrepancyResponseStatus {
  ConditionCode?: Code;
  ReferenceDate?: CopyIndicator;
  ReferenceTime?: CopyIndicator;
  Description?: AccountingCost[];
  StatusReasonCode?: Code;
  StatusReason?: AccountingCost[];
  SequenceID?: CustomizationID;
  Text?: AccountingCost[];
  IndicationIndicator?: CopyIndicator;
  Percent?: LineCountNumeric;
  ReliabilityPercent?: LineCountNumeric;
  Condition?: Ion[];
}

export interface CreditNoteLineItem {
  Description?: AccountingCost[];
  PackQuantity?: Quantity;
  PackSizeNumeric?: LineCountNumeric;
  CatalogueIndicator?: CopyIndicator;
  Name?: AccountingCost;
  HazardousRiskIndicator?: CopyIndicator;
  AdditionalInformation?: AccountingCost[];
  Keyword?: AccountingCost[];
  BrandName?: AccountingCost[];
  ModelName?: AccountingCost[];
  BuyersItemIdentification?: PurpleItemIdentification;
  SellersItemIdentification?: PurpleItemIdentification;
  ManufacturersItemIdentification?: PurpleItemIdentification[];
  StandardItemIdentification?: PurpleItemIdentification;
  CatalogueItemIdentification?: PurpleItemIdentification;
  AdditionalItemIdentification?: PurpleItemIdentification[];
  CatalogueDocumentReference?: BillingReferenceCatalogueDocumentReference;
  ItemSpecificationDocumentReference?: BillingReferenceCatalogueDocumentReference[];
  OriginCountry?: Country;
  CommodityClassification?: CommodityClassification[];
  TransactionConditions?: PurpleTransactionCondition[];
  HazardousItem?: PurpleHazardousItem[];
  ClassifiedTaxCategory?: PurpleTaxCategory[];
  AdditionalItemProperty?: ItemInstanceAdditionalItemProperty[];
  ManufacturerParty?: DocumentReferenceIssuerParty[];
  InformationContentProviderParty?: DocumentReferenceIssuerParty;
  OriginAddress?: ApplicableTerritoryAddressElement[];
  ItemInstance?: PurpleItemInstance[];
  Certificate?: FluffyCertificate[];
  Dimension?: Ion[];
}

export interface PurpleItemIdentification {
  ID?: CustomizationID;
  ExtendedID?: CustomizationID;
  BarcodeSymbologyID?: CustomizationID;
  PhysicalAttribute?: PhysicalAttribute[];
  MeasurementDimension?: Ion[];
  IssuerParty?: ContactPartyElement;
}

export interface PhysicalAttribute {
  AttributeID?: CustomizationID;
  PositionCode?: Code;
  DescriptionCode?: Code;
  Description?: AccountingCost[];
}

export interface ItemInstanceAdditionalItemProperty {
  ID?: CustomizationID;
  Name?: AccountingCost;
  NameCode?: Code;
  TestMethod?: AccountingCost;
  Value?: AccountingCost;
  ValueQuantity?: Quantity;
  ValueQualifier?: AccountingCost[];
  ImportanceCode?: Code;
  ListValue?: AccountingCost[];
  UsabilityPeriod?: Period;
  ItemPropertyGroup?: ItemPropertyGroup[];
  RangeDimension?: Ion;
  ItemPropertyRange?: ItemPropertyRange;
}

export interface ItemPropertyGroup {
  ID?: CustomizationID;
  Name?: AccountingCost;
  ImportanceCode?: Code;
}

export interface ItemPropertyRange {
  MinimumValue?: AccountingCost;
  MaximumValue?: AccountingCost;
}

export interface FluffyCertificate {
  ID?: CustomizationID;
  CertificateTypeCode?: Code;
  CertificateType?: AccountingCost;
  Remarks?: AccountingCost[];
  IssuerParty?: ContactPartyElement;
  DocumentReference?: CertificateContractDocumentReference[];
  Signature?: CertificateSignature[];
}

export interface CertificateSignature {
  ID?: CustomizationID;
  Note?: AccountingCost[];
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidatorID?: CustomizationID;
  CanonicalizationMethod?: AccountingCost;
  SignatureMethod?: AccountingCost;
  SignatoryParty?: ResponsibleTransportServiceProviderPartyElement;
  DigitalSignatureAttachment?: ShipmentDocumentReferenceAttachment;
  OriginalDocumentReference?: IdentityDocumentReferenceElement;
}

export interface CommodityClassification {
  NatureCode?: Code;
  CargoTypeCode?: Code;
  CommodityCode?: Code;
  ItemClassificationCode?: Code;
}

export interface PurpleHazardousItem {
  ID?: CustomizationID;
  PlacardNotation?: AccountingCost;
  PlacardEndorsement?: AccountingCost;
  AdditionalInformation?: AccountingCost[];
  UNDGCode?: Code;
  EmergencyProceduresCode?: Code;
  MedicalFirstAidGuideCode?: Code;
  TechnicalName?: AccountingCost;
  CategoryName?: AccountingCost;
  HazardousCategoryCode?: Code;
  UpperOrangeHazardPlacardID?: CustomizationID;
  LowerOrangeHazardPlacardID?: CustomizationID;
  MarkingID?: CustomizationID;
  HazardClassID?: CustomizationID;
  NetWeightMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  Quantity?: Quantity;
  ContactParty?: ContactPartyElement;
  SecondaryHazard?: SecondaryHazard[];
  HazardousGoodsTransit?: HazardousItemHazardousGoodsTransit[];
  EmergencyTemperature?: PurpleTemperature;
  FlashpointTemperature?: PurpleTemperature;
  AdditionalTemperature?: PurpleTemperature[];
}

export interface HazardousItemHazardousGoodsTransit {
  TransportEmergencyCardCode?: Code;
  PackingCriteriaCode?: Code;
  HazardousRegulationCode?: Code;
  InhalationToxicityZoneCode?: Code;
  TransportAuthorizationCode?: Code;
  MaximumTemperature?: PurpleTemperature;
  MinimumTemperature?: PurpleTemperature;
}

export interface SecondaryHazard {
  ID?: CustomizationID;
  PlacardNotation?: AccountingCost;
  PlacardEndorsement?: AccountingCost;
  EmergencyProceduresCode?: Code;
  Extension?: AccountingCost[];
}

export interface PurpleItemInstance {
  ProductTraceID?: CustomizationID;
  ManufactureDate?: CopyIndicator;
  ManufactureTime?: CopyIndicator;
  BestBeforeDate?: CopyIndicator;
  RegistrationID?: CustomizationID;
  SerialID?: CustomizationID;
  AdditionalItemProperty?: ItemInstanceAdditionalItemProperty[];
  LotIdentification?: LotIdentification;
}

export interface LotIdentification {
  LotNumberID?: CustomizationID;
  ExpiryDate?: CopyIndicator;
  AdditionalItemProperty?: LotIdentificationAdditionalItemProperty[];
}

export interface LotIdentificationAdditionalItemProperty {
  ID?: CustomizationID;
  Name?: AccountingCost;
  NameCode?: Code;
  TestMethod?: AccountingCost;
  Value?: AccountingCost;
  ValueQuantity?: Quantity;
  ValueQualifier?: AccountingCost[];
  ImportanceCode?: Code;
  ListValue?: AccountingCost[];
  UsabilityPeriod?: AutoGeneratedForWildcard;
  ItemPropertyGroup?: PartyIdentification[];
  RangeDimension?: FloorSpaceMeasurementDimension;
  ItemPropertyRange?: AutoGeneratedForWildcard;
}

export interface PurpleTransactionCondition {
  ID?: CustomizationID;
  ActionCode?: Code;
  Description?: AccountingCost[];
  DocumentReference?: CertificateContractDocumentReference[];
}

export interface CreditNoteLineItemPriceExtension {
  Amount?: Amount;
  TaxTotal?: FluffyTaxTotal[];
}

export interface CreditNoteLineOrderLineReference {
  LineID?: CustomizationID;
  SalesOrderLineID?: CustomizationID;
  UUID?: CustomizationID;
  LineStatusCode?: Code;
  OrderReference?: OrderLineReferenceOrderReference;
}

export interface OrderLineReferenceOrderReference {
  ID?: CustomizationID;
  SalesOrderID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  CustomerReference?: AccountingCost;
  OrderTypeCode?: Code;
  DocumentReference?: CertificateContractDocumentReference;
}

export interface CreditNoteLinePaymentTerm {
  ID?: CustomizationID;
  PaymentMeansID?: CustomizationID[];
  PrepaidPaymentReferenceID?: CustomizationID;
  Note?: AccountingCost[];
  ReferenceEventCode?: Code;
  SettlementDiscountPercent?: LineCountNumeric;
  PenaltySurchargePercent?: LineCountNumeric;
  PaymentPercent?: LineCountNumeric;
  Amount?: Amount;
  SettlementDiscountAmount?: Amount;
  PenaltyAmount?: Amount;
  PaymentTermsDetailsURI?: CustomizationID;
  PaymentDueDate?: CopyIndicator;
  InstallmentDueDate?: CopyIndicator;
  InvoicingPartyReference?: AccountingCost;
  SettlementPeriod?: Period;
  PenaltyPeriod?: Period;
  ExchangeRate?: FluffyExchangeRate;
  ValidityPeriod?: Period;
}

export interface FluffyExchangeRate {
  SourceCurrencyCode?: Code;
  SourceCurrencyBaseRate?: LineCountNumeric;
  TargetCurrencyCode?: Code;
  TargetCurrencyBaseRate?: LineCountNumeric;
  ExchangeMarketID?: CustomizationID;
  CalculationRate?: LineCountNumeric;
  MathematicOperatorCode?: Code;
  Date?: CopyIndicator;
  ForeignExchangeContract?: ExchangeRateForeignExchangeContract;
}

export interface ExchangeRateForeignExchangeContract {
  ID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  NominationDate?: CopyIndicator;
  NominationTime?: CopyIndicator;
  ContractTypeCode?: Code;
  ContractType?: AccountingCost;
  Note?: AccountingCost[];
  VersionID?: CustomizationID;
  Description?: AccountingCost[];
  ValidityPeriod?: Period;
  ContractDocumentReference?: IdentityDocumentReferenceElement[];
  NominationPeriod?: Period;
  ContractualDelivery?: Delivery;
}

export interface Delivery {
  ID?: CustomizationID;
  Quantity?: Quantity;
  MinimumQuantity?: Quantity;
  MaximumQuantity?: Quantity;
  ActualDeliveryDate?: CopyIndicator;
  ActualDeliveryTime?: CopyIndicator;
  LatestDeliveryDate?: CopyIndicator;
  LatestDeliveryTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  TrackingID?: CustomizationID;
  DeliveryAddress?: AutoGeneratedForWildcard;
  DeliveryLocation?: AutoGeneratedForWildcard;
  AlternativeDeliveryLocation?: AutoGeneratedForWildcard;
  RequestedDeliveryPeriod?: AutoGeneratedForWildcard;
  PromisedDeliveryPeriod?: AutoGeneratedForWildcard;
  EstimatedDeliveryPeriod?: AutoGeneratedForWildcard;
  CarrierParty?: AutoGeneratedForWildcard;
  DeliveryParty?: AutoGeneratedForWildcard;
  NotifyParty?: AutoGeneratedForWildcard[];
  Despatch?: AutoGeneratedForWildcard;
  DeliveryTerms?: AutoGeneratedForWildcard[];
  MinimumDeliveryUnit?: PurpleDeliveryUnit;
  MaximumDeliveryUnit?: PurpleDeliveryUnit;
  Shipment?: PartyIdentification;
}

export interface CreditNoteLinePrice {
  PriceAmount?: Amount;
  BaseQuantity?: Quantity;
  PriceChangeReason?: AccountingCost[];
  PriceTypeCode?: Code;
  PriceType?: AccountingCost;
  OrderableUnitFactorRate?: LineCountNumeric;
  ValidityPeriod?: Period[];
  PriceList?: AlternativeConditionPricePriceList;
  AllowanceCharge?: PurpleAllowanceCharge[];
  PricingExchangeRate?: FluffyExchangeRate;
}

export interface AlternativeConditionPricePriceList {
  ID?: CustomizationID;
  StatusCode?: Code;
  ValidityPeriod?: Period[];
}

export interface CreditNoteLinePricingReference {
  OriginalItemLocationQuantity?: OriginalItemLocationQuantity;
  AlternativeConditionPrice?: AlternativeConditionPrice[];
}

export interface AlternativeConditionPrice {
  PriceAmount?: Amount;
  BaseQuantity?: Quantity;
  PriceChangeReason?: AccountingCost[];
  PriceTypeCode?: Code;
  PriceType?: AccountingCost;
  OrderableUnitFactorRate?: LineCountNumeric;
  ValidityPeriod?: Period[];
  PriceList?: AlternativeConditionPricePriceList;
  AllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  PricingExchangeRate?: PricingExchangeRate;
}

export interface PricingExchangeRate {
  SourceCurrencyCode?: Code;
  SourceCurrencyBaseRate?: LineCountNumeric;
  TargetCurrencyCode?: Code;
  TargetCurrencyBaseRate?: LineCountNumeric;
  ExchangeMarketID?: CustomizationID;
  CalculationRate?: LineCountNumeric;
  MathematicOperatorCode?: Code;
  Date?: CopyIndicator;
  ForeignExchangeContract?: PurpleContract;
}

export interface OriginalItemLocationQuantity {
  LeadTimeMeasure?: Measure;
  MinimumQuantity?: Quantity;
  MaximumQuantity?: Quantity;
  HazardousRiskIndicator?: CopyIndicator;
  TradingRestrictions?: AccountingCost[];
  ApplicableTerritoryAddress?: ApplicableTerritoryAddressElement[];
  Price?: OriginalItemLocationQuantityPrice;
  DeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit[];
  ApplicableTaxCategory?: ApplicableTaxCategoryElement[];
  Package?: Package;
  AllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  DependentPriceReference?: DependentPriceReference;
}

export interface DependentPriceReference {
  Percent?: LineCountNumeric;
  LocationAddress?: LocationAddressElement;
  DependentLineReference?: DependentLineReferenceElement;
}

export interface DependentLineReferenceElement {
  LineID?: CustomizationID;
  UUID?: CustomizationID;
  LineStatusCode?: Code;
  DocumentReference?: PartyIdentification;
}

export interface Package {
  ID?: CustomizationID;
  Quantity?: Quantity;
  ReturnableMaterialIndicator?: CopyIndicator;
  PackageLevelCode?: Code;
  PackagingTypeCode?: Code;
  PackingMaterial?: AccountingCost[];
  TraceID?: CustomizationID;
  ContainingTransportEquipment?: TransportEquipment;
  GoodsItem?: PackageGoodsItem[];
  MeasurementDimension?: Ion[];
  DeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit[];
  Delivery?: Delivery;
  Pickup?: PackagePickup;
  Despatch?: PackageDespatch;
}

export interface OriginalItemLocationQuantityPrice {
  PriceAmount?: Amount;
  BaseQuantity?: Quantity;
  PriceChangeReason?: AccountingCost[];
  PriceTypeCode?: Code;
  PriceType?: AccountingCost;
  OrderableUnitFactorRate?: LineCountNumeric;
  ValidityPeriod?: Period[];
  PriceList?: PurplePriceList;
  AllowanceCharge?: FluffyAllowanceCharge[];
  PricingExchangeRate?: TentacledExchangeRate;
}

export interface PurplePriceList {
  ID?: CustomizationID;
  StatusCode?: Code;
  ValidityPeriod?: AutoGeneratedForWildcard[];
}

export interface TentacledExchangeRate {
  SourceCurrencyCode?: Code;
  SourceCurrencyBaseRate?: LineCountNumeric;
  TargetCurrencyCode?: Code;
  TargetCurrencyBaseRate?: LineCountNumeric;
  ExchangeMarketID?: CustomizationID;
  CalculationRate?: LineCountNumeric;
  MathematicOperatorCode?: Code;
  Date?: CopyIndicator;
  ForeignExchangeContract?: AutoGeneratedForWildcard;
}

export interface PEFInvoiceDelivery {
  ID?: CustomizationID;
  Quantity?: Quantity;
  MinimumQuantity?: Quantity;
  MaximumQuantity?: Quantity;
  ActualDeliveryDate?: CopyIndicator;
  ActualDeliveryTime?: CopyIndicator;
  LatestDeliveryDate?: CopyIndicator;
  LatestDeliveryTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  TrackingID?: CustomizationID;
  DeliveryAddress?: ApplicableTerritoryAddressElement;
  DeliveryLocation?: PartyPhysicalLocation;
  AlternativeDeliveryLocation?: PartyPhysicalLocation;
  RequestedDeliveryPeriod?: Period;
  PromisedDeliveryPeriod?: Period;
  EstimatedDeliveryPeriod?: Period;
  CarrierParty?: Party;
  DeliveryParty?: Party;
  NotifyParty?: Party[];
  Despatch?: FluffyDespatch;
  DeliveryTerms?: CreditNoteLineDeliveryTerm[];
  MinimumDeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit;
  MaximumDeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit;
  Shipment?: FluffyShipment;
}

export interface FluffyDespatch {
  ID?: CustomizationID;
  RequestedDespatchDate?: CopyIndicator;
  RequestedDespatchTime?: CopyIndicator;
  EstimatedDespatchDate?: CopyIndicator;
  EstimatedDespatchTime?: CopyIndicator;
  ActualDespatchDate?: CopyIndicator;
  ActualDespatchTime?: CopyIndicator;
  GuaranteedDespatchDate?: CopyIndicator;
  GuaranteedDespatchTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  Instructions?: AccountingCost[];
  DespatchAddress?: ApplicableTerritoryAddressElement;
  DespatchLocation?: PartyPhysicalLocation;
  DespatchParty?: DocumentReferenceIssuerParty;
  CarrierParty?: DocumentReferenceIssuerParty;
  NotifyParty?: DocumentReferenceIssuerParty[];
  Contact?: Contact;
  EstimatedDespatchPeriod?: Period;
  RequestedDespatchPeriod?: Period;
}

export interface FluffyShipment {
  ID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  Information?: AccountingCost[];
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: AccountingCost[];
  DeliveryInstructions?: AccountingCost[];
  SplitConsignmentIndicator?: CopyIndicator;
  ConsignmentQuantity?: Quantity;
  Consignment?: FluffyConsignment[];
  GoodsItem?: FluffyGoodsItem[];
  ShipmentStage?: ShipmentStage[];
  TransportHandlingUnit?: TentacledTransportHandlingUnit[];
  ReturnAddress?: ApplicableTerritoryAddressElement;
  OriginAddress?: ApplicableTerritoryAddressElement;
  FirstArrivalPortLocation?: PartyPhysicalLocation;
  LastExitPortLocation?: PartyPhysicalLocation;
  ExportCountry?: Country;
  FreightAllowanceCharge?: PurpleAllowanceCharge[];
}

export interface FluffyConsignment {
  ID?: CustomizationID;
  CarrierAssignedID?: CustomizationID;
  ConsigneeAssignedID?: CustomizationID;
  ConsignorAssignedID?: CustomizationID;
  FreightForwarderAssignedID?: CustomizationID;
  BrokerAssignedID?: CustomizationID;
  ContractedCarrierAssignedID?: CustomizationID;
  PerformingCarrierAssignedID?: CustomizationID;
  SummaryDescription?: AccountingCost[];
  TotalInvoiceAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  TariffDescription?: AccountingCost[];
  TariffCode?: Code;
  InsurancePremiumAmount?: Amount;
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  ChargeableWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  LoadingLengthMeasure?: Measure;
  Remarks?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  AnimalFoodIndicator?: CopyIndicator;
  HumanFoodIndicator?: CopyIndicator;
  LivestockIndicator?: CopyIndicator;
  BulkCargoIndicator?: CopyIndicator;
  ContainerizedIndicator?: CopyIndicator;
  GeneralCargoIndicator?: CopyIndicator;
  SpecialSecurityIndicator?: CopyIndicator;
  ThirdPartyPayerIndicator?: CopyIndicator;
  CarrierServiceInstructions?: AccountingCost[];
  CustomsClearanceServiceInstructions?: AccountingCost[];
  ForwarderServiceInstructions?: AccountingCost[];
  SpecialServiceInstructions?: AccountingCost[];
  SequenceID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  Information?: AccountingCost[];
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: AccountingCost[];
  SplitConsignmentIndicator?: CopyIndicator;
  DeliveryInstructions?: AccountingCost[];
  ConsignmentQuantity?: Quantity;
  ConsolidatableIndicator?: CopyIndicator;
  HaulageInstructions?: AccountingCost[];
  LoadingSequenceID?: CustomizationID;
  ChildConsignmentQuantity?: Quantity;
  TotalPackagesQuantity?: Quantity;
  CustomsDeclaration?: FluffyCustomsDeclaration[];
  RequestedPickupTransportEvent?: PurpleTransportEvent;
  RequestedDeliveryTransportEvent?: PurpleTransportEvent;
  PlannedPickupTransportEvent?: PurpleTransportEvent;
  PlannedDeliveryTransportEvent?: PurpleTransportEvent;
  Status?: DiscrepancyResponseStatus[];
  ConsigneeParty?: ContactPartyElement;
  ExporterParty?: ContactPartyElement;
  ConsignorParty?: ContactPartyElement;
  ImporterParty?: ContactPartyElement;
  CarrierParty?: ContactPartyElement;
  FreightForwarderParty?: ContactPartyElement;
  NotifyParty?: ContactPartyElement;
  OriginalDespatchParty?: ContactPartyElement;
  FinalDeliveryParty?: ContactPartyElement;
  PerformingCarrierParty?: ContactPartyElement;
  SubstituteCarrierParty?: ContactPartyElement;
  LogisticsOperatorParty?: ContactPartyElement;
  TransportAdvisorParty?: ContactPartyElement;
  HazardousItemNotificationParty?: ContactPartyElement;
  InsuranceParty?: ContactPartyElement;
  MortgageHolderParty?: ContactPartyElement;
  BillOfLadingHolderParty?: ContactPartyElement;
  OriginalDepartureCountry?: Country;
  FinalDestinationCountry?: Country;
  TransitCountry?: Country[];
  TransportContract?: ExchangeRateForeignExchangeContract;
  TransportEvent?: PurpleTransportEvent[];
  OriginalDespatchTransportationService?: FluffyTransportationService;
  FinalDeliveryTransportationService?: FluffyTransportationService;
  DeliveryTerms?: FluffyDeliveryTerm;
  PaymentTerms?: PaymentTerms;
  CollectPaymentTerms?: PaymentTerms;
  DisbursementPaymentTerms?: PaymentTerms;
  PrepaidPaymentTerms?: PaymentTerms;
  FreightAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  ExtraAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  MainCarriageShipmentStage?: PurpleShipmentStage[];
  PreCarriageShipmentStage?: PurpleShipmentStage[];
  OnCarriageShipmentStage?: PurpleShipmentStage[];
  TransportHandlingUnit?: FluffyTransportHandlingUnit[];
  FirstArrivalPortLocation?: SignatoryPartyFreightChargeLocation;
  LastExitPortLocation?: SignatoryPartyFreightChargeLocation;
}

export interface PaymentTerms {
  ID?: CustomizationID;
  PaymentMeansID?: CustomizationID[];
  PrepaidPaymentReferenceID?: CustomizationID;
  Note?: AccountingCost[];
  ReferenceEventCode?: Code;
  SettlementDiscountPercent?: LineCountNumeric;
  PenaltySurchargePercent?: LineCountNumeric;
  PaymentPercent?: LineCountNumeric;
  Amount?: Amount;
  SettlementDiscountAmount?: Amount;
  PenaltyAmount?: Amount;
  PaymentTermsDetailsURI?: CustomizationID;
  PaymentDueDate?: CopyIndicator;
  InstallmentDueDate?: CopyIndicator;
  InvoicingPartyReference?: AccountingCost;
  SettlementPeriod?: Period;
  PenaltyPeriod?: Period;
  ExchangeRate?: TentacledExchangeRate;
  ValidityPeriod?: Period;
}

export interface FluffyCustomsDeclaration {
  ID?: CustomizationID;
  IssuerParty?: ResponsibleTransportServiceProviderPartyElement;
}

export interface FluffyDeliveryTerm {
  ID?: CustomizationID;
  SpecialTerms?: AccountingCost[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: AccountingCost[];
  Amount?: Amount;
  DeliveryLocation?: Location;
  AllowanceCharge?: FluffyAllowanceCharge;
}

export interface FluffyTransportationService {
  TransportServiceCode?: Code;
  TariffClassCode?: Code;
  Priority?: AccountingCost;
  FreightRateClassCode?: Code;
  TransportationServiceDescription?: AccountingCost[];
  TransportationServiceDetailsURI?: CustomizationID;
  NominationDate?: CopyIndicator;
  NominationTime?: CopyIndicator;
  Name?: AccountingCost;
  SequenceNumeric?: LineCountNumeric;
  TransportEquipment?: TransportEquipment[];
  SupportedTransportEquipment?: TransportEquipment[];
  UnsupportedTransportEquipment?: TransportEquipment[];
  CommodityClassification?: CommodityClassification[];
  SupportedCommodityClassification?: CommodityClassification[];
  UnsupportedCommodityClassification?: CommodityClassification[];
  TotalCapacityDimension?: Ion;
  ShipmentStage?: FinalDeliveryTransportationServiceShipmentStage[];
  TransportEvent?: PlannedDeliveryTransportEventElement[];
  ResponsibleTransportServiceProviderParty?: ResponsibleTransportServiceProviderPartyElement;
  EnvironmentalEmission?: FluffyEnvironmentalEmission[];
  EstimatedDurationPeriod?: Period;
  ScheduledServiceFrequency?: ScheduledServiceFrequency[];
}

export interface FluffyEnvironmentalEmission {
  EnvironmentalEmissionTypeCode?: Code;
  ValueMeasure?: Measure;
  Description?: AccountingCost[];
  EmissionCalculationMethod?: AutoGeneratedForWildcard[];
}

export interface PurpleTransportEvent {
  IdentificationID?: CustomizationID;
  OccurrenceDate?: CopyIndicator;
  OccurrenceTime?: CopyIndicator;
  TransportEventTypeCode?: Code;
  Description?: AccountingCost[];
  CompletionIndicator?: CopyIndicator;
  CurrentStatus?: Status[];
  Contact?: ContactElement[];
  Location?: Location;
  Signature?: PlannedDeliveryTransportEventSignature;
  Period?: Period[];
}

export interface PlannedDeliveryTransportEventSignature {
  ID?: CustomizationID;
  Note?: AccountingCost[];
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidatorID?: CustomizationID;
  CanonicalizationMethod?: AccountingCost;
  SignatureMethod?: AccountingCost;
  SignatoryParty?: AutoGeneratedForWildcard;
  DigitalSignatureAttachment?: AutoGeneratedForWildcard;
  OriginalDocumentReference?: PartyIdentification;
}

export interface FluffyGoodsItem {
  ID?: CustomizationID;
  SequenceNumberID?: CustomizationID;
  Description?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  DeclaredCustomsValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  InsuranceValueAmount?: Amount;
  ValueAmount?: Amount;
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  ChargeableWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  Quantity?: Quantity;
  PreferenceCriterionCode?: Code;
  RequiredCustomsID?: CustomizationID;
  CustomsStatusCode?: Code;
  CustomsTariffQuantity?: Quantity;
  CustomsImportClassifiedIndicator?: CopyIndicator;
  ChargeableQuantity?: Quantity;
  ReturnableQuantity?: Quantity;
  TraceID?: CustomizationID;
  Item?: PurpleItem[];
  GoodsItemContainer?: FluffyGoodsItemContainer[];
  FreightAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  InvoiceLine?: TentacledInvoiceLine[];
  Temperature?: PurpleTemperature[];
  OriginAddress?: ApplicableTerritoryAddressElement;
  Pickup?: PurplePickup;
  Despatch?: TentacledDespatch;
  MeasurementDimension?: Ion[];
  ContainingPackage?: ContainingPackage[];
  ShipmentDocumentReference?: CertificateContractDocumentReference;
  MinimumTemperature?: PurpleTemperature;
  MaximumTemperature?: PurpleTemperature;
}

export interface ContainingPackage {
  ID?: CustomizationID;
  Quantity?: Quantity;
  ReturnableMaterialIndicator?: CopyIndicator;
  PackageLevelCode?: Code;
  PackagingTypeCode?: Code;
  PackingMaterial?: AccountingCost[];
  TraceID?: CustomizationID;
  ContainingTransportEquipment?: TransportEquipment;
  MeasurementDimension?: Ion[];
  DeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit[];
  Pickup?: PackagePickup;
  Despatch?: PackageDespatch;
}

export interface TentacledDespatch {
  ID?: CustomizationID;
  RequestedDespatchDate?: CopyIndicator;
  RequestedDespatchTime?: CopyIndicator;
  EstimatedDespatchDate?: CopyIndicator;
  EstimatedDespatchTime?: CopyIndicator;
  ActualDespatchDate?: CopyIndicator;
  ActualDespatchTime?: CopyIndicator;
  GuaranteedDespatchDate?: CopyIndicator;
  GuaranteedDespatchTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  Instructions?: AccountingCost[];
  DespatchAddress?: LocationAddressElement;
  DespatchLocation?: Location;
  DespatchParty?: ResponsibleTransportServiceProviderPartyElement;
  CarrierParty?: ResponsibleTransportServiceProviderPartyElement;
  NotifyParty?: ResponsibleTransportServiceProviderPartyElement[];
  Contact?: ContactElement;
  EstimatedDespatchPeriod?: Period;
  RequestedDespatchPeriod?: Period;
}

export interface FluffyGoodsItemContainer {
  ID?: CustomizationID;
  Quantity?: Quantity;
  TransportEquipment?: TransportEquipment[];
}

export interface TentacledInvoiceLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: AccountingCost[];
  InvoicedQuantity?: Quantity;
  LineExtensionAmount?: Amount;
  TaxPointDate?: CopyIndicator;
  AccountingCostCode?: Code;
  AccountingCost?: AccountingCost;
  PaymentPurposeCode?: Code;
  FreeOfChargeIndicator?: CopyIndicator;
  InvoicePeriod?: Period[];
  OrderLineReference?: InvoiceLineOrderLineReference[];
  DespatchLineReference?: DependentLineReferenceElement[];
  ReceiptLineReference?: DependentLineReferenceElement[];
  BillingReference?: InvoiceLineBillingReference[];
  DocumentReference?: IdentityDocumentReferenceElement[];
  PricingReference?: InvoiceLinePricingReference;
  OriginatorParty?: ResponsibleTransportServiceProviderPartyElement;
  PaymentTerms?: CollectPaymentTerms[];
  AllowanceCharge?: FluffyAllowanceCharge[];
  TaxTotal?: TentacledTaxTotal[];
  WithholdingTaxTotal?: TentacledTaxTotal[];
  Item?: InvoiceLineItem;
  Price?: PurplePrice;
  DeliveryTerms?: InvoiceLineDeliveryTerm;
  ItemPriceExtension?: FluffyItemPriceExtension;
}

export interface InvoiceLineBillingReference {
  InvoiceDocumentReference?: PartyIdentification;
  SelfBilledInvoiceDocumentReference?: PartyIdentification;
  CreditNoteDocumentReference?: PartyIdentification;
  SelfBilledCreditNoteDocumentReference?: PartyIdentification;
  DebitNoteDocumentReference?: PartyIdentification;
  ReminderDocumentReference?: PartyIdentification;
  AdditionalDocumentReference?: PartyIdentification;
  BillingReferenceLine?: PartyIdentification[];
}

export interface FluffyItemPriceExtension {
  Amount?: Amount;
  TaxTotal?: ServiceAllowanceChargeTaxTotal[];
}

export interface InvoiceLineOrderLineReference {
  LineID?: CustomizationID;
  SalesOrderLineID?: CustomizationID;
  UUID?: CustomizationID;
  LineStatusCode?: Code;
  OrderReference?: PartyIdentification;
}

export interface PurplePrice {
  PriceAmount?: Amount;
  BaseQuantity?: Quantity;
  PriceChangeReason?: AccountingCost[];
  PriceTypeCode?: Code;
  PriceType?: AccountingCost;
  OrderableUnitFactorRate?: LineCountNumeric;
  ValidityPeriod?: AutoGeneratedForWildcard[];
  PriceList?: AutoGeneratedForWildcard;
  AllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
  PricingExchangeRate?: PurpleExchangeRate;
}

export interface InvoiceLinePricingReference {
  OriginalItemLocationQuantity?: AutoGeneratedForWildcard;
  AlternativeConditionPrice?: Price[];
}

export interface PurpleItem {
  Description?: AccountingCost[];
  PackQuantity?: Quantity;
  PackSizeNumeric?: LineCountNumeric;
  CatalogueIndicator?: CopyIndicator;
  Name?: AccountingCost;
  HazardousRiskIndicator?: CopyIndicator;
  AdditionalInformation?: AccountingCost[];
  Keyword?: AccountingCost[];
  BrandName?: AccountingCost[];
  ModelName?: AccountingCost[];
  BuyersItemIdentification?: FluffyItemIdentification;
  SellersItemIdentification?: FluffyItemIdentification;
  ManufacturersItemIdentification?: FluffyItemIdentification[];
  StandardItemIdentification?: FluffyItemIdentification;
  CatalogueItemIdentification?: FluffyItemIdentification;
  AdditionalItemIdentification?: FluffyItemIdentification[];
  CatalogueDocumentReference?: IdentityDocumentReferenceElement;
  ItemSpecificationDocumentReference?: IdentityDocumentReferenceElement[];
  OriginCountry?: Country;
  CommodityClassification?: CommodityClassification[];
  TransactionConditions?: FluffyTransactionCondition[];
  HazardousItem?: FluffyHazardousItem[];
  ClassifiedTaxCategory?: ExtraAllowanceChargeTaxCategory[];
  AdditionalItemProperty?: LotIdentificationAdditionalItemProperty[];
  ManufacturerParty?: ResponsibleTransportServiceProviderPartyElement[];
  InformationContentProviderParty?: ResponsibleTransportServiceProviderPartyElement;
  OriginAddress?: LocationAddressElement[];
  ItemInstance?: FluffyItemInstance[];
  Certificate?: TentacledCertificate[];
  Dimension?: Ion[];
}

export interface FluffyItemIdentification {
  ID?: CustomizationID;
  ExtendedID?: CustomizationID;
  BarcodeSymbologyID?: CustomizationID;
  PhysicalAttribute?: FloorSpaceMeasurementDimension[];
  MeasurementDimension?: FloorSpaceMeasurementDimension[];
  IssuerParty?: AutoGeneratedForWildcard;
}

export interface TentacledCertificate {
  ID?: CustomizationID;
  CertificateTypeCode?: Code;
  CertificateType?: AccountingCost;
  Remarks?: AccountingCost[];
  IssuerParty?: AutoGeneratedForWildcard;
  DocumentReference?: PartyIdentification[];
  Signature?: PartyIdentification[];
}

export interface FluffyHazardousItem {
  ID?: CustomizationID;
  PlacardNotation?: AccountingCost;
  PlacardEndorsement?: AccountingCost;
  AdditionalInformation?: AccountingCost[];
  UNDGCode?: Code;
  EmergencyProceduresCode?: Code;
  MedicalFirstAidGuideCode?: Code;
  TechnicalName?: AccountingCost;
  CategoryName?: AccountingCost;
  HazardousCategoryCode?: Code;
  UpperOrangeHazardPlacardID?: CustomizationID;
  LowerOrangeHazardPlacardID?: CustomizationID;
  MarkingID?: CustomizationID;
  HazardClassID?: CustomizationID;
  NetWeightMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  Quantity?: Quantity;
  ContactParty?: AutoGeneratedForWildcard;
  SecondaryHazard?: AutoGeneratedForWildcard[];
  HazardousGoodsTransit?: AutoGeneratedForWildcard[];
  EmergencyTemperature?: ContainingTransportEquipmentMaximumTemperature;
  FlashpointTemperature?: ContainingTransportEquipmentMaximumTemperature;
  AdditionalTemperature?: ContainingTransportEquipmentMaximumTemperature[];
}

export interface FluffyItemInstance {
  ProductTraceID?: CustomizationID;
  ManufactureDate?: CopyIndicator;
  ManufactureTime?: CopyIndicator;
  BestBeforeDate?: CopyIndicator;
  RegistrationID?: CustomizationID;
  SerialID?: CustomizationID;
  AdditionalItemProperty?: PartyName[];
  LotIdentification?: AutoGeneratedForWildcard;
}

export interface FluffyTransactionCondition {
  ID?: CustomizationID;
  ActionCode?: Code;
  Description?: AccountingCost[];
  DocumentReference?: PartyIdentification[];
}

export interface PurplePickup {
  ID?: CustomizationID;
  ActualPickupDate?: CopyIndicator;
  ActualPickupTime?: CopyIndicator;
  EarliestPickupDate?: CopyIndicator;
  EarliestPickupTime?: CopyIndicator;
  LatestPickupDate?: CopyIndicator;
  LatestPickupTime?: CopyIndicator;
  PickupLocation?: Location;
  PickupParty?: ResponsibleTransportServiceProviderPartyElement;
}

export interface ShipmentStage {
  ID?: CustomizationID;
  TransportModeCode?: Code;
  TransportMeansTypeCode?: Code;
  TransitDirectionCode?: Code;
  PreCarriageIndicator?: CopyIndicator;
  OnCarriageIndicator?: CopyIndicator;
  EstimatedDeliveryDate?: CopyIndicator;
  EstimatedDeliveryTime?: CopyIndicator;
  RequiredDeliveryDate?: CopyIndicator;
  RequiredDeliveryTime?: CopyIndicator;
  LoadingSequenceID?: CustomizationID;
  SuccessiveSequenceID?: CustomizationID;
  Instructions?: AccountingCost[];
  DemurrageInstructions?: AccountingCost[];
  CrewQuantity?: Quantity;
  PassengerQuantity?: Quantity;
  TransitPeriod?: Period;
  CarrierParty?: ContactPartyElement[];
  TransportMeans?: TransportMean;
  LoadingPortLocation?: SignatoryPartyFreightChargeLocation;
  UnloadingPortLocation?: SignatoryPartyFreightChargeLocation;
  TransshipPortLocation?: SignatoryPartyFreightChargeLocation;
  LoadingTransportEvent?: PurpleTransportEvent;
  ExaminationTransportEvent?: PurpleTransportEvent;
  AvailabilityTransportEvent?: PurpleTransportEvent;
  ExportationTransportEvent?: PurpleTransportEvent;
  DischargeTransportEvent?: PurpleTransportEvent;
  WarehousingTransportEvent?: PurpleTransportEvent;
  TakeoverTransportEvent?: PurpleTransportEvent;
  OptionalTakeoverTransportEvent?: PurpleTransportEvent;
  DropoffTransportEvent?: PurpleTransportEvent;
  ActualPickupTransportEvent?: PurpleTransportEvent;
  DeliveryTransportEvent?: PurpleTransportEvent;
  ReceiptTransportEvent?: PurpleTransportEvent;
  StorageTransportEvent?: PurpleTransportEvent;
  AcceptanceTransportEvent?: PurpleTransportEvent;
  TerminalOperatorParty?: ContactPartyElement;
  CustomsAgentParty?: ContactPartyElement;
  EstimatedTransitPeriod?: Period;
  FreightAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  FreightChargeLocation?: SignatoryPartyFreightChargeLocation;
  DetentionTransportEvent?: PurpleTransportEvent[];
  RequestedDepartureTransportEvent?: PurpleTransportEvent;
  RequestedArrivalTransportEvent?: PurpleTransportEvent;
  RequestedWaypointTransportEvent?: PurpleTransportEvent[];
  PlannedDepartureTransportEvent?: PurpleTransportEvent;
  PlannedArrivalTransportEvent?: PurpleTransportEvent;
  PlannedWaypointTransportEvent?: PurpleTransportEvent[];
  ActualDepartureTransportEvent?: PurpleTransportEvent;
  ActualWaypointTransportEvent?: PurpleTransportEvent;
  ActualArrivalTransportEvent?: PurpleTransportEvent;
  TransportEvent?: PurpleTransportEvent[];
  EstimatedDepartureTransportEvent?: PurpleTransportEvent;
  EstimatedArrivalTransportEvent?: PurpleTransportEvent;
  PassengerPerson?: InformationContentProviderPartyPerson[];
  DriverPerson?: InformationContentProviderPartyPerson[];
  ReportingPerson?: InformationContentProviderPartyPerson;
  CrewMemberPerson?: InformationContentProviderPartyPerson[];
  SecurityOfficerPerson?: InformationContentProviderPartyPerson;
  MasterPerson?: InformationContentProviderPartyPerson;
  ShipsSurgeonPerson?: InformationContentProviderPartyPerson;
}

export interface TransportMean {
  JourneyID?: CustomizationID;
  RegistrationNationalityID?: CustomizationID;
  RegistrationNationality?: AccountingCost[];
  DirectionCode?: Code;
  TransportMeansTypeCode?: Code;
  TradeServiceCode?: Code;
  Stowage?: Stowage;
  AirTransport?: AirTransport;
  RoadTransport?: RoadTransport;
  RailTransport?: PurpleRailTransport;
  MaritimeTransport?: MaritimeTransport;
  OwnerParty?: ResponsibleTransportServiceProviderPartyElement;
  MeasurementDimension?: Ion[];
}

export interface MaritimeTransport {
  VesselID?: CustomizationID;
  VesselName?: AccountingCost;
  RadioCallSignID?: CustomizationID;
  ShipsRequirements?: AccountingCost[];
  GrossTonnageMeasure?: Measure;
  NetTonnageMeasure?: Measure;
  RegistryCertificateDocumentReference?: PartyIdentification;
  RegistryPortLocation?: AutoGeneratedForWildcard;
}

export interface PurpleRailTransport {
  TrainID?: CustomizationID;
  RailCarID?: CustomizationID;
}

export interface Stowage {
  LocationID?: CustomizationID;
  Location?: AccountingCost[];
  MeasurementDimension?: FloorSpaceMeasurementDimension[];
}

export interface TentacledTransportHandlingUnit {
  ID?: CustomizationID;
  TransportHandlingUnitTypeCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  TotalGoodsItemQuantity?: Quantity;
  TotalPackageQuantity?: Quantity;
  DamageRemarks?: AccountingCost[];
  ShippingMarks?: AccountingCost[];
  TraceID?: CustomizationID;
  HandlingUnitDespatchLine?: TentacledHandlingUnitDespatchLine[];
  ActualPackage?: PurplePackage[];
  ReceivedHandlingUnitReceiptLine?: FluffyReceivedHandlingUnitReceiptLine[];
  TransportEquipment?: PurpleTransportEquipment[];
  TransportMeans?: TransportMean[];
  HazardousGoodsTransit?: HazardousItemHazardousGoodsTransit[];
  MeasurementDimension?: Ion[];
  MinimumTemperature?: PurpleTemperature;
  MaximumTemperature?: PurpleTemperature;
  GoodsItem?: PurpleGoodsItem[];
  FloorSpaceMeasurementDimension?: Ion;
  PalletSpaceMeasurementDimension?: Ion;
  ShipmentDocumentReference?: CertificateContractDocumentReference[];
  Status?: DiscrepancyResponseStatus[];
  CustomsDeclaration?: FluffyCustomsDeclaration[];
  Package?: PurplePackage[];
}

export interface PurplePackage {
  ID?: CustomizationID;
  Quantity?: Quantity;
  ReturnableMaterialIndicator?: CopyIndicator;
  PackageLevelCode?: Code;
  PackagingTypeCode?: Code;
  PackingMaterial?: AccountingCost[];
  TraceID?: CustomizationID;
  ContainingTransportEquipment?: TransportEquipment;
  GoodsItem?: PackageGoodsItem[];
  MeasurementDimension?: Ion[];
  DeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit[];
  Pickup?: PackagePickup;
  Despatch?: PackageDespatch;
}

export interface TentacledHandlingUnitDespatchLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: AccountingCost[];
  LineStatusCode?: Code;
  DeliveredQuantity?: Quantity;
  BackorderQuantity?: Quantity;
  BackorderReason?: AccountingCost[];
  OutstandingQuantity?: Quantity;
  OutstandingReason?: AccountingCost[];
  OversupplyQuantity?: Quantity;
  OrderLineReference?: InvoiceLineOrderLineReference[];
  DocumentReference?: IdentityDocumentReferenceElement[];
  Item?: InvoiceLineItem;
}

export interface FluffyReceivedHandlingUnitReceiptLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: AccountingCost[];
  ReceivedQuantity?: Quantity;
  ShortQuantity?: Quantity;
  ShortageActionCode?: Code;
  RejectedQuantity?: Quantity;
  RejectReasonCode?: Code;
  RejectReason?: AccountingCost[];
  RejectActionCode?: Code;
  QuantityDiscrepancyCode?: Code;
  OversupplyQuantity?: Quantity;
  ReceivedDate?: CopyIndicator;
  TimingComplaintCode?: Code;
  TimingComplaint?: AccountingCost;
  OrderLineReference?: InvoiceLineOrderLineReference;
  DespatchLineReference?: DependentLineReferenceElement[];
  DocumentReference?: IdentityDocumentReferenceElement[];
  Item?: InvoiceLineItem[];
}

export interface PurpleTransportEquipment {
  ID?: CustomizationID;
  ReferencedConsignmentID?: CustomizationID[];
  TransportEquipmentTypeCode?: Code;
  ProviderTypeCode?: Code;
  OwnerTypeCode?: Code;
  SizeTypeCode?: Code;
  DispositionCode?: Code;
  FullnessIndicationCode?: Code;
  RefrigerationOnIndicator?: CopyIndicator;
  Information?: AccountingCost[];
  ReturnabilityIndicator?: CopyIndicator;
  LegalStatusIndicator?: CopyIndicator;
  AirFlowPercent?: LineCountNumeric;
  HumidityPercent?: LineCountNumeric;
  AnimalFoodApprovedIndicator?: CopyIndicator;
  HumanFoodApprovedIndicator?: CopyIndicator;
  DangerousGoodsApprovedIndicator?: CopyIndicator;
  RefrigeratedIndicator?: CopyIndicator;
  Characteristics?: AccountingCost;
  DamageRemarks?: AccountingCost[];
  Description?: AccountingCost[];
  SpecialTransportRequirements?: AccountingCost[];
  GrossWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  TareWeightMeasure?: Measure;
  TrackingDeviceCode?: Code;
  PowerIndicator?: CopyIndicator;
  TraceID?: CustomizationID;
  MeasurementDimension?: Ion[];
  TransportEquipmentSeal?: TransportEquipmentSeal[];
  MinimumTemperature?: PurpleTemperature;
  MaximumTemperature?: PurpleTemperature;
  ProviderParty?: ResponsibleTransportServiceProviderPartyElement;
  LoadingProofParty?: ResponsibleTransportServiceProviderPartyElement;
  SupplierParty?: SupplierPartyClass;
  OwnerParty?: ResponsibleTransportServiceProviderPartyElement;
  OperatingParty?: ResponsibleTransportServiceProviderPartyElement;
  LoadingLocation?: Location;
  UnloadingLocation?: Location;
  StorageLocation?: Location;
  PositioningTransportEvent?: PlannedDeliveryTransportEventElement[];
  QuarantineTransportEvent?: PlannedDeliveryTransportEventElement[];
  DeliveryTransportEvent?: PlannedDeliveryTransportEventElement[];
  PickupTransportEvent?: PlannedDeliveryTransportEventElement[];
  HandlingTransportEvent?: PlannedDeliveryTransportEventElement[];
  LoadingTransportEvent?: PlannedDeliveryTransportEventElement[];
  TransportEvent?: PlannedDeliveryTransportEventElement[];
  ApplicableTransportMeans?: TransportMeans;
  HaulageTradingTerms?: HaulageTradingTerm[];
  HazardousGoodsTransit?: TransportEquipmentHazardousGoodsTransit[];
  ServiceAllowanceCharge?: FluffyAllowanceCharge[];
  FreightAllowanceCharge?: FluffyAllowanceCharge[];
  Pickup?: PackagePickup;
  Despatch?: PackageDespatch;
  ShipmentDocumentReference?: IdentityDocumentReferenceElement[];
  Package?: ContainingPackageElement[];
  GoodsItem?: PackageGoodsItem[];
}

export interface HaulageTradingTerm {
  Information?: AccountingCost[];
  Reference?: AccountingCost;
  ApplicableAddress?: AutoGeneratedForWildcard;
}

export interface SupplierPartyClass {
  CustomerAssignedAccountID?: CustomizationID;
  AdditionalAccountID?: CustomizationID[];
  DataSendingCapability?: AccountingCost;
  Party?: AutoGeneratedForWildcard;
  DespatchContact?: AutoGeneratedForWildcard;
  AccountingContact?: AutoGeneratedForWildcard;
  SellerContact?: AutoGeneratedForWildcard;
}

export interface TransportEquipmentSeal {
  ID?: CustomizationID;
  SealIssuerTypeCode?: Code;
  Condition?: AccountingCost;
  SealStatusCode?: Code;
  SealingPartyType?: AccountingCost;
}

export interface PEFInvoiceDeliveryTerm {
  ID?: CustomizationID;
  SpecialTerms?: AccountingCost[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: AccountingCost[];
  Amount?: Amount;
  DeliveryLocation?: PartyPhysicalLocation;
  AllowanceCharge?: CreditNoteLineAllowanceCharge;
}

export interface LegalMonetaryTotal {
  LineExtensionAmount?: Amount;
  TaxExclusiveAmount?: Amount;
  TaxInclusiveAmount?: Amount;
  AllowanceTotalAmount?: Amount;
  ChargeTotalAmount?: Amount;
  PrepaidAmount?: Amount;
  PayableRoundingAmount?: Amount;
  PayableAmount?: Amount;
  PayableAlternativeAmount?: Amount;
}

export interface PEFInvoiceOrderReference {
  ID?: CustomizationID;
  SalesOrderID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  CustomerReference?: AccountingCost;
  OrderTypeCode?: Code;
  DocumentReference?: BillingReferenceOriginalDocumentReference;
}

export interface EParty {
  MarkCareIndicator?: CopyIndicator;
  MarkAttentionIndicator?: CopyIndicator;
  WebsiteURI?: CustomizationID;
  LogoReferenceID?: CustomizationID;
  EndpointID?: CustomizationID;
  IndustryClassificationCode?: Code;
  PartyIdentification?: PartyIdentification[];
  PartyName?: PartyName[];
  Language?: Language;
  PostalAddress?: ApplicableTerritoryAddressElement;
  PhysicalLocation?: PartyPhysicalLocation;
  PartyTaxScheme?: PayeePartyPartyTaxScheme[];
  PartyLegalEntity?: PayeePartyPartyLegalEntity[];
  Contact?: Contact;
  Person?: PayeePartyPerson[];
  FinancialAccount?: PayeePartyFinancialAccount;
}

export interface PayeePartyFinancialAccount {
  ID?: CustomizationID;
  Name?: AccountingCost;
  AliasName?: AccountingCost;
  AccountTypeCode?: Code;
  AccountFormatCode?: Code;
  CurrencyCode?: Code;
  PaymentNote?: AccountingCost[];
  FinancialInstitutionBranch?: FinancialInstitutionBranch;
  Country?: Country;
}

export interface FinancialInstitutionBranch {
  ID?: CustomizationID;
  Name?: AccountingCost;
  FinancialInstitution?: PurpleFinancialInstitution;
  Address?: ApplicableTerritoryAddressElement;
}

export interface PayeePartyPartyLegalEntity {
  RegistrationName?: AccountingCost;
  CompanyID?: CustomizationID;
  RegistrationDate?: CopyIndicator;
  RegistrationExpirationDate?: CopyIndicator;
  CompanyLegalFormCode?: Code;
  CompanyLegalForm?: AccountingCost;
  SoleProprietorshipIndicator?: CopyIndicator;
  CompanyLiquidationStatusCode?: Code;
  CorporateStockAmount?: Amount;
  FullyPaidSharesIndicator?: CopyIndicator;
  RegistrationAddress?: ApplicableTerritoryAddressElement;
  CorporateRegistrationScheme?: TentacledCorporateRegistrationScheme;
  ShareholderParty?: ShareholderParty[];
}

export interface TentacledCorporateRegistrationScheme {
  ID?: CustomizationID;
  Name?: AccountingCost;
  CorporateRegistrationTypeCode?: Code;
  JurisdictionRegionAddress?: ApplicableTerritoryAddressElement[];
}

export interface PayeePartyPartyTaxScheme {
  RegistrationName?: AccountingCost;
  CompanyID?: CustomizationID;
  TaxLevelCode?: Code;
  ExemptionReasonCode?: Code;
  ExemptionReason?: AccountingCost[];
  RegistrationAddress?: ApplicableTerritoryAddressElement;
  TaxScheme?: PurpleTaxScheme;
}

export interface PayeePartyPerson {
  ID?: CustomizationID;
  FirstName?: AccountingCost;
  FamilyName?: AccountingCost;
  Title?: AccountingCost;
  MiddleName?: AccountingCost;
  OtherName?: AccountingCost;
  NameSuffix?: AccountingCost;
  JobTitle?: AccountingCost;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: AccountingCost;
  OrganizationDepartment?: AccountingCost;
  Contact?: Contact;
  FinancialAccount?: PartyFinancialAccount;
  IdentityDocumentReference?: FluffyIdentityDocumentReference[];
  ResidenceAddress?: ApplicableTerritoryAddressElement;
}

export interface FluffyIdentityDocumentReference {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: AccountingCost;
  XPath?: AccountingCost[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: AccountingCost[];
  Attachment?: AdditionalDocumentReferenceAttachment;
  ValidityPeriod?: Period;
  ResultOfVerification?: ResultOfVerification;
}

export interface ExchangeRate {
  SourceCurrencyCode?: Code;
  SourceCurrencyBaseRate?: LineCountNumeric;
  TargetCurrencyCode?: Code;
  TargetCurrencyBaseRate?: LineCountNumeric;
  ExchangeMarketID?: CustomizationID;
  CalculationRate?: LineCountNumeric;
  MathematicOperatorCode?: Code;
  Date?: CopyIndicator;
  ForeignExchangeContract?: PaymentAlternativeExchangeRateForeignExchangeContract;
}

export interface PaymentAlternativeExchangeRateForeignExchangeContract {
  ID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  NominationDate?: CopyIndicator;
  NominationTime?: CopyIndicator;
  ContractTypeCode?: Code;
  ContractType?: AccountingCost;
  Note?: AccountingCost[];
  VersionID?: CustomizationID;
  Description?: AccountingCost[];
  ValidityPeriod?: Period;
  ContractDocumentReference?: BillingReferenceCatalogueDocumentReference[];
  NominationPeriod?: Period;
  ContractualDelivery?: PurpleContractualDelivery;
}

export interface PurpleContractualDelivery {
  ID?: CustomizationID;
  Quantity?: Quantity;
  MinimumQuantity?: Quantity;
  MaximumQuantity?: Quantity;
  ActualDeliveryDate?: CopyIndicator;
  ActualDeliveryTime?: CopyIndicator;
  LatestDeliveryDate?: CopyIndicator;
  LatestDeliveryTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  TrackingID?: CustomizationID;
  DeliveryAddress?: ApplicableTerritoryAddressElement;
  DeliveryLocation?: SignatoryPartyFreightChargeLocation;
  AlternativeDeliveryLocation?: SignatoryPartyFreightChargeLocation;
  RequestedDeliveryPeriod?: Period;
  PromisedDeliveryPeriod?: Period;
  EstimatedDeliveryPeriod?: Period;
  CarrierParty?: ContactPartyElement;
  DeliveryParty?: ContactPartyElement;
  NotifyParty?: ContactPartyElement[];
  Despatch?: TentacledDespatch;
  DeliveryTerms?: FluffyDeliveryTerm[];
  MinimumDeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit;
  MaximumDeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit;
  Shipment?: TentacledShipment;
}

export interface TentacledShipment {
  ID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  Information?: AccountingCost[];
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: AccountingCost[];
  DeliveryInstructions?: AccountingCost[];
  SplitConsignmentIndicator?: CopyIndicator;
  ConsignmentQuantity?: Quantity;
  Consignment?: TentacledConsignment[];
  GoodsItem?: PackageGoodsItem[];
  ShipmentStage?: FinalDeliveryTransportationServiceShipmentStage[];
  TransportHandlingUnit?: PurpleTransportHandlingUnit[];
  ReturnAddress?: LocationAddressElement;
  OriginAddress?: LocationAddressElement;
  FirstArrivalPortLocation?: Location;
  LastExitPortLocation?: Location;
  ExportCountry?: Country;
  FreightAllowanceCharge?: FluffyAllowanceCharge[];
}

export interface TentacledConsignment {
  ID?: CustomizationID;
  CarrierAssignedID?: CustomizationID;
  ConsigneeAssignedID?: CustomizationID;
  ConsignorAssignedID?: CustomizationID;
  FreightForwarderAssignedID?: CustomizationID;
  BrokerAssignedID?: CustomizationID;
  ContractedCarrierAssignedID?: CustomizationID;
  PerformingCarrierAssignedID?: CustomizationID;
  SummaryDescription?: AccountingCost[];
  TotalInvoiceAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  TariffDescription?: AccountingCost[];
  TariffCode?: Code;
  InsurancePremiumAmount?: Amount;
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  ChargeableWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  LoadingLengthMeasure?: Measure;
  Remarks?: AccountingCost[];
  HazardousRiskIndicator?: CopyIndicator;
  AnimalFoodIndicator?: CopyIndicator;
  HumanFoodIndicator?: CopyIndicator;
  LivestockIndicator?: CopyIndicator;
  BulkCargoIndicator?: CopyIndicator;
  ContainerizedIndicator?: CopyIndicator;
  GeneralCargoIndicator?: CopyIndicator;
  SpecialSecurityIndicator?: CopyIndicator;
  ThirdPartyPayerIndicator?: CopyIndicator;
  CarrierServiceInstructions?: AccountingCost[];
  CustomsClearanceServiceInstructions?: AccountingCost[];
  ForwarderServiceInstructions?: AccountingCost[];
  SpecialServiceInstructions?: AccountingCost[];
  SequenceID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  Information?: AccountingCost[];
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: AccountingCost[];
  SplitConsignmentIndicator?: CopyIndicator;
  DeliveryInstructions?: AccountingCost[];
  ConsignmentQuantity?: Quantity;
  ConsolidatableIndicator?: CopyIndicator;
  HaulageInstructions?: AccountingCost[];
  LoadingSequenceID?: CustomizationID;
  ChildConsignmentQuantity?: Quantity;
  TotalPackagesQuantity?: Quantity;
  CustomsDeclaration?: PartyIdentification[];
  RequestedPickupTransportEvent?: AutoGeneratedForWildcard;
  RequestedDeliveryTransportEvent?: AutoGeneratedForWildcard;
  PlannedPickupTransportEvent?: AutoGeneratedForWildcard;
  PlannedDeliveryTransportEvent?: AutoGeneratedForWildcard;
  Status?: AutoGeneratedForWildcard[];
  ConsigneeParty?: AutoGeneratedForWildcard;
  ExporterParty?: AutoGeneratedForWildcard;
  ConsignorParty?: AutoGeneratedForWildcard;
  ImporterParty?: AutoGeneratedForWildcard;
  CarrierParty?: AutoGeneratedForWildcard;
  FreightForwarderParty?: AutoGeneratedForWildcard;
  NotifyParty?: AutoGeneratedForWildcard;
  OriginalDespatchParty?: AutoGeneratedForWildcard;
  FinalDeliveryParty?: AutoGeneratedForWildcard;
  PerformingCarrierParty?: AutoGeneratedForWildcard;
  SubstituteCarrierParty?: AutoGeneratedForWildcard;
  LogisticsOperatorParty?: AutoGeneratedForWildcard;
  TransportAdvisorParty?: AutoGeneratedForWildcard;
  HazardousItemNotificationParty?: AutoGeneratedForWildcard;
  InsuranceParty?: AutoGeneratedForWildcard;
  MortgageHolderParty?: AutoGeneratedForWildcard;
  BillOfLadingHolderParty?: AutoGeneratedForWildcard;
  OriginalDepartureCountry?: AutoGeneratedForWildcard;
  FinalDestinationCountry?: AutoGeneratedForWildcard;
  TransitCountry?: AutoGeneratedForWildcard[];
  TransportEvent?: AutoGeneratedForWildcard[];
  OriginalDespatchTransportationService?: TentacledTransportationService;
  FinalDeliveryTransportationService?: TentacledTransportationService;
  DeliveryTerms?: AutoGeneratedForWildcard;
  PaymentTerms?: AutoGeneratedForWildcard;
  CollectPaymentTerms?: AutoGeneratedForWildcard;
  DisbursementPaymentTerms?: AutoGeneratedForWildcard;
  PrepaidPaymentTerms?: AutoGeneratedForWildcard;
  FreightAllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
  ExtraAllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
  MainCarriageShipmentStage?: AutoGeneratedForWildcard[];
  PreCarriageShipmentStage?: AutoGeneratedForWildcard[];
  OnCarriageShipmentStage?: AutoGeneratedForWildcard[];
  TransportHandlingUnit?: AutoGeneratedForWildcard[];
  FirstArrivalPortLocation?: AutoGeneratedForWildcard;
  LastExitPortLocation?: AutoGeneratedForWildcard;
}

export interface TentacledTransportationService {
  TransportServiceCode?: Code;
}

export interface PEFInvoicePaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: AccountingCost[];
  PaymentID?: CustomizationID[];
  CardAccount?: PurpleCardAccount;
  PayerFinancialAccount?: PayeePartyFinancialAccount;
  PayeeFinancialAccount?: PayeePartyFinancialAccount;
  CreditAccount?: CreditAccount;
  PaymentMandate?: StickyPaymentMandate;
  TradeFinancing?: IndigoTradeFinancing;
}

export interface StickyPaymentMandate {
  ID?: CustomizationID;
  MandateTypeCode?: Code;
  MaximumPaymentInstructionsNumeric?: LineCountNumeric;
  MaximumPaidAmount?: Amount;
  SignatureID?: CustomizationID;
  PayerParty?: DocumentReferenceIssuerParty;
  PayerFinancialAccount?: PartyFinancialAccount;
  ValidityPeriod?: Period;
  PaymentReversalPeriod?: Period;
  Clause?: Clause[];
}

export interface IndigoTradeFinancing {
  ID?: CustomizationID;
  FinancingInstrumentCode?: Code;
  ContractDocumentReference?: BillingReferenceCatalogueDocumentReference;
  DocumentReference?: BillingReferenceCatalogueDocumentReference[];
  FinancingParty?: DocumentReferenceIssuerParty;
  FinancingFinancialAccount?: PartyFinancialAccount;
  Clause?: Clause[];
}

export interface PEFInvoicePaymentTerm {
  ID?: CustomizationID;
  PaymentMeansID?: CustomizationID[];
  PrepaidPaymentReferenceID?: CustomizationID;
  Note?: AccountingCost[];
  ReferenceEventCode?: Code;
  SettlementDiscountPercent?: LineCountNumeric;
  PenaltySurchargePercent?: LineCountNumeric;
  PaymentPercent?: LineCountNumeric;
  Amount?: Amount;
  SettlementDiscountAmount?: Amount;
  PenaltyAmount?: Amount;
  PaymentTermsDetailsURI?: CustomizationID;
  PaymentDueDate?: CopyIndicator;
  InstallmentDueDate?: CopyIndicator;
  InvoicingPartyReference?: AccountingCost;
  SettlementPeriod?: Period;
  PenaltyPeriod?: Period;
  ExchangeRate?: StickyExchangeRate;
  ValidityPeriod?: Period;
}

export interface StickyExchangeRate {
  SourceCurrencyCode?: Code;
  SourceCurrencyBaseRate?: LineCountNumeric;
  TargetCurrencyCode?: Code;
  TargetCurrencyBaseRate?: LineCountNumeric;
  ExchangeMarketID?: CustomizationID;
  CalculationRate?: LineCountNumeric;
  MathematicOperatorCode?: Code;
  Date?: CopyIndicator;
  ForeignExchangeContract?: ExchangeRateForeignExchangeContractClass;
}

export interface ExchangeRateForeignExchangeContractClass {
  ID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  NominationDate?: CopyIndicator;
  NominationTime?: CopyIndicator;
  ContractTypeCode?: Code;
  ContractType?: AccountingCost;
  Note?: AccountingCost[];
  VersionID?: CustomizationID;
  Description?: AccountingCost[];
  ValidityPeriod?: Period;
  ContractDocumentReference?: CertificateContractDocumentReference[];
  NominationPeriod?: Period;
  ContractualDelivery?: FluffyContractualDelivery;
}

export interface FluffyContractualDelivery {
  ID?: CustomizationID;
  Quantity?: Quantity;
  MinimumQuantity?: Quantity;
  MaximumQuantity?: Quantity;
  ActualDeliveryDate?: CopyIndicator;
  ActualDeliveryTime?: CopyIndicator;
  LatestDeliveryDate?: CopyIndicator;
  LatestDeliveryTime?: CopyIndicator;
  ReleaseID?: CustomizationID;
  TrackingID?: CustomizationID;
  DeliveryAddress?: LocationAddressElement;
  DeliveryLocation?: Location;
  AlternativeDeliveryLocation?: Location;
  RequestedDeliveryPeriod?: Period;
  PromisedDeliveryPeriod?: Period;
  EstimatedDeliveryPeriod?: Period;
  CarrierParty?: ResponsibleTransportServiceProviderPartyElement;
  DeliveryParty?: ResponsibleTransportServiceProviderPartyElement;
  NotifyParty?: ResponsibleTransportServiceProviderPartyElement[];
  Despatch?: PackageDespatch;
  DeliveryTerms?: InvoiceLineDeliveryTerm[];
  MinimumDeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit;
  MaximumDeliveryUnit?: OriginalItemLocationQuantityMaximumDeliveryUnit;
  Shipment?: StickyShipment;
}

export interface StickyShipment {
  ID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: AccountingCost[];
  Information?: AccountingCost[];
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: AccountingCost[];
  DeliveryInstructions?: AccountingCost[];
  SplitConsignmentIndicator?: CopyIndicator;
  ConsignmentQuantity?: Quantity;
  Consignment?: PartyIdentification[];
  GoodsItem?: AutoGeneratedForWildcard[];
  ShipmentStage?: AutoGeneratedForWildcard[];
  TransportHandlingUnit?: AutoGeneratedForWildcard[];
  ReturnAddress?: AutoGeneratedForWildcard;
  OriginAddress?: AutoGeneratedForWildcard;
  FirstArrivalPortLocation?: AutoGeneratedForWildcard;
  LastExitPortLocation?: AutoGeneratedForWildcard;
  ExportCountry?: AutoGeneratedForWildcard;
  FreightAllowanceCharge?: ContainingTransportEquipmentFreightAllowanceCharge[];
}

export interface PEFInvoiceSignature {
  ID?: CustomizationID;
  Note?: AccountingCost[];
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidatorID?: CustomizationID;
  CanonicalizationMethod?: AccountingCost;
  SignatureMethod?: AccountingCost;
  SignatoryParty?: Party;
  DigitalSignatureAttachment?: AdditionalDocumentReferenceAttachment;
  OriginalDocumentReference?: BillingReferenceOriginalDocumentReference;
}

export interface PEFInvoiceTaxTotal {
  TaxAmount?: Amount;
  RoundingAmount?: Amount;
  TaxEvidenceIndicator?: CopyIndicator;
  TaxIncludedIndicator?: CopyIndicator;
  TaxSubtotal?: StickyTaxSubtotal[];
}

export interface StickyTaxSubtotal {
  TaxableAmount?: Amount;
  TaxAmount?: Amount;
  CalculationSequenceNumeric?: LineCountNumeric;
  TransactionCurrencyTaxAmount?: Amount;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TierRange?: AccountingCost;
  TierRatePercent?: LineCountNumeric;
  TaxCategory?: PurpleTaxCategory;
}

export interface UBLExtensions {
  UBLExtension?: UBLExtension[];
}

export interface UBLExtension {
  ID?: CustomizationID;
  Name?: AccountingCost;
  ExtensionAgencyID?: CustomizationID;
  ExtensionAgencyName?: AccountingCost;
  ExtensionVersionID?: CustomizationID;
  ExtensionAgencyURI?: CustomizationID;
  ExtensionURI?: CustomizationID;
  ExtensionReasonCode?: Code;
  ExtensionReason?: AccountingCost;
  ExtensionContent?: ExtensionContent;
}

export interface ExtensionContent {
  AdditionalAddressData?: AdditionalAddressData;
  OriginalInvoiceData?: OriginalInvoiceData;
  InvoiceCorrection?: InvoiceCorrection;
  AdditionalInvoiceGrossData?: AdditionalInvoiceGrossData;
}

export interface InvoiceCorrection {
  AdditionalInvoiceGrossData: AdditionalInvoiceGrossData;
  AllowanceCharge: PEFInvoiceAllowanceCharge[];
  TaxTotal: PEFInvoiceTaxTotal;
  LegalMonetaryTotal: LegalMonetaryTotal;
}

export interface AdditionalInvoiceGrossData {
  InvoiceLine: InvoiceLine[];
}

export interface AdditionalAddressData {
  SellerSupplierParty: SellerSupplierParty;
  ReceiverParty: ReceiverParty;
}

export interface SellerSupplierParty {
  Party?: Party;
}

export interface PEFInvoiceAttributes {
  xsi?: string;
  n1?: string;
  n2?: string;
  cbc?: string;
  cac?: string;
  ext?: string;
  schemaLocation?: string;
}

export interface FP {
  _attributes?: AccountingCostAttributes;
  _text?: ListAgencyNameEnum;
}

export interface ReceiverParty {
  Party: ReceiverPartyFields;
}

export interface ReceiverPartyFields {
  PartyName: PartyName;
  PostalAddress: PartyPostalAddress;
  PartyLegalEntity: PayeePartyPartyLegalEntity;
  Contact: Contact;
}

export interface OriginalInvoiceData {
  InvoiceLine: InvoiceLine[];
  AllowanceCharge?: PEFInvoiceAllowanceCharge[];
  TaxTotal: PEFInvoiceTaxTotal;
  LegalMonetaryTotal: LegalMonetaryTotal;
  AdditionalInvoiceGrossData: AdditionalInvoiceGrossData;
}

export interface InvoiceLine {
  ID?: FP;
  Note?: FP;
  InvoicedQuantity?: Quantity;
  LineExtensionAmount?: Amount;
  LineExtensionGrossAmount?: Amount;
  AccountingCost?: FP;
  InvoicePeriod?: InvoiceLineInvoicePeriod;
  OrderLineReference?: OrderLineReference;
  DocumentReference?: DocumentReference;
  AllowanceCharge?: AllowanceCharge[];
  Item?: Item;
  Price?: Price;
  TaxTotal?: TaxTotal;
}

export interface TaxTotal {
  TaxAmount: Amount;
}

export interface InvoiceLineInvoicePeriod {
  StartDate: FP;
  EndDate: FP;
}

export interface OrderLineReference {
  LineID: FP;
}

export interface AllowanceCharge {
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReason?: AccountingCost[];
  AllowanceChargeReasonCode?: Code;
  MultiplierFactorNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
}

export interface Item {
  Description: FP;
  Name: FP;
  BuyersItemIdentification: BuyersItemIdentification;
  SellersItemIdentification: SellersItemIdentification;
  StandardItemIdentification: StandardItemIdentification;
  OriginCountry: OriginCountry;
  CommodityClassification: CommodityClassification[];
  ClassifiedTaxCategory: ClassifiedTaxCategory;
  AdditionalItemProperty: AdditionalItemProperty[];
}

export interface BuyersItemIdentification {
  ID: FP;
}

export interface SellersItemIdentification {
  ID: FP;
}

export interface StandardItemIdentification {
  ID: TextWithSchemeID;
}

export interface OriginCountry {
  IdentificationCode: FP;
}

export interface ClassifiedTaxCategory {
  ID?: FP;
  Percent?: FP;
  TaxScheme?: TaxSchemeClassifiedTaxCategory;
}

export interface TaxSchemeClassifiedTaxCategory {
  ID: FP;
}

export interface AdditionalItemProperty {
  Name?: AccountingCost;
  Value?: AccountingCost;
}

export interface TextWithSchemeID {
  _text: string;
  _attributes: AttributeSchemeID;
}

export interface AttributeSchemeID {
  schemeID: string;
}

export interface PartyPostalAddress {
  ID?: CustomizationID;
  AddressTypeCode?: Code;
  AddressFormatCode?: Code;
  Postbox?: FP;
  Floor?: FP;
  Room?: FP;
  StreetName?: FP;
  AdditionalStreetName?: FP;
  BlockName?: FP;
  BuildingName?: FP;
  BuildingNumber?: FP;
  InhouseMail?: FP;
  Department?: FP;
  MarkAttention?: FP;
  MarkCare?: FP;
  PlotIdentification?: FP;
  CitySubdivisionName?: FP;
  CityName?: FP;
  PostalZone?: FP;
  CountrySubentity?: FP;
  CountrySubentityCode?: Code;
  Region?: FP;
  District?: FP;
  TimezoneOffset?: FP;
  AddressLine?: AddressLine[];
  Country?: Country;
  LocationCoordinate?: LocationCoordinate[];
}
