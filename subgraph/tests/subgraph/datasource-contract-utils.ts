import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { ManifestPublished } from "../../generated/DatasourceContract/DatasourceContract"

export function createManifestPublishedEvent(
  owner: Address,
  schema_id: Bytes,
  name_hash: Bytes,
  name: string,
  manifest_cid: string
): ManifestPublished {
  let manifestPublishedEvent = changetype<ManifestPublished>(newMockEvent())

  manifestPublishedEvent.parameters = new Array()

  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam("schema_id", ethereum.Value.fromFixedBytes(schema_id))
  )
  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam("name_hash", ethereum.Value.fromFixedBytes(name_hash))
  )
  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam("manifest_cid", ethereum.Value.fromString(manifest_cid))
  )

  return manifestPublishedEvent
}