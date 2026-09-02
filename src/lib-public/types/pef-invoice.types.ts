export interface PEFBasicInvoice {
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
  DueDate?: CopyIndicator;
  InvoiceTypeCode?: Code;
  Note?: FP[];
  TaxPointDate?: CopyIndicator;
  DocumentCurrencyCode?: Code;
  TaxCurrencyCode?: Code;
  PricingCurrencyCode?: Code;
  PaymentCurrencyCode?: Code;
  PaymentAlternativeCurrencyCode?: Code;
  AccountingCostCode?: Code;
  AccountingCost?: FP;
  LineCountNumeric?: LineCountNumeric;
  BuyerReference?: FP;
  InvoicePeriod?: Period[];
  OrderReference?: PEFInvoiceOrderReference;
  BillingReference?: PEFInvoiceBillingReference[];
  DespatchDocumentReference?: DocumentReference[];
  ReceiptDocumentReference?: DocumentReference[];
  StatementDocumentReference?: DocumentReference[];
  OriginatorDocumentReference?: DocumentReference[];
  ContractDocumentReference?: DocumentReference[];
  AdditionalDocumentReference?: DocumentReference[];
  ProjectReference?: ProjectReference[];
  Signature?: PEFInvoiceSignature[];
  AccountingSupplierParty?: SupplierParty;
  AccountingCustomerParty?: CustomerParty;
  PayeeParty?: EParty;
  BuyerCustomerParty?: CustomerParty;
  SellerSupplierParty?: SupplierParty;
  TaxRepresentativeParty?: EParty;
  Delivery?: PEFInvoiceDelivery[];
  DeliveryTerms?: DeliveryTerms;
  PaymentMeans?: PEFInvoicePaymentMean[];
  PaymentTerms?: PEFInvoicePaymentTerm[];
  PrepaidPayment?: PrepaidPayment[];
  AllowanceCharge?: PEFInvoiceAllowanceCharge[];
  TaxExchangeRate?: ExchangeRate;
  PricingExchangeRate?: ExchangeRate;
  PaymentExchangeRate?: ExchangeRate;
  PaymentAlternativeExchangeRate?: ExchangeRate;
  TaxTotal?: PEFInvoiceTaxTotal[];
  WithholdingTaxTotal?: PEFInvoiceTaxTotal[];
  LegalMonetaryTotal?: LegalMonetaryTotal;
  InvoiceLine?: PEFInvoiceInvoiceLine[];
}

export interface FP {
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
  Name?: FP;
  Telephone?: FP;
  Telefax?: FP;
  ElectronicMail?: FP;
  Note?: FP[];
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
  Channel?: FP;
  Value?: FP;
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
  PostalAddress?: PartyPostalAddress;
  PhysicalLocation?: PartyPhysicalLocation;
  PartyTaxScheme?: PartyPartyTaxScheme[];
  PartyLegalEntity?: PartyPartyLegalEntity[];
  Contact?: Contact;
  Person?: PartyPerson[];
  FinancialAccount?: PartyFinancialAccount;
}

export interface PartyFinancialAccount {
  ID?: CustomizationID;
  Name?: FP;
  AliasName?: FP;
  AccountTypeCode?: Code;
  AccountFormatCode?: Code;
  CurrencyCode?: Code;
  PaymentNote?: FP[];
  FinancialInstitutionBranch?: FinancialInstitution;
  Country?: Country;
}

export interface Country {
  IdentificationCode?: Code;
  Name?: FP;
}

export interface FinancialInstitution {
  ID?: CustomizationID;
  Name?: FP;
  FinancialInstitution?: FinancialInstitutionElement;
  Address?: FinancialInstitutionElement;
}

export interface FinancialInstitutionElement {}

export interface Language {
  ID?: CustomizationID;
  Name?: FP;
  LocaleCode?: Code;
}

export interface CopyIndicator {
  _text?: string;
}

export interface PartyIdentification {
  ID?: CustomizationID;
}

export interface PartyPartyLegalEntity {
  RegistrationName?: FP;
  CompanyID?: CustomizationID;
  RegistrationDate?: CopyIndicator;
  RegistrationExpirationDate?: CopyIndicator;
  CompanyLegalFormCode?: Code;
  CompanyLegalForm?: FP;
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
  Name?: FP;
  CorporateRegistrationTypeCode?: Code;
  JurisdictionRegionAddress?: FinancialInstitutionElement[];
}

export interface Amount {
  _attributes?: AmountAttributes;
  _text?: string;
}

export interface AmountAttributes {
  currencyCodeListVersionID?: LanguageLocaleIDEnum;
  currencyID?: LanguageLocaleIDEnum;
}

export interface ApplicableTerritoryAddressElement {
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
  Country?: FinancialInstitutionElement;
  LocationCoordinate?: FinancialInstitutionElement[];
}

export interface AddressLine {
  Line?: FP;
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
  Name?: FP;
}

export interface PartyPartyTaxScheme {
  RegistrationName?: FP;
  CompanyID?: CustomizationID;
  TaxLevelCode?: Code;
  ExemptionReasonCode?: Code;
  ExemptionReason?: FP[];
  RegistrationAddress?: ApplicableTerritoryAddressElement;
  TaxScheme?: ClassifiedTaxCategoryTaxScheme;
}

export interface ClassifiedTaxCategoryTaxScheme {
  ID?: CustomizationID;
  Name?: FP;
  TaxTypeCode?: Code;
  CurrencyCode?: Code;
  JurisdictionRegionAddress?: FinancialInstitutionElement[];
}

export interface PartyPerson {
  ID?: CustomizationID;
  FirstName?: FP;
  FamilyName?: FP;
  Title?: FP;
  MiddleName?: FP;
  OtherName?: FP;
  NameSuffix?: FP;
  JobTitle?: FP;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: FP;
  OrganizationDepartment?: FP;
  Contact?: DespatchPartyContact;
  FinancialAccount?: DespatchPartyFinancialAccount;
  IdentityDocumentReference?: IdentityDocumentReferenceElement[];
  ResidenceAddress?: ApplicableTerritoryAddressElement;
}

export interface DespatchPartyContact {
  ID?: CustomizationID;
  Name?: FP;
  Telephone?: FP;
  Telefax?: FP;
  ElectronicMail?: FP;
  Note?: FP[];
  OtherCommunication?: FinancialInstitutionElement[];
}

export interface DespatchPartyFinancialAccount {
  ID?: CustomizationID;
  Name?: FP;
  AliasName?: FP;
  AccountTypeCode?: Code;
  AccountFormatCode?: Code;
  CurrencyCode?: Code;
  PaymentNote?: FP[];
  FinancialInstitutionBranch?: FinancialInstitutionElement;
  Country?: FinancialInstitutionElement;
}

