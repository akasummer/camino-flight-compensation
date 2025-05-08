import hardhat from 'hardhat';
const { ethers } = hardhat;

async function main() {
  // Get the Contract Factory for RequestProcessing
  const RequestProcessing = await ethers.getContractFactory(
    'RequestProcessing',
  );

  // Deploy the contract
  const requestProcessing = await RequestProcessing.deploy();

  // Wait for the deployment to complete
  await requestProcessing.deployed();

  console.log('RequestProcessing deployed to:', requestProcessing.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
