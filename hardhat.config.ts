import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-gas-reporter';
import { config } from 'dotenv';
config({ path: '.env' });

module.exports = {
  gasReporter: {
    currency: 'USD',
    token: 'ETH',
    gasPrice: 20,
    enabled: process.env.COINMARKETCAP_API_KEY ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  solidity: {
    version: '0.8.16',
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
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      },
    },
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   // accounts: [process.env.PRIVATE_KEY]
    // },
    scroll: {
      url: 'https://alpha-rpc.scroll.io/l2' || '',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      scrollAlpha: 'abc',
    },
    customChains: [
      {
        network: 'scroll',
        chainId: 534353,
        urls: {
          apiURL: 'https://blockscout.scroll.io/api',
          browserURL: 'https://blockscout.scroll.io/',
        },
      },
    ],
  },
};
