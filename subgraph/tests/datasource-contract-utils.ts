import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { ManifestPublished } from "../generated/DatasourceContract/DatasourceContract"

export function createManifestPublishedEvent(
  owner: Address,
  schema_id: Bytes,
  manifest_cid: string,
  version: BigInt
): ManifestPublished {
  let manifestPublishedEvent = changetype<ManifestPublished>(newMockEvent())

  manifestPublishedEvent.parameters = new Array()

  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam(
      "schema_id",
      ethereum.Value.fromFixedBytes(schema_id)
    )
  )
  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam(
      "manifest_cid",
      ethereum.Value.fromString(manifest_cid)
    )
  )
  manifestPublishedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return manifestPublishedEvent
}
