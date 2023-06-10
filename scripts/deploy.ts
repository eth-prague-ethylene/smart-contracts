//This script deploys the ERC20Votes contract to the Goerli testnet
import { ethers } from "hardhat";
import * as dotenv from "dotenv";


// to deploy use:
// npx hardhat run scripts/deploy.ts --network mantle
// npx hardhat verify --network scroll 0x04b3786899D4400bBEf2f000c07CBB916a9a8E24 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889 200 0xAfAE2dD69F115ec26DFbE2fa5a8642D94D7Cd37E
// npx hardhat verify --network optimisticEthereum 0x7364861986cbf3474acfbb7139695f9cb6ed1f1e 0x7F5c764cBc14f9669B88837ca1490cCa17c31607 172800 0x072819Bb43B50E7A251c64411e7aA362ce82803B
dotenv.config();

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const time = 200;

  const contract = await ethers.deployContract("Ethylene", ["0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", 200, "0xAfAE2dD69F115ec26DFbE2fa5a8642D94D7Cd37E"]);


  console.log("Contract address:", await contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });