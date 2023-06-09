//This script deploys the ERC20Votes contract to the Goerli testnet
import { ethers } from "hardhat";
import * as dotenv from "dotenv";


// to deploy use:
// npx hardhat run scripts/deploy.ts --network scroll
dotenv.config();

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const time = 200;

  const contract = await ethers.deployContract("Ethylene", ["0x7EeBF5cCe9911765C6a9478aB9251f92f30Ff4db", 200]);

  await contract.waitForDeployment();

  console.log("Coken address:", await contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });