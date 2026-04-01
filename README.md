# Fangorn Subgraphs
A collection of subgraphs that are used by Fangorn

## Motivation
Currently, obtaining rich data in the web3 ecosystem is a painful process. At a minimum, you must read from the on chain state for IPFS references and then query for them which leads to a poor user experience.
However, The Graph has created Subgraphs which listen to on-chain events and allow for storage of on-chain data. Not only that, but they also allow for fetching data from IPFS which greatly enhances the developer experience. This means that developers who might be new to the decentralized web/web3 space can query for data in a familiar manner with GraphQL. Subgraphs not only serve as a perfect decentralized backend for traditional web applications,
but they also enable much more responsive and enriched agentic experiences. To experience this, check out the fangorn-agent repo on github. 

## Pre-reqs
Please ensure you have:

0. npm and cargo installed
1. graph-cli installed `npm install -g @graphprotocol/graph-cli@latest`
2. solidity compiler, `solc`, installed
3. cargo stylus installed, `cargo install --force cargo-stylus`

#### Important Files

1. **subgraph.yaml**
This file contains datasources and templates. 
    - **dataSources:** A datasource for us is any contract whose events we will be listening for. It describes what entities will be used, where the abis are located, and what functions will be used for which events.
    - **templates:** A template is used to represent file data that is stored in IPFS. The fields are nearly identical to what is used in the datsources
        >Note that the abis field **is not** actually used but is still required for templates. The file path must be valid and the file must contain a valid ABI, but it can be *any* valid ABI.

2. **schema.graphql:**
This file contains the entities that will be stored for a subgraph. These types will be generated when you run `graph codegen` and stored in the `generated` directory.

#### Updating subgraphs when a contract is updated and deployed
0. From the contracts project, generate the ABI that you need and copy it into the abis directory of the corresponding subgraph project.
    - For stylus, generate the solidity interface `cargo stylus export-abi > abi.sol` and manually add your events to it (literally a copy + paste of the event definitions in the stylus! macro). You can then use this interface to generate `solc --abi abi.sol -o ./abi.json` the proper ABI json. For some reason, generating the the ABI json directly from the stylus contract does not include events.
1. **schema.graphql:**
You will need to define any new types that have been added to the contract. Typically, this will only need to be updated if you have created a new event that you wish for the subgraph to track. Once a new type has been added, you need to run `graph codegen` in order to properly reference these types in your code.
2. **subgraph.yaml:**
You will need to update the corresponding datasource entry with the new address of the contract, the new starting block(Important! If the block is very far in the past it will take the subgraph a long time to update!), the new event (in the entities field), the new abi you have generated, and the new event handler asssociated with the event.
3. **src/your_typescript_file.ts**
Implement any new logic that will be needed to handle any new events or types that you have added.

4. **networks.json:**
Update this file with the new starting block and the new address for the contract.

After you have ensured that your changes are correct and working, navigate to the subgraph studio dashboard, go to the subgraph's dashboard you wish to update, copy the auth command and run it `graph auth whateverSecretItGivesYou`. You can then run `graph build` and `graph deploy your-subgraph-slug`. Make sure you update the version number appropriately when prompted. You can then navigate back to the subgraph's dashboard and use the playground to confirm that everything works as expected.

### Querying the Subgraph

#### Querying for a manifest
> Note: Queries are **schema specific**. In order to properly form a query, you must know what schema your data conforms to. For example, if a schema is related to CSV data, it is unlikely to contain an "artist" field. All examples below use a music related schema


```
{
  fields (where: {name: "artist", value:"Theo Cappucino"}) {
    manifestState {
    owner,
    schema_name,
    manifest{
      files{
        fields {
          name
          value
          atType
          acc
          price {
            price
            currency
          }
        }
      }
    }
  }
}
}
```

Above, someone wishes to return an entire manifest (all files that are a part of the same document) where one file is related to the artist "Theo Cappucino". It will return every manifest that has Theo Cappucino as the artist. To guarantee the conformance of a schema, one can discriminate even further like this:

```
{
  fields (where: {manifestState_: {schema_name: "noagent-fangorn.test.music.v0"}, name: "artist", value:"Theo Cappucino"}) {
    manifestState {
    owner,
    schema_name,
    manifest{
      files{
        fields {
          name
          value
          atType
          acc
          price {
            price
            currency
          }
        }
      }
    }
  }
}
}
```

The data output of the above query looks like:

