import { BigInt, Bytes, dataSource, DataSourceContext, ipfs, json, JSONValue, JSONValueKind, log } from "@graphprotocol/graph-ts"
import { ManifestPublished as ManifestPublishedEvent, ManifestUpdated as ManifestUpdatedEvent } from "../generated/DatasourceContract/DatasourceContract"
import { Manifest, ManifestPublished, ManifestState, ManifestUpdated, SchemaState, Schema, ManifestLeaf, ManifestNode } from "../generated/schema"
import { Manifest as ManifestTemplate } from "../generated/templates"
import { generateManifestStateId, generateNodeId, walkSchema } from "./utils"

function fetchTraversalFromIpfs(schemaCid: string): string {
  let rawBytes = ipfs.cat(schemaCid)
  if (rawBytes === null) {
    return ""
  }
  let bytes: Bytes = rawBytes
  let jsonValue = json.try_fromBytes(bytes)
	if (jsonValue.isError) {
		log.warning("Direct IPFS fetch failed for schema CID: {}", [schemaCid])
		return ""
	}
  return walkSchema(jsonValue.value, schemaCid, false)
}

export function handleManifestPublished(manifestPublishedEvent: ManifestPublishedEvent): void {
	let manifestPublished = new ManifestPublished(
		manifestPublishedEvent.transaction.hash.concatI32(manifestPublishedEvent.logIndex.toI32())
	)
	manifestPublished.owner = manifestPublishedEvent.params.owner
	manifestPublished.schemaId = manifestPublishedEvent.params.schema_id
	manifestPublished.manifestCid = manifestPublishedEvent.params.manifest_cid
	manifestPublished.name = manifestPublishedEvent.params.name
	manifestPublished.nameHash = manifestPublishedEvent.params.name_hash
	manifestPublished.blockNumber = manifestPublishedEvent.block.number
	manifestPublished.blockTimestamp = manifestPublishedEvent.block.timestamp
	manifestPublished.transactionHash = manifestPublishedEvent.transaction.hash
	manifestPublished.save()

	let schemaState = SchemaState.load(manifestPublished.schemaId)
	if (schemaState == null) {
		log.warning("SchemaState wasn't found for schema_id: {}", [manifestPublished.schemaId.toHexString()])
		return
	}

	let schemas = schemaState.versions
	if (schemas == null || schemas.length == 0) {
		log.warning("Schemas IPFS CIDs weren't set for SchemaState: {}", [schemaState.schemaId.toHexString()])
		return
	}

// Try loading the Schema entity first
let schemaCid = schemas[0]
if (schemaCid == null || schemaCid == "") {
	log.warning("Schemas IPFS CIDs weren't set for SchemaState: {}", [schemaState.schemaId.toHexString()])
	return
}
let traversalString = ""

let schema = Schema.load(schemaCid)
if (schema != null) {
  traversalString = schema.traversalString
} else {
	log.warning("ManifestPublish: Schema not loaded. Attempting direct fetch from IPFS.", [])
	traversalString = fetchTraversalFromIpfs(schemaCid)
}

if (traversalString == "") {
  log.warning("Could not build traversal string for schema_id: {}", [manifestPublished.schemaId.toHexString()])
  return
}

	let schemaName = schemaState.name
	if (schemaName == null) {
		log.warning("schema name was null", [])
		schemaName = "unknown_schema_name"
	}

	let stateId = generateManifestStateId(manifestPublished.owner, manifestPublished.schemaId, manifestPublished.nameHash)

	let manifestState = new ManifestState(stateId)
	manifestState.owner = manifestPublished.owner
	manifestState.schemaId = manifestPublished.schemaId
	manifestState.schema = schemas[0]
	manifestState.manifestCid = manifestPublished.manifestCid
	manifestState.manifest = manifestPublished.manifestCid + "-" + manifestState.id.toHexString()
	manifestState.version = BigInt.fromI32(1)
	manifestState.schemaName = schemaName
	manifestState.lastUpdated = manifestPublishedEvent.block.timestamp
	manifestState.save()

	let context = new DataSourceContext()
	context.setString("schemaId", manifestPublished.schemaId.toHexString())
	context.setString("schemaName", manifestState.schemaName)
	context.setString("traversalString", traversalString)
	context.setString("manifestStateId", manifestState.id.toHexString())

	ManifestTemplate.createWithContext(manifestState.manifestCid, context)
}

