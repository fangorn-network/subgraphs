import { BigInt, Bytes, dataSource, json, log } from "@graphprotocol/graph-ts"
import {SchemaRegistered as SchemaRegisteredEvent, SchemaUpdated as SchemaUpdatedEvent} from "../generated/SchemaContract/SchemaContract"
import { SchemaRegistered, SchemaUpdated, Schema, SchemaEntries, SchemaField } from "../generated/schema"
import { Schema as SchemaTemplate } from "../generated/templates"

export function handleSchemaRegistered(event: SchemaRegisteredEvent): void {

  let entity = new SchemaRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.schemaId = event.params.id
  entity.agent_id = event.params.agent_id
  entity.name = event.params.name
  entity.spec_cid = event.params.spec_cid
  entity.save()

  log.debug("Creating new Schema with string {}", [entity.schemaId.toHexString()])
  let schema = new Schema(entity.schemaId.toHexString())

  schema.schemaId = entity.schemaId
  schema.owner = entity.owner
  schema.name = entity.name
  let version = [entity.spec_cid]

  schema.versions = version

  schema.save()
  // Spawn the schema template fetch and parse the schema from IPFS
  SchemaTemplate.create(entity.spec_cid)
}

export function handleSchemaUpdated(event: SchemaUpdatedEvent): void {

  // record that an update has occurred
  let entity = new SchemaUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.schemaId = event.params.id
  entity.new_spec_cid = event.params.new_spec_cid
  entity.new_agent_id = event.params.new_agent_id

  entity.save()

  let schema = Schema.load(entity.schemaId.toHexString())
  let versions: string[] = []

  if (schema == null) {
    schema = new Schema(entity.schemaId.toHexString())
    versions.push(entity.new_spec_cid)
    schema.versions = versions
  } else {
    let versions = schema.versions
    if (versions == null) {
        versions = []
        versions.push(entity.new_spec_cid)
        schema.versions = versions
    } else {
        versions.push(entity.new_spec_cid)
        schema.versions = versions
    }
  }
  SchemaTemplate.create(entity.new_spec_cid)
}

export function handleSchema(content: Bytes): void {

  let cid = dataSource.stringParam()
  let schemaData = new SchemaEntries(cid)
  
  let parsed = json.try_fromBytes(content)
  if (parsed.isError) return

  let ipfsObj = parsed.value.toObject()

  let versionVal = ipfsObj.get("version")
  if (versionVal == null) return
  let version = BigInt.fromU64(versionVal.toU64())
  schemaData.version = version

  schemaData.spec_cid = cid

  schemaData.agent_id = ""

  let definitionVal = ipfsObj.get("definition")
  if (definitionVal == null) return
  let definition = definitionVal.toObject()

  let fieldEntries = definition.entries;

  let schemaFields: string[] = []
  for (let i = 0; i < fieldEntries.length; i++) {
    let key = fieldEntries[i].key;
    let val = fieldEntries[i].value.toObject()
    let atTypeVal = val.get("@type")
    let fieldType = atTypeVal != null ? atTypeVal.toString() : "unknown"
    let schemaFieldId = cid.concat(key)
    let schemaField = new SchemaField(schemaFieldId)
    schemaField.fieldType = fieldType
    schemaField.name = key
    schemaField.save()
    schemaFields.push(schemaFieldId)
  }

  schemaData.fields = schemaFields

  schemaData.save()
}