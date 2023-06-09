import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-gas-reporter';
import { config } from 'dotenv';
config({ path: '../../.env' });

module.exports = {
  gasReporter: {
    currency: 'USD',
    token: 'ETH',
    gasPrice: 20,
    enabled: process.env.COINMARKETCAP_API_KEY ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: 'typechain-types',
    target: 'ethers-v5',
  },
};
