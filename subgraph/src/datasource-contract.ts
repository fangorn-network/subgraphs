import { BigInt, Bytes, dataSource, DataSourceContext, ipfs, json, log } from "@graphprotocol/graph-ts"
import { ManifestPublished as ManifestPublishedEvent, ManifestUpdated as ManifestUpdatedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { FileField, File, Manifest, ManifestPublished, ManifestState, ManifestUpdated, SchemaState, Schema, SchemaField } from "../generated/schema"
import { Manifest as ManifestTemplate } from "../generated/templates"


function deriveManifestStateId(owner: Bytes, schemaId: Bytes): Bytes {
	return owner.concat(schemaId)
}

// This function is for when a SchemaState has populated CIDS, but the Schema hasn't been populated by the 
// appropriate IPFS handler yet. We depend on these; attempt a direct fetch from IPFS for them.
function deriveSchemaFieldsFromIpfs(ipfsCid: string): string[] {
	let fieldPairs: string[] = []
	let schemaBytes = ipfs.cat(ipfsCid)
	if (schemaBytes === null) {
		log.warning("Direct IPFS fetch failed for schema CID: {}", [ipfsCid])
		return fieldPairs
	}

	let parsed = json.try_fromBytes(schemaBytes as Bytes)
	if (parsed.isError) {
		log.warning("Failed to parse schema from IPFS for CID: {}", [ipfsCid])
		return fieldPairs
	}

	let ipfsSchemaObj = parsed.value.toObject()
	let definitionVal = ipfsSchemaObj.get("definition")
	if (definitionVal === null) {
		log.warning("definitionObj was null for IPFS CID: {}", [ipfsCid])
		return fieldPairs
	}

	let definition = definitionVal.toObject()
	let fieldEntries = definition.entries
	for (let i = 0; i < fieldEntries.length; i++) {
		let entry = fieldEntries[i]
		let key = entry.key
		let valObj = entry.value.toObject()
		let atTypeVal = valObj.get("@type")
		let fieldType = "unknown"
		if (atTypeVal !== null) {
			fieldType = atTypeVal.toString()
		}
		fieldPairs.push(key + ":" + fieldType)
	}

	if (fieldPairs.length > 0) {
		log.info("Fetching directly from IPFS succeeded for ipfsCid {}", [ipfsCid])
	}

	return fieldPairs
}

function deriveSchemaFields(fieldPointers: string[]): string[] {
	// Build a serialized representation of the schema fields
	// Format: "name:type,name:type,name:type"
	let fieldPairs: string[] = []
	for (let i = 0; i < fieldPointers.length; i++) {
		let schemaField = SchemaField.load(fieldPointers[i])
		if (schemaField != null) {
			fieldPairs.push(schemaField.name + ":" + schemaField.fieldType)
		} else {
			log.warning("schemaField was null", [])
		}
	}
	return fieldPairs;
}

export function handleManifestPublished(manifestPublishedEvent: ManifestPublishedEvent): void {
	let manifestPublished = new ManifestPublished(
		manifestPublishedEvent.transaction.hash.concatI32(manifestPublishedEvent.logIndex.toI32())
	)
	manifestPublished.owner = manifestPublishedEvent.params.owner
	manifestPublished.schemaId = manifestPublishedEvent.params.schema_id
	manifestPublished.manifestCid = manifestPublishedEvent.params.manifest_cid
	manifestPublished.version = manifestPublishedEvent.params.version

	manifestPublished.blockNumber = manifestPublishedEvent.block.number
	manifestPublished.blockTimestamp = manifestPublishedEvent.block.timestamp
	manifestPublished.transactionHash = manifestPublishedEvent.transaction.hash
	manifestPublished.save()

	let schemaState = SchemaState.load(manifestPublished.schemaId)
	if (schemaState == null) {
		log.warning("SchemaState wasn't found for schema_id: {}", [manifestPublished.schemaId.toHexString()])
		return
	}

	let schemas = schemaState.versions
	if (schemas == null || schemas.length == 0) {
		log.warning("Schemas IPFS CIDs weren't set for SchemaState: {}", [schemaState.schemaId.toHexString()])
		return
	}

	let fieldPairs: string[] = [];

	// Try loading the Schema entity first
	let schema = Schema.load(schemas[0])
	if (schema != null) {
		let fieldPointers = schema.fields
		if (fieldPointers != null) {
			fieldPairs = deriveSchemaFields(fieldPointers)
		}
	} else {
		log.warning("ManifestPublish: Schema failed to load. Attempting direct fetch from IPFS.", [])
		fieldPairs = deriveSchemaFieldsFromIpfs(schemas[0])
	}

	if (fieldPairs.length == 0) {
		log.warning("Could not resolve schema fields for schema_id: {}", [manifestPublished.schemaId.toHexString()])
		return
	}

	let schemaName = schemaState.name
	if (schemaName == null) {
		log.warning("schema name was null", [])
		schemaName = "unknown_schema_name"
	}

	let stateId = deriveManifestStateId(manifestPublished.owner, manifestPublished.schemaId)

	let manifestState = new ManifestState(stateId)
	manifestState.owner = manifestPublished.owner
	manifestState.schemaId = manifestPublished.schemaId
	manifestState.schema = schemas[0]
	manifestState.manifestCid = manifestPublished.manifestCid
	manifestState.manifest = manifestPublished.manifestCid
	manifestState.version = manifestPublished.version
	manifestState.schemaName = schemaName
	manifestState.lastUpdated = manifestPublishedEvent.block.timestamp
	manifestState.save()

	let context = new DataSourceContext()
	context.setString("schemaId", manifestPublished.schemaId.toHexString())
	context.setString("schemaName", manifestState.schemaName)
	context.setString("fields", fieldPairs.join(","))
	context.setString("manifestStateId", manifestState.id.toHexString())

	ManifestTemplate.createWithContext(manifestState.manifestCid, context)
}

export function handleManifestUpdated(manifestUpdatedEvent: ManifestUpdatedEvent): void {
	let manifestOwner = manifestUpdatedEvent.params.owner
	let schemaId = manifestUpdatedEvent.params.schema_id
	let stateId = deriveManifestStateId(manifestOwner, schemaId)

	let manifestState = ManifestState.load(stateId)

	// record that an update has occurred
	let manifestUpdated = new ManifestUpdated(
		manifestUpdatedEvent.transaction.hash.concatI32(manifestUpdatedEvent.logIndex.toI32())
	)
	manifestUpdated.owner = manifestUpdatedEvent.params.owner
	manifestUpdated.schemaId = manifestUpdatedEvent.params.schema_id
	manifestUpdated.manifestCid = manifestUpdatedEvent.params.manifest_cid
	manifestUpdated.version = manifestUpdatedEvent.params.version
	manifestUpdated.blockNumber = manifestUpdatedEvent.block.number
	manifestUpdated.blockTimestamp = manifestUpdatedEvent.block.timestamp
	manifestUpdated.transactionHash = manifestUpdatedEvent.transaction.hash
	manifestUpdated.save()

	let schemaState = SchemaState.load(manifestUpdatedEvent.params.schema_id)
	if (schemaState == null) {
		log.warning("schema was null in manifest update for {}", [manifestUpdated.manifestCid])
		return
	}

	let schemas = schemaState.versions
	if (schemas == null || schemas.length == 0) {
		log.warning("schema.versions was null or there were no versions in manifest update for {}", [manifestUpdated.manifestCid])
		return
	}

	let fieldPairs: string[] = [];
	// Try loading the Schema entity first
	let schema = Schema.load(schemas[0])
	if (schema != null) {
		let fieldPointers = schema.fields
		if (fieldPointers != null) {
			fieldPairs = deriveSchemaFields(fieldPointers)
		}
	} else {
		log.warning("ManifestUpdate: Schema failed to load. Attempting direct fetch from IPFS.", [])
		fieldPairs = deriveSchemaFieldsFromIpfs(schemas[0])
	}

	if (fieldPairs.length == 0) {
		log.warning("Could not resolve schema fields for schema_id: {}", [manifestUpdated.schemaId.toHexString()])
		return
	}

	let schemaName = schemaState.name

	if (schemaName == null) {
		log.warning("schemaName was null in manifest update for {}", [manifestUpdated.manifestCid])
		schemaName = "unknown_schema_name"
	}

	// Update manifest state
	if (manifestState == null) {
		log.warning("Manifest state was found to be null with ID {}", [stateId.toHexString()])
		manifestState = new ManifestState(stateId)
		manifestState.owner = manifestUpdated.owner
		manifestState.schemaId = manifestUpdated.schemaId
		manifestState.schemaName = schemaName
		manifestState.schema = schemas[0]
	}

	manifestState.manifestCid = manifestUpdated.manifestCid
	manifestState.manifest = manifestUpdated.manifestCid
	manifestState.version = manifestUpdated.version
	manifestState.lastUpdated = manifestUpdated.blockTimestamp
	manifestState.save()

	let context = new DataSourceContext()
	context.setString("schemaId", manifestState.schemaId.toHexString())
	context.setString("schemaName", manifestState.schemaName)
	context.setString("fields", fieldPairs.join(","))
	context.setString("manifestStateId", manifestState.id.toHexString())

	ManifestTemplate.createWithContext(manifestState.manifestCid, context)
}

export function handleMetadata(content: Bytes): void {
	let cid = dataSource.stringParam()
	let context = dataSource.context()

	let schemaIdString = context.getString("schemaId")
	let schemaName = context.getString("schemaName")
	let fieldsString = context.getString("fields")
	let manifestStateIdString = context.getString("manifestStateId")

	if (manifestStateIdString == null) {
		log.warning("No manifestStateId found", [])
		return
	}

	if (schemaIdString == null) {
		log.warning("Manifest found with no schema ref", [])
		return
	}

	let schemaId = Bytes.fromHexString(schemaIdString)

	let manifestStateId = Bytes.fromHexString(manifestStateIdString)

	let parsed = json.try_fromBytes(content)
	if (parsed.isError) {
		log.warning("Failed to parse IPFS content for CID: {}", [cid])
		return
	}

	let ipfsFileObj = parsed.value.toObject()

	let versionVal = ipfsFileObj.get("version")
	let entriesVal = ipfsFileObj.get("entries")

	if (versionVal == null || entriesVal == null) {
		log.warning("Invalid manifest format for CID: {}", [cid])
		return
	}

	let fieldPairs = fieldsString.split(",")
	let fieldNames: string[] = []
	let fieldTypes: string[] = []
	for (let i = 0; i < fieldPairs.length; i++) {
		let parts = fieldPairs[i].split(":")
		if (parts.length == 2) {
			fieldNames.push(parts[0])
			fieldTypes.push(parts[1])
		} else {
			log.warning("SchemField name value pair found no pair for ManifestState ID {}", [manifestStateIdString])
		}
	}

	let manifest = new Manifest(cid)
	manifest.manifestVersion = BigInt.fromU64(versionVal.toU64())
	manifest.schemaId = schemaId
	manifest.schemaName = schemaName
	manifest.manifestStateId = manifestStateId
	manifest.manifestState = manifestStateId
	manifest.save()

	let fileEntriesArray = entriesVal.toArray()

	for (let i = 0; i < fileEntriesArray.length; i++) {
		let fileEntryObj = fileEntriesArray[i].toObject()
		let entryId = cid + "-" + i.toString()

		let fileFieldsObj = fileEntryObj.get("fields")
		if (fileFieldsObj == null) {
			log.warning("File's fields object was null. Skipping this for manifest {}", [cid])
			continue
		}
		let fileFields = fileFieldsObj.toObject()

		let tagObj = fileEntryObj.get("tag")
		let tag = ""
		if (tagObj == null) {
			log.warning("Tag for file entry was null, replacing with empty tag for manifest cid {}", [cid])
		} else {
			tag = tagObj.toString()
		}

		let file = new File(entryId)
		file.tag = tag

		file.manifest = manifest.id
		file.manifestStateId = manifestStateId
		file.schemaId = schemaId
		file.schemaName = schemaName
		file.save()

		for (let j = 0; j < fieldNames.length; j++) {
			let fieldKey = fieldNames[j]
			let fieldType = fieldTypes[j]

			let fieldEntityId = entryId + "-" + fieldKey
			let fileField = new FileField(fieldEntityId)
			fileField.name = fieldKey
			fileField.atType = fieldType
			fileField.manifestStateId = manifestStateId
			fileField.schemaId = schemaId
			fileField.schemaName = schemaName

			if (fieldType == "encrypted") {
				let valueVal = fileFields.get(fieldKey)
				if (valueVal == null) {
					log.warning("Field's type was encrypted, but the value was null. Skipping this for manifest {}", [cid])
					continue
				}
				let valueObj = valueVal.toObject()

				let gadgetObj = valueObj.get("gadgetDescriptor")
				if (gadgetObj == null) {
					log.warning("Field's type was encrypted, but the gadgetVal was null. Skipping this for manifest {}", [cid])
					continue
				}
				let gadget = gadgetObj.toObject()

				let accObj = gadget.get("type")
				if (accObj == null) {
					fileField.acc = "no_acc"
					fileField.value = "unknown"
					fileField.pricing = "unknown"
				} else {
					fileField.acc = accObj.toString()
					fileField.value = "enc"
					let paramsObj = gadget.get("params")
					if (paramsObj == null) {
						fileField.pricing = "unknown"
					} else {
						let params = paramsObj.toObject()
						let resourceId = params.get("resourceId")
						if (resourceId == null) {
							fileField.pricing = "unknown"
						} else {
							fileField.pricing = resourceId.toString()
						}
					}
				}
			} else {
				fileField.acc = "plain"
				let valueObj = fileFields.get(fieldKey)
				if (valueObj == null) {
					fileField.value = "unknown_val"
				} else {
					fileField.value = valueObj.toString()
				}
			}
			fileField.file = file.id
			fileField.save()
		}
	}

	log.info("Manifest processed safely: {}", [cid])
}