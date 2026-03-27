import { BigInt, Bytes, dataSource, json, log, store } from "@graphprotocol/graph-ts"
import { ManifestPublished as ManifestPublishedEvent, ManifestUpdated as ManifestUpdatedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { Field, FileEntry, FileMetadata, ManifestPublished, ManifestState, ManifestUpdated, Schema, SchemaEntries, SchemaField } from "../generated/schema"
import { FileMetadata as FileMetadataTemplate } from "../generated/templates"

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

  // Spawn the file data source to fetch and parse the manifest from IPFS
  FileMetadataTemplate.create(event.params.manifest_cid)

  let stateId = entity.owner.concat(entity.schema_id)
  let state = new ManifestState(stateId)
  state.owner = entity.owner
  state.schema_id = entity.schema_id
  state.manifest_cid = entity.manifest_cid
  state.version = entity.version
  state.metadata = entity.manifest_cid
  state.lastUpdated = event.block.timestamp
  state.save();
}

export function handleManifestUpdated(event: ManifestUpdatedEvent): void {

  // clean up previous manifest state
  let stateId = event.params.owner.concat(event.params.schema_id)
  let state = ManifestState.load(stateId)
  if (state != null) {
    let oldMetadata = FileMetadata.load(state.manifest_cid)
    if (oldMetadata != null && oldMetadata.entries != null) {
      let oldEntries = oldMetadata.entries!
      for (let i = 0; i < oldEntries.length; i++) {
        store.remove("FileEntry", oldEntries[i])
      }
      store.remove("FileMetadata", state.manifest_cid)
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

  FileMetadataTemplate.create(entity.manifest_cid)

  // Update manifest state
  if (state == null) {
    state = new ManifestState(stateId)
    state.owner = entity.owner
    state.schema_id = entity.schema_id
  }
  state.manifest_cid = entity.manifest_cid
  state.version = entity.version
  state.metadata = entity.manifest_cid
  state.lastUpdated = entity.blockTimestamp
  state.save()

}

export function handleMetadata(content: Bytes): void {

  let cid = dataSource.stringParam()
  log.debug("File CID {}", [cid])
  let fileMetadata = new FileMetadata(cid)
  log.debug("Parsing file", [])
  let parsed = json.try_fromBytes(content)
  if (parsed.isError) return

  let ipfsFileObj = parsed.value.toObject()

  log.debug("Checking version", [])
  let versionVal = ipfsFileObj.get("version")
  if (versionVal == null) return
  let manifestVersion = BigInt.fromU64(versionVal.toU64())
  fileMetadata.manifestVersion = manifestVersion

  log.debug("Getting entries from IPFS file", [])
  let entriesVal = ipfsFileObj.get("entries")
  if (entriesVal == null) return
  let fileEntriesArray = entriesVal.toArray()

  log.debug("Getting Schema ID", [])
  let schemaIdVal = ipfsFileObj.get("schemaId")
  if (schemaIdVal == null) return
  let schemaIdString = schemaIdVal.toString()
  log.debug("Loading Schema with string {}", [schemaIdString])
  let schema = Schema.load(schemaIdString)

  if (schema == null) return
  log.debug("Schema loaded", [])
  let versions = schema.versions
  log.debug("Checking schema versions", [])
  if (versions == null) return
  if (versions.length == 0) return
  log.debug("Checking first schema versions", [])
  let version = versions[0]
  if (version == null) return
  log.debug("Schema Retrieved", [])

  let schemaEntries = SchemaEntries.load(version)

  if (schemaEntries == null) return
  let fieldPointers = schemaEntries.fields

  if (fieldPointers == null) return

  let currentEntries: string[] = []
  log.debug("Entering IPFS loop", [])
  // Loop over all entries in the IPFS file
  for (let i = 0; i < fileEntriesArray.length; i++) {
    let fileEntryObj = fileEntriesArray[i].toObject()

    let entryId = `${cid}-${i.toString()}`

    let fileFieldsVal = fileEntryObj.get("fields")
    if (fileFieldsVal == null) continue
    let fileFields = fileFieldsVal.toObject()

    let fileEntry = new FileEntry(entryId)

    let fileEntryFieldsArray: string[] = []

    log.debug("Entering Schema loop", [])
    // Get values from all fields defined by the associated schema
    for (let j = 0; j < fieldPointers.length; j++) {

      let fieldId = fieldPointers[j]

      let schemaField = SchemaField.load(fieldId)

      if (schemaField == null) return

      let fieldKey = schemaField.name

      let fieldType = schemaField.fieldType
      let fileField = new Field(cid.concat(fieldKey))
      fileField.atType = fieldType
      fileField.name = fieldKey


      if (fieldType == "encrypted") {

        let valueVal = fileFields.get(fieldKey)
        if (valueVal == null) continue
        let valueObj = valueVal.toObject()

        let gadgetVal = valueObj.get("gadgetDescriptor")
        if (gadgetVal == null) continue
        let gadget = gadgetVal.toObject()

        let accVal = gadget.get("type")
        if ( accVal == null) continue
        let acc = accVal.toString()
        fileField.acc = acc

      } else {
        fileField.acc = ""
        let valueVal = fileFields.get(fieldKey)
        if (valueVal == null) continue
        let value = valueVal.toString()
        fileField.value = value
      }

      fileField.save()
      
      fileEntryFieldsArray.push(cid.concat(fieldKey))

      log.debug("Inner loop end hit", [])

    }

    log.debug("Outter loop end hit", [])
    fileEntry.fields = fileEntryFieldsArray
    fileEntry.save()
    currentEntries.push(entryId)
  }
  log.debug("Final save", [])
  fileMetadata.schemaId = schemaIdString
  fileMetadata.entries = currentEntries

  fileMetadata.save()
}