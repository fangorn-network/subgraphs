
// ── Primitive Entity Types ──────────────────────────────────────────────────

export interface SchemaState {
  id: string;
  schemaId: string;
  owner: string;
  name: string;
  versions: Schema[] | null;
}

export interface Schema {
  id: string;
  manifests: ManifestState[] | null;
  version: string | null;
  agentId: string | null;
  fields: SchemaField[] | null;
}

export interface SchemaField {
  id: string;
  name: string;
  fieldType: string;
}

export interface ManifestState {
  id: string;
  owner: string;
  schema_id: string;
  schema: Schema | null;
  schemaName: string;
  manifestCid: string;
  manifest: Manifest | null;
  version: string;
  lastUpdated: string;
}

export interface Manifest {
  id: string;
  manifestVersion: string;
  schemaId: string;
  manifestState: ManifestState
  files: File[] | null;
}


export interface File {
  id: string;
  tag: string;
  manifest: Manifest;
  fileFields: FileField[] | null;
}

export interface FileField {
  id: string;
  name: string;
  value: string;
  atType: string;
  acc: string;
  file: File;
  pricing: PricingResource | null;
}

export interface PricingResource {
  id: string;
  owner: string;
  price: string;
  currency: string;
}