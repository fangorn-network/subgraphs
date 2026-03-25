import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { ManifestPublished } from "../generated/schema"
import { ManifestPublished as ManifestPublishedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { handleManifestPublished } from "../src/datasource-contract"
import { createManifestPublishedEvent } from "./datasource-contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let schema_id = Bytes.fromI32(1234567890)
    let manifest_cid = "Example string value"
    let version = BigInt.fromI32(234)
    let newManifestPublishedEvent = createManifestPublishedEvent(
      owner,
      schema_id,
      manifest_cid,
      version
    )
    handleManifestPublished(newManifestPublishedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("ManifestPublished created and stored", () => {
    assert.entityCount("ManifestPublished", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "ManifestPublished",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "ManifestPublished",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "schema_id",
      "1234567890"
    )
    assert.fieldEquals(
      "ManifestPublished",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "manifest_cid",
      "Example string value"
    )
    assert.fieldEquals(
      "ManifestPublished",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "version",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
