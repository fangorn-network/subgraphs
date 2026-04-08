export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: string; output: string; }
  BigInt: { input: string; output: string; }
  Bytes: { input: string; output: string; }
  Int8: { input: number; output: number; }
  Timestamp: { input: any; output: any; }
};

/** Indicates whether the current, partially filled bucket should be included in the response. Defaults to `exclude` */
export type Aggregation_Current =
  /** Exclude the current, partially filled bucket from the response */
  | 'exclude'
  /** Include the current, partially filled bucket in the response */
  | 'include';

export type Aggregation_Interval =
  | 'day'
  | 'hour';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type FileField_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  acc?: InputMaybe<Scalars['String']['input']>;
  acc_contains?: InputMaybe<Scalars['String']['input']>;
  acc_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  acc_ends_with?: InputMaybe<Scalars['String']['input']>;
  acc_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  acc_gt?: InputMaybe<Scalars['String']['input']>;
  acc_gte?: InputMaybe<Scalars['String']['input']>;
  acc_in?: InputMaybe<Array<Scalars['String']['input']>>;
  acc_lt?: InputMaybe<Scalars['String']['input']>;
  acc_lte?: InputMaybe<Scalars['String']['input']>;
  acc_not?: InputMaybe<Scalars['String']['input']>;
  acc_not_contains?: InputMaybe<Scalars['String']['input']>;
  acc_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  acc_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  acc_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  acc_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  acc_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  acc_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  acc_starts_with?: InputMaybe<Scalars['String']['input']>;
  acc_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<FileField_Filter>>>;
  atType?: InputMaybe<Scalars['String']['input']>;
  atType_contains?: InputMaybe<Scalars['String']['input']>;
  atType_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  atType_ends_with?: InputMaybe<Scalars['String']['input']>;
  atType_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  atType_gt?: InputMaybe<Scalars['String']['input']>;
  atType_gte?: InputMaybe<Scalars['String']['input']>;
  atType_in?: InputMaybe<Array<Scalars['String']['input']>>;
  atType_lt?: InputMaybe<Scalars['String']['input']>;
  atType_lte?: InputMaybe<Scalars['String']['input']>;
  atType_not?: InputMaybe<Scalars['String']['input']>;
  atType_not_contains?: InputMaybe<Scalars['String']['input']>;
  atType_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  atType_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  atType_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  atType_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  atType_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  atType_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  atType_starts_with?: InputMaybe<Scalars['String']['input']>;
  atType_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<Scalars['String']['input']>;
  file_?: InputMaybe<File_Filter>;
  file_contains?: InputMaybe<Scalars['String']['input']>;
  file_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  file_ends_with?: InputMaybe<Scalars['String']['input']>;
  file_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  file_gt?: InputMaybe<Scalars['String']['input']>;
  file_gte?: InputMaybe<Scalars['String']['input']>;
  file_in?: InputMaybe<Array<Scalars['String']['input']>>;
  file_lt?: InputMaybe<Scalars['String']['input']>;
  file_lte?: InputMaybe<Scalars['String']['input']>;
  file_not?: InputMaybe<Scalars['String']['input']>;
  file_not_contains?: InputMaybe<Scalars['String']['input']>;
  file_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  file_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  file_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  file_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  file_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  file_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  file_starts_with?: InputMaybe<Scalars['String']['input']>;
  file_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<FileField_Filter>>>;
  pricing?: InputMaybe<Scalars['String']['input']>;
  pricing_?: InputMaybe<PricingResource_Filter>;
  pricing_contains?: InputMaybe<Scalars['String']['input']>;
  pricing_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pricing_ends_with?: InputMaybe<Scalars['String']['input']>;
  pricing_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pricing_gt?: InputMaybe<Scalars['String']['input']>;
  pricing_gte?: InputMaybe<Scalars['String']['input']>;
  pricing_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pricing_lt?: InputMaybe<Scalars['String']['input']>;
  pricing_lte?: InputMaybe<Scalars['String']['input']>;
  pricing_not?: InputMaybe<Scalars['String']['input']>;
  pricing_not_contains?: InputMaybe<Scalars['String']['input']>;
  pricing_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pricing_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pricing_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pricing_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pricing_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pricing_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pricing_starts_with?: InputMaybe<Scalars['String']['input']>;
  pricing_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  value_contains?: InputMaybe<Scalars['String']['input']>;
  value_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  value_ends_with?: InputMaybe<Scalars['String']['input']>;
  value_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_gt?: InputMaybe<Scalars['String']['input']>;
  value_gte?: InputMaybe<Scalars['String']['input']>;
  value_in?: InputMaybe<Array<Scalars['String']['input']>>;
  value_lt?: InputMaybe<Scalars['String']['input']>;
  value_lte?: InputMaybe<Scalars['String']['input']>;
  value_not?: InputMaybe<Scalars['String']['input']>;
  value_not_contains?: InputMaybe<Scalars['String']['input']>;
  value_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  value_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  value_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  value_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  value_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  value_starts_with?: InputMaybe<Scalars['String']['input']>;
  value_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type FileField_OrderBy =
  | 'acc'
  | 'atType'
  | 'file'
  | 'file__id'
  | 'file__tag'
  | 'id'
  | 'name'
  | 'pricing'
  | 'pricing__currency'
  | 'pricing__id'
  | 'pricing__owner'
  | 'pricing__price'
  | 'value';

export type File_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<File_Filter>>>;
  fileFields_?: InputMaybe<FileField_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  manifest?: InputMaybe<Scalars['String']['input']>;
  manifest_?: InputMaybe<Manifest_Filter>;
  manifest_contains?: InputMaybe<Scalars['String']['input']>;
  manifest_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifest_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_gt?: InputMaybe<Scalars['String']['input']>;
  manifest_gte?: InputMaybe<Scalars['String']['input']>;
  manifest_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifest_lt?: InputMaybe<Scalars['String']['input']>;
  manifest_lte?: InputMaybe<Scalars['String']['input']>;
  manifest_not?: InputMaybe<Scalars['String']['input']>;
  manifest_not_contains?: InputMaybe<Scalars['String']['input']>;
  manifest_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifest_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifest_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifest_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifest_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<File_Filter>>>;
  tag?: InputMaybe<Scalars['String']['input']>;
  tag_contains?: InputMaybe<Scalars['String']['input']>;
  tag_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tag_ends_with?: InputMaybe<Scalars['String']['input']>;
  tag_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tag_gt?: InputMaybe<Scalars['String']['input']>;
  tag_gte?: InputMaybe<Scalars['String']['input']>;
  tag_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tag_lt?: InputMaybe<Scalars['String']['input']>;
  tag_lte?: InputMaybe<Scalars['String']['input']>;
  tag_not?: InputMaybe<Scalars['String']['input']>;
  tag_not_contains?: InputMaybe<Scalars['String']['input']>;
  tag_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tag_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tag_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tag_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tag_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tag_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tag_starts_with?: InputMaybe<Scalars['String']['input']>;
  tag_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type File_OrderBy =
  | 'fileFields'
  | 'id'
  | 'manifest'
  | 'manifest__id'
  | 'manifest__manifestVersion'
  | 'manifest__schemaId'
  | 'tag';

export type ManifestPublished_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ManifestPublished_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  manifestCid?: InputMaybe<Scalars['String']['input']>;
  manifestCid_contains?: InputMaybe<Scalars['String']['input']>;
  manifestCid_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_gt?: InputMaybe<Scalars['String']['input']>;
  manifestCid_gte?: InputMaybe<Scalars['String']['input']>;
  manifestCid_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifestCid_lt?: InputMaybe<Scalars['String']['input']>;
  manifestCid_lte?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_contains?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifestCid_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<ManifestPublished_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  version?: InputMaybe<Scalars['BigInt']['input']>;
  version_gt?: InputMaybe<Scalars['BigInt']['input']>;
  version_gte?: InputMaybe<Scalars['BigInt']['input']>;
  version_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  version_lt?: InputMaybe<Scalars['BigInt']['input']>;
  version_lte?: InputMaybe<Scalars['BigInt']['input']>;
  version_not?: InputMaybe<Scalars['BigInt']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type ManifestPublished_OrderBy =
  | 'blockNumber'
  | 'blockTimestamp'
  | 'id'
  | 'manifestCid'
  | 'owner'
  | 'schemaId'
  | 'transactionHash'
  | 'version';

