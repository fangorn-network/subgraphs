import { log } from "@graphprotocol/graph-ts";
import { PriceUpdated, PricingResource, ResourceCreated } from "../generated/schema";
import { PriceUpdated as PriceUpdatedEvent, ResourceCreated as ResourceCreatedEvent } from "../generated/SettlementContract/SettlementContract";


export function handleResourceCreated(event: ResourceCreatedEvent): void {

    let entity = new ResourceCreated(event.transaction.hash.concatI32(event.logIndex.toI32()))

    entity.resourceId = event.params.resourceId
    entity.price = event.params.price
    entity.groupId = event.params.groupId
    entity.owner = event.params.owner

    let resource = new PricingResource(entity.resourceId.toHexString())

    resource.owner = entity.owner
    resource.price = entity.price
    resource.currency = "USDC"

    entity.save()
    resource.save()
}

export function handlePriceUpdated(event: PriceUpdatedEvent): void {
    let entity = new PriceUpdated(event.transaction.hash.concatI32(event.logIndex.toI32()))
    entity.resourceId = event.params.resourceId
    entity.owner = event.params.owner
    entity.price = event.params.price

    let resource = PricingResource.load(entity.resourceId.toHexString())
    if (resource == null) {
        log.warning("No resource found matching {}", [entity.resourceId.toHexString()])
        return
    }
    resource.price = entity.price
    entity.save()
    resource.save()
}