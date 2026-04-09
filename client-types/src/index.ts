export interface SchemaState {
	id: string
	schemaId: string
	owner: string
	name: string
	versions?: Schema[]
}

export interface Schema {
	id: string
	manifests?: ManifestState[]
	version?: String
	agentId?: String
	fields?: SchemaField[]
}

export interface SchemaField {
	id: string;
	name: string;
	fieldType: string;
}

export interface ManifestState {
	id: string
	schemaId: string
	schemaName: string
	owner: string
	manifestCid: string
	manifest?: Manifest
	version: string
	lastUpdated: string
}

export interface Manifest {
	id: string
	schemaId: string
	schemaName: string
	manifestStateId: string
	manifestVersion?: string
	files?: FileEntry[]
}

export interface FileEntry {
	id: string
	schemaId: string
	schemaName: string
	manifestStateId: string
	tag?: string
	fileFields?: FileField[]
}

export interface FileField {
	id: string
	schemaId: string
	schemaName: string
	manifestStateId: string
	fileId: string
	name?: string
	value?: string
	atType?: string
	acc?: string
	pricing?: PricingResource
}

export interface PricingResource {
	id: string;
	owner: string;
	price: string;
	currency: string;
}