```
{
  "data": {
    "fields": [
      {
        "manifestState": {
          "owner": "0x147c24c5ea2f1ee1ac42ad16820de23bbba45ef6",
          "schema_name": "noagent-fangorn.test.music.v0",
          "manifest": {
            "files": [
              {
                "fields": [
                  {
                    "name": "artist",
                    "value": "Ovid the Terrible",
                    "atType": "string",
                    "acc": "plain",
                    "price": null
                  },
                  {
                    "name": "audio",
                    "value": "enc",
                    "atType": "encrypted",
                    "acc": "settled",
                    "price": {
                      "price": "1",
                      "currency": "USDC"
                    }
                  },
                  {
                    "name": "title",
                    "value": "Hostile Corporate Takeover by Viking Businessmen",
                    "atType": "string",
                    "acc": "plain",
                    "price": null
                  }
                ]
              },
              {
                "fields": [
                  {
                    "name": "artist",
                    "value": "Theo Cappucino",
                    "atType": "string",
                    "acc": "plain",
                    "price": null
                  },
                  {
                    "name": "audio",
                    "value": "enc",
                    "atType": "encrypted",
                    "acc": "settled",
                    "price": {
                      "price": "1",
                      "currency": "USDC"
                    }
                  },
                  {
                    "name": "title",
                    "value": "That Boy Ain't Right",
                    "atType": "string",
                    "acc": "plain",
                    "price": null
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  }
}
```

### Querying for a file

If you only wish to retrieve the files that are associated with the matching field, this can be done like

```
{
  fields (first: 1, where: {manifestState_: {schema_name: "noagent-fangorn.test.music.v0"}, name: "artist", value:"Theo Cappucino"}) {
    fileEntry {
        fields {
          name
          value
          atType
          acc
          price {
            id
            price
            currency
          }
        }
      }
    }
  }
```

This returns:

```
{
  "data": {
    "fields": [
      {
        "fileEntry": {
          "fields": [
            {
              "name": "artist",
              "value": "Theo Cappucino",
              "atType": "string",
              "acc": "plain",
              "price": null
            },
            {
              "name": "audio",
              "value": "enc",
              "atType": "encrypted",
              "acc": "settled",
              "price": {
                "id": "0x53fe1f08e8cf5bf6b6e9afa38ab251cdf5f5673494ff965ffbe3528acaf2a68e",
                "price": "1",
                "currency": "USDC"
              }
            },
            {
              "name": "title",
              "value": "That Boy Ain't Right",
              "atType": "string",
              "acc": "plain",
              "price": null
            }
          ]
        }
      }
    ]
  }
}
```

### Querying for a schema

The schema, which is stored on IPFS, that created the data described in the "Querying for a File section" is:

```
{
  "version": 1,
  "name": "noagent-fangorn.test.music.v0",
  "owner": "0x147c24c5ea2f1ee1ac42ad16820de23bbba45ef6",
  "agentId": "",
  "definition": {
    "title": {
      "@type": "string"
    },
    "artist": {
      "@type": "string"
    },
    "audio": {
      "@type": "encrypted",
      "gadget": "settled"
    }
  },
  "createdAt": "2026-03-26T15:01:14.041Z"
}
```

We can query for the Subgraph entry related to this schema with this query:

```
{
  schemas (where: {name: "noagent-fangorn.test.music.v0"}) {
    name
    schemaId
    owner
    name
    versions {
      version
      spec_cid
      agent_id
      fields {
        name
        fieldType
      }
    }
    
  }
}
```

This returns

```
{
  "data": {
    "schemas": [
      {
        "name": "noagent-fangorn.test.music.v0",
        "schemaId": "0xdd2d15d54e402ac7383280029bd15eb039fba2b3ee0025ea846c67b55155bc9c",
        "owner": "0x147c24c5ea2f1ee1ac42ad16820de23bbba45ef6",
        "versions": [
          {
            "version": "1",
            "spec_cid": "bafkreic3t42shcrmdoxrlv3sci3yews7xdbaxslt45wus35ion5c3eznly",
            "agent_id": null,
            "fields": [
              {
                "name": "artist",
                "fieldType": "string"
              },
              {
                "name": "audio",
                "fieldType": "encrypted"
              },
              {
                "name": "title",
                "fieldType": "string"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

#### Querying for Pricing information

```
{
  pricingResources (first: 1) {
    price
    currency
    owner
    id
  }
}
```
This query returns

```
{
  "data": {
    "pricingResources": [
      {
        "price": "1",
        "currency": "USDC",
        "owner": "0x147c24c5ea2f1ee1ac42ad16820de23bbba45ef6",
        "id": "0x173af741673d83b42315b180d616998a356f661401ecb0c5b9436b43088dc782"
      }
    ]
  }
}
```
Where the ID is the resource ID associated with a specific file.

### File data structure
The data structure goes as follows:

`ManifestState -> Manifest -> [FileEntry -> [Field -> ManifestState]]`

Where the arrows represent pointers (the id) of related data. It is read as one `ManifestState` references one `Manifest`. One `Manifest` references many `FileEntries`. Each `FileEntry` references many `Fields`. Each `Field` references the top level `ManifestState`.

This structure allows for schemas to be the source of truth for what fields are present, queryable, and persisted.

Note the difference between `ManifestState` and `Manifest` entities is that the `ManifestState` is the (most recently received) manifest information that lives on-chain. The `Manifest` entity is what is stored on IPFS.

We also store the entire history of interactions of Manifests, Pricing information, and Schema information. These are all immutable and allow for a history to be maintained by the Subgraph.