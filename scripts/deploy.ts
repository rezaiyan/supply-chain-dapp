import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy SupplyChain contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const SupplyChain = await hre.ethers.getContractFactory('SupplyChain');
    const supplyChain = await SupplyChain.deploy();

    await supplyChain.deployed();

    console.log('SupplyChain deployed to:', supplyChain.address);
  }
);