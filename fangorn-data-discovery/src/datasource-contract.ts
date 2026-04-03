import { BigInt, Bytes, dataSource, DataSourceContext, json, log } from "@graphprotocol/graph-ts"
import { ManifestPublished as ManifestPublishedEvent, ManifestUpdated as ManifestUpdatedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { FileField, File, Manifest, ManifestPublished, ManifestState, ManifestUpdated, SchemaState, Schema, SchemaField } from "../generated/schema"
import { Manifest as ManifestTemplate } from "../generated/templates"


function deriveManifestStateId(owner: Bytes, schemaId: Bytes):Bytes {
  return owner.concat(schemaId)
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

  let schemaState = SchemaState.load(manifestPublished.schemaId.toHexString())
  if (schemaState == null) {
    log.warning("SchemaState wasn't found for schema_id: {}", [manifestPublished.schemaId.toHexString()])
    return

  } else {
    let schemas = schemaState.versions
  if (schemas == null || schemas.length == 0){
    log.warning("Schemas weren't retrieved from IPFS for SchemaState: {}", [schemaState.schemaId.toHexString()])
    return
  }

  let schema = Schema.load(schemas[0])
  if (schema == null) {
    log.warning("Schema wasn't found for schema_id: {}", [manifestPublishedEvent.params.schema_id.toHexString()])
    return
  }

  let fieldPointers = schema.fields
  if (fieldPointers == null) {
    log.warning("Schema fields weren't found for schema_id: {}", [manifestPublishedEvent.params.schema_id.toHexString()])
    return
  }

  let fieldPairs = deriveSchemaFields(fieldPointers)

  let schemaName = schemaState.name

  if (schemaName == null) {
    log.warning("schema name was null", [])
    schemaName = "unknown_schema_name"
  }

  let stateId = deriveManifestStateId(manifestPublished.owner, manifestPublished.schemaId)

  let manifestState = new ManifestState(stateId)
  manifestState.owner = manifestPublished.owner
  manifestState.schemaId = manifestPublished.schemaId
  manifestState.schema = schemaState.id
  manifestState.manifestCid = manifestPublished.manifestCid
  manifestState.version = manifestPublished.version
  manifestState.manifest = manifestPublished.manifestCid
  manifestState.schemaName = schemaName
  manifestState.lastUpdated = manifestPublishedEvent.block.timestamp
  manifestState.save()

  let context = new DataSourceContext()
  context.setString("schemaId", manifestPublishedEvent.params.schema_id.toHexString())
  context.setString("fields", fieldPairs.join(","))
  context.setString("manifestStateId", manifestState.id.toHexString())
  context.setString("lastUpdated", manifestState.lastUpdated.toString())

  ManifestTemplate.createWithContext(manifestState.manifestCid, context)
  }

}

export function handleManifestUpdated(manifestUpdatedEvent: ManifestUpdatedEvent): void {
  let manifestOwner = manifestUpdatedEvent.params.owner
  let schemaId = manifestUpdatedEvent.params.schema_id
  let stateId = deriveManifestStateId(manifestOwner, schemaId)

  let state = ManifestState.load(stateId)

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

  let schema = SchemaState.load(manifestUpdatedEvent.params.schema_id.toHexString())
  if (schema == null) {
    log.warning("schema was null in manifest update for {}", [manifestUpdated.manifestCid]) 
    return
  }

  let versions = schema.versions
  if (versions == null || versions.length == 0){
    log.warning("schema.versions was null or there were no versions in manifest update for {}", [manifestUpdated.manifestCid]) 
    return
  }

  let schemaEntries = Schema.load(versions[0])
  if (schemaEntries == null) {
    log.warning("schemaEntries was null in manifest update for {}", [manifestUpdated.manifestCid]) 
    return
  }

  let fieldPointers = schemaEntries.fields
  if (fieldPointers == null) {
    log.warning("fieldPointers was null in manifest update for {}", [manifestUpdated.manifestCid]) 
    return
  }

  let schemaName = schema.name

  if (schemaName == null) {
    log.warning("schemaName was null in manifest update for {}", [manifestUpdated.manifestCid])
    schemaName = "unknown_schema_name"
  }

  let fieldPairs: string[] = deriveSchemaFields(fieldPointers)

  // Update manifest state
  if (state == null) {
    log.warning("Manifest state was found to be null with ID {}", [stateId.toHexString()])
    state = new ManifestState(stateId)
    state.owner = manifestUpdated.owner
    state.schemaId = manifestUpdated.schemaId
    state.schemaName = schemaName
    state.schema = schema.id
  }

  state.manifestCid = manifestUpdated.manifestCid
  state.version = manifestUpdated.version
  state.manifest = manifestUpdated.manifestCid
  state.lastUpdated = manifestUpdated.blockTimestamp
  state.save()

  let context = new DataSourceContext()
  context.setString("schemaId", manifestUpdatedEvent.params.schema_id.toHexString())
  context.setString("fields", fieldPairs.join(","))
  context.setString("manifestStateId", state.id.toHexString())
  context.setString("lastUpdated", state.lastUpdated.toString())

  ManifestTemplate.createWithContext(state.manifestCid, context)
}

export function handleMetadata(content: Bytes): void {
  let cid = dataSource.stringParam()
  let context = dataSource.context()

  let schemaIdString = context.getString("schemaId")
  let fieldsString = context.getString("fields")
  let manifestStateIdString = context.getString("manifestStateId")

  if (manifestStateIdString == null) {
    log.warning("No manifestStateId found", [])
    return
  }

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
    }
  }

  let manifest = new Manifest(cid)
  manifest.manifestVersion = BigInt.fromU64(versionVal.toU64())
  manifest.schemaId = schemaIdString

  let fileEntriesArray = entriesVal.toArray()

  let currentFiles: string[] = []

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

    let fileEntry = new File(entryId)
    fileEntry.tag = tag
    
    let fileEntryFieldsArray: string[] = []

    for (let j = 0; j < fieldNames.length; j++) {
      let fieldKey = fieldNames[j]
      let fieldType = fieldTypes[j]

      let fieldEntityId = entryId + "-" + fieldKey
      let fileField = new FileField(fieldEntityId)
      fileField.name = fieldKey
      fileField.atType = fieldType

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
          if(paramsObj == null) {
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

      fileField.manifestState = manifestStateId
      fileField.parentFile = entryId
      fileField.save()
      fileEntryFieldsArray.push(fileField.id)
    }

    fileEntry.fields = fileEntryFieldsArray
    fileEntry.manifest = cid
    fileEntry.save()
    currentFiles.push(fileEntry.id)
  }

  manifest.files = currentFiles
  manifest.save()

  log.info("Manifest processed safely: {}", [cid])
}