export type ManifestState_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ManifestState_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  lastUpdated?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastUpdated_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastUpdated_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  manifest?: InputMaybe<Scalars['String']['input']>;
  manifestCid?: InputMaybe<Scalars['String']['input']>;
  manifestCid_contains?: InputMaybe<Scalars['String']['input']>;
  manifestCid_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_gt?: InputMaybe<Scalars['String']['input']>;
  manifestCid_gte?: InputMaybe<Scalars['String']['input']>;
  manifestCid_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifestCid_lt?: InputMaybe<Scalars['String']['input']>;
  manifestCid_lte?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_contains?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifestCid_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_?: InputMaybe<Manifest_Filter>;
  manifest_contains?: InputMaybe<Scalars['String']['input']>;
  manifest_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifest_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_gt?: InputMaybe<Scalars['String']['input']>;
  manifest_gte?: InputMaybe<Scalars['String']['input']>;
  manifest_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifest_lt?: InputMaybe<Scalars['String']['input']>;
  manifest_lte?: InputMaybe<Scalars['String']['input']>;
  manifest_not?: InputMaybe<Scalars['String']['input']>;
  manifest_not_contains?: InputMaybe<Scalars['String']['input']>;
  manifest_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifest_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifest_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifest_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifest_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifest_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<ManifestState_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schema?: InputMaybe<Scalars['String']['input']>;
  schemaId?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaName?: InputMaybe<Scalars['String']['input']>;
  schemaName_contains?: InputMaybe<Scalars['String']['input']>;
  schemaName_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaName_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaName_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaName_gt?: InputMaybe<Scalars['String']['input']>;
  schemaName_gte?: InputMaybe<Scalars['String']['input']>;
  schemaName_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaName_lt?: InputMaybe<Scalars['String']['input']>;
  schemaName_lte?: InputMaybe<Scalars['String']['input']>;
  schemaName_not?: InputMaybe<Scalars['String']['input']>;
  schemaName_not_contains?: InputMaybe<Scalars['String']['input']>;
  schemaName_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaName_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaName_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaName_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaName_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaName_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaName_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaName_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_?: InputMaybe<Schema_Filter>;
  schema_contains?: InputMaybe<Scalars['String']['input']>;
  schema_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_ends_with?: InputMaybe<Scalars['String']['input']>;
  schema_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_gt?: InputMaybe<Scalars['String']['input']>;
  schema_gte?: InputMaybe<Scalars['String']['input']>;
  schema_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schema_lt?: InputMaybe<Scalars['String']['input']>;
  schema_lte?: InputMaybe<Scalars['String']['input']>;
  schema_not?: InputMaybe<Scalars['String']['input']>;
  schema_not_contains?: InputMaybe<Scalars['String']['input']>;
  schema_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schema_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schema_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schema_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schema_starts_with?: InputMaybe<Scalars['String']['input']>;
  schema_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version?: InputMaybe<Scalars['BigInt']['input']>;
  version_gt?: InputMaybe<Scalars['BigInt']['input']>;
  version_gte?: InputMaybe<Scalars['BigInt']['input']>;
  version_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  version_lt?: InputMaybe<Scalars['BigInt']['input']>;
  version_lte?: InputMaybe<Scalars['BigInt']['input']>;
  version_not?: InputMaybe<Scalars['BigInt']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type ManifestState_OrderBy =
  | 'id'
  | 'lastUpdated'
  | 'manifest'
  | 'manifestCid'
  | 'manifest__id'
  | 'manifest__manifestVersion'
  | 'manifest__schemaId'
  | 'owner'
  | 'schema'
  | 'schemaId'
  | 'schemaName'
  | 'schema__agentId'
  | 'schema__id'
  | 'schema__version'
  | 'version';

