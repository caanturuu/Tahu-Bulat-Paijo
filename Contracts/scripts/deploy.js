const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { EIP712_TYPES, writeDeploymentArtifact } = require("./lib/deploymentArtifact");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("RELAYER_PRIVATE_KEY belum diisi di root .env");
  }

  const network = await hre.ethers.provider.getNetwork();
  const networkName = hre.network.name;
  const balance = await hre.ethers.provider.getBalance(deployer.address);

  console.log(`Network  : ${networkName} (chainId: ${network.chainId})`);
  console.log(`Deployer : ${deployer.address}`);
  console.log(`Balance  : ${hre.ethers.formatEther(balance)} ETH`);

  const VeritasChain = await hre.ethers.getContractFactory("VeritasChain");
  const contract = await VeritasChain.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const tx = contract.deploymentTransaction();
  const abi = JSON.parse(VeritasChain.interface.formatJson());

  console.log(`\nVeritasChain deployed to: ${address}`);
  if (tx) {
    console.log(`Tx hash : ${tx.hash}`);
  }

  // Always export clean ABI for Frontend/Backend consumption.
  const abiDir = path.resolve(__dirname, "../abi");
  fs.mkdirSync(abiDir, { recursive: true });
  fs.writeFileSync(
    path.join(abiDir, "VeritasChain.json"),
    `${JSON.stringify({ contractName: "VeritasChain", eip712Types: EIP712_TYPES, abi }, null, 2)}\n`,
    "utf8"
  );

  // Persist deployment handoff file for persistent networks (e.g. sepolia).
  if (networkName !== "hardhat") {
    const outDir = path.resolve(__dirname, "../deployments");
    const { filePath } = writeDeploymentArtifact({
      outDir,
      networkName,
      chainId: network.chainId,
      address,
      txHash: tx ? tx.hash : null,
      deployer: deployer.address,
      abi,
    });
    console.log(`Artifact: ${filePath}`);
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
