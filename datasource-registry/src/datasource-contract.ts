import { BigInt, Bytes, dataSource, DataSourceContext, json, log, store } from "@graphprotocol/graph-ts"
import { ManifestPublished as ManifestPublishedEvent, ManifestUpdated as ManifestUpdatedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { Field, FileEntry, Manifest, ManifestPublished, ManifestState, ManifestUpdated, Schema, SchemaEntries, SchemaField } from "../generated/schema"
import { Manifest as ManifestTemplate } from "../generated/templates"

function cleanupOldManifest(oldManifestCid: string): void {
  let oldManifest = Manifest.load(oldManifestCid)
  if (oldManifest != null) {
    let fileIds = oldManifest.files
    if (fileIds != null && fileIds.length > 0) {
      for (let i = 0; i < fileIds.length; i++) {
        let fileId = fileIds[i]
        let file = FileEntry.load(fileId)
        if (file != null) {
          let fieldIds = file.fields
          if (fieldIds != null && fieldIds.length > 0) {
            for (let j = 0; j < fieldIds.length; j++) {
              store.remove("Field", fieldIds[j])
            }
          } else {
            log.error("During cleanup, the fileFieldIds were null for {}", [oldManifestCid])
          }
          store.remove("FileEntry", fileId)
        } else {
          log.error("During cleanup, the fileEntryIds were null for {}", [oldManifestCid])
        }
      }
    }
    store.remove("Manifest", oldManifestCid)
  } else {
    log.warning("During cleanup, oldManifest was null for {}. It may not have been indexed yet via IPFS.", [oldManifestCid])
  }
}

export function handleManifestPublished(event: ManifestPublishedEvent): void {
  let entity = new ManifestPublished(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.schema_id = event.params.schema_id
  entity.manifest_cid = event.params.manifest_cid
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  let schema = Schema.load(event.params.schema_id.toHexString())
  if (schema == null) {
    log.error("Schema wasn't found for schema_id: {}", [event.params.schema_id.toHexString()])
    return
  }

  let versions = schema.versions
  if (versions == null || versions.length == 0){
    log.error("Schema version wasn't proper for schema_id: {}", [event.params.schema_id.toHexString()])
    return
  }

  let schemaEntries = SchemaEntries.load(versions[0])
  if (schemaEntries == null) {
    log.error("Schema entries weren't found for schema_id: {}", [event.params.schema_id.toHexString()])
    return
  }

  let fieldPointers = schemaEntries.fields
  if (fieldPointers == null) {
    log.error("Schema fieldPointers weren't found for schema_id: {}", [event.params.schema_id.toHexString()])
    return
  }

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

  let schemaName = schema.name

  if (schemaName == null) {
    log.warning("schema name was null", [])
    schemaName = "unknown_schema_name"
  }

  let stateId = entity.owner.concat(entity.schema_id)

  let potentialOldState = ManifestState.load(stateId)
  if (potentialOldState != null) {
    log.warning("An old manifest was found, but a new Manifest Published event occurred {}", [stateId.toHexString()])
    let oldManifestCid = potentialOldState.manifest_cid
    if (oldManifestCid != null && oldManifestCid != "") {
      cleanupOldManifest(oldManifestCid)
    }
  }

  let state = new ManifestState(stateId)
  state.owner = entity.owner
  state.schema_id = entity.schema_id
  state.schema = schema.id
  state.manifest_cid = entity.manifest_cid
  state.version = entity.version
  state.manifest = entity.manifest_cid
  state.schema_name = schemaName
  state.lastUpdated = event.block.timestamp
  state.save()

  let context = new DataSourceContext()
  context.setString("schemaId", event.params.schema_id.toHexString())
  context.setString("fields", fieldPairs.join(","))
  context.setString("manifestStateId", state.id.toHexString())
  context.setString("lastUpdated", state.lastUpdated.toString())

  ManifestTemplate.createWithContext(state.manifest_cid, context)
}

export function handleManifestUpdated(event: ManifestUpdatedEvent): void {

  let stateId = event.params.owner.concat(event.params.schema_id)
  let state = ManifestState.load(stateId)

  // record that an update has occurred
  let entity = new ManifestUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.schema_id = event.params.schema_id
  entity.manifest_cid = event.params.manifest_cid
  entity.version = event.params.version
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  let schema = Schema.load(event.params.schema_id.toHexString())
  if (schema == null) return

  let versions = schema.versions
  if (versions == null || versions.length == 0) return

  let schemaEntries = SchemaEntries.load(versions[0])
  if (schemaEntries == null) return

  let fieldPointers = schemaEntries.fields
  if (fieldPointers == null) return

  let schemaName = schema.name

  if (schemaName == null) {
    schemaName = "unknown_schema_name"
  }

  // Build a serialized representation of the schema fields
  // Format: "name:type,name:type,name:type"
  let fieldPairs: string[] = []
  for (let i = 0; i < fieldPointers.length; i++) {
    let schemaField = SchemaField.load(fieldPointers[i])
    if (schemaField != null) {
      fieldPairs.push(schemaField.name + ":" + schemaField.fieldType)
    }
  }

  // Update manifest state
  if (state == null) {
    log.warning("Manifest state was found to be null with ID {}", [stateId.toHexString()])
    state = new ManifestState(stateId)
    state.owner = entity.owner
    state.schema_id = entity.schema_id
    state.schema_name = schemaName
    state.schema = schema.id
  }

  // Clean up old manifest data before updating state
  let oldManifestCid = state.manifest_cid
  if (oldManifestCid != null && oldManifestCid != "" && oldManifestCid != entity.manifest_cid) {
    cleanupOldManifest(oldManifestCid)
  }

  state.manifest_cid = entity.manifest_cid
  state.version = entity.version
  state.manifest = entity.manifest_cid
  state.lastUpdated = entity.blockTimestamp
  state.save()

  let context = new DataSourceContext()
  context.setString("schemaId", event.params.schema_id.toHexString())
  context.setString("fields", fieldPairs.join(","))
  context.setString("manifestStateId", state.id.toHexString())
  context.setString("lastUpdated", state.lastUpdated.toString())

  ManifestTemplate.createWithContext(state.manifest_cid, context)
}

export function handleMetadata(content: Bytes): void {
  let cid = dataSource.stringParam()
  let context = dataSource.context()

  let schemaIdString = context.getString("schemaId")
  let fieldsString = context.getString("fields")
  let manifestStateIdString = context.getString("manifestStateId")

  if (manifestStateIdString == null) {
    log.error("No manifestStateId found", [])
    return
  }

  let manifestStateId = Bytes.fromHexString(manifestStateIdString)

  let lastUpdatedString = context.getString("lastUpdated")
  let lastUpdated = BigInt.fromString(lastUpdatedString)
  
  let currentState = ManifestState.load(manifestStateId)
  if (currentState != null && currentState.lastUpdated.gt(lastUpdated)) {
    log.warning("Skipping stale manifest {}. State has moved on.", [cid])
    return
  }

  let parsed = json.try_fromBytes(content)
  if (parsed.isError) {
    log.error("Failed to parse IPFS content for CID: {}", [cid])
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

    let fileFieldsVal = fileEntryObj.get("fields")
    if (fileFieldsVal == null) {
      log.error("File's fields object was null. Skipping this for manifest {}", [cid])
      continue
    }
    let fileFields = fileFieldsVal.toObject()

    let fileEntry = new FileEntry(entryId)
    let fileEntryFieldsArray: string[] = []

    for (let j = 0; j < fieldNames.length; j++) {
      let fieldKey = fieldNames[j]
      let fieldType = fieldTypes[j]

      let fieldEntityId = entryId + "-" + fieldKey
      let fileField = new Field(fieldEntityId)
      fileField.name = fieldKey
      fileField.atType = fieldType

      if (fieldType == "encrypted") {
        let valueVal = fileFields.get(fieldKey)
        if (valueVal == null) {
          log.error("Field's type was encrypted, but the value was null. Skipping this for manifest {}", [cid])
          continue
        }
        let valueObj = valueVal.toObject()

        let gadgetVal = valueObj.get("gadgetDescriptor")
        if (gadgetVal == null) {
          log.error("Field's type was encrypted, but the gadgetVal was null. Skipping this for manifest {}", [cid])
          continue
        }
        let gadget = gadgetVal.toObject()

        let accVal = gadget.get("type")
        if (accVal == null) {
          fileField.acc = "no_acc"
          fileField.value = "unknown"
          fileField.price = "unknown"
        } else {
          fileField.acc = accVal.toString()
          fileField.value = "enc"
          let paramsVal = gadget.get("params")
          if(paramsVal == null) {
            fileField.price = "unknown"
          } else {
            let params = paramsVal.toObject()
            let resourceId = params.get("resourceId")
            if (resourceId == null) {
              fileField.price = "unknown"
            } else {
              fileField.price = resourceId.toString()
            }
          }
        }
      } else {
        fileField.acc = "plain"
        let valueVal = fileFields.get(fieldKey)
        if (valueVal == null) {
          fileField.value = "unknown_val"
        } else {
          fileField.value = valueVal.toString()
        }
      }

      fileField.manifestState = manifestStateId
      fileField.fileEntry = entryId
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