# Subgraph Client


## Setup
### Pre-reqs
1. Ensure `pnpm` is installed and run `pnpm i`
2. Run `cp env.example .env` and include the subgraph URL that you wish to generate types from

### Generate
On first install or subsequent changes to queries/fragments you need to generate files using `pnpm codegen`

### Files of interest:

#### codgen.ts
This file defines what is generated and where it is stored.

#### src/graphql/*
This folder contains all queries and fragments that are used to generate the files that are in the `src/generated` folder

#### src/client.ts
The wrapper around the generated graphql client. It ensures that query results are appropriately mapped to their vanilla typescript types.

#### src/typeMappings.ts
This file contains how query results are mapped to the vanilla typescript types.