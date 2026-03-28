import { BigInt, Bytes, dataSource, DataSourceContext, json, log, store } from "@graphprotocol/graph-ts"
import { ManifestPublished as ManifestPublishedEvent, ManifestUpdated as ManifestUpdatedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { Field, FileEntry, Manifest, ManifestPublished, ManifestState, ManifestUpdated, Schema, SchemaEntries, SchemaField } from "../generated/schema"
import { Manifest as ManifestTemplate } from "../generated/templates"

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
  if (schema == null) return

  let versions = schema.versions
  if (versions == null || versions.length == 0) return

  let schemaEntries = SchemaEntries.load(versions[0])
  if (schemaEntries == null) return

  let fieldPointers = schemaEntries.fields
  if (fieldPointers == null) return

  // Build a serialized representation of the schema fields
  // Format: "name:type,name:type,name:type"
  let fieldPairs: string[] = []
  for (let i = 0; i < fieldPointers.length; i++) {
    let schemaField = SchemaField.load(fieldPointers[i])
    if (schemaField != null) {
      fieldPairs.push(schemaField.name + ":" + schemaField.fieldType)
    }
  }

  let schemaName = schema.name

  if (schemaName == null) {
    schemaName = "unknown_schema_name"
  }

  let stateId = entity.owner.concat(entity.schema_id)
  let state = new ManifestState(stateId)

  state.owner = entity.owner
  state.schema_id = entity.schema_id
  state.manifest_cid = entity.manifest_cid
  state.version = entity.version
  state.manifest = entity.manifest_cid
  state.schema_name = schemaName
  state.lastUpdated = event.block.timestamp
  state.save();

  let context = new DataSourceContext()
  context.setString("schemaId", event.params.schema_id.toHexString())
  context.setString("fields", fieldPairs.join(","))
  context.setString("manifestStatetId", state.id.toHexString())

  ManifestTemplate.createWithContext(event.params.manifest_cid, context)

}

export function handleManifestUpdated(event: ManifestUpdatedEvent): void {

  // clean up previous manifest state
  let stateId = event.params.owner.concat(event.params.schema_id)
  let state = ManifestState.load(stateId)
  if (state != null) {
    let oldManifest = Manifest.load(state.manifest_cid)
    if (oldManifest != null) {
      let oldFilesLoader = oldManifest.files
      let oldFiles = oldFilesLoader.load();
      if (oldFiles != null && oldFiles.length > 0) {
        for (let i = 0; i < oldFiles.length; i++) {
          let oldFileId = oldFiles[i].id
          let oldFile = FileEntry.load(oldFileId)
          if (oldFile != null) {
            let oldFieldsLoader = oldFile.fields
            let oldFields = oldFieldsLoader.load()
            if(oldFields != null && oldFields.length > 0) {
              for (let j = 0; j < oldFields.length; j++) {
                store.remove("Field", oldFields[j].id)
              }
            }
            store.remove("FileEntry", oldFileId)
          }
        }
      }
      store.remove("Manifest", state.manifest_cid)
    }
  }

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
    state = new ManifestState(stateId)
    state.owner = entity.owner
    state.schema_id = entity.schema_id
    state.schema_name = schemaName
  }

  state.manifest_cid = entity.manifest_cid
  state.version = entity.version
  state.manifest = entity.manifest_cid
  state.lastUpdated = entity.blockTimestamp
  state.save()

  let context = new DataSourceContext()
  context.setString("schemaId", event.params.schema_id.toHexString())
  context.setString("fields", fieldPairs.join(","))
  context.setString("manifestStatetId", state.id.toHexString())

  ManifestTemplate.createWithContext(event.params.manifest_cid, context)

}

export function handleMetadata(content: Bytes): void {

  let cid = dataSource.stringParam()
  let context = dataSource.context()
  let schemaIdString = context.getString("schemaId")
  let fieldsString = context.getString("fields")
  let manifestStatetIdString = context.getString("manifestStatetId");
  let manifestStateId = Bytes.empty();

  if (manifestStatetIdString != null) {
      manifestStateId = Bytes.fromHexString(manifestStatetIdString)
  }

  // Parse the field definitions from context
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

  let parsed = json.try_fromBytes(content)
  if (parsed.isError) return

  let ipfsFileObj = parsed.value.toObject()

  let versionVal = ipfsFileObj.get("version")
  if (versionVal == null) return
  manifest.manifestVersion = BigInt.fromU64(versionVal.toU64())
  manifest.schemaId = schemaIdString
  manifest.save()

  let entriesVal = ipfsFileObj.get("entries")
  if (entriesVal == null) return
  let fileEntriesArray = entriesVal.toArray()

  for (let i = 0; i < fileEntriesArray.length; i++) {
    let fileEntryObj = fileEntriesArray[i].toObject()
    let entryId = cid + "-" + i.toString()

    let fileFieldsVal = fileEntryObj.get("fields")
    if (fileFieldsVal == null) continue
    let fileFields = fileFieldsVal.toObject()

    let fileEntry = new FileEntry(entryId)
    fileEntry.manifest = manifest.id
    fileEntry.save()

    for (let j = 0; j < fieldNames.length; j++) {
      let fieldKey = fieldNames[j]
      let fieldType = fieldTypes[j]

      let fieldEntityId = entryId + "-" + fieldKey
      let fileField = new Field(fieldEntityId)
      fileField.name = fieldKey
      fileField.atType = fieldType

      if (fieldType == "encrypted") {
        let valueVal = fileFields.get(fieldKey)
        if (valueVal == null) continue
        let valueObj = valueVal.toObject()

        let gadgetVal = valueObj.get("gadgetDescriptor")
        if (gadgetVal == null) continue
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
      fileField.fileEntry = fileEntry.id
      fileField.save()
    }
  }
}