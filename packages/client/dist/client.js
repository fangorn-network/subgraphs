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
export const GetManifestsBySchemaNameDocument = gql `
    query GetManifestsBySchemaName($name: String, $first: Int = 100, $skip: Int = 0) {
  schemaStates(where: {name: $name}, first: $first, skip: $skip) {
    ...SchemaStateWithManifests
  }
}
    ${SchemaStateWithManifestsFragmentDoc}
${SchemaStateCoreFragmentDoc}
${SchemaWithManifestsFragmentDoc}
${SchemaCoreFragmentDoc}
${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
${ManifestFragmentDoc}
${ManifestCoreFragmentDoc}
${FileFragmentDoc}
${FileCoreFragmentDoc}
${FileFieldFragmentDoc}
${FileFieldCoreFragmentDoc}
${PricingResourceFragmentDoc}`;
export const GetManifestsBySchemaIdDocument = gql `
    query GetManifestsBySchemaId($id: Bytes, $first: Int = 100, $skip: Int = 0) {
  schemaStates(where: {id: $id}, first: $first, skip: $skip) {
    ...SchemaStateWithManifests
  }
}
    ${SchemaStateWithManifestsFragmentDoc}
${SchemaStateCoreFragmentDoc}
${SchemaWithManifestsFragmentDoc}
${SchemaCoreFragmentDoc}
${ManifestStateFragmentDoc}
${ManifestStateCoreFragmentDoc}
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
export const GetManifestByFileFieldNameValuePairDocument = gql `
    query GetManifestByFileFieldNameValuePair($name: String, $value: String, $first: Int = 100, $skip: Int = 0) {
  fileFields(where: {name: $name, value: $value}, first: $first, skip: $skip) {
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
export const GetPriceByFileFieldIdDocument = gql `
    query GetPriceByFileFieldId($id: ID) {
  fileFields(where: {id: $id}) {
    pricing {
      ...PricingResource
    }
  }
}
    ${PricingResourceFragmentDoc}`;
const defaultWrapper = (action, _operationName, _operationType, _variables) => action();
export function getSdk(client, withWrapper = defaultWrapper) {
    return {
        GetManifestsBySchemaName(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestsBySchemaNameDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestsBySchemaName', 'query', variables);
        },
        GetManifestsBySchemaId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestsBySchemaIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestsBySchemaId', 'query', variables);
        },
        GetManifestByFileFieldId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestByFileFieldIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestByFileFieldId', 'query', variables);
        },
        GetManifestByFileId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestByFileIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestByFileId', 'query', variables);
        },
        GetFileByFileFieldId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetFileByFileFieldIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFileByFileFieldId', 'query', variables);
        },
        GetManifestByFileFieldNameValuePair(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetManifestByFileFieldNameValuePairDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetManifestByFileFieldNameValuePair', 'query', variables);
        },
        GetFileByFileFieldNameValuePair(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetFileByFileFieldNameValuePairDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetFileByFileFieldNameValuePair', 'query', variables);
        },
        GetPriceByFileFieldId(variables, requestHeaders, signal) {
            return withWrapper((wrappedRequestHeaders) => client.request({ document: GetPriceByFileFieldIdDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GetPriceByFileFieldId', 'query', variables);
        }
    };
}
//# sourceMappingURL=client.js.map