import { GraphQLClient } from "graphql-request";
import { getSdk, Sdk } from "./generated/graphql-req.js";
import { FileEntry, SchemaState, ManifestState } from "@fangorn-network/client-types";
import {
	FileByFileFieldFragment, FileFieldValueFragment, GetAllSchemaStatesByOwnerQueryVariables,
	GetAllSchemaStatesQueryVariables,
	GetFileByFileIdQueryVariables,
	GetFileEntriesByManifestStatetIdQueryVariables,
	GetFileFieldValuesByFileFieldNameQueryVariables,
	GetFilesByFileFieldNameQueryVariables,
	GetFilesByFileFieldNameValuePairQueryVariables,
	GetFilesByFileFieldValueQueryVariables,
	GetManifestStateByIdQueryVariables,
	GetManifestStatesByFileFieldNameQueryVariables,
	GetManifestStatesByFileFieldNameValuePairQueryVariables,
	GetManifestStatesByFileFieldValueQueryVariables,
	GetManifestStatesBySchemaNameAndOwnerQueryVariables,
	GetManifestStatesBySchemaNameQueryVariables,
	GetSchemaStateByIdQueryVariables,
	GetSchemaStateByNameQueryVariables,
	ManifestStateByFileFieldFragment
} from "./generated/operations";
import { toFiles, toManifestStates, toSchemaStates, toManifestState, toFile } from "./typeMappings.js";


export class FangornGraphClient {

	private rawClient: GraphQLClient
	private typedClient: Sdk

	constructor(url: string, apiKey?: string) {
    const client = new GraphQLClient(url, {
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {},
    });
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
		caseSensitive: boolean,
		args: GetManifestStatesByFileFieldNameValuePairQueryVariables,
		owner?: string
	): Promise<ManifestState[]> {

		let result;
		if (!args.value) {
			const newArgs: GetManifestStatesByFileFieldNameQueryVariables = {name: args.name, first: args.first, skip: args.skip}
			result = await this.typedClient.GetManifestStatesByFileFieldName(newArgs);
		} else {
			if (caseSensitive) {
				result = await this.typedClient.GetManifestStatesByFileFieldNameValuePair(args);
			} else {
				result = await this.typedClient.GetManifestStatesByFileFieldNameValuePairNoCase(args);
			}
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

		let result;
		if (!args.value) {
			const newArgs: GetManifestStatesByFileFieldNameQueryVariables = {name: args.name, first: args.first, skip: args.skip}
			result = await this.typedClient.GetManifestStatesByFileFieldName(newArgs);
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

	async getManifestStatesByFileFieldValue(caseSensitive: boolean, args: GetManifestStatesByFileFieldValueQueryVariables) {

		let result;
		if (caseSensitive) {
			result = await this.typedClient.GetManifestStatesByFileFieldValue(args)
		} else {
			result = await this.typedClient.GetManifestStatesByFileFieldValueNoCase(args)
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
		const result = await this.typedClient.GetFilesByFileFieldName(args);
		const files = result.fileFields.map((ff: FileByFileFieldFragment) => toFile(ff.file))
		const uniqueFiles = files.filter((f: FileEntry, index: number, self: FileEntry[]) => 
			self.findIndex((other) => other.id === f.id) === index)
		return uniqueFiles
	}

	async GetFilesByFileFieldNameValuePair(caseSensitive: boolean, args: GetFilesByFileFieldNameValuePairQueryVariables): Promise<FileEntry[]> {
		let result
		if (!args.value) {
			const newArgs: GetFilesByFileFieldNameQueryVariables = {name: args.name, first: args.first, skip: args.skip}
			result = await this.typedClient.GetFilesByFileFieldName(newArgs)
		} else {
			if(caseSensitive) {
				result = await this.typedClient.GetFilesByFileFieldNameValuePair(args);
			} else {
				result = await this.typedClient.GetFilesByFileFieldNameValuePairNoCase(args);
			}
		}
		const files = result.fileFields.map((ff: FileByFileFieldFragment) => toFile(ff.file))
		const uniqueFiles = files.filter((f: FileEntry, index: number, self: FileEntry[]) => 
			self.findIndex((other) => other.id === f.id) === index)
		return uniqueFiles
	}

	async getFilesByFileFieldValue(caseSensitive: boolean, args: GetFilesByFileFieldValueQueryVariables): Promise<FileEntry[]> {
		let result;
		if (caseSensitive) {
			result = await this.typedClient.GetFilesByFileFieldValue(args);
		} else {
			result = await this.typedClient.GetFilesByFileFieldValueNoCase(args);
		}
		const files = result.fileFields.map((ff: FileByFileFieldFragment) => toFile(ff.file))
		const uniqueFiles = files.filter((f: FileEntry, index: number, self: FileEntry[]) => 
			self.findIndex((other) => other.id === f.id) === index)
		return uniqueFiles
	}

	async getFileFieldValuesByFileFieldName(args: GetFileFieldValuesByFileFieldNameQueryVariables): Promise<string[]> {

		const result = await this.typedClient.GetFileFieldValuesByFileFieldName(args);

		const fieldValues = result.fileFields.map((ffv: FileFieldValueFragment) => ffv.value ?? "")
		const uniqueFields = fieldValues.filter((value: string, index: number, self: string[]) => 
			self.findIndex((other) => other === value) === index)

		return uniqueFields

	}


	// ── Raw ─────────────────────────────────────────────────────────────────

	/** Execute a raw GraphQL query. */
	async rawQuery(gql: string): Promise<unknown> {
		return this.rawClient.rawRequest(gql)
	}
}