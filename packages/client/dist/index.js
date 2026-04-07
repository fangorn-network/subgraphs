import { GraphQLClient } from "graphql-request";
import { getSdk } from "./client.js";
export function getSubgraphClients(url) {
    const client = new GraphQLClient(url);
    const typedClient = getSdk(client);
    return { client, typedClient };
}
//# sourceMappingURL=index.js.map