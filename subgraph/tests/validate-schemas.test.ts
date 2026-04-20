import Ajv from "ajv/dist/2020"
import { describe, test, expect } from "vitest"
import metaSchema from "./metaschema.json"
import implementedSchema from "./ipfs/album-schema.json"
import manifest from "./ipfs/album-manifest.json"

const typeMap: Record<string, object> = {
  string:  { type: "string" },
  number:  { type: "integer" },
  decimal: { type: "number" },
  bool:    { type: "boolean" },
  address: { type: "string", pattern: "^0x[0-9a-fA-F]{40}$" },
  bytes:   { type: "string", pattern: "^0x[0-9a-fA-F]*$" }
}

function schemaToJsonSchema(schema: Record<string, any>): object {
  const properties: Record<string, object> = {}
  const required: string[] = []

  for (const [key, value] of Object.entries(schema)) {
    required.push(key)

    if (typeof value === "string") {
      properties[key] = typeMap[value]
    } else if (Array.isArray(value) && typeof value[0] === "string") {
      properties[key] = { type: "array", items: typeMap[value[0]] }
    } else if (Array.isArray(value) && typeof value[0] === "object") {
      properties[key] = { type: "array", items: schemaToJsonSchema(value[0]) }
    } else if (typeof value === "object" && value !== null) {
      properties[key] = schemaToJsonSchema(value)
    }
  }

  return {
    type: "object",
    properties,
    required,
    additionalProperties: false
  }
}

const ajv = new Ajv()

describe("Schema validation", () => {
  test("implemented schema conforms to metaschema", () => {
    const validate = ajv.compile(metaSchema)
    const valid = validate(implementedSchema)
    if (!valid) console.log(validate.errors)
    expect(valid).toBe(true)
  })

  test("manifest conforms to implemented schema", () => {
    const jsonSchema = schemaToJsonSchema(implementedSchema)
    const validate = ajv.compile(jsonSchema)
    const valid = validate(manifest)
    if (!valid) console.log(validate.errors)
    expect(valid).toBe(true)
  })

  test("invalid manifest fails validation", () => {
    const jsonSchema = schemaToJsonSchema(implementedSchema)
    const validate = ajv.compile(jsonSchema)
    const invalid = validate({ title: 123 })
    expect(invalid).toBe(false)
  })

  test("manifest with extra fields fails validation", () => {
    const jsonSchema = schemaToJsonSchema(implementedSchema)
    const validate = ajv.compile(jsonSchema)
    const invalid = validate({ ...manifest, extraField: "not allowed" })
    expect(invalid).toBe(false)
  })

  test("manifest with missing required field fails validation", () => {
    const jsonSchema = schemaToJsonSchema(implementedSchema)
    const validate = ajv.compile(jsonSchema)
    const { title, ...incomplete } = manifest
    const invalid = validate(incomplete)
    expect(invalid).toBe(false)
  })
})