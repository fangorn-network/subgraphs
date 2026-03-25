import { BigInt, Bytes, dataSource, json } from "@graphprotocol/graph-ts"
import { ManifestPublished as ManifestPublishedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { FileEntry, FileMetadata, ManifestPublished } from "../generated/schema"
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

  // Spawn the file data source to fetch and parse the manifest from IPFS
  FileMetadataTemplate.create(event.params.manifest_cid)

  entity.metadata = event.params.manifest_cid
  entity.save()
}

export function handleMetadata(content: Bytes): void {
  // Use dataSource.stringParam() + tag for a unique ID
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

  let currentEntries = metadata.entries
  for (let i = 0; i < entries.length; i++) {

    if (currentEntries == null) {
      currentEntries = []
    }
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