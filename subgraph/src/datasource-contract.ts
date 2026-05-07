import { Bytes } from "@graphprotocol/graph-ts"
import {
  ManifestPublished as ManifestPublishedEvent,
  ManifestUpdated as ManifestUpdatedEvent,
} from "../generated/DatasourceContract/DatasourceContract"
import {
  ManifestPublished,
  ManifestUpdated,
} from "../generated/schema"

export function handleManifestPublished(event: ManifestPublishedEvent): void {
  let entity = new ManifestPublished(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.schemaId = event.params.schema_id
  entity.nameHash = event.params.name_hash
  entity.name = event.params.name
  entity.manifestCid = event.params.manifest_cid
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}

export function handleManifestUpdated(event: ManifestUpdatedEvent): void {
  let entity = new ManifestUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.schemaId = event.params.schema_id
  entity.nameHash = event.params.name_hash
  entity.manifestCid = event.params.manifest_cid
  entity.version = event.params.version
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()
}