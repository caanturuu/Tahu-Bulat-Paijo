const fs = require("fs");
const path = require("path");

const EIP712_TYPES = {
  RecordVerification: [
    { name: "articleKey", type: "bytes32" },
    { name: "contentHash", type: "bytes32" },
    { name: "ipfsCid", type: "string" },
    { name: "credibilityScore", type: "uint8" },
    { name: "verifier", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
};

function buildEip712Domain(chainId, verifyingContract) {
  return {
    name: "VeritasChain",
    version: "1",
    chainId: Number(chainId),
    verifyingContract,
  };
}

function getExplorerUrl(chainId, address) {
  if (Number(chainId) === 11155111) {
    return `https://sepolia.etherscan.io/address/${address}`;
  }
  return null;
}

function writeDeploymentArtifact({
  outDir,
  networkName,
  chainId,
  address,
  txHash,
  deployer,
  abi,
}) {
  fs.mkdirSync(outDir, { recursive: true });
  const numericChainId = Number(chainId);

  const payload = {
    contractName: "VeritasChain",
    network: networkName,
    chainId: numericChainId,
    address,
    txHash: txHash || null,
    deployer,
    explorerUrl: getExplorerUrl(numericChainId, address),
    deployedAt: new Date().toISOString(),
    eip712: {
      domain: buildEip712Domain(numericChainId, address),
      types: EIP712_TYPES,
    },
    abi,
  };

  const filePath = path.join(outDir, `${networkName}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return { filePath, payload };
}

function readDeploymentArtifact(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Deployment artifact tidak ditemukan: ${filePath}`);
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!parsed.address || !Array.isArray(parsed.abi)) {
    throw new Error(`Format deployment artifact tidak valid: ${filePath}`);
  }
  return parsed;
}

module.exports = {
  EIP712_TYPES,
  buildEip712Domain,
  writeDeploymentArtifact,
  readDeploymentArtifact,
};
