import type { CodegenConfig } from "@graphql-codegen/cli";
import { configDotenv } from "dotenv";

configDotenv()

const SUBGRAPH_URL = process.env.SUBGRAPH_URL;

if (!SUBGRAPH_URL) throw new Error("No Subgraph URL provided for codegen")
	
// The Graph uses custom scalars so we map them to TS types
const sharedScalars = {
  BigInt: "string",
  BigDecimal: "string",
  Bytes: "string",
  Int8: "number",
};

const config: CodegenConfig = {
  overwrite: true,
  schema: SUBGRAPH_URL,
  // All .graphql files (fragments + queries)
  documents: "src/graphql/*.graphql",
  generates: {
	"./src/generated/types.ts": {
    plugins: ["typescript"],
    config: { scalars: sharedScalars, enumsAsTypes: true },
  },
		"./src/generated/operations.ts": {
    plugins: ["typescript-operations"],
		preset: "import-types-preset",
		presetConfig: {
        typesPath: "./types.js",
    },
    config: { scalars: sharedScalars, enumsAsTypes: true },
  },
    "./src/generated/graphql-req.ts": {
			plugins: [
        "typescript-graphql-request",
      ],		
			preset: "import-types-preset",
		presetConfig: {
        typesPath: "./operations.js",
    },
      config: {
        scalars: sharedScalars,
        // Use 'import type' for type-only imports
        useTypeImports: true,
        // Deduplicate fragment types
        dedupeFragments: true,
        // Makes enums as string unions instead of TS enums
        enumsAsTypes: true,
      },
    },
    "./src/generated/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeIntrospectionTypes: false,
				includeDirectives: true,
      }
    }
  },
};

export default config;