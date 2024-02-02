import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
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
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraKey}`,
      accounts: {
        mnemonic: mnemonic,
      }
    }
  },
};

export default config;
