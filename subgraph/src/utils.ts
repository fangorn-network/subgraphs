import { crypto, ByteArray, JSONValueKind, JSONValue, Bytes } from "@graphprotocol/graph-ts"
import { SchemaLeaf, SchemaNode } from "../generated/schema"

export function generateLeafId(key: string, valueType: string, isList: boolean): string {
  let raw = key + "-" + valueType + "-" + isList.toString()
  return crypto.keccak256(ByteArray.fromUTF8(raw)).toHexString()
}

export function generateNodeId(cid: string, path: string): string {
  let raw = cid + "-" + path
  return crypto.keccak256(ByteArray.fromUTF8(raw)).toHexString()
}

export function generateManifestStateId(owner: Bytes, schemaId: Bytes, nameHash: Bytes): Bytes {
	return owner.concat(schemaId).concat(nameHash)
}

export function mapValueType(raw: string): string {
  if (raw == "string") return "STRING"
  if (raw == "number") return "NUMBER"
  if (raw == "decimal") return "DECIMAL"
  if (raw == "bool") return "BOOL"
  if (raw == "address") return "ADDRESS"
  if (raw == "bytes") return "BYTES"
  return ""
}

class WalkWorkItem {
  jsonValue: JSONValue
  key: string
  traversalPath: string
  isList: boolean

  constructor(jsonValue: JSONValue, key: string, traversalPath: string, isList: boolean) {
    this.jsonValue = jsonValue
    this.key = key
    this.traversalPath = traversalPath
    this.isList = isList
  }
}

function ensureLeaf(id: string, key: string, valueType: string, isList: boolean): void {
  let leaf = SchemaLeaf.load(id)
  if (leaf != null) return
  leaf = new SchemaLeaf(id)
  leaf.key = key
  leaf.valueType = valueType
  leaf.isList = isList
  leaf.save()
}

export function walkSchema(
  jsonValue: JSONValue,
  cid: string,
	createEntities: boolean
): string {
  if (jsonValue.kind != JSONValueKind.OBJECT) return ""

  let traversalLines: string[] = []
  let stack: WalkWorkItem[] = []

  stack.push(new WalkWorkItem(jsonValue, "root", "root", false))

  while (stack.length > 0) {
    let item = stack.pop()
    let obj = item.jsonValue.toObject()

    traversalLines.push("node|" + item.traversalPath + "|" + item.isList.toString())

    let childNodeIds: string[] = []
    let childLeafIds: string[] = []

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

      if (entryValue.kind == JSONValueKind.STRING) {
        let mappedType = mapValueType(entryValue.toString())
				if (mappedType == "") continue
        traversalLines.push("leaf|" + childPath + "|" + mappedType + "|false")

        if (createEntities) {
          let leafId = generateLeafId(entryKey, mappedType, false)
          ensureLeaf(leafId, entryKey, mappedType, false)
          childLeafIds.push(leafId)
        }

      } else if (entryValue.kind == JSONValueKind.ARRAY) {
        let arr = entryValue.toArray()
        if (arr.length != 1) continue
        let inner = arr[0]

        if (inner.kind == JSONValueKind.STRING) {
        let mappedType = mapValueType(inner.toString())
				if (mappedType == "") continue
          traversalLines.push("leaf|" + childPath + "|" + mappedType + "|true")

          if (createEntities) {
            let leafId = generateLeafId(entryKey, mappedType, true)
            ensureLeaf(leafId, entryKey, mappedType, true)
            childLeafIds.push(leafId)
          }

        } else if (inner.kind == JSONValueKind.OBJECT) {
          if (createEntities) {
            let childNodeId = generateNodeId(cid, childPath)
            childNodeIds.push(childNodeId)
          }
          stack.push(new WalkWorkItem(inner, entryKey, childPath, true))
        }

      } else if (entryValue.kind == JSONValueKind.OBJECT) {
        if (createEntities) {
          let childNodeId = generateNodeId(cid, childPath)
          childNodeIds.push(childNodeId)
        }
        stack.push(new WalkWorkItem(entryValue, entryKey, childPath, false))
      }
    }

    if (createEntities) {
      let nodeId = generateNodeId(cid, item.traversalPath)
      let node = new SchemaNode(nodeId)
      node.key = item.key
      node.isList = item.isList
      node.childNodes = childNodeIds
      node.childLeaves = childLeafIds
      node.save()
    }
  }

  return traversalLines.join("\n")
}