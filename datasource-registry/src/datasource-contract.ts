import { BigInt, Bytes, dataSource, json, store } from "@graphprotocol/graph-ts"
import { ManifestPublished as ManifestPublishedEvent, ManifestUpdated as ManifestUpdatedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { FileEntry, FileMetadata, ManifestPublished, ManifestState, ManifestUpdated } from "../generated/schema"
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
  let metadata = new FileMetadata(cid)
  
  let parsed = json.try_fromBytes(content)
  if (parsed.isError) return

  let obj = parsed.value.toObject()

  let versionVal = obj.get("version")
  if (versionVal == null) return
  let manifestVersion = BigInt.fromI32(versionVal.toI64() as i32)
  metadata.manifestVersion = manifestVersion

  let entriesVal = obj.get("entries")
  if (entriesVal == null) return
  let entries = entriesVal.toArray()

  let currentEntries: string[] = []
  for (let i = 0; i < entries.length; i++) {

    let entry = entries[i].toObject()

    let tagVal = entry.get("tag")
    if (tagVal == null) continue
    let tag = tagVal.toString()

    let entryId = `${cid}-${i.toString()}`

    let fieldsVal = entry.get("fields")
    if (fieldsVal == null) continue
    let fields = fieldsVal.toObject()

    let titleVal = fields.get("title")
    if (titleVal == null) continue
    let title = titleVal.toString()

    let artistVal = fields.get("artist")
    if (artistVal == null) continue
    let artist = artistVal.toString()

    let audioVal = fields.get("audio")
    if (audioVal == null) continue
    let audio = audioVal.toObject()

    let atTypeVal = audio.get("@type")
    if (atTypeVal  == null) continue
    let atType = atTypeVal.toString()

    let gadgetVal = audio.get("gadgetDescriptor")
    if (gadgetVal == null) continue
    let gadget = gadgetVal.toObject()

    let accVal = gadget.get("type")
    if (accVal == null) continue
    let acc = accVal.toString()

    let fileEntry = new FileEntry(entryId)
    fileEntry.tag = tag
    fileEntry.title = title
    fileEntry.artist = artist
    fileEntry.atType = atType
    fileEntry.acc = acc
    fileEntry.save()
    currentEntries.push(entryId)
  }

  metadata.entries = currentEntries

  metadata.save()
}