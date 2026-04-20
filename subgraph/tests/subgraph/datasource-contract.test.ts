import {
  assert,
  describe,
  test,
  clearStore,
  beforeEach,
  afterEach,
  dataSourceMock,
  mockIpfsFile,
  readFile
} from "matchstick-as"
import { Address, Bytes, BigInt, DataSourceContext, Value } from "@graphprotocol/graph-ts"
import { SchemaState, Schema, ManifestState, Manifest, ManifestNode, ManifestLeaf } from "../../generated/schema"
import { handleManifestPublished, handleMetadata } from "../../src/datasource-contract"
import { handleSchema } from "../../src/schema-contract"
import { createManifestPublishedEvent } from "./datasource-contract-utils"
import { generateNodeId, generateManifestStateId, walkSchema } from "../../src/utils"

export { handleManifestPublished, handleMetadata, handleSchema }

const SCHEMA_CID = "QmTestAlbumSchemaHash123"
const MANIFEST_CID = "QmTestManifestHash456"
const OWNER = Bytes.fromHexString("0x0000000000000000000000000000000000000001")
const SCHEMA_ID = Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000499602d2")
const NAME = "Midnight Frequencies"
const NAME_HASH = Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000deadbeef")

describe("handleManifestPublished", () => {
  beforeEach(() => {
    // Set up schema IPFS mock and create Schema entity
    mockIpfsFile(SCHEMA_CID, "tests/ipfs/album-schema.json")
    dataSourceMock.resetValues()
    dataSourceMock.setAddress(SCHEMA_CID)

    let schemaContent = readFile("tests/ipfs/album-schema.json")
    handleSchema(schemaContent)

    // Set up SchemaState entity
    let schemaState = new SchemaState(SCHEMA_ID)
    schemaState.schemaId = SCHEMA_ID
    schemaState.owner = Address.fromBytes(OWNER)
    schemaState.name = "AlbumSchema"
    schemaState.versions = [SCHEMA_CID]
    schemaState.save()

    // Set up manifest IPFS mock
    mockIpfsFile(MANIFEST_CID, "tests/ipfs/album-manifest.json")
  })

  afterEach(() => {
    clearStore()
  })

  test("creates ManifestPublished event entity", () => {
		let event = createManifestPublishedEvent(
  		Address.fromBytes(OWNER),
  		SCHEMA_ID,
  		NAME_HASH,
  		NAME,
  		MANIFEST_CID
		)
    handleManifestPublished(event)

    assert.entityCount("ManifestPublished", 1)
  })

  test("creates ManifestState entity", () => {
		let event = createManifestPublishedEvent(
  		Address.fromBytes(OWNER),
  		SCHEMA_ID,
  		NAME_HASH,
  		NAME,
  		MANIFEST_CID
		)
    handleManifestPublished(event)

    assert.entityCount("ManifestState", 1)
  })

  test("ManifestState has correct schema reference", () => {
		let event = createManifestPublishedEvent(
  		Address.fromBytes(OWNER),
  		SCHEMA_ID,
  		NAME_HASH,
  		NAME,
  		MANIFEST_CID
		)
    handleManifestPublished(event)

    let stateId = generateManifestStateId(
      Address.fromBytes(OWNER),
      SCHEMA_ID,
      NAME_HASH
    )
    assert.fieldEquals("ManifestState", stateId.toHexString(), "schema", SCHEMA_CID)
  })

  test("ManifestState has correct schemaName", () => {
		let event = createManifestPublishedEvent(
  		Address.fromBytes(OWNER),
  		SCHEMA_ID,
  		NAME_HASH,
  		NAME,
  		MANIFEST_CID
		)
    handleManifestPublished(event)

    let stateId = generateManifestStateId(
      Address.fromBytes(OWNER),
      SCHEMA_ID,
      NAME_HASH
    )
    assert.fieldEquals("ManifestState", stateId.toHexString(), "schemaName", "AlbumSchema")
  })

  test("ManifestState passes traversal string through context", () => {
		let event = createManifestPublishedEvent(
  		Address.fromBytes(OWNER),
  		SCHEMA_ID,
  		NAME_HASH,
  		NAME,
  		MANIFEST_CID
		)

    handleManifestPublished(event)

    // Verify the template was created
    assert.dataSourceCount("Manifest", 1)
    assert.dataSourceExists("Manifest", MANIFEST_CID)
  })
})

