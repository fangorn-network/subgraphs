import { SchemaRegistered as SchemaRegisteredEvent, SchemaUpdated as SchemaUpdatedEvent } from "../generated/SchemaContract/SchemaContract"
import { SchemaRegistered, SchemaUpdated } from "../generated/schema"

export function handleSchemaRegistered(event: SchemaRegisteredEvent): void {
  let entity = new SchemaRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.schemaId = event.params.id
  entity.owner = event.params.owner
  entity.name = event.params.name
  entity.ipfsCid = event.params.spec_cid
  entity.agentId = event.params.agent_id
  entity.save()
}

export function handleSchemaUpdated(event: SchemaUpdatedEvent): void {
  let entity = new SchemaUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.schemaId = event.params.id
  entity.newIpfsCid = event.params.new_spec_cid
  entity.newAgentId = event.params.new_agent_id
  entity.save()
}