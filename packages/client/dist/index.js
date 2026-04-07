import { GraphQLClient } from "graphql-request";
import { getSdk } from "./client.js";
import { configDotenv } from "dotenv";
export { getSdk };
configDotenv();
const subgraphUrl = process.env.SUBGRAPH_URL;
if (!subgraphUrl)
    throw new Error("No subgraph URL provided");
const client = new GraphQLClient(subgraphUrl);
const typedClient = getSdk(client);
const result = await typedClient.GetManifestsBySchemaId({ id: "0x1823e9fabeb770332c7140bde6e497699f50fe9681c0b8270733a913d0bd4ac1" });
console.log(result);
console.log(result.schemaStates[0].versions[0]);
//# sourceMappingURL=index.js.map