describe("handleMetadata - album manifest", () => {
  beforeEach(() => {
    // Set up schema
    mockIpfsFile(SCHEMA_CID, "tests/ipfs/album-schema.json")
    dataSourceMock.resetValues()
    dataSourceMock.setAddress(SCHEMA_CID)

    let schemaContent = readFile("tests/ipfs/album-schema.json")
    handleSchema(schemaContent)

    // Load schema to get traversal string
    let schema = Schema.load(SCHEMA_CID)!
    let traversalString = schema.traversalString

    // Set up SchemaState
    let schemaState = new SchemaState(SCHEMA_ID)
    schemaState.schemaId = SCHEMA_ID
    schemaState.owner = Address.fromBytes(OWNER)
    schemaState.name = "AlbumSchema"
    schemaState.versions = [SCHEMA_CID]
    schemaState.save()

    // Mock dataSource for manifest handler
    dataSourceMock.resetValues()
    dataSourceMock.setAddress(MANIFEST_CID)

    let context = new DataSourceContext()
    context.set("schemaId", Value.fromString(SCHEMA_ID.toHexString()))
    context.set("schemaName", Value.fromString("AlbumSchema"))
    context.set("traversalString", Value.fromString(traversalString))
    context.set("manifestStateId", Value.fromString(
      generateManifestStateId(OWNER, SCHEMA_ID, NAME_HASH).toHexString()
    ))
    dataSourceMock.setReturnValues(MANIFEST_CID, "mainnet", context)

    // Call the handler
    mockIpfsFile(MANIFEST_CID, "tests/ipfs/album-manifest.json")
    let manifestContent = readFile("tests/ipfs/album-manifest.json")
    handleMetadata(manifestContent)
  })

  afterEach(() => {
    clearStore()
  })

  // --- Manifest entity ---

  test("creates Manifest entity", () => {
    assert.entityCount("Manifest", 1)
  })

  test("Manifest has correct schemaName", () => {
    assert.fieldEquals("Manifest", MANIFEST_CID, "schemaName", "AlbumSchema")
  })

  // --- Root node ---

  test("root ManifestNode exists", () => {
    let rootId = generateNodeId(MANIFEST_CID, "root")
    assert.fieldEquals("ManifestNode", rootId, "name", "root")
    assert.fieldEquals("ManifestNode", rootId, "type", "object")
  })

  // --- Simple leaves ---

  test("title leaf has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "title")
    assert.fieldEquals("ManifestLeaf", leafId, "name", "title")
    assert.fieldEquals("ManifestLeaf", leafId, "type", "STRING")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "Midnight Frequencies")
  })

  test("artist leaf has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "artist")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "Nova Drift")
  })

  test("totalTracks leaf has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "totalTracks")
    assert.fieldEquals("ManifestLeaf", leafId, "type", "NUMBER")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "3")
  })

  test("duration leaf has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "duration")
    assert.fieldEquals("ManifestLeaf", leafId, "type", "DECIMAL")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "847.5")
  })

  // --- Nested object (credits) ---

  test("credits node exists as object type", () => {
    let creditsId = generateNodeId(MANIFEST_CID, "credits")
    assert.fieldEquals("ManifestNode", creditsId, "name", "credits")
    assert.fieldEquals("ManifestNode", creditsId, "type", "object")
  })

  test("credits.producer leaf has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "credits.producer")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "Alex Chen")
  })

  test("credits.studio leaf has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "credits.studio")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "Echo Chamber Studios")
  })

  // --- Array of primitives (tags) ---

  test("tags node exists as array type", () => {
    let tagsId = generateNodeId(MANIFEST_CID, "tags")
    assert.fieldEquals("ManifestNode", tagsId, "name", "tags")
    assert.fieldEquals("ManifestNode", tagsId, "type", "array")
  })

  test("tags array has correct leaf values", () => {
    let tag0 = generateNodeId(MANIFEST_CID, "tags[0]")
    let tag1 = generateNodeId(MANIFEST_CID, "tags[1]")
    let tag2 = generateNodeId(MANIFEST_CID, "tags[2]")
    assert.fieldEquals("ManifestLeaf", tag0, "value", "electronic")
    assert.fieldEquals("ManifestLeaf", tag1, "value", "ambient")
    assert.fieldEquals("ManifestLeaf", tag2, "value", "experimental")
  })

  // --- Array of objects (tracks) ---

  test("tracks node exists as array type", () => {
    let tracksId = generateNodeId(MANIFEST_CID, "tracks")
    assert.fieldEquals("ManifestNode", tracksId, "name", "tracks")
    assert.fieldEquals("ManifestNode", tracksId, "type", "array")
  })

  test("first track element node exists", () => {
    let track0Id = generateNodeId(MANIFEST_CID, "tracks[0]")
    assert.fieldEquals("ManifestNode", track0Id, "type", "object")
  })

  test("first track title has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "tracks[0].title")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "Signal Loss")
  })

  test("first track duration has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "tracks[0].duration")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "245.8")
  })

  test("second track has correct featured artists", () => {
    let fa0 = generateNodeId(MANIFEST_CID, "tracks[1].featuredArtists[0]")
    let fa1 = generateNodeId(MANIFEST_CID, "tracks[1].featuredArtists[1]")
    assert.fieldEquals("ManifestLeaf", fa0, "value", "Neon Veil")
    assert.fieldEquals("ManifestLeaf", fa1, "value", "Glass Fauna")
  })

  test("third track has empty featured artists array", () => {
    let tagsNodeId = generateNodeId(MANIFEST_CID, "tracks[2].featuredArtists")
    assert.fieldEquals("ManifestNode", tagsNodeId, "type", "array")
    // No leaf children since the array is empty
  })

  // --- Nested object inside array (tracks.lyrics) ---

  test("first track lyrics node exists", () => {
    let lyricsId = generateNodeId(MANIFEST_CID, "tracks[0].lyrics")
    assert.fieldEquals("ManifestNode", lyricsId, "name", "lyrics")
    assert.fieldEquals("ManifestNode", lyricsId, "type", "object")
  })

  test("first track lyrics language has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "tracks[0].lyrics.language")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "en")
  })

  test("first track lyrics contentHash has correct value", () => {
    let leafId = generateNodeId(MANIFEST_CID, "tracks[0].lyrics.contentHash")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "0x1a2b3c4d5e6f")
  })

  test("third track lyrics language is Japanese", () => {
    let leafId = generateNodeId(MANIFEST_CID, "tracks[2].lyrics.language")
    assert.fieldEquals("ManifestLeaf", leafId, "value", "ja")
  })

  // --- Entity counts ---

  test("correct total ManifestNode count", () => {
    // root (1)
    // credits (1)
    // tags array node (1)
    // tracks array node (1)
    // tracks[0] object (1), tracks[1] object (1), tracks[2] object (1)
    // tracks[0].featuredArtists array (1), tracks[1].featuredArtists array (1), tracks[2].featuredArtists array (1)
    // tracks[0].lyrics object (1), tracks[1].lyrics object (1), tracks[2].lyrics object (1)
    // = 13
    assert.entityCount("ManifestNode", 13)
  })

  test("correct total ManifestLeaf count", () => {
    // Root leaves: title, artist, releaseDate, genre, totalTracks, duration = 6
    // tags[0], tags[1], tags[2] = 3
    // credits: producer, engineer, studio = 3
    // track 0: trackNumber, title, duration = 3, featuredArtists[0] = 1, lyrics.language, lyrics.contentHash = 2 -> 6
    // track 1: trackNumber, title, duration = 3, featuredArtists[0], featuredArtists[1] = 2, lyrics.language, lyrics.contentHash = 2 -> 7
    // track 2: trackNumber, title, duration = 3, featuredArtists (empty) = 0, lyrics.language, lyrics.contentHash = 2 -> 5
    // total = 6 + 3 + 3 + 6 + 7 + 5 = 30
    assert.entityCount("ManifestLeaf", 30)
  })
})