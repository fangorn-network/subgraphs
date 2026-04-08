import type { CodegenConfig } from "@graphql-codegen/cli";
import { configDotenv } from "dotenv";

configDotenv()

const SUBGRAPH_URL = process.env.SUBGRAPH_URL;

if (!SUBGRAPH_URL) throw new Error("No Subgraph URL provided for codegen")

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
        // The Graph uses custom scalars so we map them to TS types
        scalars: {
          BigInt: "string",
          BigDecimal: "string",
          Bytes: "string",
          Int8: "number",
        },
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
      },
    },
  },
};

export default config;