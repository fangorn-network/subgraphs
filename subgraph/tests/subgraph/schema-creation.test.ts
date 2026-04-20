import { assert, test, describe, beforeEach, afterEach, clearStore, dataSourceMock, mockIpfsFile, readFile } from "matchstick-as"
import { Bytes } from "@graphprotocol/graph-ts"
import { handleSchema } from "../../src/schema-contract"
import { Schema, SchemaNode, SchemaLeaf } from "../../generated/schema"
import { generateLeafId, generateNodeId } from "../../src/utils"

// Export handler for coverage
export { handleSchema }

const CID = "QmTestAlbumSchemaHash123"

describe("walkSchema - album schema", () => {
  beforeEach(() => {
    mockIpfsFile(CID, "tests/ipfs/album-schema.json")
    dataSourceMock.resetValues()
    dataSourceMock.setAddress(CID)

    let content = readFile("tests/ipfs/album-schema.json")
    handleSchema(content)
  })

  afterEach(() => {
    clearStore()
  })

  // --- Schema entity ---

  test("creates Schema entity with correct ID", () => {
    assert.fieldEquals("Schema", CID, "id", CID)
  })

  test("Schema entity has a root node", () => {
    let expectedRootId = generateNodeId(CID, "root")
    assert.fieldEquals("Schema", CID, "root", expectedRootId)
  })

  test("Schema entity has a non-empty traversal string", () => {
    let schema = Schema.load(CID)!
    assert.assertTrue(schema.traversalString.length > 0)
  })

  // --- Root node ---

  test("root node exists with correct key", () => {
    let rootId = generateNodeId(CID, "root")
    assert.fieldEquals("SchemaNode", rootId, "key", "root")
    assert.fieldEquals("SchemaNode", rootId, "isList", "false")
  })

  test("root node has correct number of child leaves", () => {
    let rootId = generateNodeId(CID, "root")
    let root = SchemaNode.load(rootId)!
    // title, artist, releaseDate, genre, totalTracks, duration = 6 leaves
    // tags is a leaf with isList=true = 1 leaf
    // total = 7 child leaves
    assert.i32Equals(7, root.childLeaves!.length)
  })

  test("root node has correct number of child nodes", () => {
    let rootId = generateNodeId(CID, "root")
    let root = SchemaNode.load(rootId)!
    // credits (object) + tracks (list of objects) = 2 child nodes
    assert.i32Equals(2, root.childNodes!.length)
  })

  // --- Simple leaf deduplication ---

  test("leaves with same key/type/isList share the same ID", () => {
    // "title" appears at root level AND inside tracks
    // both are key="title", valueType="STRING", isList=false
    // they should have the same leaf ID
    let titleLeafId = generateLeafId("title", "STRING", false)
    assert.fieldEquals("SchemaLeaf", titleLeafId, "key", "title")
    assert.fieldEquals("SchemaLeaf", titleLeafId, "valueType", "STRING")
    assert.fieldEquals("SchemaLeaf", titleLeafId, "isList", "false")
  })

  test("duration leaf is DECIMAL type", () => {
    let leafId = generateLeafId("duration", "DECIMAL", false)
    assert.fieldEquals("SchemaLeaf", leafId, "key", "duration")
    assert.fieldEquals("SchemaLeaf", leafId, "valueType", "DECIMAL")
  })

  test("totalTracks leaf is NUMBER type", () => {
    let leafId = generateLeafId("totalTracks", "NUMBER", false)
    assert.fieldEquals("SchemaLeaf", leafId, "key", "totalTracks")
    assert.fieldEquals("SchemaLeaf", leafId, "valueType", "NUMBER")
  })

  // --- Array of primitives ---

  test("tags leaf exists with isList true", () => {
    let leafId = generateLeafId("tags", "STRING", true)
    assert.fieldEquals("SchemaLeaf", leafId, "key", "tags")
    assert.fieldEquals("SchemaLeaf", leafId, "valueType", "STRING")
    assert.fieldEquals("SchemaLeaf", leafId, "isList", "true")
  })

  test("featuredArtists leaf exists with isList true", () => {
    let leafId = generateLeafId("featuredArtists", "STRING", true)
    assert.fieldEquals("SchemaLeaf", leafId, "key", "featuredArtists")
    assert.fieldEquals("SchemaLeaf", leafId, "isList", "true")
  })

  // --- Nested object (credits) ---

  test("credits node exists and is not a list", () => {
    let creditsId = generateNodeId(CID, "credits")
    assert.fieldEquals("SchemaNode", creditsId, "key", "credits")
    assert.fieldEquals("SchemaNode", creditsId, "isList", "false")
  })

  test("credits node has correct child leaves", () => {
    let creditsId = generateNodeId(CID, "credits")
    let creditsNode = SchemaNode.load(creditsId)!
    // producer, engineer, studio = 3 leaves
    assert.i32Equals(3, creditsNode.childLeaves!.length)
  })

  // --- Array of objects (tracks) ---

  test("tracks node exists and is a list", () => {
    let tracksId = generateNodeId(CID, "tracks")
    assert.fieldEquals("SchemaNode", tracksId, "key", "tracks")
    assert.fieldEquals("SchemaNode", tracksId, "isList", "true")
  })

  test("tracks node has correct child leaves", () => {
    let tracksId = generateNodeId(CID, "tracks")
    let tracksNode = SchemaNode.load(tracksId)!
    // trackNumber, title, duration, featuredArtists = 4 leaves
    assert.i32Equals(4, tracksNode.childLeaves!.length)
  })

  test("tracks node has one child node (lyrics)", () => {
    let tracksId = generateNodeId(CID, "tracks")
    let tracksNode = SchemaNode.load(tracksId)!
    // lyrics = 1 child node
    assert.i32Equals(1, tracksNode.childNodes!.length)
  })

  // --- Nested object inside array (tracks.lyrics) ---

  test("lyrics node exists inside tracks", () => {
    let lyricsId = generateNodeId(CID, "tracks.lyrics")
    assert.fieldEquals("SchemaNode", lyricsId, "key", "lyrics")
    assert.fieldEquals("SchemaNode", lyricsId, "isList", "false")
  })

  test("lyrics node has correct child leaves", () => {
    let lyricsId = generateNodeId(CID, "tracks.lyrics")
    let lyricsNode = SchemaNode.load(lyricsId)!
    // language, contentHash = 2 leaves
    assert.i32Equals(2, lyricsNode.childLeaves!.length)
  })

  test("contentHash leaf is BYTES type", () => {
    let leafId = generateLeafId("contentHash", "BYTES", false)
    assert.fieldEquals("SchemaLeaf", leafId, "key", "contentHash")
    assert.fieldEquals("SchemaLeaf", leafId, "valueType", "BYTES")
  })

  // --- Traversal string correctness ---

  test("traversal string contains all expected node entries", () => {
    let schema = Schema.load(CID)!
    let ts = schema.traversalString
    assert.assertTrue(ts.includes("node|root|false") == true)
    assert.assertTrue(ts.includes("node|credits|false") == true)
    assert.assertTrue(ts.includes("node|tracks|true") == true)
    assert.assertTrue(ts.includes("node|tracks.lyrics|false") == true)
  })

  test("traversal string contains all expected leaf entries", () => {
    let schema = Schema.load(CID)!
    let ts = schema.traversalString
    assert.assertTrue(ts.includes("leaf|title|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|artist|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|releaseDate|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|genre|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|totalTracks|NUMBER|false") == true)
    assert.assertTrue(ts.includes("leaf|duration|DECIMAL|false") == true)
    assert.assertTrue(ts.includes("leaf|tags|STRING|true") == true)
    assert.assertTrue(ts.includes("leaf|credits.producer|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|credits.engineer|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|credits.studio|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|tracks.trackNumber|NUMBER|false") == true)
    assert.assertTrue(ts.includes("leaf|tracks.title|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|tracks.duration|DECIMAL|false") == true)
    assert.assertTrue(ts.includes("leaf|tracks.featuredArtists|STRING|true") == true)
    assert.assertTrue(ts.includes("leaf|tracks.lyrics.language|STRING|false") == true)
    assert.assertTrue(ts.includes("leaf|tracks.lyrics.contentHash|BYTES|false") == true)
  })

  test("traversal string has correct number of lines", () => {
    let schema = Schema.load(CID)!
    let lines = schema.traversalString.split("\n")
    // 4 nodes (root, credits, tracks, tracks.lyrics)
    // 16 leaves
    // total = 20 lines
    assert.i32Equals(20, lines.length)
  })

  // --- Entity counts ---

  test("correct total number of SchemaNode entities", () => {
    // root, credits, tracks, tracks.lyrics = 4
    assert.entityCount("SchemaNode", 4)
  })

  test("correct total number of SchemaLeaf entities", () => {
    // Unique leaves after deduplication:
    // title (STRING, false) - shared between root and tracks
    // artist (STRING, false)
    // releaseDate (STRING, false)
    // genre (STRING, false)
    // totalTracks (NUMBER, false)
    // duration (DECIMAL, false) - shared between root and tracks
    // tags (STRING, true)
    // producer (STRING, false) - same ID as artist? No - different key
    // engineer (STRING, false)
    // studio (STRING, false)
    // trackNumber (NUMBER, false)
    // featuredArtists (STRING, true)
    // language (STRING, false)
    // contentHash (BYTES, false)
    // = 14 unique leaves
    assert.entityCount("SchemaLeaf", 14)
  })
})