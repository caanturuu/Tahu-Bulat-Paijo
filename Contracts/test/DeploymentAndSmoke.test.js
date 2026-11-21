const fs = require("fs");
const os = require("os");
const path = require("path");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  EIP712_TYPES,
  buildEip712Domain,
  writeDeploymentArtifact,
  readDeploymentArtifact,
} = require("../scripts/lib/deploymentArtifact");
const { runSmokeTest } = require("../scripts/lib/smokeRunner");

describe("Deployment Handoff Artifact & Smoke Test", function () {
  it("writes and reads a complete Sepolia handoff JSON with ABI, address, explorer URL, and EIP-712 schema", async function () {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "veritas-deploy-"));
    try {
      const artifact = await ethers.getContractFactory("VeritasChain");
      const abi = JSON.parse(artifact.interface.formatJson());
      const sampleAddress = "0x1111111111111111111111111111111111111111";
      const sampleTx = "0x" + "ab".repeat(32);
      const sampleDeployer = "0x2222222222222222222222222222222222222222";

      const { filePath, payload } = writeDeploymentArtifact({
        outDir: tmpDir,
        networkName: "sepolia",
        chainId: 11155111n,
        address: sampleAddress,
        txHash: sampleTx,
        deployer: sampleDeployer,
        abi,
      });

      expect(fs.existsSync(filePath)).to.equal(true);
      expect(payload.chainId).to.equal(11155111);
      expect(payload.address).to.equal(sampleAddress);
      expect(payload.explorerUrl).to.equal(
        `https://sepolia.etherscan.io/address/${sampleAddress}`
      );
      expect(payload.eip712.domain).to.deep.equal(
        buildEip712Domain(11155111, sampleAddress)
      );
      expect(payload.eip712.types).to.deep.equal(EIP712_TYPES);

      const loaded = readDeploymentArtifact(filePath);
      expect(loaded).to.deep.equal(payload);
      expect(loaded.abi.some((entry) => entry.name === "recordVerificationMeta")).to.equal(true);
      expect(loaded.abi.some((entry) => entry.name === "checkArticleChange")).to.equal(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("executes end-to-end gasless EIP-712 smoke test and detects unchanged vs modified article", async function () {
    const [relayer, verifier] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("VeritasChain");
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    const result = await runSmokeTest({
      contract,
      relayer,
      verifier,
    });

    expect(result.recordId).to.equal(1n);
    expect(result.txHash).to.match(/^0x[0-9a-fA-F]{64}$/);
    expect(result.unchangedCheck.exists).to.equal(true);
    expect(result.unchangedCheck.modified).to.equal(false);
    expect(result.modifiedCheck.exists).to.equal(true);
    expect(result.modifiedCheck.modified).to.equal(true);
  });
});
