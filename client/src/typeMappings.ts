import { FileEntry, FileField, Manifest, ManifestState, PricingResource, Schema, SchemaField, SchemaState } from "@fangorn-network/client-types";
import { FileFieldFragment, FileFragment, ManifestFragment, ManifestStateFragment, PricingResourceFragment, SchemaFieldFragment, SchemaFragment, SchemaStateFragment } from "./generated/operations";


export function toSchemaState(frag: SchemaStateFragment): SchemaState {
	const schemas = frag.versions ? toSchemas(frag.versions) : undefined
	return {
		id: frag.id,
		name: frag.name,
		schemaId: frag.schemaId,
		owner: frag.owner,
		versions: schemas
	}
}

export function toSchema(frag: SchemaFragment): Schema {
	const manifests = frag.manifests ? toManifestStates(frag.manifests) : undefined
	return {
		id: frag.id,
		manifests,
		version: frag.version ? frag.version : undefined,
		agentId: frag.agentId ? frag.agentId : undefined,
		fields: frag.fields ? toSchemaFields(frag.fields) : undefined
	}
}

export function toSchemaField(frag: SchemaFieldFragment): SchemaField {

	return {
		id: frag.id,
		name: frag.name,
		fieldType: frag.fieldType
	}
	
}

export function toManifestState(frag: ManifestStateFragment): ManifestState {

	const manifestFrag = frag.manifest
	const manifest = manifestFrag ? toManifest(manifestFrag) : undefined

	return {
		id: frag.id,
		owner: frag.owner,
		schemaId: frag.schemaId,
		schemaName: frag.schemaName,
		manifestCid: frag.manifestCid,
		manifest,
		version: frag.version,
		lastUpdated: frag.lastUpdated
	}

}

export function toManifest(frag: ManifestFragment): Manifest {

	const fileFragments = frag.files
	const files = fileFragments ? toFiles(fileFragments) : undefined

	return {
		id: frag.id,
		schemaId: frag.schemaId,
		schemaName: frag.schemaName,
		manifestStateId: frag.manifestStateId,
		manifestVersion: frag.manifestVersion ? frag.manifestVersion : undefined,
		files
	}

}

export function toFile(frag: FileFragment): FileEntry {
	const fileFieldsFrag = frag.fileFields
	const fileFields = fileFieldsFrag ? toFileFields(fileFieldsFrag) : undefined
	return {
		id: frag.id,
		schemaId: frag.schemaId,
		schemaName: frag.schemaName,
		manifestStateId: frag.manifestStateId,
		tag: frag.tag ? frag.tag : undefined,
		fileFields
	}
}

export function toFileField(frag: FileFieldFragment): FileField {
	const pricingFrag = frag.pricing
	const pricing = pricingFrag ? toPricingResource(pricingFrag) : undefined
	return {
	  id: frag.id,
	  schemaId: frag.schemaId,
	  schemaName: frag.schemaName,
	  manifestStateId: frag.manifestStateId,
	  fileId: frag.fileId,
	  name: frag.name ?? undefined,
	  value: frag.value ?? undefined,
	  atType: frag.atType ?? undefined,
	  acc: frag.acc ?? undefined,
	  pricing,
	}
}

export function toPricingResource(frag: PricingResourceFragment): PricingResource {
	return {
		id: frag.id,
		owner: frag.owner,
		price: frag.price,
		currency: frag.currency
	}
}

export function toSchemaStates(frag: SchemaStateFragment[]): SchemaState[] {
	const schemaStates = frag.map((ssf) => {
		return toSchemaState(ssf)
	})
	return schemaStates
}


export function toSchemas(frag: SchemaFragment[]): Schema[] {
	const schemas = frag.map((sf) => {
		return toSchema(sf)
	})
	return schemas
}

export function toSchemaFields(frag: SchemaFieldFragment[]): SchemaField[] {
	const schemaFields = frag.map((sff) => {
		return toSchemaField(sff)
	})
	return schemaFields
}

export function toManifestStates(frag: ManifestStateFragment[]): ManifestState[] {
	const manifestStates = frag.map((msf) => {
		return toManifestState(msf)
	})
	return manifestStates
}

export function toFiles(frag: FileFragment[]): FileEntry[] {
	const files: FileEntry[] = frag.map((ff) => {
		return toFile(ff)
	})
	return files
}

export function toFileFields(frag: FileFieldFragment[]): FileField[] {
	const fileFields: FileField[] = frag.map((fff) => {
		return toFileField(fff)
	})
	return fileFields
}
