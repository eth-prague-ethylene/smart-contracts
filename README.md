# Ethylene smart contracts

This project allows our frontend dapp to connect with UMA protocol. It comes with a contract, a test for that contract, and a script that deploys that contract. Next to that there is a second contract which extends the OptimisticOracleV3Interface from UMA.



Try running some of the following tasks to compile, test and deploy the contracts:

```shell
npx hardhat compile
pnx hardhat test
npx hardhat run scripts/deploy.ts --network polygonMumbai
```



# Deployment contracts
Polygon Mumbai testnet: https://mumbai.polygonscan.com/address/0x7807A8d0fD161b0AB28a29b7A0Ca7d8059A1F95B#code
> Polygon Mumbai contract is deployed with the gateway RPC

Optimism mainnet: https://optimistic.etherscan.io/address/0x7364861986cbf3474acfbb7139695f9cb6ed1f1e

Scroll Alpha testnet: https://blockscout.scroll.io/address/0x04b3786899D4400bBEf2f000c07CBB916a9a8E24#code

Taiko testnet: https://explorer.test.taiko.xyz/address/0x8FDDf2Fe177d16C2783b1F52dc71ABbc4366977B

Mantle testnet: https://explorer.testnet.mantle.xyz/address/0xE57bae05b7568E1b2b03104bD171ab94F54BcbFE#code

> [Our tweet about Mantle deployment](https://twitter.com/arjanjohan/status/1667578964632584196).

# Sandboxed UMA V3 oracle:

The V3 Oracle by UMA was not available on Polygon Mumbai testnet. By using [this guide](https://docs.uma.xyz/developers/optimistic-oracle-v3/sandboxed-oracle-environment) we deployed a sandboxed V3 Oracle on Mumbai to testing.

  Deployed Finder at 0xa7568E44Ae1f4B44279eaaC20c8F1f82b039711E

  Deployed Store at 0x300F22fc5659190Cd6dE4FfFe4C84f3F52C188CB

  Deployed AddressWhitelist at 0x902b9a1c61386522d487bbf7cEE61bDB96032113

  Deployed IdentifierWhitelist at 0x5a8e9B93F3d8c1E5678B1EA98bE0339c48B6f045

  Deployed MockOracleAncillary at 0xFA9861b79F7f23dD6d4f35379B3049dFf82Da657

  Deployed Optimistic Oracle V3 at 0xAfAE2dD69F115ec26DFbE2fa5a8642D94D7Cd37E
