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
    "./src/client.ts": {
			plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
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
    "./src/schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeIntrospectionTypes: false,
				includeDirectives: true,
      }
    }, // Types-only output for the shared package
    "../client-types/src/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
      ],
      config: {
        scalars: sharedScalars,
        useTypeImports: true,
        dedupeFragments: true,
        enumsAsTypes: true,
        // Only export types, no runtime code
        onlyOperationTypes: true,
      },
    },
  },
};

export default config;