export type ManifestUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ManifestUpdated_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  manifestCid?: InputMaybe<Scalars['String']['input']>;
  manifestCid_contains?: InputMaybe<Scalars['String']['input']>;
  manifestCid_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_gt?: InputMaybe<Scalars['String']['input']>;
  manifestCid_gte?: InputMaybe<Scalars['String']['input']>;
  manifestCid_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifestCid_lt?: InputMaybe<Scalars['String']['input']>;
  manifestCid_lte?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_contains?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifestCid_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestCid_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifestCid_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<ManifestUpdated_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  version?: InputMaybe<Scalars['BigInt']['input']>;
  version_gt?: InputMaybe<Scalars['BigInt']['input']>;
  version_gte?: InputMaybe<Scalars['BigInt']['input']>;
  version_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  version_lt?: InputMaybe<Scalars['BigInt']['input']>;
  version_lte?: InputMaybe<Scalars['BigInt']['input']>;
  version_not?: InputMaybe<Scalars['BigInt']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type ManifestUpdated_OrderBy =
  | 'blockNumber'
  | 'blockTimestamp'
  | 'id'
  | 'manifestCid'
  | 'owner'
  | 'schemaId'
  | 'transactionHash'
  | 'version';

export type Manifest_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Manifest_Filter>>>;
  files_?: InputMaybe<File_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  manifestState?: InputMaybe<Scalars['String']['input']>;
  manifestState_?: InputMaybe<ManifestState_Filter>;
  manifestState_contains?: InputMaybe<Scalars['String']['input']>;
  manifestState_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestState_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifestState_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestState_gt?: InputMaybe<Scalars['String']['input']>;
  manifestState_gte?: InputMaybe<Scalars['String']['input']>;
  manifestState_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifestState_lt?: InputMaybe<Scalars['String']['input']>;
  manifestState_lte?: InputMaybe<Scalars['String']['input']>;
  manifestState_not?: InputMaybe<Scalars['String']['input']>;
  manifestState_not_contains?: InputMaybe<Scalars['String']['input']>;
  manifestState_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestState_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  manifestState_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestState_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  manifestState_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifestState_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestState_starts_with?: InputMaybe<Scalars['String']['input']>;
  manifestState_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  manifestVersion?: InputMaybe<Scalars['BigInt']['input']>;
  manifestVersion_gt?: InputMaybe<Scalars['BigInt']['input']>;
  manifestVersion_gte?: InputMaybe<Scalars['BigInt']['input']>;
  manifestVersion_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  manifestVersion_lt?: InputMaybe<Scalars['BigInt']['input']>;
  manifestVersion_lte?: InputMaybe<Scalars['BigInt']['input']>;
  manifestVersion_not?: InputMaybe<Scalars['BigInt']['input']>;
  manifestVersion_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Manifest_Filter>>>;
  schemaId?: InputMaybe<Scalars['String']['input']>;
  schemaId_contains?: InputMaybe<Scalars['String']['input']>;
  schemaId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaId_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaId_gt?: InputMaybe<Scalars['String']['input']>;
  schemaId_gte?: InputMaybe<Scalars['String']['input']>;
  schemaId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaId_lt?: InputMaybe<Scalars['String']['input']>;
  schemaId_lte?: InputMaybe<Scalars['String']['input']>;
  schemaId_not?: InputMaybe<Scalars['String']['input']>;
  schemaId_not_contains?: InputMaybe<Scalars['String']['input']>;
  schemaId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  schemaId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  schemaId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  schemaId_starts_with?: InputMaybe<Scalars['String']['input']>;
  schemaId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Manifest_OrderBy =
  | 'files'
  | 'id'
  | 'manifestState'
  | 'manifestState__id'
  | 'manifestState__lastUpdated'
  | 'manifestState__manifestCid'
  | 'manifestState__owner'
  | 'manifestState__schemaId'
  | 'manifestState__schemaName'
  | 'manifestState__version'
  | 'manifestVersion'
  | 'schemaId';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type PriceUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PriceUpdated_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PriceUpdated_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  resourceId?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  resourceId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_not?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type PriceUpdated_OrderBy =
  | 'id'
  | 'owner'
  | 'price'
  | 'resourceId';