export function handleManifestUpdated(manifestUpdatedEvent: ManifestUpdatedEvent): void {
	let manifestOwner = manifestUpdatedEvent.params.owner
	let schemaId = manifestUpdatedEvent.params.schema_id
	let stateId = generateManifestStateId(manifestOwner, schemaId, manifestUpdatedEvent.params.name_hash)

	let manifestState = ManifestState.load(stateId)

	// record that an update has occurred
	let manifestUpdated = new ManifestUpdated(
		manifestUpdatedEvent.transaction.hash.concatI32(manifestUpdatedEvent.logIndex.toI32())
	)
	manifestUpdated.owner = manifestUpdatedEvent.params.owner
	manifestUpdated.schemaId = manifestUpdatedEvent.params.schema_id
	manifestUpdated.manifestCid = manifestUpdatedEvent.params.manifest_cid
	manifestUpdated.nameHash = manifestUpdatedEvent.params.name_hash
	manifestUpdated.version = manifestUpdatedEvent.params.version
	manifestUpdated.blockNumber = manifestUpdatedEvent.block.number
	manifestUpdated.blockTimestamp = manifestUpdatedEvent.block.timestamp
	manifestUpdated.transactionHash = manifestUpdatedEvent.transaction.hash
	manifestUpdated.save()

	let schemaState = SchemaState.load(manifestUpdatedEvent.params.schema_id)
	if (schemaState == null) {
		log.warning("schema was null in manifest update for {}", [manifestUpdated.manifestCid])
		return
	}

	let schemas = schemaState.versions
	if (schemas == null || schemas.length == 0) {
		log.warning("schema.versions was null or there were no versions in manifest update for {}", [manifestUpdated.manifestCid])
		return
	}

// Try loading the Schema entity first
let schemaCid = schemas[0]
if (schemaCid == null || schemaCid == "") {
	log.warning("Schemas IPFS CIDs weren't set for SchemaState: {}", [schemaState.schemaId.toHexString()])
	return
}
let traversalString = ""

let schema = Schema.load(schemaCid)
if (schema != null) {
  traversalString = schema.traversalString
} else {
	log.warning("ManifestPublish: Schema not loaded. Attempting direct fetch from IPFS.", [])
	traversalString = fetchTraversalFromIpfs(schemaCid)
}

if (traversalString == "") {
  log.warning("Could not build traversal string for schema_id: {}", [manifestUpdated.schemaId.toHexString()])
  return
}
	let schemaName = schemaState.name

	if (schemaName == null) {
		log.warning("schemaName was null in manifest update for {}", [manifestUpdated.manifestCid])
		schemaName = "unknown_schema_name"
	}

	// Update manifest state
	if (manifestState == null) {
		log.warning("Manifest state was found to be null with ID {}", [stateId.toHexString()])
		manifestState = new ManifestState(stateId)
		manifestState.owner = manifestUpdated.owner
		manifestState.schemaId = manifestUpdated.schemaId
		manifestState.schemaName = schemaName
		manifestState.schema = schemas[0]
	}

	manifestState.manifestCid = manifestUpdated.manifestCid
	manifestState.manifest = manifestUpdated.manifestCid + "-" + manifestState.id.toHexString()
	manifestState.version = manifestUpdated.version
	manifestState.lastUpdated = manifestUpdated.blockTimestamp
	manifestState.save()

	let context = new DataSourceContext()
	context.setString("schemaId", manifestState.schemaId.toHexString())
	context.setString("schemaName", manifestState.schemaName)
	context.setString("traversalString", traversalString)
	context.setString("manifestStateId", manifestState.id.toHexString())

	ManifestTemplate.createWithContext(manifestState.manifestCid, context)
}

class TraversalEntry {
  kind: string       // "node" or "leaf"
  path: string
  isList: boolean
  valueType: string  // only for leaves

  constructor(kind: string, path: string, isList: boolean, valueType: string) {
    this.kind = kind
    this.path = path
    this.isList = isList
    this.valueType = valueType
  }
}

class WorkItem {
  jsonValue: JSONValue
  key: string
  traversalPath: string
  parentNodeId: string | null
  nodeType: string   // "object" or "array"

  constructor(
    jsonValue: JSONValue,
    key: string,
    traversalPath: string,
    parentNodeId: string | null,
    nodeType: string
  ) {
    this.jsonValue = jsonValue
    this.key = key
    this.traversalPath = traversalPath
    this.parentNodeId = parentNodeId
    this.nodeType = nodeType
  }
}

