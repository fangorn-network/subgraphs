# Fangorn Subgraphs
A collection of subgraphs that are used by Fangorn

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

Example query:

```
{
  fields (where: {name: "artist", value:"Theo Cappucino"}) {
    manifestState {
    owner,
    schema_name,
    metadata{
      entries{
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

The query above would be for a music based schema where someone is querying for the artist "Theo Cappucino". It will return every manifest that has Theo Cappucino as the artist. To guarantee the conformance of a schema, one can discriminate even further like this:

```
{
  fields (where: {manifestState_: {schema_name: "noagent-fangorn.test.music.v0"}, 
    name: "artist", 
    value:"Theo Cappucino"}) {
    manifestState {
    owner,
    schema_name,
    metadata{
      entries{
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

The data structure goes as follows:

`ManifestState -> FileMetadata -> [FileEntry -> [Field -> ManifestStateId]]`

Where the arrows represent pointers. It is read as one ManifestState references one FileMetadata. One FileMetadata references many FileEntries. Each FileEntry references many Fields. Each Field references the top level ManifestState.

This structure allows for schemas to be the source of truth for what fields are present, queryable, and persisted.