export type PricingResource_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PricingResource_Filter>>>;
  currency?: InputMaybe<Scalars['String']['input']>;
  currency_contains?: InputMaybe<Scalars['String']['input']>;
  currency_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  currency_ends_with?: InputMaybe<Scalars['String']['input']>;
  currency_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currency_gt?: InputMaybe<Scalars['String']['input']>;
  currency_gte?: InputMaybe<Scalars['String']['input']>;
  currency_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currency_lt?: InputMaybe<Scalars['String']['input']>;
  currency_lte?: InputMaybe<Scalars['String']['input']>;
  currency_not?: InputMaybe<Scalars['String']['input']>;
  currency_not_contains?: InputMaybe<Scalars['String']['input']>;
  currency_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  currency_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  currency_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currency_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currency_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  currency_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currency_starts_with?: InputMaybe<Scalars['String']['input']>;
  currency_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PricingResource_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type PricingResource_OrderBy =
  | 'currency'
  | 'id'
  | 'owner'
  | 'price';

export type ResourceCreated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ResourceCreated_Filter>>>;
  groupId?: InputMaybe<Scalars['BigInt']['input']>;
  groupId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  groupId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  groupId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  groupId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  groupId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  groupId_not?: InputMaybe<Scalars['BigInt']['input']>;
  groupId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ResourceCreated_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  price?: InputMaybe<Scalars['BigInt']['input']>;
  price_gt?: InputMaybe<Scalars['BigInt']['input']>;
  price_gte?: InputMaybe<Scalars['BigInt']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  price_lt?: InputMaybe<Scalars['BigInt']['input']>;
  price_lte?: InputMaybe<Scalars['BigInt']['input']>;
  price_not?: InputMaybe<Scalars['BigInt']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  resourceId?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  resourceId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_not?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  resourceId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type ResourceCreated_OrderBy =
  | 'groupId'
  | 'id'
  | 'owner'
  | 'price'
  | 'resourceId';

export type SchemaField_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SchemaField_Filter>>>;
  fieldType?: InputMaybe<Scalars['String']['input']>;
  fieldType_contains?: InputMaybe<Scalars['String']['input']>;
  fieldType_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fieldType_ends_with?: InputMaybe<Scalars['String']['input']>;
  fieldType_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fieldType_gt?: InputMaybe<Scalars['String']['input']>;
  fieldType_gte?: InputMaybe<Scalars['String']['input']>;
  fieldType_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fieldType_lt?: InputMaybe<Scalars['String']['input']>;
  fieldType_lte?: InputMaybe<Scalars['String']['input']>;
  fieldType_not?: InputMaybe<Scalars['String']['input']>;
  fieldType_not_contains?: InputMaybe<Scalars['String']['input']>;
  fieldType_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  fieldType_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  fieldType_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fieldType_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  fieldType_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  fieldType_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  fieldType_starts_with?: InputMaybe<Scalars['String']['input']>;
  fieldType_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<SchemaField_Filter>>>;
};

export type SchemaField_OrderBy =
  | 'fieldType'
  | 'id'
  | 'name';

