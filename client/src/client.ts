import { GraphQLClient } from "graphql-request";
import { getSdk, Sdk } from "./generated/graphql-req";
import { FileEntry, SchemaState, ManifestState } from "@fangorn-network/client-types";
import {
	FileByFileFieldFragment, GetAllSchemaStatesByOwnerQueryVariables,
	GetAllSchemaStatesQueryVariables,
	GetFileByFileIdQueryVariables,
	GetFileEntriesByManifestStatetIdQueryVariables,
	GetFilesByFileFieldNameQueryVariables,
	GetManifestStateByIdQueryVariables,
	GetManifestStatesByFileFieldNameValuePairQueryVariables,
	GetManifestStatesBySchemaNameAndOwnerQueryVariables,
	GetManifestStatesBySchemaNameQueryVariables,
	GetSchemaStateByIdQueryVariables,
	GetSchemaStateByNameQueryVariables,
	ManifestStateByFileFieldFragment
} from "./generated/operations";
import { toFiles, toManifestStates, toSchemaStates, toManifestState, toFile } from "./typeMappings";


export class FangornGraphClient {

	private rawClient: GraphQLClient
	private typedClient: Sdk

	constructor(url: string) {
		const client = new GraphQLClient(url);
		const typedClient = getSdk(client);
		this.rawClient = client;
		this.typedClient = typedClient
	}

	public getTypedClient(): Sdk {
		return this.typedClient
	}

	public getRawClient(): GraphQLClient {
		return this.rawClient
	}

	/** Get a single manifest by its ID. */
	async getManifestStateById(args: GetManifestStateByIdQueryVariables): Promise<ManifestState | null> {

		const result = await this.typedClient.GetManifestStateById(args)

		const manifests: ManifestState[] = toManifestStates(result.manifestStates)

		return manifests[0]
	}

	async getFileById(args: GetFileByFileIdQueryVariables) {

		const result = await this.typedClient.GetFileByFileId(args);

		const files: FileEntry[] = toFiles(result.files)

		return files[0]
	}

	async getSchemaStateById(args: GetSchemaStateByIdQueryVariables) {

		const result = await this.typedClient.GetSchemaStateById(args)

		const schemaStates: SchemaState[] = toSchemaStates(result.schemaStates)

		return schemaStates[0]
	}

	async getAllSchemaStates(args: GetAllSchemaStatesByOwnerQueryVariables): Promise<SchemaState[]> {
		let result;
		if (args.owner) {
			result = await this.typedClient.GetAllSchemaStatesByOwner(args)
		} else {
			const variables: GetAllSchemaStatesQueryVariables = { first: args.first, skip: args.skip }
			result = await this.typedClient.GetAllSchemaStates(variables)
		}
		const schemaStates: SchemaState[] = toSchemaStates(result.schemaStates)
		return schemaStates;
	}

	/** Get a single schema by name. */
	async getSchemaStateByName(args: GetSchemaStateByNameQueryVariables): Promise<SchemaState | null> {

		const result = await this.typedClient.GetSchemaStateByName(args)
		const schemaStates: SchemaState[] = result.schemaStates as SchemaState[]

		if (schemaStates.length === 0) {
			return null
		}

		return schemaStates[0]
	}

	// ── Data Queries ────────────────────────────────────────────────────────

	/** List manifest states, filtered by schema_name and optionally owner. */
	async getManifestStatesBySchemaNameAndOwner(args: GetManifestStatesBySchemaNameAndOwnerQueryVariables): Promise<ManifestState[]> {

		let result;
		if (args.owner) {
			result = await this.typedClient.GetManifestStatesBySchemaNameAndOwner(args)
		} else {
			const vars: GetManifestStatesBySchemaNameQueryVariables = { name: args.name, first: args.first, skip: args.skip }
			result = await this.typedClient.GetManifestStatesBySchemaName(vars)
		}
		const manifestStates: ManifestState[] = toManifestStates(result.manifestStates)

		return manifestStates
	}

	/** Get file entries for a given manifest ID. */
	async getFilesByManifestStateId(args: GetFileEntriesByManifestStatetIdQueryVariables): Promise<FileEntry[]> {
		const result = await this.typedClient.GetFileEntriesByManifestStatetId(args)
		return toFiles(result.files)
	}

	// ── Search Queries ──────────────────────────────────────────────────────

	/**
	 * Search fields within a specific schema.
	 * Returns Field[] — use manifestState.id and fileEntry.id to navigate.
	 */
	async getManifestStatesByFieldsAndSchemaName(
		schemaName: string,
		args: GetManifestStatesByFileFieldNameValuePairQueryVariables,
		owner?: string
	): Promise<ManifestState[]> {

		let result;
		if (!args.value) {
			result = await this.typedClient.GetManifestStatesByFileFieldName(args);
		} else {
			result = await this.typedClient.GetManifestStatesByFileFieldNameValuePair(args);
		}

		console.log("Searching Manifests by fields and schema name")

		const manifestStates = result.fileFields
			.filter((ff: ManifestStateByFileFieldFragment) => {
				const manifestState = ff.file.manifest.manifestState;
				if (manifestState.schemaName !== schemaName) return false;
				if (owner && manifestState.owner !== owner) return false;
				return true;
			})
			.map((ff: ManifestStateByFileFieldFragment) => { return toManifestState(ff.file.manifest.manifestState) })
			.filter(
				(m: ManifestState, index: number, self: ManifestState[]) =>
					self.findIndex((other) => other.id === m.id) === index
			);

		return manifestStates;
	}

	/**
	 * Search fields across all schemas.
	 * Returns Manifest[] — use manifestState.id and fileEntry.id to navigate.
	 */
	async getManifestsByFields(args: GetManifestStatesByFileFieldNameValuePairQueryVariables): Promise<ManifestState[]> {

		console.log("Searching Globally")

		console.log(`variables: ${JSON.stringify(args, null, 2)}`)

		let result;
		if (!args.value) {
			result = await this.typedClient.GetManifestStatesByFileFieldName(args);
		} else {
			result = await this.typedClient.GetManifestStatesByFileFieldNameValuePair(args);
		}

		const manifestStates = result.fileFields
			.filter((ff: ManifestStateByFileFieldFragment) => {
				const manifestState = ff.file.manifest.manifestState;
				if (!manifestState) return false;
				return true;
			})
			.map((ff: ManifestStateByFileFieldFragment) => toManifestState(ff.file.manifest.manifestState))
			.filter(
				(m: ManifestState, index: number, self: ManifestState[]) =>
					self.findIndex((other) => other.id === m.id) === index
			);
		return manifestStates;
	}

	async getFilesByFileFieldName(args: GetFilesByFileFieldNameQueryVariables): Promise<FileEntry[]> {
		console.log("Searching Globally for FileFields")
		const result = await this.typedClient.GetFilesByFileFieldName(args);
		const files = result.fileFields.map((ff: FileByFileFieldFragment) => toFile(ff.file))
		return files
	}

	// ── Raw ─────────────────────────────────────────────────────────────────

	/** Execute a raw GraphQL query. */
	async rawQuery(gql: string): Promise<unknown> {
		return this.rawClient.rawRequest(gql)
	}
}