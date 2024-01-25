import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy RetailerRole contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const RetailerRole = await hre.ethers.getContractFactory('RetailerRole');
    const retailerRole = await RetailerRole.deploy();

    await retailerRole.deployed();

    console.log('RetailerRole deployed to:', retailerRole.address);
  }
);