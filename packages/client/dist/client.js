import gql from 'graphql-tag';
export const SchemaStateCoreFragmentDoc = gql `
    fragment SchemaStateCore on SchemaState {
  id
  schemaId
  owner
  name
}
    `;
export const SchemaCoreFragmentDoc = gql `
    fragment SchemaCore on Schema {
  id
  version
  agentId
}
    `;
export const SchemaFieldFragmentDoc = gql `
    fragment SchemaField on SchemaField {
  id
  name
  fieldType
}
    `;
export const SchemaWithFieldsFragmentDoc = gql `
    fragment SchemaWithFields on Schema {
  ...SchemaCore
  fields {
    ...SchemaField
  }
}
    `;
export const SchemaStateWithFieldsFragmentDoc = gql `
    fragment SchemaStateWithFields on SchemaState {
  ...SchemaStateCore
  versions {
    ...SchemaWithFields
  }
}
    `;
export const ManifestStateCoreFragmentDoc = gql `
    fragment ManifestStateCore on ManifestState {
  id
  owner
  schemaId
  schemaName
  manifestCid
  version
  lastUpdated
}
    `;
export const ManifestCoreFragmentDoc = gql `
    fragment ManifestCore on Manifest {
  id
  manifestVersion
  schemaId
}
    `;
export const FileCoreFragmentDoc = gql `
    fragment FileCore on File {
  id
  tag
}
    `;
export const FileFieldCoreFragmentDoc = gql `
    fragment FileFieldCore on FileField {
  id
  name
  value
  atType
  acc
}
    `;
export const PricingResourceFragmentDoc = gql `
    fragment PricingResource on PricingResource {
  id
  owner
  price
  currency
}
    `;
export const FileFieldFragmentDoc = gql `
    fragment FileField on FileField {
  ...FileFieldCore
  pricing {
    ...PricingResource
  }
}
    `;
export const FileFragmentDoc = gql `
    fragment File on File {
  ...FileCore
  fileFields {
    ...FileField
  }
}
    `;
export const ManifestFragmentDoc = gql `
    fragment Manifest on Manifest {
  ...ManifestCore
  files {
    ...File
  }
}
    `;
export const ManifestStateFragmentDoc = gql `
    fragment ManifestState on ManifestState {
  ...ManifestStateCore
  manifest {
    ...Manifest
  }
}
    `;
export const SchemaWithManifestsFragmentDoc = gql `
    fragment SchemaWithManifests on Schema {
  ...SchemaCore
  manifests {
    ...ManifestState
  }
}
    `;
export const SchemaStateWithManifestsFragmentDoc = gql `
    fragment SchemaStateWithManifests on SchemaState {
  ...SchemaStateCore
  versions {
    ...SchemaWithManifests
  }
}
    `;
export const SchemaFragmentDoc = gql `
    fragment Schema on Schema {
  ...SchemaCore
  manifests {
    ...ManifestState
  }
  fields {
    ...SchemaField
  }
}
    `;
export const SchemaStateFragmentDoc = gql `
    fragment SchemaState on SchemaState {
  ...SchemaStateCore
  versions {
    ...Schema
  }
}
    `;
export const ManifestByFileFieldFragmentDoc = gql `
    fragment ManifestByFileField on FileField {
  file {
    manifest {
      ...Manifest
    }
  }
}
    `;
export const ManifestByFileFragmentDoc = gql `
    fragment ManifestByFile on File {
  manifest {
    ...Manifest
  }
}
    `;
export const FileByFileFieldFragmentDoc = gql `
    fragment FileByFileField on FileField {
  file {
    fileFields {
      ...FileField
    }
  }
}
    `;
