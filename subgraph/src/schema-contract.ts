import { Bytes, JSONValue, JSONValueKind, dataSource, json, TypedMap, log } from "@graphprotocol/graph-ts";
import { SchemaRegistered as SchemaRegisteredEvent, SchemaUpdated as SchemaUpdatedEvent } from "../generated/SchemaContract/SchemaContract"
import { SchemaRegistered, SchemaUpdated, SchemaState, Schema, SchemaNode, SchemaLeaf } from "../generated/schema"
import { Schema as SchemaTemplate } from "../generated/templates"
import { generateNodeId, walkSchema } from "./utils"

export function handleSchemaRegistered(schemaRegisteredEvent: SchemaRegisteredEvent): void {

  let schemaRegistration = new SchemaRegistered(
    schemaRegisteredEvent.transaction.hash.concatI32(schemaRegisteredEvent.logIndex.toI32())
  )
  schemaRegistration.owner = schemaRegisteredEvent.params.owner
  schemaRegistration.schemaId = schemaRegisteredEvent.params.id
  schemaRegistration.agentId = schemaRegisteredEvent.params.agent_id
  schemaRegistration.name = schemaRegisteredEvent.params.name
  schemaRegistration.ipfsCid = schemaRegisteredEvent.params.spec_cid
  schemaRegistration.save()

  log.debug("Creating new Schema with string {}", [schemaRegistration.schemaId.toHexString()])
  let schemaState = new SchemaState(schemaRegistration.schemaId)

  schemaState.schemaId = schemaRegistration.schemaId
  schemaState.owner = schemaRegistration.owner
  schemaState.name = schemaRegistration.name
  let version = [schemaRegistration.ipfsCid]

  schemaState.versions = version

  schemaState.save()
  // Spawn the schema template fetch and parse the schema from IPFS
  SchemaTemplate.create(schemaRegistration.ipfsCid)
}

export function handleSchemaUpdated(schemaUpdatedEvent: SchemaUpdatedEvent): void {

  // record that an update has occurred
  let schemaUpdate = new SchemaUpdated(
    schemaUpdatedEvent.transaction.hash.concatI32(schemaUpdatedEvent.logIndex.toI32())
  )

  schemaUpdate.schemaId = schemaUpdatedEvent.params.id
  schemaUpdate.newIpfsCid = schemaUpdatedEvent.params.new_spec_cid
  schemaUpdate.newAgentId = schemaUpdatedEvent.params.new_agent_id

  schemaUpdate.save()

  let schema = SchemaState.load(schemaUpdate.schemaId)
  let versions: string[] = []

  if (schema == null) {
    schema = new SchemaState(schemaUpdate.schemaId)
    versions.push(schemaUpdate.newIpfsCid)
    schema.versions = versions
  } else {
    let versions = schema.versions
    if (versions == null) {
      log.warning("Schema Update for SchemaState {} with no found versions. Adding new entry.", [schema.name])
      versions = []
      versions.push(schemaUpdate.newIpfsCid)
      schema.versions = versions
    } else {
      versions.push(schemaUpdate.newIpfsCid)
      schema.versions = versions
    }
  }
  schema.save();
  SchemaTemplate.create(schemaUpdate.newIpfsCid)
}
export function handleSchema(content: Bytes): void {
  let cid = dataSource.stringParam()
  let jsonValue = json.fromBytes(content)

  let traversalString = walkSchema(jsonValue, cid, true)
  if (traversalString == "") {
    log.warning("Failed to process schema for CID {}", [cid])
    return
  }

  let schema = new Schema(cid)
  schema.root = generateNodeId(cid, "root")
  schema.traversalString = traversalString
  schema.save()
}