export interface IdentityDocumentReferenceElement {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: FP;
  XPath?: FP[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: FP[];
  Attachment?: FinancialInstitutionElement;
  ValidityPeriod?: FinancialInstitutionElement;
  ResultOfVerification?: FinancialInstitutionElement;
  IssuerParty?: FinancialInstitutionElement;
}

export interface PartyPhysicalLocation {
  ID?: CustomizationID;
  Description?: FP[];
  Conditions?: FP[];
  CountrySubentity?: FP;
  CountrySubentityCode?: Code;
  LocationTypeCode?: Code;
  InformationURI?: CustomizationID;
  Name?: FP;
  ValidityPeriod?: Period[];
  Address?: ApplicableTerritoryAddressElement;
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

export interface Period {
  StartDate?: CopyIndicator;
  StartTime?: CopyIndicator;
  EndDate?: CopyIndicator;
  EndTime?: CopyIndicator;
  DurationMeasure?: Measure;
  DescriptionCode?: Code[];
  Description?: FP[];
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

export interface SupplierParty {
  CustomerAssignedAccountID?: CustomizationID;
  AdditionalAccountID?: CustomizationID[];
  DataSendingCapability?: FP;
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
  DocumentType?: FP;
  XPath?: FP[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: FP[];
  Attachment?: Attachment;
  ValidityPeriod?: Period;
  IssuerParty?: Party;
  ResultOfVerification?: DespatchDocumentReferenceResultOfVerification;
}

export interface Attachment {
  EmbeddedDocumentBinaryObject?: EmbeddedDocumentBinaryObject;
  ExternalReference?: ExternalReference;
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

export interface ExternalReference {
  URI?: CustomizationID;
  DocumentHash?: FP;
  HashAlgorithmMethod?: FP;
  ExpiryDate?: CopyIndicator;
  ExpiryTime?: CopyIndicator;
  MimeCode?: Code;
  FormatCode?: Code;
  EncodingCode?: Code;
  CharacterSetCode?: Code;
  FileName?: FP;
  Description?: FP[];
}

export interface DespatchDocumentReferenceResultOfVerification {
  ValidatorID?: CustomizationID;
  ValidationResultCode?: Code;
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidateProcess?: FP;
  ValidateTool?: FP;
  ValidateToolVersion?: FP;
  SignatoryParty?: InformationContentProviderPartyClass;
}

export interface InformationContentProviderPartyClass {
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
  PhysicalLocation?: FreightChargeLocationClass;
  PartyTaxScheme?: DespatchPartyPartyTaxScheme[];
  PartyLegalEntity?: DespatchPartyPartyLegalEntity[];
  Contact?: DespatchPartyContact;
  Person?: Person[];
  FinancialAccount?: DespatchPartyFinancialAccount;
}

export interface DespatchPartyPartyLegalEntity {
  RegistrationName?: FP;
  CompanyID?: CustomizationID;
  RegistrationDate?: CopyIndicator;
  RegistrationExpirationDate?: CopyIndicator;
  CompanyLegalFormCode?: Code;
  CompanyLegalForm?: FP;
  SoleProprietorshipIndicator?: CopyIndicator;
  CompanyLiquidationStatusCode?: Code;
  CorporateStockAmount?: Amount;
  FullyPaidSharesIndicator?: CopyIndicator;
  RegistrationAddress?: FinancialInstitutionElement;
  CorporateRegistrationScheme?: FinancialInstitutionElement;
  ShareholderParty?: FinancialInstitutionElement[];
}

export interface DespatchPartyPartyTaxScheme {
  RegistrationName?: FP;
  CompanyID?: CustomizationID;
  TaxLevelCode?: Code;
  ExemptionReasonCode?: Code;
  ExemptionReason?: FP[];
  RegistrationAddress?: FinancialInstitutionElement;
  TaxScheme?: FinancialInstitutionElement;
}

export interface Person {
  ID?: CustomizationID;
  FirstName?: FP;
  FamilyName?: FP;
  Title?: FP;
  MiddleName?: FP;
  OtherName?: FP;
  NameSuffix?: FP;
  JobTitle?: FP;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: FP;
  OrganizationDepartment?: FP;
  Contact?: FinancialInstitutionElement;
  FinancialAccount?: FinancialInstitutionElement;
  ResidenceAddress?: FinancialInstitutionElement;
  IdentityDocumentReference?: PartyIdentification[];
}

export interface FreightChargeLocationClass {
  ID?: CustomizationID;
  Description?: FP[];
  Conditions?: FP[];
  CountrySubentity?: FP;
  CountrySubentityCode?: Code;
  LocationTypeCode?: Code;
  InformationURI?: CustomizationID;
  Name?: FP;
  ValidityPeriod?: FinancialInstitutionElement[];
  Address?: FinancialInstitutionElement;
  LocationCoordinate?: FinancialInstitutionElement[];
}

export interface PEFInvoiceAllowanceCharge {
  ID?: CustomizationID;
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReasonCode?: Code;
  AllowanceChargeReason?: FP[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: FP;
  PerUnitAmount?: Amount;
  TaxCategory?: TaxCategory[];
  TaxTotal?: PurpleTaxTotal;
  PaymentMeans?: PurplePaymentMean[];
}

export interface PurplePaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: FP[];
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
  HolderName?: FP;
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
  PayerParty?: SignatoryPartyElement;
  PayerFinancialAccount?: DespatchPartyFinancialAccount;
  ValidityPeriod?: Period;
  PaymentReversalPeriod?: Period;
  Clause?: Clause[];
}

export interface Clause {
  ID?: CustomizationID;
  Content?: FP[];
}

export interface SignatoryPartyElement {
  MarkCareIndicator?: CopyIndicator;
  MarkAttentionIndicator?: CopyIndicator;
  WebsiteURI?: CustomizationID;
  LogoReferenceID?: CustomizationID;
  EndpointID?: CustomizationID;
  IndustryClassificationCode?: Code;
  PartyIdentification?: PartyIdentification[];
  PartyName?: PartyName[];
  Language?: FinancialInstitutionElement;
  PostalAddress?: FinancialInstitutionElement;
  PhysicalLocation?: FinancialInstitutionElement;
  PartyTaxScheme?: PartyTaxSchemeElement[];
  PartyLegalEntity?: FinancialInstitutionElement[];
  Contact?: FinancialInstitutionElement;
  Person?: FinancialInstitutionElement[];
  FinancialAccount?: FinancialInstitutionElement;
}

export interface PartyTaxSchemeElement {
  TaxScheme?: FinancialInstitutionElement;
}

export interface PurpleTradeFinancing {
  ID?: CustomizationID;
  FinancingInstrumentCode?: Code;
  ContractDocumentReference?: IdentityDocumentReferenceElement;
  DocumentReference?: IdentityDocumentReferenceElement[];
  FinancingParty?: SignatoryPartyElement;
  FinancingFinancialAccount?: DespatchPartyFinancialAccount;
  Clause?: Clause[];
}

export interface TaxCategory {
  ID?: CustomizationID;
  Name?: FP;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TaxExemptionReasonCode?: Code;
  TaxExemptionReason?: FP[];
  TierRange?: FP;
  TierRatePercent?: LineCountNumeric;
  TaxScheme?: PurpleTaxScheme;
}

export interface PurpleTaxScheme {
  ID?: CustomizationID;
  Name?: FP;
  TaxTypeCode?: Code;
  CurrencyCode?: Code;
  JurisdictionRegionAddress?: ApplicableTerritoryAddressElement[];
}

export interface PurpleTaxTotal {
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
  TierRange?: FP;
  TierRatePercent?: LineCountNumeric;
  TaxCategory?: ApplicableTaxCategoryElement;
}

export interface ApplicableTaxCategoryElement {
  ID?: CustomizationID;
  Name?: FP;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TaxExemptionReasonCode?: Code;
  TaxExemptionReason?: FP[];
  TierRange?: FP;
  TierRatePercent?: LineCountNumeric;
  TaxScheme?: FinancialInstitutionElement;
}

export interface PEFInvoiceBillingReference {
  InvoiceDocumentReference?: OriginalDocumentReferenceElement;
  SelfBilledInvoiceDocumentReference?: OriginalDocumentReferenceElement;
  CreditNoteDocumentReference?: OriginalDocumentReferenceElement;
  SelfBilledCreditNoteDocumentReference?: OriginalDocumentReferenceElement;
  DebitNoteDocumentReference?: OriginalDocumentReferenceElement;
  ReminderDocumentReference?: OriginalDocumentReferenceElement;
  AdditionalDocumentReference?: OriginalDocumentReferenceElement;
  BillingReferenceLine?: PurpleBillingReferenceLine[];
}

export interface OriginalDocumentReferenceElement {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: FP;
  XPath?: FP[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: FP[];
  Attachment?: Attachment;
  ValidityPeriod?: Period;
  IssuerParty?: InformationContentProviderPartyClass;
  ResultOfVerification?: OriginalDocumentReferenceResultOfVerification;
}

export interface OriginalDocumentReferenceResultOfVerification {
  ValidatorID?: CustomizationID;
  ValidationResultCode?: Code;
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidateProcess?: FP;
  ValidateTool?: FP;
  ValidateToolVersion?: FP;
  SignatoryParty?: SignatoryPartyElement;
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
  AllowanceChargeReason?: FP[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: FP;
  PerUnitAmount?: Amount;
  TaxCategory?: ApplicableTaxCategoryElement[];
  TaxTotal?: FluffyTaxTotal;
  PaymentMeans?: FluffyPaymentMean[];
}

export interface FluffyPaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: FP[];
  PaymentID?: CustomizationID[];
  CardAccount?: FluffyCardAccount;
  PayerFinancialAccount?: FinancialInstitutionElement;
  PayeeFinancialAccount?: FinancialInstitutionElement;
  CreditAccount?: CreditAccount;
  PaymentMandate?: FinancialInstitutionElement;
  TradeFinancing?: FluffyTradeFinancing;
}

export interface FluffyCardAccount {
  PrimaryAccountNumberID?: CustomizationID;
  NetworkID?: CustomizationID;
}

export interface FluffyTradeFinancing {
  FinancingParty?: FinancialInstitutionElement;
}

export interface FluffyTaxTotal {
  TaxAmount?: Amount;
  RoundingAmount?: Amount;
  TaxEvidenceIndicator?: CopyIndicator;
  TaxIncludedIndicator?: CopyIndicator;
  TaxSubtotal?: FluffyTaxSubtotal[];
}

export interface FluffyTaxSubtotal {
  TaxAmount?: Amount;
  TaxCategory?: PartyTaxSchemeElement;
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
  DeliveryAddress?: PartyPostalAddress;
  DeliveryLocation?: PayeePartyDeliveryLocation;
  AlternativeDeliveryLocation?: PayeePartyDeliveryLocation;
  RequestedDeliveryPeriod?: Period;
  PromisedDeliveryPeriod?: Period;
  EstimatedDeliveryPeriod?: Period;
  CarrierParty?: Party;
  DeliveryParty?: Party;
  NotifyParty?: Party[];
  Despatch?: PurpleDespatch;
  DeliveryTerms?: DeliveryDeliveryTerms[];
  MinimumDeliveryUnit?: DeliveryMaximumDeliveryUnit;
  MaximumDeliveryUnit?: DeliveryMaximumDeliveryUnit;
  Shipment?: PurpleShipment;
}

export interface PayeePartyDeliveryLocation {
  ID?: CustomizationID;
  Description?: FP[];
  Conditions?: FP[];
  CountrySubentity?: FP;
  CountrySubentityCode?: Code;
  LocationTypeCode?: Code;
  InformationURI?: CustomizationID;
  Name?: FP;
  ValidityPeriod?: Period[];
  Address?: PartyPostalAddress;
  LocationCoordinate?: LocationCoordinate[];
}

export interface DeliveryDeliveryTerms {
  ID?: CustomizationID;
  SpecialTerms?: FP[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: FP[];
  Amount?: Amount;
  DeliveryLocation?: PartyPhysicalLocation;
  AllowanceCharge?: PurpleAllowanceCharge;
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
  Instructions?: FP[];
  DespatchAddress?: PartyPostalAddress;
  DespatchLocation?: PartyPhysicalLocation;
  DespatchParty?: InformationContentProviderPartyClass;
  CarrierParty?: InformationContentProviderPartyClass;
  NotifyParty?: InformationContentProviderPartyClass[];
  Contact?: Contact;
  EstimatedDespatchPeriod?: Period;
  RequestedDespatchPeriod?: Period;
}

export interface DeliveryMaximumDeliveryUnit {
  BatchQuantity?: Quantity;
  ConsumerUnitQuantity?: Quantity;
  HazardousRiskIndicator?: CopyIndicator;
}

export interface Quantity {
  _attributes?: MaximumQuantityAttributes;
  _text?: string;
}

export interface MaximumQuantityAttributes {
  unitCode?: LanguageLocaleIDEnum;
  unitCodeListID?: LanguageLocaleIDEnum;
  unitCodeListAgencyID?: LanguageLocaleIDEnum;
  unitCodeListAgencyName?: ListAgencyNameEnum;
}

export interface PurpleShipment {
  ID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: FP[];
  Information?: FP[];
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
  SpecialInstructions?: FP[];
  DeliveryInstructions?: FP[];
  SplitConsignmentIndicator?: CopyIndicator;
  ConsignmentQuantity?: Quantity;
  Consignment?: PurpleConsignment[];
  GoodsItem?: PurpleGoodsItem[];
  ShipmentStage?: PurpleShipmentStage[];
  TransportHandlingUnit?: PurpleTransportHandlingUnit[];
  ReturnAddress?: PartyPostalAddress;
  OriginAddress?: PartyPostalAddress;
  FirstArrivalPortLocation?: PartyPhysicalLocation;
  LastExitPortLocation?: PartyPhysicalLocation;
  ExportCountry?: Country;
  FreightAllowanceCharge?: PurpleAllowanceCharge[];
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
  SummaryDescription?: FP[];
  TotalInvoiceAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  TariffDescription?: FP[];
  TariffCode?: Code;
  InsurancePremiumAmount?: Amount;
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  ChargeableWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  LoadingLengthMeasure?: Measure;
  Remarks?: FP[];
  HazardousRiskIndicator?: CopyIndicator;
  AnimalFoodIndicator?: CopyIndicator;
  HumanFoodIndicator?: CopyIndicator;
  LivestockIndicator?: CopyIndicator;
  BulkCargoIndicator?: CopyIndicator;
  ContainerizedIndicator?: CopyIndicator;
  GeneralCargoIndicator?: CopyIndicator;
  SpecialSecurityIndicator?: CopyIndicator;
  ThirdPartyPayerIndicator?: CopyIndicator;
  CarrierServiceInstructions?: FP[];
  CustomsClearanceServiceInstructions?: FP[];
  ForwarderServiceInstructions?: FP[];
  SpecialServiceInstructions?: FP[];
  SequenceID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: FP[];
  Information?: FP[];
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: FP[];
  SplitConsignmentIndicator?: CopyIndicator;
  DeliveryInstructions?: FP[];
  ConsignmentQuantity?: Quantity;
  ConsolidatableIndicator?: CopyIndicator;
  HaulageInstructions?: FP[];
  LoadingSequenceID?: CustomizationID;
  ChildConsignmentQuantity?: Quantity;
  TotalPackagesQuantity?: Quantity;
  CustomsDeclaration?: CustomsDeclaration[];
  RequestedPickupTransportEvent?: TransportEvent;
  RequestedDeliveryTransportEvent?: TransportEvent;
  PlannedPickupTransportEvent?: TransportEvent;
  PlannedDeliveryTransportEvent?: TransportEvent;
  Status?: Status[];
  ConsigneeParty?: SignatoryPartyElement;
  ExporterParty?: SignatoryPartyElement;
  ConsignorParty?: SignatoryPartyElement;
  ImporterParty?: SignatoryPartyElement;
  CarrierParty?: SignatoryPartyElement;
  FreightForwarderParty?: SignatoryPartyElement;
  NotifyParty?: SignatoryPartyElement;
  OriginalDespatchParty?: SignatoryPartyElement;
  FinalDeliveryParty?: SignatoryPartyElement;
  PerformingCarrierParty?: SignatoryPartyElement;
  SubstituteCarrierParty?: SignatoryPartyElement;
  LogisticsOperatorParty?: SignatoryPartyElement;
  TransportAdvisorParty?: SignatoryPartyElement;
  HazardousItemNotificationParty?: SignatoryPartyElement;
  InsuranceParty?: SignatoryPartyElement;
  MortgageHolderParty?: SignatoryPartyElement;
  BillOfLadingHolderParty?: SignatoryPartyElement;
  OriginalDepartureCountry?: Country;
  FinalDestinationCountry?: Country;
  TransitCountry?: Country[];
  TransportContract?: Contract;
  TransportEvent?: TransportEvent[];
  OriginalDespatchTransportationService?: PurpleTransportationService;
  FinalDeliveryTransportationService?: PurpleTransportationService;
  DeliveryTerms?: ConsignmentDeliveryTerm;
  PaymentTerms?: PaymentTerms;
  CollectPaymentTerms?: PaymentTerms;
  DisbursementPaymentTerms?: PaymentTerms;
  PrepaidPaymentTerms?: PaymentTerms;
  FreightAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  ExtraAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  MainCarriageShipmentStage?: ShipmentStage[];
  PreCarriageShipmentStage?: ShipmentStage[];
  OnCarriageShipmentStage?: ShipmentStage[];
  TransportHandlingUnit?: ConsignmentTransportHandlingUnit[];
  FirstArrivalPortLocation?: FreightChargeLocationClass;
  LastExitPortLocation?: FreightChargeLocationClass;
}

export interface PaymentTerms {
  ID?: CustomizationID;
  PaymentMeansID?: CustomizationID[];
  PrepaidPaymentReferenceID?: CustomizationID;
  Note?: FP[];
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
  InvoicingPartyReference?: FP;
  SettlementPeriod?: FinancialInstitutionElement;
  PenaltyPeriod?: FinancialInstitutionElement;
  ExchangeRate?: CollectPaymentTermsPricingExchangeRate;
  ValidityPeriod?: FinancialInstitutionElement;
}

export interface CollectPaymentTermsPricingExchangeRate {
  SourceCurrencyCode?: Code;
  TargetCurrencyCode?: Code;
}

export interface CustomsDeclaration {
  ID?: CustomizationID;
  IssuerParty?: FinancialInstitutionElement;
}

export interface ConsignmentDeliveryTerm {
  ID?: CustomizationID;
  SpecialTerms?: FP[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: FP[];
  Amount?: Amount;
  DeliveryLocation?: FinancialInstitutionElement;
  AllowanceCharge?: ServiceAllowanceChargeElement;
}

export interface ServiceAllowanceChargeElement {
  ChargeIndicator?: CopyIndicator;
  Amount?: Amount;
}

export interface BillingReferenceLineExtraAllowanceCharge {
  ID?: CustomizationID;
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReasonCode?: Code;
  AllowanceChargeReason?: FP[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: FP;
  PerUnitAmount?: Amount;
  TaxCategory?: PartyTaxSchemeElement[];
  TaxTotal?: ExtraAllowanceChargeTaxTotal;
  PaymentMeans?: ExtraAllowanceChargePaymentMean[];
}

export interface ExtraAllowanceChargePaymentMean {
  PaymentMeansCode?: Code;
}

export interface ExtraAllowanceChargeTaxTotal {
  TaxAmount?: Amount;
}

export interface PurpleTransportationService {
  TransportServiceCode?: Code;
  TariffClassCode?: Code;
  Priority?: FP;
  FreightRateClassCode?: Code;
  TransportationServiceDescription?: FP[];
  TransportationServiceDetailsURI?: CustomizationID;
  NominationDate?: CopyIndicator;
  NominationTime?: CopyIndicator;
  Name?: FP;
  SequenceNumeric?: LineCountNumeric;
  TransportEquipment?: FinancialInstitutionElement[];
  SupportedTransportEquipment?: FinancialInstitutionElement[];
  UnsupportedTransportEquipment?: FinancialInstitutionElement[];
  CommodityClassification?: FinancialInstitutionElement[];
  SupportedCommodityClassification?: FinancialInstitutionElement[];
  UnsupportedCommodityClassification?: FinancialInstitutionElement[];
  TotalCapacityDimension?: Ion;
  ShipmentStage?: FinancialInstitutionElement[];
  TransportEvent?: FinancialInstitutionElement[];
  ResponsibleTransportServiceProviderParty?: FinancialInstitutionElement;
  EnvironmentalEmission?: EnvironmentalEmission[];
  EstimatedDurationPeriod?: FinancialInstitutionElement;
  ScheduledServiceFrequency?: ScheduledServiceFrequency[];
}

export interface EnvironmentalEmission {
  EnvironmentalEmissionTypeCode?: Code;
  ValueMeasure?: Measure;
}

export interface ScheduledServiceFrequency {
  WeekDayCode?: Code;
}

export interface Ion {
  AttributeID?: CustomizationID;
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
  Instructions?: FP[];
  DemurrageInstructions?: FP[];
  CrewQuantity?: Quantity;
  PassengerQuantity?: Quantity;
  TransitPeriod?: FinancialInstitutionElement;
  CarrierParty?: FinancialInstitutionElement[];
  TransportMeans?: FinancialInstitutionElement;
  LoadingPortLocation?: FinancialInstitutionElement;
  UnloadingPortLocation?: FinancialInstitutionElement;
  TransshipPortLocation?: FinancialInstitutionElement;
  LoadingTransportEvent?: FinancialInstitutionElement;
  ExaminationTransportEvent?: FinancialInstitutionElement;
  AvailabilityTransportEvent?: FinancialInstitutionElement;
  ExportationTransportEvent?: FinancialInstitutionElement;
  DischargeTransportEvent?: FinancialInstitutionElement;
  WarehousingTransportEvent?: FinancialInstitutionElement;
  TakeoverTransportEvent?: FinancialInstitutionElement;
  OptionalTakeoverTransportEvent?: FinancialInstitutionElement;
  DropoffTransportEvent?: FinancialInstitutionElement;
  ActualPickupTransportEvent?: FinancialInstitutionElement;
  DeliveryTransportEvent?: FinancialInstitutionElement;
  ReceiptTransportEvent?: FinancialInstitutionElement;
  StorageTransportEvent?: FinancialInstitutionElement;
  AcceptanceTransportEvent?: FinancialInstitutionElement;
  TerminalOperatorParty?: FinancialInstitutionElement;
  CustomsAgentParty?: FinancialInstitutionElement;
  EstimatedTransitPeriod?: FinancialInstitutionElement;
  FreightAllowanceCharge?: ServiceAllowanceChargeElement[];
  FreightChargeLocation?: FinancialInstitutionElement;
  DetentionTransportEvent?: FinancialInstitutionElement[];
  RequestedDepartureTransportEvent?: FinancialInstitutionElement;
  RequestedArrivalTransportEvent?: FinancialInstitutionElement;
  RequestedWaypointTransportEvent?: FinancialInstitutionElement[];
  PlannedDepartureTransportEvent?: FinancialInstitutionElement;
  PlannedArrivalTransportEvent?: FinancialInstitutionElement;
  PlannedWaypointTransportEvent?: FinancialInstitutionElement[];
  ActualDepartureTransportEvent?: FinancialInstitutionElement;
  ActualWaypointTransportEvent?: FinancialInstitutionElement;
  ActualArrivalTransportEvent?: FinancialInstitutionElement;
  TransportEvent?: FinancialInstitutionElement[];
  EstimatedDepartureTransportEvent?: FinancialInstitutionElement;
  EstimatedArrivalTransportEvent?: FinancialInstitutionElement;
  PassengerPerson?: FinancialInstitutionElement[];
  DriverPerson?: FinancialInstitutionElement[];
  ReportingPerson?: FinancialInstitutionElement;
  CrewMemberPerson?: FinancialInstitutionElement[];
  SecurityOfficerPerson?: FinancialInstitutionElement;
  MasterPerson?: FinancialInstitutionElement;
  ShipsSurgeonPerson?: FinancialInstitutionElement;
}

export interface TransportEvent {
  IdentificationID?: CustomizationID;
  OccurrenceDate?: CopyIndicator;
  OccurrenceTime?: CopyIndicator;
  TransportEventTypeCode?: Code;
  Description?: FP[];
  CompletionIndicator?: CopyIndicator;
  CurrentStatus?: FinancialInstitutionElement[];
  Contact?: FinancialInstitutionElement[];
  Location?: FinancialInstitutionElement;
  Signature?: PartyIdentification;
  Period?: FinancialInstitutionElement[];
}

export interface Status {
  ConditionCode?: Code;
  ReferenceDate?: CopyIndicator;
  ReferenceTime?: CopyIndicator;
  Description?: FP[];
  StatusReasonCode?: Code;
  StatusReason?: FP[];
  SequenceID?: CustomizationID;
  Text?: FP[];
  IndicationIndicator?: CopyIndicator;
  Percent?: LineCountNumeric;
  ReliabilityPercent?: LineCountNumeric;
  Condition?: Ion[];
}

export interface Contract {
  ID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  NominationDate?: CopyIndicator;
  NominationTime?: CopyIndicator;
  ContractTypeCode?: Code;
  ContractType?: FP;
  Note?: FP[];
  VersionID?: CustomizationID;
  Description?: FP[];
  ValidityPeriod?: FinancialInstitutionElement;
  ContractDocumentReference?: PartyIdentification[];
  NominationPeriod?: FinancialInstitutionElement;
  ContractualDelivery?: FinancialInstitutionElement;
}

export interface ConsignmentTransportHandlingUnit {
  ID?: CustomizationID;
  TransportHandlingUnitTypeCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: FP[];
  HazardousRiskIndicator?: CopyIndicator;
  TotalGoodsItemQuantity?: Quantity;
  TotalPackageQuantity?: Quantity;
  DamageRemarks?: FP[];
  ShippingMarks?: FP[];
  TraceID?: CustomizationID;
  HandlingUnitDespatchLine?: PurpleHandlingUnitDespatchLine[];
  ActualPackage?: FinancialInstitutionElement[];
  ReceivedHandlingUnitReceiptLine?: PartyIdentification[];
  TransportEquipment?: FinancialInstitutionElement[];
  TransportMeans?: FinancialInstitutionElement[];
  HazardousGoodsTransit?: FinancialInstitutionElement[];
  MeasurementDimension?: Ion[];
  MinimumTemperature?: HazardousGoodsTransitMaximumTemperature;
  MaximumTemperature?: HazardousGoodsTransitMaximumTemperature;
  GoodsItem?: FinancialInstitutionElement[];
  FloorSpaceMeasurementDimension?: Ion;
  PalletSpaceMeasurementDimension?: Ion;
  ShipmentDocumentReference?: PartyIdentification[];
  Status?: FinancialInstitutionElement[];
  CustomsDeclaration?: PartyIdentification[];
  Package?: FinancialInstitutionElement[];
}

export interface PurpleHandlingUnitDespatchLine {
  ID?: CustomizationID;
  OrderLineReference?: DependentLineReferenceElement[];
  Item?: FinancialInstitutionElement;
}

export interface DependentLineReferenceElement {
  LineID?: CustomizationID;
}

export interface HazardousGoodsTransitMaximumTemperature {
  AttributeID?: CustomizationID;
  Measure?: Measure;
}

export interface PurpleGoodsItem {
  ID?: CustomizationID;
  SequenceNumberID?: CustomizationID;
  Description?: FP[];
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
  Item?: ItemElement[];
  GoodsItemContainer?: GoodsItemContainer[];
  FreightAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  InvoiceLine?: PurpleInvoiceLine[];
  Temperature?: MaximumTemperatureElement[];
  OriginAddress?: ApplicableTerritoryAddressElement;
  Pickup?: Pickup;
  Despatch?: GoodsItemDespatch;
  MeasurementDimension?: Dimension[];
  ContainingPackage?: Package[];
  ShipmentDocumentReference?: IdentityDocumentReferenceElement;
  MinimumTemperature?: MaximumTemperatureElement;
  MaximumTemperature?: MaximumTemperatureElement;
}

export interface Package {
  ID?: CustomizationID;
  Quantity?: Quantity;
  ReturnableMaterialIndicator?: CopyIndicator;
  PackageLevelCode?: Code;
  PackagingTypeCode?: Code;
  PackingMaterial?: FP[];
  TraceID?: CustomizationID;
  ContainingTransportEquipment?: FinancialInstitutionElement;
  MeasurementDimension?: Ion[];
  DeliveryUnit?: PackageMaximumDeliveryUnit[];
  Pickup?: FinancialInstitutionElement;
  Despatch?: FinancialInstitutionElement;
  GoodsItem?: FinancialInstitutionElement[];
  Delivery?: FinancialInstitutionElement;
}

export interface PackageMaximumDeliveryUnit {
  BatchQuantity?: Quantity;
}

export interface GoodsItemDespatch {
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
  Instructions?: FP[];
  DespatchAddress?: FinancialInstitutionElement;
  DespatchLocation?: FinancialInstitutionElement;
  DespatchParty?: FinancialInstitutionElement;
  CarrierParty?: FinancialInstitutionElement;
  NotifyParty?: FinancialInstitutionElement[];
  Contact?: FinancialInstitutionElement;
  EstimatedDespatchPeriod?: FinancialInstitutionElement;
  RequestedDespatchPeriod?: FinancialInstitutionElement;
}

export interface GoodsItemContainer {
  ID?: CustomizationID;
  Quantity?: Quantity;
  TransportEquipment?: FinancialInstitutionElement[];
}

export interface PurpleInvoiceLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: FP[];
  InvoicedQuantity?: Quantity;
  LineExtensionAmount?: Amount;
  TaxPointDate?: CopyIndicator;
  AccountingCostCode?: Code;
  AccountingCost?: FP;
  PaymentPurposeCode?: Code;
  FreeOfChargeIndicator?: CopyIndicator;
  InvoicePeriod?: FinancialInstitutionElement[];
  OrderLineReference?: DependentLineReferenceElement[];
  DespatchLineReference?: DependentLineReferenceElement[];
  ReceiptLineReference?: DependentLineReferenceElement[];
  BillingReference?: FinancialInstitutionElement[];
  DocumentReference?: PartyIdentification[];
  PricingReference?: FinancialInstitutionElement;
  OriginatorParty?: FinancialInstitutionElement;
  PaymentTerms?: FinancialInstitutionElement[];
  AllowanceCharge?: ServiceAllowanceChargeElement[];
  TaxTotal?: ExtraAllowanceChargeTaxTotal[];
  WithholdingTaxTotal?: ExtraAllowanceChargeTaxTotal[];
  Item?: FinancialInstitutionElement;
  Price?: PurplePrice;
  DeliveryTerms?: FinancialInstitutionElement;
  ItemPriceExtension?: PurpleItemPriceExtension;
}

export interface PurpleItemPriceExtension {
  Amount?: Amount;
}

export interface PurplePrice {
  PriceAmount?: Amount;
}

export interface ItemElement {
  Description?: FP[];
  PackQuantity?: Quantity;
  PackSizeNumeric?: LineCountNumeric;
  CatalogueIndicator?: CopyIndicator;
  Name?: FP;
  HazardousRiskIndicator?: CopyIndicator;
  AdditionalInformation?: FP[];
  Keyword?: FP[];
  BrandName?: FP[];
  ModelName?: FP[];
  BuyersItemIdentification?: PartyIdentification;
  SellersItemIdentification?: PartyIdentification;
  ManufacturersItemIdentification?: PartyIdentification[];
  StandardItemIdentification?: PartyIdentification;
  CatalogueItemIdentification?: PartyIdentification;
  AdditionalItemIdentification?: PartyIdentification[];
  CatalogueDocumentReference?: PartyIdentification;
  ItemSpecificationDocumentReference?: PartyIdentification[];
  OriginCountry?: FinancialInstitutionElement;
  CommodityClassification?: FinancialInstitutionElement[];
  TransactionConditions?: FinancialInstitutionElement[];
  HazardousItem?: FinancialInstitutionElement[];
  ClassifiedTaxCategory?: PartyTaxSchemeElement[];
  AdditionalItemProperty?: PartyName[];
  ManufacturerParty?: FinancialInstitutionElement[];
  InformationContentProviderParty?: FinancialInstitutionElement;
  OriginAddress?: FinancialInstitutionElement[];
  ItemInstance?: FinancialInstitutionElement[];
  Certificate?: PurpleCertificate[];
  Dimension?: Ion[];
}

export interface PurpleCertificate {
  ID?: CustomizationID;
  CertificateTypeCode?: Code;
  CertificateType?: FP;
  IssuerParty?: FinancialInstitutionElement;
}

export interface MaximumTemperatureElement {
  AttributeID?: CustomizationID;
  Measure?: Measure;
  Description?: FP[];
}

export interface Dimension {
  AttributeID?: CustomizationID;
  Measure?: Measure;
  Description?: FP[];
  MinimumMeasure?: Measure;
  MaximumMeasure?: Measure;
}

export interface Pickup {
  ID?: CustomizationID;
  ActualPickupDate?: CopyIndicator;
  ActualPickupTime?: CopyIndicator;
  EarliestPickupDate?: CopyIndicator;
  EarliestPickupTime?: CopyIndicator;
  LatestPickupDate?: CopyIndicator;
  LatestPickupTime?: CopyIndicator;
  PickupLocation?: FinancialInstitutionElement;
  PickupParty?: FinancialInstitutionElement;
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
  Instructions?: FP[];
  DemurrageInstructions?: FP[];
  CrewQuantity?: Quantity;
  PassengerQuantity?: Quantity;
  TransitPeriod?: Period;
  CarrierParty?: SignatoryPartyElement[];
  TransportMeans?: TransportMean;
  LoadingPortLocation?: FreightChargeLocationClass;
  UnloadingPortLocation?: FreightChargeLocationClass;
  TransshipPortLocation?: FreightChargeLocationClass;
  LoadingTransportEvent?: TransportEvent;
  ExaminationTransportEvent?: TransportEvent;
  AvailabilityTransportEvent?: TransportEvent;
  ExportationTransportEvent?: TransportEvent;
  DischargeTransportEvent?: TransportEvent;
  WarehousingTransportEvent?: TransportEvent;
  TakeoverTransportEvent?: TransportEvent;
  OptionalTakeoverTransportEvent?: TransportEvent;
  DropoffTransportEvent?: TransportEvent;
  ActualPickupTransportEvent?: TransportEvent;
  DeliveryTransportEvent?: TransportEvent;
  ReceiptTransportEvent?: TransportEvent;
  StorageTransportEvent?: TransportEvent;
  AcceptanceTransportEvent?: TransportEvent;
  TerminalOperatorParty?: SignatoryPartyElement;
  CustomsAgentParty?: SignatoryPartyElement;
  EstimatedTransitPeriod?: Period;
  FreightAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  FreightChargeLocation?: FreightChargeLocationClass;
  DetentionTransportEvent?: TransportEvent[];
  RequestedDepartureTransportEvent?: TransportEvent;
  RequestedArrivalTransportEvent?: TransportEvent;
  RequestedWaypointTransportEvent?: TransportEvent[];
  PlannedDepartureTransportEvent?: TransportEvent;
  PlannedArrivalTransportEvent?: TransportEvent;
  PlannedWaypointTransportEvent?: TransportEvent[];
  ActualDepartureTransportEvent?: TransportEvent;
  ActualWaypointTransportEvent?: TransportEvent;
  ActualArrivalTransportEvent?: TransportEvent;
  TransportEvent?: TransportEvent[];
  EstimatedDepartureTransportEvent?: TransportEvent;
  EstimatedArrivalTransportEvent?: TransportEvent;
  PassengerPerson?: Person[];
  DriverPerson?: Person[];
  ReportingPerson?: Person;
  CrewMemberPerson?: Person[];
  SecurityOfficerPerson?: Person;
  MasterPerson?: Person;
  ShipsSurgeonPerson?: Person;
}

export interface TransportMean {
  JourneyID?: CustomizationID;
  RegistrationNationalityID?: CustomizationID;
  RegistrationNationality?: FP[];
  DirectionCode?: Code;
  TransportMeansTypeCode?: Code;
  TradeServiceCode?: Code;
  Stowage?: FinancialInstitutionElement;
  AirTransport?: AirTransport;
  RoadTransport?: RoadTransport;
  RailTransport?: RailTransport;
  MaritimeTransport?: FinancialInstitutionElement;
  OwnerParty?: FinancialInstitutionElement;
  MeasurementDimension?: Ion[];
}

export interface AirTransport {
  AircraftID?: CustomizationID;
}

export interface RailTransport {
  TrainID?: CustomizationID;
}

export interface RoadTransport {
  LicensePlateID?: CustomizationID;
}

export interface PurpleTransportHandlingUnit {
  ID?: CustomizationID;
  TransportHandlingUnitTypeCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: FP[];
  HazardousRiskIndicator?: CopyIndicator;
  TotalGoodsItemQuantity?: Quantity;
  TotalPackageQuantity?: Quantity;
  DamageRemarks?: FP[];
  ShippingMarks?: FP[];
  TraceID?: CustomizationID;
  HandlingUnitDespatchLine?: FluffyHandlingUnitDespatchLine[];
  ActualPackage?: Package[];
  ReceivedHandlingUnitReceiptLine?: ReceivedHandlingUnitReceiptLine[];
  TransportEquipment?: TransportEquipment[];
  TransportMeans?: TransportMean[];
  HazardousGoodsTransit?: HazardousGoodsTransit[];
  MeasurementDimension?: Dimension[];
  MinimumTemperature?: MaximumTemperatureElement;
  MaximumTemperature?: MaximumTemperatureElement;
  GoodsItem?: TransportHandlingUnitGoodsItem[];
  FloorSpaceMeasurementDimension?: Dimension;
  PalletSpaceMeasurementDimension?: Dimension;
  ShipmentDocumentReference?: IdentityDocumentReferenceElement[];
  Status?: Status[];
  CustomsDeclaration?: CustomsDeclaration[];
  Package?: Package[];
}

export interface TransportHandlingUnitGoodsItem {
  ID?: CustomizationID;
  SequenceNumberID?: CustomizationID;
  Description?: FP[];
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
  Item?: FinancialInstitutionElement[];
  GoodsItemContainer?: PartyIdentification[];
  FreightAllowanceCharge?: ServiceAllowanceChargeElement[];
  InvoiceLine?: FluffyInvoiceLine[];
  Temperature?: HazardousGoodsTransitMaximumTemperature[];
  OriginAddress?: FinancialInstitutionElement;
  Pickup?: FinancialInstitutionElement;
  Despatch?: FinancialInstitutionElement;
  MeasurementDimension?: Ion[];
  ContainingPackage?: FinancialInstitutionElement[];
  ShipmentDocumentReference?: PartyIdentification;
  MinimumTemperature?: HazardousGoodsTransitMaximumTemperature;
  MaximumTemperature?: HazardousGoodsTransitMaximumTemperature;
}

export interface FluffyInvoiceLine {
  ID?: CustomizationID;
  LineExtensionAmount?: Amount;
  Item?: FinancialInstitutionElement;
}

export interface FluffyHandlingUnitDespatchLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: FP[];
  LineStatusCode?: Code;
  DeliveredQuantity?: Quantity;
  BackorderQuantity?: Quantity;
  BackorderReason?: FP[];
  OutstandingQuantity?: Quantity;
  OutstandingReason?: FP[];
  OversupplyQuantity?: Quantity;
  OrderLineReference?: DependentLineReferenceElement[];
  DocumentReference?: PartyIdentification[];
  Item?: FinancialInstitutionElement;
}

export interface HazardousGoodsTransit {
  TransportEmergencyCardCode?: Code;
  PackingCriteriaCode?: Code;
  HazardousRegulationCode?: Code;
  InhalationToxicityZoneCode?: Code;
  TransportAuthorizationCode?: Code;
  MaximumTemperature?: HazardousGoodsTransitMaximumTemperature;
  MinimumTemperature?: HazardousGoodsTransitMaximumTemperature;
}

export interface ReceivedHandlingUnitReceiptLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: FP[];
  ReceivedQuantity?: Quantity;
  ShortQuantity?: Quantity;
  ShortageActionCode?: Code;
  RejectedQuantity?: Quantity;
  RejectReasonCode?: Code;
  RejectReason?: FP[];
  RejectActionCode?: Code;
  QuantityDiscrepancyCode?: Code;
  OversupplyQuantity?: Quantity;
  ReceivedDate?: CopyIndicator;
  TimingComplaintCode?: Code;
  TimingComplaint?: FP;
  OrderLineReference?: DependentLineReferenceElement;
  DespatchLineReference?: DependentLineReferenceElement[];
  DocumentReference?: PartyIdentification[];
  Item?: FinancialInstitutionElement[];
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
  Information?: FP[];
  ReturnabilityIndicator?: CopyIndicator;
  LegalStatusIndicator?: CopyIndicator;
  AirFlowPercent?: LineCountNumeric;
  HumidityPercent?: LineCountNumeric;
  AnimalFoodApprovedIndicator?: CopyIndicator;
  HumanFoodApprovedIndicator?: CopyIndicator;
  DangerousGoodsApprovedIndicator?: CopyIndicator;
  RefrigeratedIndicator?: CopyIndicator;
  Characteristics?: FP;
  DamageRemarks?: FP[];
  Description?: FP[];
  SpecialTransportRequirements?: FP[];
  GrossWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  TareWeightMeasure?: Measure;
  TrackingDeviceCode?: Code;
  PowerIndicator?: CopyIndicator;
  TraceID?: CustomizationID;
  MeasurementDimension?: Ion[];
  TransportEquipmentSeal?: PartyIdentification[];
  MinimumTemperature?: HazardousGoodsTransitMaximumTemperature;
  MaximumTemperature?: HazardousGoodsTransitMaximumTemperature;
  ProviderParty?: FinancialInstitutionElement;
  LoadingProofParty?: FinancialInstitutionElement;
  SupplierParty?: FinancialInstitutionElement;
  OwnerParty?: FinancialInstitutionElement;
  OperatingParty?: FinancialInstitutionElement;
  LoadingLocation?: FinancialInstitutionElement;
  UnloadingLocation?: FinancialInstitutionElement;
  StorageLocation?: FinancialInstitutionElement;
  PositioningTransportEvent?: FinancialInstitutionElement[];
  QuarantineTransportEvent?: FinancialInstitutionElement[];
  DeliveryTransportEvent?: FinancialInstitutionElement[];
  PickupTransportEvent?: FinancialInstitutionElement[];
  HandlingTransportEvent?: FinancialInstitutionElement[];
  LoadingTransportEvent?: FinancialInstitutionElement[];
  TransportEvent?: FinancialInstitutionElement[];
  ApplicableTransportMeans?: FinancialInstitutionElement;
  HaulageTradingTerms?: FinancialInstitutionElement[];
  HazardousGoodsTransit?: FinancialInstitutionElement[];
  ServiceAllowanceCharge?: ServiceAllowanceChargeElement[];
  FreightAllowanceCharge?: ServiceAllowanceChargeElement[];
  Pickup?: FinancialInstitutionElement;
  Despatch?: FinancialInstitutionElement;
  ShipmentDocumentReference?: PartyIdentification[];
  Package?: FinancialInstitutionElement[];
  GoodsItem?: FinancialInstitutionElement[];
}

export interface DeliveryTerms {
  ID?: CustomizationID;
  SpecialTerms?: FP[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: FP[];
  Amount?: Amount;
  DeliveryLocation?: PayeePartyDeliveryLocation;
  AllowanceCharge?: FluffyAllowanceCharge;
}

export interface FluffyAllowanceCharge {
  ID?: CustomizationID;
  ChargeIndicator?: CopyIndicator;
  AllowanceChargeReasonCode?: Code;
  AllowanceChargeReason?: FP[];
  MultiplierFactorNumeric?: LineCountNumeric;
  PrepaidIndicator?: CopyIndicator;
  SequenceNumeric?: LineCountNumeric;
  Amount?: Amount;
  BaseAmount?: Amount;
  AccountingCostCode?: Code;
  AccountingCost?: FP;
  PerUnitAmount?: Amount;
  TaxCategory?: PurpleTaxCategory[];
  TaxTotal?: ItemPriceExtensionTaxTotal;
  PaymentMeans?: TentacledPaymentMean[];
}

export interface TentacledPaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: FP[];
  PaymentID?: CustomizationID[];
  CardAccount?: PurpleCardAccount;
  PayerFinancialAccount?: DespatchPartyFinancialAccount;
  PayeeFinancialAccount?: DespatchPartyFinancialAccount;
  CreditAccount?: CreditAccount;
  PaymentMandate?: FluffyPaymentMandate;
  TradeFinancing?: TentacledTradeFinancing;
}

export interface FluffyPaymentMandate {
  ID?: CustomizationID;
  MandateTypeCode?: Code;
  MaximumPaymentInstructionsNumeric?: LineCountNumeric;
  MaximumPaidAmount?: Amount;
  SignatureID?: CustomizationID;
  PayerParty?: FinancialInstitutionElement;
  PayerFinancialAccount?: FinancialInstitutionElement;
  ValidityPeriod?: FinancialInstitutionElement;
  PaymentReversalPeriod?: FinancialInstitutionElement;
  Clause?: FinancialInstitutionElement[];
}

export interface TentacledTradeFinancing {
  ID?: CustomizationID;
  FinancingInstrumentCode?: Code;
  ContractDocumentReference?: PartyIdentification;
  DocumentReference?: PartyIdentification[];
  FinancingParty?: FinancialInstitutionElement;
  FinancingFinancialAccount?: FinancialInstitutionElement;
  Clause?: FinancialInstitutionElement[];
}

export interface PurpleTaxCategory {
  ID?: CustomizationID;
  Name?: FP;
  Percent?: LineCountNumeric;
  BaseUnitMeasure?: Measure;
  PerUnitAmount?: Amount;
  TaxExemptionReasonCode?: Code;
  TaxExemptionReason?: FP[];
  TierRange?: FP;
  TierRatePercent?: LineCountNumeric;
  TaxScheme?: ClassifiedTaxCategoryTaxScheme;
}

export interface ItemPriceExtensionTaxTotal {
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
  TierRange?: FP;
  TierRatePercent?: LineCountNumeric;
  TaxCategory?: PartyTaxSchemeElement;
}

export interface PEFInvoiceInvoiceLine {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  Note?: FP[];
  InvoicedQuantity?: Quantity;
  LineExtensionAmount?: Amount;
  TaxPointDate?: CopyIndicator;
  AccountingCostCode?: Code;
  AccountingCost?: FP;
  PaymentPurposeCode?: Code;
  FreeOfChargeIndicator?: CopyIndicator;
  InvoicePeriod?: Period[];
  OrderLineReference?: OrderLineReference[];
  DespatchLineReference?: PurpleLineReference[];
  ReceiptLineReference?: PurpleLineReference[];
  BillingReference?: InvoiceLineBillingReference[];
  DocumentReference?: OriginalDocumentReferenceElement[];
  PricingReference?: PricingReference;
  OriginatorParty?: Party;
  Delivery?: InvoiceLineDelivery[];
  PaymentTerms?: InvoiceLinePaymentTerm[];
  AllowanceCharge?: FluffyAllowanceCharge[];
  TaxTotal?: PurpleTaxTotal[];
  WithholdingTaxTotal?: PurpleTaxTotal[];
  Item?: InvoiceLineItem;
  Price?: FluffyPrice;
  DeliveryTerms?: DeliveryDeliveryTerms;
  ItemPriceExtension?: FluffyItemPriceExtension;
}

export interface InvoiceLineBillingReference {
  InvoiceDocumentReference?: CatalogueDocumentReferenceElement;
  SelfBilledInvoiceDocumentReference?: CatalogueDocumentReferenceElement;
  CreditNoteDocumentReference?: CatalogueDocumentReferenceElement;
  SelfBilledCreditNoteDocumentReference?: CatalogueDocumentReferenceElement;
  DebitNoteDocumentReference?: CatalogueDocumentReferenceElement;
  ReminderDocumentReference?: CatalogueDocumentReferenceElement;
  AdditionalDocumentReference?: CatalogueDocumentReferenceElement;
  BillingReferenceLine?: FluffyBillingReferenceLine[];
}

export interface CatalogueDocumentReferenceElement {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: FP;
  XPath?: FP[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: FP[];
  Attachment?: CatalogueDocumentReferenceAttachment;
  ValidityPeriod?: Period;
  IssuerParty?: SignatoryPartyElement;
  ResultOfVerification?: CatalogueDocumentReferenceResultOfVerification;
}

export interface CatalogueDocumentReferenceAttachment {
  EmbeddedDocumentBinaryObject?: EmbeddedDocumentBinaryObject;
  ExternalReference?: FinancialInstitutionElement;
}

export interface CatalogueDocumentReferenceResultOfVerification {
  ValidatorID?: CustomizationID;
  ValidationResultCode?: Code;
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidateProcess?: FP;
  ValidateTool?: FP;
  ValidateToolVersion?: FP;
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
  PhysicalLocation?: FreightChargeLocationClass;
  PartyTaxScheme?: DespatchPartyPartyTaxScheme[];
  PartyLegalEntity?: DespatchPartyPartyLegalEntity[];
  Contact?: DespatchPartyContact;
  Person?: PurplePerson[];
  FinancialAccount?: DespatchPartyFinancialAccount;
}

export interface PurplePerson {
  ID?: CustomizationID;
  FirstName?: FP;
  FamilyName?: FP;
  Title?: FP;
  MiddleName?: FP;
  OtherName?: FP;
  NameSuffix?: FP;
  JobTitle?: FP;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: FP;
  OrganizationDepartment?: FP;
  Contact?: FinancialInstitutionElement;
  FinancialAccount?: FinancialInstitutionElement;
  ResidenceAddress?: FinancialInstitutionElement;
}

export interface FluffyBillingReferenceLine {
  ID?: CustomizationID;
  Amount?: Amount;
  AllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
}

export interface InvoiceLineDelivery {
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
  DeliveryAddress?: PartyPostalAddress;
  DeliveryLocation?: PartyPhysicalLocation;
  AlternativeDeliveryLocation?: PartyPhysicalLocation;
  RequestedDeliveryPeriod?: Period;
  PromisedDeliveryPeriod?: Period;
  EstimatedDeliveryPeriod?: Period;
  CarrierParty?: InformationContentProviderPartyClass;
  DeliveryParty?: InformationContentProviderPartyClass;
  NotifyParty?: InformationContentProviderPartyClass[];
  Despatch?: FluffyDespatch;
  DeliveryTerms?: DeliveryTerm[];
  MinimumDeliveryUnit?: DeliveryMaximumDeliveryUnit;
  MaximumDeliveryUnit?: DeliveryMaximumDeliveryUnit;
  Shipment?: FluffyShipment;
}

export interface DeliveryTerm {
  ID?: CustomizationID;
  SpecialTerms?: FP[];
  LossRiskResponsibilityCode?: Code;
  LossRisk?: FP[];
  Amount?: Amount;
  DeliveryLocation?: FreightChargeLocationClass;
  AllowanceCharge?: BillingReferenceLineExtraAllowanceCharge;
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
  Instructions?: FP[];
  DespatchAddress?: ApplicableTerritoryAddressElement;
  DespatchLocation?: FreightChargeLocationClass;
  DespatchParty?: SignatoryPartyElement;
  CarrierParty?: SignatoryPartyElement;
  NotifyParty?: SignatoryPartyElement[];
  Contact?: DespatchPartyContact;
  EstimatedDespatchPeriod?: Period;
  RequestedDespatchPeriod?: Period;
}

export interface FluffyShipment {
  ID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: FP[];
  Information?: FP[];
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
  SpecialInstructions?: FP[];
  DeliveryInstructions?: FP[];
  SplitConsignmentIndicator?: CopyIndicator;
  ConsignmentQuantity?: Quantity;
  Consignment?: FluffyConsignment[];
  GoodsItem?: TransportHandlingUnitGoodsItem[];
  ShipmentStage?: ShipmentStage[];
  TransportHandlingUnit?: ConsignmentTransportHandlingUnit[];
  ReturnAddress?: ApplicableTerritoryAddressElement;
  OriginAddress?: ApplicableTerritoryAddressElement;
  FirstArrivalPortLocation?: FreightChargeLocationClass;
  LastExitPortLocation?: FreightChargeLocationClass;
  ExportCountry?: Country;
  FreightAllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
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
  SummaryDescription?: FP[];
  TotalInvoiceAmount?: Amount;
  DeclaredCustomsValueAmount?: Amount;
  TariffDescription?: FP[];
  TariffCode?: Code;
  InsurancePremiumAmount?: Amount;
  GrossWeightMeasure?: Measure;
  NetWeightMeasure?: Measure;
  NetNetWeightMeasure?: Measure;
  ChargeableWeightMeasure?: Measure;
  GrossVolumeMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  LoadingLengthMeasure?: Measure;
  Remarks?: FP[];
  HazardousRiskIndicator?: CopyIndicator;
  AnimalFoodIndicator?: CopyIndicator;
  HumanFoodIndicator?: CopyIndicator;
  LivestockIndicator?: CopyIndicator;
  BulkCargoIndicator?: CopyIndicator;
  ContainerizedIndicator?: CopyIndicator;
  GeneralCargoIndicator?: CopyIndicator;
  SpecialSecurityIndicator?: CopyIndicator;
  ThirdPartyPayerIndicator?: CopyIndicator;
  CarrierServiceInstructions?: FP[];
  CustomsClearanceServiceInstructions?: FP[];
  ForwarderServiceInstructions?: FP[];
  SpecialServiceInstructions?: FP[];
  SequenceID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: FP[];
  Information?: FP[];
  TotalGoodsItemQuantity?: Quantity;
  TotalTransportHandlingUnitQuantity?: Quantity;
  InsuranceValueAmount?: Amount;
  DeclaredForCarriageValueAmount?: Amount;
  DeclaredStatisticsValueAmount?: Amount;
  FreeOnBoardValueAmount?: Amount;
  SpecialInstructions?: FP[];
  SplitConsignmentIndicator?: CopyIndicator;
  DeliveryInstructions?: FP[];
  ConsignmentQuantity?: Quantity;
  ConsolidatableIndicator?: CopyIndicator;
  HaulageInstructions?: FP[];
  LoadingSequenceID?: CustomizationID;
  ChildConsignmentQuantity?: Quantity;
  TotalPackagesQuantity?: Quantity;
  CustomsDeclaration?: PartyIdentification[];
  RequestedPickupTransportEvent?: FinancialInstitutionElement;
  RequestedDeliveryTransportEvent?: FinancialInstitutionElement;
  PlannedPickupTransportEvent?: FinancialInstitutionElement;
  PlannedDeliveryTransportEvent?: FinancialInstitutionElement;
  Status?: FinancialInstitutionElement[];
  ConsigneeParty?: FinancialInstitutionElement;
  ExporterParty?: FinancialInstitutionElement;
  ConsignorParty?: FinancialInstitutionElement;
  ImporterParty?: FinancialInstitutionElement;
  CarrierParty?: FinancialInstitutionElement;
  FreightForwarderParty?: FinancialInstitutionElement;
  NotifyParty?: FinancialInstitutionElement;
  OriginalDespatchParty?: FinancialInstitutionElement;
  FinalDeliveryParty?: FinancialInstitutionElement;
  PerformingCarrierParty?: FinancialInstitutionElement;
  SubstituteCarrierParty?: FinancialInstitutionElement;
  LogisticsOperatorParty?: FinancialInstitutionElement;
  TransportAdvisorParty?: FinancialInstitutionElement;
  HazardousItemNotificationParty?: FinancialInstitutionElement;
  InsuranceParty?: FinancialInstitutionElement;
  MortgageHolderParty?: FinancialInstitutionElement;
  BillOfLadingHolderParty?: FinancialInstitutionElement;
  OriginalDepartureCountry?: FinancialInstitutionElement;
  FinalDestinationCountry?: FinancialInstitutionElement;
  TransitCountry?: FinancialInstitutionElement[];
  TransportContract?: FinancialInstitutionElement;
  TransportEvent?: FinancialInstitutionElement[];
  OriginalDespatchTransportationService?: FluffyTransportationService;
  FinalDeliveryTransportationService?: FluffyTransportationService;
  DeliveryTerms?: FinancialInstitutionElement;
  PaymentTerms?: FinancialInstitutionElement;
  CollectPaymentTerms?: FinancialInstitutionElement;
  DisbursementPaymentTerms?: FinancialInstitutionElement;
  PrepaidPaymentTerms?: FinancialInstitutionElement;
  FreightAllowanceCharge?: ServiceAllowanceChargeElement[];
  ExtraAllowanceCharge?: ServiceAllowanceChargeElement[];
  MainCarriageShipmentStage?: FinancialInstitutionElement[];
  PreCarriageShipmentStage?: FinancialInstitutionElement[];
  OnCarriageShipmentStage?: FinancialInstitutionElement[];
  TransportHandlingUnit?: FinancialInstitutionElement[];
  FirstArrivalPortLocation?: FinancialInstitutionElement;
  LastExitPortLocation?: FinancialInstitutionElement;
}

export interface FluffyTransportationService {
  TransportServiceCode?: Code;
}

export interface PurpleLineReference {
  LineID?: CustomizationID;
  UUID?: CustomizationID;
  LineStatusCode?: Code;
  DocumentReference?: CatalogueDocumentReferenceElement;
}

export interface InvoiceLineItem {
  Description?: FP[];
  PackQuantity?: Quantity;
  PackSizeNumeric?: LineCountNumeric;
  CatalogueIndicator?: CopyIndicator;
  Name?: FP;
  HazardousRiskIndicator?: CopyIndicator;
  AdditionalInformation?: FP[];
  Keyword?: FP[];
  BrandName?: FP[];
  ModelName?: FP[];
  BuyersItemIdentification?: ItemIdentification;
  SellersItemIdentification?: ItemIdentification;
  ManufacturersItemIdentification?: ItemIdentification[];
  StandardItemIdentification?: ItemIdentification;
  CatalogueItemIdentification?: ItemIdentification;
  AdditionalItemIdentification?: ItemIdentification[];
  CatalogueDocumentReference?: CatalogueDocumentReferenceElement;
  ItemSpecificationDocumentReference?: CatalogueDocumentReferenceElement[];
  OriginCountry?: Country;
  CommodityClassification?: CommodityClassification[];
  TransactionConditions?: TransactionCondition[];
  HazardousItem?: HazardousItem[];
  ClassifiedTaxCategory?: PurpleTaxCategory[];
  AdditionalItemProperty?: ItemAdditionalItemProperty[];
  ManufacturerParty?: InformationContentProviderPartyClass[];
  InformationContentProviderParty?: InformationContentProviderPartyClass;
  OriginAddress?: PartyPostalAddress[];
  ItemInstance?: ItemInstance[];
  Certificate?: FluffyCertificate[];
  Dimension?: Dimension[];
}

export interface ItemIdentification {
  ID?: CustomizationID;
  ExtendedID?: CustomizationID;
  BarcodeSymbologyID?: CustomizationID;
  PhysicalAttribute?: PhysicalAttribute[];
  MeasurementDimension?: Dimension[];
  IssuerParty?: SignatoryPartyElement;
}

export interface PhysicalAttribute {
  AttributeID?: CustomizationID;
  PositionCode?: Code;
  DescriptionCode?: Code;
  Description?: FP[];
}

export interface ItemAdditionalItemProperty {
  ID?: CustomizationID;
  Name?: FP;
  NameCode?: Code;
  TestMethod?: FP;
  Value?: FP;
  ValueQuantity?: Quantity;
  ValueQualifier?: FP[];
  ImportanceCode?: Code;
  ListValue?: FP[];
  UsabilityPeriod?: Period;
  ItemPropertyGroup?: ItemPropertyGroup[];
  RangeDimension?: Dimension;
  ItemPropertyRange?: ItemPropertyRange;
}

export interface ItemPropertyGroup {
  ID?: CustomizationID;
  Name?: FP;
  ImportanceCode?: Code;
}

export interface ItemPropertyRange {
  MinimumValue?: FP;
  MaximumValue?: FP;
}

export interface FluffyCertificate {
  ID?: CustomizationID;
  CertificateTypeCode?: Code;
  CertificateType?: FP;
  Remarks?: FP[];
  IssuerParty?: SignatoryPartyElement;
  DocumentReference?: IdentityDocumentReferenceElement[];
  Signature?: CertificateSignature[];
}

export interface CertificateSignature {
  ID?: CustomizationID;
  Note?: FP[];
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidatorID?: CustomizationID;
  CanonicalizationMethod?: FP;
  SignatureMethod?: FP;
  SignatoryParty?: FinancialInstitutionElement;
  DigitalSignatureAttachment?: FinancialInstitutionElement;
  OriginalDocumentReference?: PartyIdentification;
}

export interface CommodityClassification {
  NatureCode?: Code;
  CargoTypeCode?: Code;
  CommodityCode?: Code;
  ItemClassificationCode?: Code;
}

export interface HazardousItem {
  ID?: CustomizationID;
  PlacardNotation?: FP;
  PlacardEndorsement?: FP;
  AdditionalInformation?: FP[];
  UNDGCode?: Code;
  EmergencyProceduresCode?: Code;
  MedicalFirstAidGuideCode?: Code;
  TechnicalName?: FP;
  CategoryName?: FP;
  HazardousCategoryCode?: Code;
  UpperOrangeHazardPlacardID?: CustomizationID;
  LowerOrangeHazardPlacardID?: CustomizationID;
  MarkingID?: CustomizationID;
  HazardClassID?: CustomizationID;
  NetWeightMeasure?: Measure;
  NetVolumeMeasure?: Measure;
  Quantity?: Quantity;
  ContactParty?: SignatoryPartyElement;
  SecondaryHazard?: SecondaryHazard[];
  HazardousGoodsTransit?: HazardousGoodsTransit[];
  EmergencyTemperature?: MaximumTemperatureElement;
  FlashpointTemperature?: MaximumTemperatureElement;
  AdditionalTemperature?: MaximumTemperatureElement[];
}

export interface SecondaryHazard {
  ID?: CustomizationID;
  PlacardNotation?: FP;
  PlacardEndorsement?: FP;
  EmergencyProceduresCode?: Code;
  Extension?: FP[];
}

export interface ItemInstance {
  ProductTraceID?: CustomizationID;
  ManufactureDate?: CopyIndicator;
  ManufactureTime?: CopyIndicator;
  BestBeforeDate?: CopyIndicator;
  RegistrationID?: CustomizationID;
  SerialID?: CustomizationID;
  AdditionalItemProperty?: ItemInstanceAdditionalItemProperty[];
  LotIdentification?: LotIdentification;
}

export interface ItemInstanceAdditionalItemProperty {
  ID?: CustomizationID;
  Name?: FP;
  NameCode?: Code;
  TestMethod?: FP;
  Value?: FP;
  ValueQuantity?: Quantity;
  ValueQualifier?: FP[];
  ImportanceCode?: Code;
  ListValue?: FP[];
  UsabilityPeriod?: FinancialInstitutionElement;
  ItemPropertyGroup?: PartyIdentification[];
  RangeDimension?: Ion;
  ItemPropertyRange?: FinancialInstitutionElement;
}

export interface LotIdentification {
  LotNumberID?: CustomizationID;
  ExpiryDate?: CopyIndicator;
  AdditionalItemProperty?: PartyName[];
}

export interface TransactionCondition {
  ID?: CustomizationID;
  ActionCode?: Code;
  Description?: FP[];
  DocumentReference?: IdentityDocumentReferenceElement[];
}

export interface FluffyItemPriceExtension {
  Amount?: Amount;
  TaxTotal?: ItemPriceExtensionTaxTotal[];
}

export interface OrderLineReference {
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
  CustomerReference?: FP;
  OrderTypeCode?: Code;
  DocumentReference?: IdentityDocumentReferenceElement;
}

export interface InvoiceLinePaymentTerm {
  ID?: CustomizationID;
  PaymentMeansID?: CustomizationID[];
  PrepaidPaymentReferenceID?: CustomizationID;
  Note?: FP[];
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
  InvoicingPartyReference?: FP;
  SettlementPeriod?: Period;
  PenaltyPeriod?: Period;
  ExchangeRate?: PaymentTermPricingExchangeRate;
  ValidityPeriod?: Period;
}

export interface PaymentTermPricingExchangeRate {
  SourceCurrencyCode?: Code;
  SourceCurrencyBaseRate?: LineCountNumeric;
  TargetCurrencyCode?: Code;
  TargetCurrencyBaseRate?: LineCountNumeric;
  ExchangeMarketID?: CustomizationID;
  CalculationRate?: LineCountNumeric;
  MathematicOperatorCode?: Code;
  Date?: CopyIndicator;
  ForeignExchangeContract?: Contract;
}

export interface FluffyPrice {
  PriceAmount?: Amount;
  BaseQuantity?: Quantity;
  PriceChangeReason?: FP[];
  PriceTypeCode?: Code;
  PriceType?: FP;
  OrderableUnitFactorRate?: LineCountNumeric;
  ValidityPeriod?: Period[];
  PriceList?: PricePriceList;
  AllowanceCharge?: PurpleAllowanceCharge[];
  PricingExchangeRate?: PaymentTermPricingExchangeRate;
}

export interface PricePriceList {
  ID?: CustomizationID;
  StatusCode?: Code;
  ValidityPeriod?: Period[];
}

export interface PricingReference {
  OriginalItemLocationQuantity?: OriginalItemLocationQuantity;
  AlternativeConditionPrice?: AlternativeConditionPrice[];
}

export interface AlternativeConditionPrice {
  PriceAmount?: Amount;
  BaseQuantity?: Quantity;
  PriceChangeReason?: FP[];
  PriceTypeCode?: Code;
  PriceType?: FP;
  OrderableUnitFactorRate?: LineCountNumeric;
  ValidityPeriod?: Period[];
  PriceList?: AlternativeConditionPricePriceList;
  AllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  PricingExchangeRate?: PricingExchangeRate;
}

export interface AlternativeConditionPricePriceList {
  ID?: CustomizationID;
  StatusCode?: Code;
  ValidityPeriod?: FinancialInstitutionElement[];
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
  ForeignExchangeContract?: FinancialInstitutionElement;
}

export interface OriginalItemLocationQuantity {
  LeadTimeMeasure?: Measure;
  MinimumQuantity?: Quantity;
  MaximumQuantity?: Quantity;
  HazardousRiskIndicator?: CopyIndicator;
  TradingRestrictions?: FP[];
  ApplicableTerritoryAddress?: ApplicableTerritoryAddressElement[];
  Price?: OriginalItemLocationQuantityPrice;
  DeliveryUnit?: DeliveryMaximumDeliveryUnit[];
  ApplicableTaxCategory?: ApplicableTaxCategoryElement[];
  Package?: Package;
  AllowanceCharge?: BillingReferenceLineExtraAllowanceCharge[];
  DependentPriceReference?: DependentPriceReference;
}

export interface DependentPriceReference {
  Percent?: LineCountNumeric;
  LocationAddress?: FinancialInstitutionElement;
  DependentLineReference?: DependentLineReferenceElement;
}

export interface OriginalItemLocationQuantityPrice {
  PriceAmount?: Amount;
  BaseQuantity?: Quantity;
  PriceChangeReason?: FP[];
  PriceTypeCode?: Code;
  PriceType?: FP;
  OrderableUnitFactorRate?: LineCountNumeric;
  ValidityPeriod?: FinancialInstitutionElement[];
  PriceList?: FinancialInstitutionElement;
  AllowanceCharge?: ServiceAllowanceChargeElement[];
  PricingExchangeRate?: CollectPaymentTermsPricingExchangeRate;
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
  CustomerReference?: FP;
  OrderTypeCode?: Code;
  DocumentReference?: OriginalDocumentReferenceElement;
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
  PostalAddress?: PartyPostalAddress;
  PhysicalLocation?: PayeePartyDeliveryLocation;
  PartyTaxScheme?: PayeePartyPartyTaxScheme[];
  PartyLegalEntity?: PayeePartyPartyLegalEntity[];
  Contact?: Contact;
  Person?: PayeePartyPerson[];
  FinancialAccount?: PayeePartyFinancialAccount;
}

export interface PayeePartyFinancialAccount {
  ID?: CustomizationID;
  Name?: FP;
  AliasName?: FP;
  AccountTypeCode?: Code;
  AccountFormatCode?: Code;
  CurrencyCode?: Code;
  PaymentNote?: FP[];
  FinancialInstitutionBranch?: FinancialInstitutionBranch;
  Country?: Country;
}

export interface FinancialInstitutionBranch {
  ID?: CustomizationID;
  Name?: FP;
  FinancialInstitution?: FinancialInstitution;
  Address?: ApplicableTerritoryAddressElement;
}

export interface PayeePartyPartyLegalEntity {
  RegistrationName?: FP;
  CompanyID?: CustomizationID;
  RegistrationDate?: CopyIndicator;
  RegistrationExpirationDate?: CopyIndicator;
  CompanyLegalFormCode?: Code;
  CompanyLegalForm?: FP;
  SoleProprietorshipIndicator?: CopyIndicator;
  CompanyLiquidationStatusCode?: Code;
  CorporateStockAmount?: Amount;
  FullyPaidSharesIndicator?: CopyIndicator;
  RegistrationAddress?: PartyPostalAddress;
  CorporateRegistrationScheme?: FluffyCorporateRegistrationScheme;
  ShareholderParty?: ShareholderParty[];
}

export interface FluffyCorporateRegistrationScheme {
  ID?: CustomizationID;
  Name?: FP;
  CorporateRegistrationTypeCode?: Code;
  JurisdictionRegionAddress?: ApplicableTerritoryAddressElement[];
}

export interface PayeePartyPartyTaxScheme {
  RegistrationName?: FP;
  CompanyID?: CustomizationID;
  TaxLevelCode?: Code;
  ExemptionReasonCode?: Code;
  ExemptionReason?: FP[];
  RegistrationAddress?: PartyPostalAddress;
  TaxScheme?: PurpleTaxScheme;
}

export interface PayeePartyPerson {
  ID?: CustomizationID;
  FirstName?: FP;
  FamilyName?: FP;
  Title?: FP;
  MiddleName?: FP;
  OtherName?: FP;
  NameSuffix?: FP;
  JobTitle?: FP;
  NationalityID?: CustomizationID;
  GenderCode?: Code;
  BirthDate?: CopyIndicator;
  BirthplaceName?: FP;
  OrganizationDepartment?: FP;
  Contact?: Contact;
  FinancialAccount?: PartyFinancialAccount;
  IdentityDocumentReference?: IdentityDocumentReference[];
  ResidenceAddress?: PartyPostalAddress;
}

export interface IdentityDocumentReference {
  ID?: CustomizationID;
  CopyIndicator?: CopyIndicator;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  IssueTime?: CopyIndicator;
  DocumentTypeCode?: Code;
  DocumentType?: FP;
  XPath?: FP[];
  LanguageID?: CustomizationID;
  LocaleCode?: Code;
  VersionID?: CustomizationID;
  DocumentStatusCode?: Code;
  DocumentDescription?: FP[];
  Attachment?: CatalogueDocumentReferenceAttachment;
  ValidityPeriod?: Period;
  ResultOfVerification?: CatalogueDocumentReferenceResultOfVerification;
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
  ContractType?: FP;
  Note?: FP[];
  VersionID?: CustomizationID;
  Description?: FP[];
  ValidityPeriod?: Period;
  ContractDocumentReference?: CatalogueDocumentReferenceElement[];
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
  DeliveryLocation?: FreightChargeLocationClass;
  AlternativeDeliveryLocation?: FreightChargeLocationClass;
  RequestedDeliveryPeriod?: Period;
  PromisedDeliveryPeriod?: Period;
  EstimatedDeliveryPeriod?: Period;
  CarrierParty?: SignatoryPartyElement;
  DeliveryParty?: SignatoryPartyElement;
  NotifyParty?: SignatoryPartyElement[];
  Despatch?: GoodsItemDespatch;
  DeliveryTerms?: ConsignmentDeliveryTerm[];
  MinimumDeliveryUnit?: DeliveryMaximumDeliveryUnit;
  MaximumDeliveryUnit?: DeliveryMaximumDeliveryUnit;
  Shipment?: ContractualDeliveryShipment;
}

export interface ContractualDeliveryShipment {
  ID?: CustomizationID;
  ShippingPriorityLevelCode?: Code;
  HandlingCode?: Code;
  HandlingInstructions?: FP[];
  Information?: FP[];
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
  SpecialInstructions?: FP[];
  DeliveryInstructions?: FP[];
  SplitConsignmentIndicator?: CopyIndicator;
  ConsignmentQuantity?: Quantity;
  Consignment?: PartyIdentification[];
  GoodsItem?: FinancialInstitutionElement[];
  ShipmentStage?: FinancialInstitutionElement[];
  TransportHandlingUnit?: FinancialInstitutionElement[];
  ReturnAddress?: FinancialInstitutionElement;
  OriginAddress?: FinancialInstitutionElement;
  FirstArrivalPortLocation?: FinancialInstitutionElement;
  LastExitPortLocation?: FinancialInstitutionElement;
  ExportCountry?: FinancialInstitutionElement;
  FreightAllowanceCharge?: ServiceAllowanceChargeElement[];
}

export interface PEFInvoicePaymentMean {
  ID?: CustomizationID;
  PaymentMeansCode?: Code;
  PaymentDueDate?: CopyIndicator;
  PaymentChannelCode?: Code;
  InstructionID?: CustomizationID;
  InstructionNote?: FP[];
  PaymentID?: CustomizationID[];
  CardAccount?: PurpleCardAccount;
  PayerFinancialAccount?: PayeePartyFinancialAccount;
  PayeeFinancialAccount?: PayeePartyFinancialAccount;
  CreditAccount?: CreditAccount;
  PaymentMandate?: TentacledPaymentMandate;
  TradeFinancing?: StickyTradeFinancing;
}

export interface TentacledPaymentMandate {
  ID?: CustomizationID;
  MandateTypeCode?: Code;
  MaximumPaymentInstructionsNumeric?: LineCountNumeric;
  MaximumPaidAmount?: Amount;
  SignatureID?: CustomizationID;
  PayerParty?: InformationContentProviderPartyClass;
  PayerFinancialAccount?: PartyFinancialAccount;
  ValidityPeriod?: Period;
  PaymentReversalPeriod?: Period;
  Clause?: Clause[];
}

export interface StickyTradeFinancing {
  ID?: CustomizationID;
  FinancingInstrumentCode?: Code;
  ContractDocumentReference?: CatalogueDocumentReferenceElement;
  DocumentReference?: CatalogueDocumentReferenceElement[];
  FinancingParty?: InformationContentProviderPartyClass;
  FinancingFinancialAccount?: PartyFinancialAccount;
  Clause?: Clause[];
}

export interface PEFInvoicePaymentTerm {
  ID?: CustomizationID;
  PaymentMeansID?: CustomizationID[];
  PrepaidPaymentReferenceID?: CustomizationID;
  Note?: FP[];
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
  InvoicingPartyReference?: FP;
  SettlementPeriod?: Period;
  PenaltyPeriod?: Period;
  ExchangeRate?: PurpleExchangeRate;
  ValidityPeriod?: Period;
}

export interface PurpleExchangeRate {
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
  ContractType?: FP;
  Note?: FP[];
  VersionID?: CustomizationID;
  Description?: FP[];
  ValidityPeriod?: Period;
  ContractDocumentReference?: IdentityDocumentReferenceElement[];
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
  DeliveryAddress?: FinancialInstitutionElement;
  DeliveryLocation?: FinancialInstitutionElement;
  AlternativeDeliveryLocation?: FinancialInstitutionElement;
  RequestedDeliveryPeriod?: FinancialInstitutionElement;
  PromisedDeliveryPeriod?: FinancialInstitutionElement;
  EstimatedDeliveryPeriod?: FinancialInstitutionElement;
  CarrierParty?: FinancialInstitutionElement;
  DeliveryParty?: FinancialInstitutionElement;
  NotifyParty?: FinancialInstitutionElement[];
  Despatch?: FinancialInstitutionElement;
  DeliveryTerms?: FinancialInstitutionElement[];
  MinimumDeliveryUnit?: PackageMaximumDeliveryUnit;
  MaximumDeliveryUnit?: PackageMaximumDeliveryUnit;
  Shipment?: PartyIdentification;
}

export interface PrepaidPayment {
  ID?: CustomizationID;
  PaidAmount?: Amount;
  ReceivedDate?: CopyIndicator;
  PaidDate?: CopyIndicator;
  PaidTime?: CopyIndicator;
  InstructionID?: CustomizationID;
}

export interface ProjectReference {
  ID?: CustomizationID;
  UUID?: CustomizationID;
  IssueDate?: CopyIndicator;
  WorkPhaseReference?: WorkPhaseReference[];
}

export interface WorkPhaseReference {
  ID?: CustomizationID;
  WorkPhaseCode?: Code;
  WorkPhase?: FP[];
  ProgressPercent?: LineCountNumeric;
  StartDate?: CopyIndicator;
  EndDate?: CopyIndicator;
  WorkOrderDocumentReference?: CatalogueDocumentReferenceElement[];
}

export interface PEFInvoiceSignature {
  ID?: CustomizationID;
  Note?: FP[];
  ValidationDate?: CopyIndicator;
  ValidationTime?: CopyIndicator;
  ValidatorID?: CustomizationID;
  CanonicalizationMethod?: FP;
  SignatureMethod?: FP;
  SignatoryParty?: Party;
  DigitalSignatureAttachment?: Attachment;
  OriginalDocumentReference?: OriginalDocumentReferenceElement;
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
  TierRange?: FP;
  TierRatePercent?: LineCountNumeric;
  TaxCategory?: PurpleTaxCategory;
}

export interface UBLExtensions {
  UBLExtension?: UBLExtension[];
}

export interface UBLExtension {
  ID?: CustomizationID;
  Name?: FP;
  ExtensionAgencyID?: CustomizationID;
  ExtensionAgencyName?: FP;
  ExtensionVersionID?: CustomizationID;
  ExtensionAgencyURI?: CustomizationID;
  ExtensionURI?: CustomizationID;
  ExtensionReasonCode?: Code;
  ExtensionReason?: FP;
  ExtensionContent?: ExtensionContent;
}

export interface ExtensionContent {
  'auto-generated_for_wildcard'?: FinancialInstitutionElement;
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
