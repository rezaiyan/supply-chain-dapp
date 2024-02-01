import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import './scripts/deploy';
import 'dotenv/config';
import '@typechain/hardhat';
import 'solidity-coverage';
import * as dotenv from 'dotenv';

dotenv.config();

const infuraKey = process.env.INFURA_PROJECT_ID || '';
const mnemonic = process.env.MNEMONIC || '';

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  paths: {
    artifacts: './frontend/src/artifacts'
  },
  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 1000
      }
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraKey}`,
      accounts: {
        mnemonic: mnemonic,
      },
      chainId: 11155111, // Sepolia's network ID
      gas: 4000000, // Adjust the gas limit as per your requirements
      gasPrice: 10000000000, // Set the gas price to an appropriate value
    }
  },
};

export default config;
