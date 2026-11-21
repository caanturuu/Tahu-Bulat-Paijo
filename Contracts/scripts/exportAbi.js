const fs = require("fs");
const path = require("path");
const hre = require("hardhat");
const { EIP712_TYPES } = require("./lib/deploymentArtifact");

async function main() {
  const artifact = await hre.artifacts.readArtifact("VeritasChain");
  const abiDir = path.resolve(__dirname, "../abi");
  fs.mkdirSync(abiDir, { recursive: true });

  const outPath = path.join(abiDir, "VeritasChain.json");
  fs.writeFileSync(
    outPath,
    `${JSON.stringify({ contractName: "VeritasChain", eip712Types: EIP712_TYPES, abi: artifact.abi }, null, 2)}\n`,
    "utf8"
  );
  console.log(`ABI exported to: ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