export const GetFileByFileFieldIdDocument = gql `
    query GetFileByFileFieldId($id: ID) {
  fileFields(where: {id: $id}) {
    ...FileByFileField
  }
}
    ${FileByFileFieldFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetFileByFileFieldNameValuePairDocument = gql `
    query GetFileByFileFieldNameValuePair($name: String, $value: String, $first: Int = 100, $skip: Int = 0) {
  fileFields(where: {name: $name, value: $value}, first: $first, skip: $skip) {
    ...FileByFileField
  }
}
    ${FileByFileFieldFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetFileEntriesByManifestIdDocument = gql `
    query GetFileEntriesByManifestId($manifestId: String, $first: Int = 100, $skip: Int = 0) {
  files(where: {manifest: $manifestId}, first: $first, skip: $skip) {
    ...File
  }
}
    ${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetPriceByFileFieldIdDocument = gql `
    query GetPriceByFileFieldId($id: ID) {
  fileFields(where: {id: $id}) {
    pricing {
      ...PricingResource
    }
  }
}
    ${PricingResourceFragmentDoc}`;
export const GetFileFieldsByFileIdDocument = gql `
    query GetFileFieldsByFileId($id: ID, $first: Int = 100, $skip: Int = 0) {
  files(where: {id: $id}, first: $first, skip: $skip) {
    fileFields {
      ...FileField
    }
  }
}
    ${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetManifestStatesBySchemaNameDocument = gql `
    query GetManifestStatesBySchemaName($name: String, $first: Int = 100, $skip: Int = 0) {
  manifestStates(where: {schemaName: $name}, first: $first, skip: $skip) {
    ...ManifestState
  }
}
    ${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetManifestStatesBySchemaNameAndOwnerDocument = gql `
    query GetManifestStatesBySchemaNameAndOwner($name: String, $owner: Bytes, $first: Int = 100, $skip: Int = 0) {
  manifestStates(
    where: {schemaName: $name, owner: $owner}
    first: $first
    skip: $skip
  ) {
    ...ManifestState
  }
}
    ${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetManifestStatesBySchemaIdDocument = gql `
    query GetManifestStatesBySchemaId($id: Bytes, $first: Int = 100, $skip: Int = 0) {
  manifestStates(where: {id: $id}, first: $first, skip: $skip) {
    ...ManifestState
  }
}
    ${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetManifestByIdDocument = gql `
    query GetManifestById($id: ID) {
  manifests(where: {id: $id}) {
    ...Manifest
  }
}
    ${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetManifestByFileFieldIdDocument = gql `
    query GetManifestByFileFieldId($id: ID) {
  fileFields(where: {id: $id}) {
    ...ManifestByFileField
  }
}
    ${ManifestByFileFieldFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetManifestByFileIdDocument = gql `
    query GetManifestByFileId($id: ID) {
  files(where: {id: $id}) {
    ...ManifestByFile
  }
}
    ${ManifestByFileFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetManifestByFileFieldNameValuePairDocument = gql `
    query GetManifestByFileFieldNameValuePair($name: String, $value: String, $first: Int = 100, $skip: Int = 0) {
  fileFields(where: {name: $name, value: $value}, first: $first, skip: $skip) {
    file {
      manifest {
        manifestState {
          ...ManifestState
        }
      }
    }
  }
}
    ${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetAllSchemaStatesDocument = gql `
    query GetAllSchemaStates($first: Int = 100, $skip: Int = 0) {
  schemaStates(first: $first, skip: $skip) {
    ...SchemaState
  }
}
    ${SchemaStateFragmentDoc}
${SchemaStateCoreFragmentDoc}
${SchemaFragmentDoc}
${SchemaCoreFragmentDoc}
${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}
${SchemaFieldFragmentDoc}`;
export const GetAllSchemaStatesByOwnerDocument = gql `
    query GetAllSchemaStatesByOwner($owner: Bytes, $first: Int = 100, $skip: Int = 0) {
  schemaStates(where: {owner: $owner}, first: $first, skip: $skip) {
    ...SchemaState
  }
}
    ${SchemaStateFragmentDoc}
${SchemaStateCoreFragmentDoc}
${SchemaFragmentDoc}
${SchemaCoreFragmentDoc}
${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}
${SchemaFieldFragmentDoc}`;
export const GetSchemaStateByNameDocument = gql `
    query GetSchemaStateByName($name: String) {
  schemaStates(where: {name: $name}) {
    ...SchemaState
  }
}
    ${SchemaStateFragmentDoc}
${SchemaStateCoreFragmentDoc}
${SchemaFragmentDoc}
${SchemaCoreFragmentDoc}
${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}
${SchemaFieldFragmentDoc}`;
export const GetSchemasBySchemaIdDocument = gql `
    query GetSchemasBySchemaId($id: Bytes, $first: Int = 100, $skip: Int = 0) {
  schemaStates(where: {id: $id}, first: $first, skip: $skip) {
    ...SchemaState
  }
}
    ${SchemaStateFragmentDoc}
${SchemaStateCoreFragmentDoc}
${SchemaFragmentDoc}
${SchemaCoreFragmentDoc}
${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}
${SchemaFieldFragmentDoc}`;
const defaultWrapper = (action, _operationName, _operationType, _variables) => action();
export function getSdk(client, withWrapper = defaultWrapper) {
    return {
        GetFileByFileFieldId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetFileByFileFieldIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFileByFileFieldId', 'query', variables);
        },
        GetFileByFileFieldNameValuePair(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetFileByFileFieldNameValuePairDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFileByFileFieldNameValuePair', 'query', variables);
        },
        GetFileEntriesByManifestId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetFileEntriesByManifestIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFileEntriesByManifestId', 'query', variables);
        },
        GetPriceByFileFieldId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetPriceByFileFieldIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetPriceByFileFieldId', 'query', variables);
        },
        GetFileFieldsByFileId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetFileFieldsByFileIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFileFieldsByFileId', 'query', variables);
        },
        GetManifestStatesBySchemaName(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestStatesBySchemaNameDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestStatesBySchemaName', 'query', variables);
        },
        GetManifestStatesBySchemaNameAndOwner(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestStatesBySchemaNameAndOwnerDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestStatesBySchemaNameAndOwner', 'query', variables);
        },
        GetManifestStatesBySchemaId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestStatesBySchemaIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestStatesBySchemaId', 'query', variables);
        },
        GetManifestById(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestByIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestById', 'query', variables);
        },
        GetManifestByFileFieldId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestByFileFieldIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestByFileFieldId', 'query', variables);
        },
        GetManifestByFileId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestByFileIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestByFileId', 'query', variables);
        },
        GetManifestByFileFieldNameValuePair(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestByFileFieldNameValuePairDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestByFileFieldNameValuePair', 'query', variables);
        },
        GetAllSchemaStates(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetAllSchemaStatesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAllSchemaStates', 'query', variables);
        },
        GetAllSchemaStatesByOwner(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetAllSchemaStatesByOwnerDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetAllSchemaStatesByOwner', 'query', variables);
        },
        GetSchemaStateByName(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetSchemaStateByNameDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetSchemaStateByName', 'query', variables);
        },
        GetSchemasBySchemaId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetSchemasBySchemaIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetSchemasBySchemaId', 'query', variables);
        }
    };
}
//# sourceMappingURL=client.js.map