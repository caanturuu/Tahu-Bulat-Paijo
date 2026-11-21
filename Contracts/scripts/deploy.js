const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("DEPLOYER_PRIVATE_KEY belum diisi di .env");
  }

  const network = await hre.ethers.provider.getNetwork();
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log(`Network  : ${network.name} (chainId: ${network.chainId})`);
  console.log(`Deployer : ${deployer.address}`);
  console.log(`Balance  : ${hre.ethers.formatEther(balance)} ETH`);

  const VeritasChain = await hre.ethers.getContractFactory("VeritasChain");
  const contract = await VeritasChain.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const tx = contract.deploymentTransaction();

  console.log(`\nVeritasChain deployed to: ${address}`);
  if (tx) {
    console.log(`Tx hash : ${tx.hash}`);
  }

  if (network.chainId === 11155111n) {
    console.log(`Etherscan: https://sepolia.etherscan.io/address/${address}`);
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("\nMenunggu 5 konfirmasi blok sebelum verifikasi Etherscan...");
      if (tx) await tx.wait(5);
      try {
        await hre.run("verify:verify", {
          address,
          constructorArguments: [],
        });
        console.log("Kontrak berhasil diverifikasi di Sepolia Etherscan.");
      } catch (err) {
        console.log(`Auto-verify dilewati (${err.message}). Verify manual:`);
        console.log(`npx hardhat verify --network sepolia ${address}`);
      }
    } else {
      console.log(`\nVerify manual setelah set ETHERSCAN_API_KEY:`);
      console.log(`npx hardhat verify --network sepolia ${address}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
