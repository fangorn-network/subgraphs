import { GraphQLClient } from "graphql-request";
import { getSdk, Sdk } from "./client.js";

export type * from './client.js'

export type {Sdk}

export type { SchemaStateFragment as SchemaState } from './client.js';
export type { SchemaFragment as Schema } from './client.js';
export type { SchemaFieldFragment as SchemaField } from './client.js';
export type { ManifestStateFragment as ManifestState } from './client.js';
export type { ManifestFragment as Manifest } from './client.js';
export type { FileFragment as FileEntry } from './client.js';
export type { FileFieldFragment as FileField } from './client.js';
export type { PricingResourceFragment as PricingResource } from './client.js';


export function getSubgraphClients(url: string): {client: GraphQLClient, typedClient: Sdk} {

	const client = new GraphQLClient(url);
	const typedClient = getSdk(client);

	return {client, typedClient};

}