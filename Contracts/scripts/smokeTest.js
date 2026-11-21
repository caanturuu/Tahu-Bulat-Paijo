const path = require("path");
const hre = require("hardhat");
const { readDeploymentArtifact } = require("./lib/deploymentArtifact");
const { runSmokeTest } = require("./lib/smokeRunner");

async function main() {
  const [relayer] = await hre.ethers.getSigners();
  if (!relayer) {
    throw new Error("RELAYER_PRIVATE_KEY belum diisi di root .env");
  }

  const networkName = hre.network.name;
  let contractAddress = (process.env.CONTRACT_ADDRESS || "").trim();

  if (!contractAddress) {
    const artifactPath = path.resolve(__dirname, `../deployments/${networkName}.json`);
    const deployment = readDeploymentArtifact(artifactPath);
    contractAddress = deployment.address;
  }

  const VeritasChain = await hre.ethers.getContractFactory("VeritasChain");
  const contract = VeritasChain.attach(contractAddress);

  console.log(`Running gasless EIP-712 smoke test on ${networkName}...`);
  console.log(`Contract : ${contractAddress}`);
  console.log(`Relayer  : ${relayer.address}`);

  // Ephemeral 0-ETH wallet simulates a Privy embedded user wallet signing off-chain.
  const result = await runSmokeTest({ contract, relayer });

  console.log(`\nSmoke test PASSED`);
  console.log(`Verifier (0 ETH): ${result.verifier}`);
  console.log(`Record ID       : ${result.recordId}`);
  console.log(`Tx Hash         : ${result.txHash}`);
  console.log(`Unchanged check : exists=${result.unchangedCheck.exists}, modified=${result.unchangedCheck.modified}`);
  console.log(`Modified check  : exists=${result.modifiedCheck.exists}, modified=${result.modifiedCheck.modified}`);

  const { chainId } = await hre.ethers.provider.getNetwork();
  if (chainId === 11155111n) {
    console.log(`Etherscan Tx    : https://sepolia.etherscan.io/tx/${result.txHash}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
