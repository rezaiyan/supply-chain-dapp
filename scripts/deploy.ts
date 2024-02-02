// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import { ethers } from "hardhat";
import path from "path";

async function main() {
  // This is just a convenience check
  const network = await ethers.provider.getNetwork();
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which " +
      "gets automatically created and destroyed every time. Use the Hardhat " +
      "option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Account balance:", balance);
  
  // Deploy the contract
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.waitForDeployment();
  const address = await supplyChain.getAddress();

  console.log("SupplyChain address:", address);

  // We also save the contract's artifacts and address in the frontend directory
  // saveFrontendFiles(supplyChain);
}

function saveFrontendFiles(supplyChain) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ SupplyChain: supplyChain.address }, undefined, 2)
  );

  const SupplyChainArtifact = require("../artifacts/contracts/SupplyChain.sol/SupplyChain.json");

  fs.writeFileSync(
    path.join(contractsDir, "SupplyChain.json"),
    JSON.stringify(SupplyChainArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