export type SchemaRegistered_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  agentId?: InputMaybe<Scalars['String']['input']>;
  agentId_contains?: InputMaybe<Scalars['String']['input']>;
  agentId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_ends_with?: InputMaybe<Scalars['String']['input']>;
  agentId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_gt?: InputMaybe<Scalars['String']['input']>;
  agentId_gte?: InputMaybe<Scalars['String']['input']>;
  agentId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  agentId_lt?: InputMaybe<Scalars['String']['input']>;
  agentId_lte?: InputMaybe<Scalars['String']['input']>;
  agentId_not?: InputMaybe<Scalars['String']['input']>;
  agentId_not_contains?: InputMaybe<Scalars['String']['input']>;
  agentId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  agentId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  agentId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  agentId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_starts_with?: InputMaybe<Scalars['String']['input']>;
  agentId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<SchemaRegistered_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  ipfsCid?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_contains?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_ends_with?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_gt?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_gte?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ipfsCid_lt?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_lte?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_not?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_not_contains?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  ipfsCid_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_starts_with?: InputMaybe<Scalars['String']['input']>;
  ipfsCid_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<SchemaRegistered_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type SchemaRegistered_OrderBy =
  | 'agentId'
  | 'id'
  | 'ipfsCid'
  | 'name'
  | 'owner'
  | 'schemaId';

export type SchemaState_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SchemaState_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<SchemaState_Filter>>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  versions?: InputMaybe<Array<Scalars['String']['input']>>;
  versions_?: InputMaybe<Schema_Filter>;
  versions_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  versions_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  versions_not?: InputMaybe<Array<Scalars['String']['input']>>;
  versions_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  versions_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type SchemaState_OrderBy =
  | 'id'
  | 'name'
  | 'owner'
  | 'schemaId'
  | 'versions';

export type SchemaUpdated_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SchemaUpdated_Filter>>>;
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  newAgentId?: InputMaybe<Scalars['String']['input']>;
  newAgentId_contains?: InputMaybe<Scalars['String']['input']>;
  newAgentId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newAgentId_ends_with?: InputMaybe<Scalars['String']['input']>;
  newAgentId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newAgentId_gt?: InputMaybe<Scalars['String']['input']>;
  newAgentId_gte?: InputMaybe<Scalars['String']['input']>;
  newAgentId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newAgentId_lt?: InputMaybe<Scalars['String']['input']>;
  newAgentId_lte?: InputMaybe<Scalars['String']['input']>;
  newAgentId_not?: InputMaybe<Scalars['String']['input']>;
  newAgentId_not_contains?: InputMaybe<Scalars['String']['input']>;
  newAgentId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newAgentId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  newAgentId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newAgentId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newAgentId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  newAgentId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newAgentId_starts_with?: InputMaybe<Scalars['String']['input']>;
  newAgentId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_contains?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_ends_with?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_gt?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_gte?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newIpfsCid_lt?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_lte?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_not?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_not_contains?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  newIpfsCid_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_starts_with?: InputMaybe<Scalars['String']['input']>;
  newIpfsCid_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<SchemaUpdated_Filter>>>;
  schemaId?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  schemaId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  schemaId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type SchemaUpdated_OrderBy =
  | 'id'
  | 'newAgentId'
  | 'newIpfsCid'
  | 'schemaId';

export type Schema_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  agentId?: InputMaybe<Scalars['String']['input']>;
  agentId_contains?: InputMaybe<Scalars['String']['input']>;
  agentId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_ends_with?: InputMaybe<Scalars['String']['input']>;
  agentId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_gt?: InputMaybe<Scalars['String']['input']>;
  agentId_gte?: InputMaybe<Scalars['String']['input']>;
  agentId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  agentId_lt?: InputMaybe<Scalars['String']['input']>;
  agentId_lte?: InputMaybe<Scalars['String']['input']>;
  agentId_not?: InputMaybe<Scalars['String']['input']>;
  agentId_not_contains?: InputMaybe<Scalars['String']['input']>;
  agentId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  agentId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  agentId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  agentId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  agentId_starts_with?: InputMaybe<Scalars['String']['input']>;
  agentId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Schema_Filter>>>;
  fields?: InputMaybe<Array<Scalars['String']['input']>>;
  fields_?: InputMaybe<SchemaField_Filter>;
  fields_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  fields_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  fields_not?: InputMaybe<Array<Scalars['String']['input']>>;
  fields_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  fields_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  manifests_?: InputMaybe<ManifestState_Filter>;
  or?: InputMaybe<Array<InputMaybe<Schema_Filter>>>;
  version?: InputMaybe<Scalars['String']['input']>;
  version_contains?: InputMaybe<Scalars['String']['input']>;
  version_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  version_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_gt?: InputMaybe<Scalars['String']['input']>;
  version_gte?: InputMaybe<Scalars['String']['input']>;
  version_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_lt?: InputMaybe<Scalars['String']['input']>;
  version_lte?: InputMaybe<Scalars['String']['input']>;
  version_not?: InputMaybe<Scalars['String']['input']>;
  version_not_contains?: InputMaybe<Scalars['String']['input']>;
  version_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  version_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  version_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  version_starts_with?: InputMaybe<Scalars['String']['input']>;
  version_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Schema_OrderBy =
  | 'agentId'
  | 'fields'
  | 'id'
  | 'manifests'
  | 'version';

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type GetFileByFileFieldIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetFileByFileFieldIdQuery = { __typename?: 'Query', fileFields: Array<{ __typename?: 'FileField', file: { __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null } }> };

export type GetFileByFileFieldNameValuePairQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFileByFileFieldNameValuePairQuery = { __typename?: 'Query', fileFields: Array<{ __typename?: 'FileField', file: { __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null } }> };

export type GetFileFieldsByFileFieldNameQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFileFieldsByFileFieldNameQuery = { __typename?: 'Query', fileFields: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> };

export type GetFilesByFileFieldNameQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFilesByFileFieldNameQuery = { __typename?: 'Query', fileFields: Array<{ __typename?: 'FileField', file: { __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null } }> };

export type GetFileEntriesByManifestIdQueryVariables = Exact<{
  manifestId?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFileEntriesByManifestIdQuery = { __typename?: 'Query', files: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> };

export type GetPriceByFileFieldIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetPriceByFileFieldIdQuery = { __typename?: 'Query', fileFields: Array<{ __typename?: 'FileField', pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> };

export type GetFileFieldsByFileIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetFileFieldsByFileIdQuery = { __typename?: 'Query', files: Array<{ __typename?: 'File', fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> };

export type SchemaStateCoreFragment = { __typename?: 'SchemaState', id: string, schemaId: string, owner: string, name: string };

export type SchemaStateWithFieldsFragment = { __typename?: 'SchemaState', id: string, schemaId: string, owner: string, name: string, versions?: Array<{ __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, fields?: Array<{ __typename?: 'SchemaField', id: string, name: string, fieldType: string }> | null }> | null };

export type SchemaStateWithManifestsFragment = { __typename?: 'SchemaState', id: string, schemaId: string, owner: string, name: string, versions?: Array<{ __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, manifests?: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> | null }> | null };

export type SchemaStateFragment = { __typename?: 'SchemaState', id: string, schemaId: string, owner: string, name: string, versions?: Array<{ __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, manifests?: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> | null, fields?: Array<{ __typename?: 'SchemaField', id: string, name: string, fieldType: string }> | null }> | null };

export type SchemaCoreFragment = { __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null };

export type SchemaWithFieldsFragment = { __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, fields?: Array<{ __typename?: 'SchemaField', id: string, name: string, fieldType: string }> | null };

export type SchemaWithManifestsFragment = { __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, manifests?: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> | null };

export type SchemaFragment = { __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, manifests?: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> | null, fields?: Array<{ __typename?: 'SchemaField', id: string, name: string, fieldType: string }> | null };

export type SchemaFieldFragment = { __typename?: 'SchemaField', id: string, name: string, fieldType: string };

export type ManifestStateCoreFragment = { __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string };

export type ManifestStateFragment = { __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null };

export type ManifestCoreFragment = { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null };

export type ManifestFragment = { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null };

export type FileCoreFragment = { __typename?: 'File', id: string, tag?: string | null };

export type FileFragment = { __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null };

export type FileFieldCoreFragment = { __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null };

export type FileFieldFragment = { __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null };

export type PricingResourceFragment = { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string };

export type ManifestByFileFieldFragment = { __typename?: 'FileField', file: { __typename?: 'File', manifest: { __typename?: 'Manifest', manifestState: { __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null } } } };

export type ManifestByFileFragment = { __typename?: 'File', manifest: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } };

export type FileByFileFieldFragment = { __typename?: 'FileField', file: { __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null } };

export type GetManifestStatesBySchemaNameQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetManifestStatesBySchemaNameQuery = { __typename?: 'Query', manifestStates: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> };

export type GetManifestStatesBySchemaNameAndOwnerQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetManifestStatesBySchemaNameAndOwnerQuery = { __typename?: 'Query', manifestStates: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> };

export type GetManifestStatesBySchemaIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Bytes']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetManifestStatesBySchemaIdQuery = { __typename?: 'Query', manifestStates: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> };

export type GetManifestByIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetManifestByIdQuery = { __typename?: 'Query', manifests: Array<{ __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null }> };

export type GetManifestByFileFieldIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetManifestByFileFieldIdQuery = { __typename?: 'Query', fileFields: Array<{ __typename?: 'FileField', file: { __typename?: 'File', manifest: { __typename?: 'Manifest', manifestState: { __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null } } } }> };

export type GetManifestByFileIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetManifestByFileIdQuery = { __typename?: 'Query', files: Array<{ __typename?: 'File', manifest: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } }> };

export type GetManifestByFileFieldNameValuePairQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetManifestByFileFieldNameValuePairQuery = { __typename?: 'Query', fileFields: Array<{ __typename?: 'FileField', file: { __typename?: 'File', manifest: { __typename?: 'Manifest', manifestState: { __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null } } } }> };

export type GetManifestByFileFieldNameQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetManifestByFileFieldNameQuery = { __typename?: 'Query', fileFields: Array<{ __typename?: 'FileField', file: { __typename?: 'File', manifest: { __typename?: 'Manifest', manifestState: { __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null } } } }> };

export type GetAllSchemaStatesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllSchemaStatesQuery = { __typename?: 'Query', schemaStates: Array<{ __typename?: 'SchemaState', id: string, schemaId: string, owner: string, name: string, versions?: Array<{ __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, manifests?: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> | null, fields?: Array<{ __typename?: 'SchemaField', id: string, name: string, fieldType: string }> | null }> | null }> };

export type GetAllSchemaStatesByOwnerQueryVariables = Exact<{
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllSchemaStatesByOwnerQuery = { __typename?: 'Query', schemaStates: Array<{ __typename?: 'SchemaState', id: string, schemaId: string, owner: string, name: string, versions?: Array<{ __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, manifests?: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> | null, fields?: Array<{ __typename?: 'SchemaField', id: string, name: string, fieldType: string }> | null }> | null }> };

export type GetSchemaStateByNameQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSchemaStateByNameQuery = { __typename?: 'Query', schemaStates: Array<{ __typename?: 'SchemaState', id: string, schemaId: string, owner: string, name: string, versions?: Array<{ __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, manifests?: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> | null, fields?: Array<{ __typename?: 'SchemaField', id: string, name: string, fieldType: string }> | null }> | null }> };

export type GetSchemasBySchemaIdQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Bytes']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetSchemasBySchemaIdQuery = { __typename?: 'Query', schemaStates: Array<{ __typename?: 'SchemaState', id: string, schemaId: string, owner: string, name: string, versions?: Array<{ __typename?: 'Schema', id: string, version?: string | null, agentId?: string | null, manifests?: Array<{ __typename?: 'ManifestState', id: string, owner: string, schemaId: string, schemaName: string, manifestCid: string, version: string, lastUpdated: string, manifest?: { __typename?: 'Manifest', id: string, manifestVersion?: string | null, schemaId?: string | null, files?: Array<{ __typename?: 'File', id: string, tag?: string | null, fileFields?: Array<{ __typename?: 'FileField', id: string, name?: string | null, value?: string | null, atType?: string | null, acc?: string | null, pricing?: { __typename?: 'PricingResource', id: string, owner: string, price: string, currency: string } | null }> | null }> | null } | null }> | null, fields?: Array<{ __typename?: 'SchemaField', id: string, name: string, fieldType: string }> | null }> | null }> };