export function handleMetadata(content: Bytes): void {
  let cid = dataSource.stringParam()
  let context = dataSource.context()

  let schemaIdString = context.getString("schemaId")
  let schemaName = context.getString("schemaName")
  let traversalString = context.getString("traversalString")
  let manifestStateIdString = context.getString("manifestStateId")

  let jsonValue = json.fromBytes(content)

  if (jsonValue.kind != JSONValueKind.OBJECT) {
    log.warning("Manifest root is not an object, skipping CID {}", [cid])
    return
  }

  let traversalMap = new Map<string, TraversalEntry>()
  let lines = traversalString.split("\n")
  for (let i = 0; i < lines.length; i++) {
    let parts = lines[i].split("|")
    if (parts.length < 3) {
      continue
    }

    let kind = parts[0]
    let path = parts[1]

    if (kind == "node") {
      let isList = parts[2] == "true"
      traversalMap.set(path, new TraversalEntry(kind, path, isList, ""))
    } else if (kind == "leaf" && parts.length >= 4) {
      let valueType = parts[2]
      let isList = parts[3] == "true"
      traversalMap.set(path, new TraversalEntry(kind, path, isList, valueType))
    }
  }

  let rootNodeId = generateNodeId(cid, "root")

  let stack: WorkItem[] = []
  stack.push(new WorkItem(jsonValue, "root", "root", null, "object"))

  while (stack.length > 0) {
    let item = stack.pop()
    let nodeId = generateNodeId(cid, item.traversalPath)

    let node = new ManifestNode(nodeId)
    node.manifest = cid
    node.name = item.key
    node.type = item.nodeType
    node.parentNode = item.parentNodeId
    node.save()

    if (item.nodeType == "array") {
      let arr = item.jsonValue.toArray()
      for (let i = 0; i < arr.length; i++) {
        let element = arr[i]

        if (element.kind == JSONValueKind.OBJECT) {
          let childPath = item.traversalPath + "[" + i.toString() + "]"
          stack.push(new WorkItem(element, item.key + "[" + i.toString() + "]", childPath, nodeId, "object"))
        } else {
          let lookupPath = stripArrayIndices(item.traversalPath)
          let valueType = "STRING"
          if (traversalMap.has(lookupPath)) {
            let mapEntry = traversalMap.get(lookupPath)
            valueType = mapEntry.valueType
          }
          let leafId = generateNodeId(cid, item.traversalPath + "[" + i.toString() + "]")

          let leaf = new ManifestLeaf(leafId)
          leaf.manifest = cid
          leaf.parentNode = nodeId
          leaf.name = item.key + "[" + i.toString() + "]"
          leaf.type = valueType
          leaf.value = jsonValueToString(element, valueType)
          leaf.save()
        }
      }
    } else {
      let obj = item.jsonValue.toObject()
      let entries = obj.entries

      for (let i = 0; i < entries.length; i++) {
        let entryKey = entries[i].key
        let entryValue = entries[i].value
        let childPath = ""
        if (item.traversalPath == "root") {
          childPath = entryKey
        } else {
          childPath = item.traversalPath + "." + entryKey
        }

        let lookupPath = stripArrayIndices(childPath)

        if (!traversalMap.has(lookupPath)) {
          log.warning("No traversal entry for path {}, skipping", [childPath])
          continue
        }
        let entry = traversalMap.get(lookupPath)

        if (entry.kind == "node") {
          if (entry.isList) {
            if (entryValue.kind != JSONValueKind.ARRAY) {
              log.warning("Expected array at path {}", [childPath])
              continue
            }
            stack.push(new WorkItem(entryValue, entryKey, childPath, nodeId, "array"))
          } else {
            if (entryValue.kind != JSONValueKind.OBJECT) {
              log.warning("Expected object at path {}", [childPath])
              continue
            }
            stack.push(new WorkItem(entryValue, entryKey, childPath, nodeId, "object"))
          }
        } else if (entry.kind == "leaf") {
          if (entry.isList) {
            if (entryValue.kind != JSONValueKind.ARRAY) {
              log.warning("Expected array at path {}", [childPath])
              continue
            }
            let arrayNodeId = generateNodeId(cid, childPath)
            let arrayNode = new ManifestNode(arrayNodeId)
            arrayNode.manifest = cid
            arrayNode.name = entryKey
            arrayNode.type = "array"
            arrayNode.parentNode = nodeId
            arrayNode.save()

            let arr = entryValue.toArray()
            for (let j = 0; j < arr.length; j++) {
              let leafId = generateNodeId(cid, childPath + "[" + j.toString() + "]")
              let leaf = new ManifestLeaf(leafId)
              leaf.manifest = cid
              leaf.parentNode = arrayNodeId
              leaf.name = entryKey + "[" + j.toString() + "]"
              leaf.type = entry.valueType
              leaf.value = jsonValueToString(arr[j], leaf.type)
              leaf.save()
            }
          } else {
            let leafId = generateNodeId(cid, childPath)
            let leaf = new ManifestLeaf(leafId)
            leaf.manifest = cid
            leaf.parentNode = nodeId
            leaf.name = entryKey
            leaf.type = entry.valueType
            leaf.value = jsonValueToString(entryValue, leaf.type)
            leaf.save()
          }
        }
      }
    }
  }

  let manifest = new Manifest(cid)
  manifest.schemaId = Bytes.fromHexString(schemaIdString)
  manifest.schemaName = schemaName
  manifest.manifestStateId = Bytes.fromHexString(manifestStateIdString)
	manifest.manifestState = Bytes.fromHexString(manifestStateIdString)
  manifest.root = rootNodeId
  manifest.save()
}

function stripArrayIndices(path: string): string {
  let result = ""
  let i = 0
  while (i < path.length) {
    if (path.charAt(i) == "[") {
      while (i < path.length && path.charAt(i) != "]") {
        i++
      }
      i++
    } else {
      result = result + path.charAt(i)
      i++
    }
  }
  return result
}

function jsonValueToString(value: JSONValue, valueType: string): string {
  if (valueType == "STRING") {
    return value.toString()
  } else if (valueType == "NUMBER") {
    return i64(value.toF64()).toString()
  } else if (valueType == "DECIMAL") {
    return value.toF64().toString()
  } else if (valueType == "BOOL") {
    if (value.toBool()) {
      return "true"
    }
    return "false"
  } else if (valueType == "ADDRESS" || valueType == "BYTES") {
    return value.toString()
  }
  return ""
}