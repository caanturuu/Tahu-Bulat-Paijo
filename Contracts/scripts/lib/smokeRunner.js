const { ethers } = require("ethers");
const { EIP712_TYPES, buildEip712Domain } = require("./deploymentArtifact");

async function runSmokeTest({ contract, relayer, verifier }) {
  const provider = relayer.provider;
  const { chainId } = await provider.getNetwork();
  const contractAddress = await contract.getAddress();
  const userWallet = verifier || ethers.Wallet.createRandom();

  const uniqueUrl = `https://veritaschain.test/smoke/${Date.now()}`;
  const articleKey = ethers.keccak256(ethers.toUtf8Bytes(uniqueUrl));
  const originalHash = ethers.sha256(ethers.toUtf8Bytes("Berita asli untuk uji smoke test."));
  const modifiedHash = ethers.sha256(ethers.toUtf8Bytes("Berita telah diubah diam-diam."));
  const ipfsCid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
  const credibilityScore = 88;

  const nonce = await contract.nonces(userWallet.address);
  const latestBlock = await provider.getBlock("latest");
  const deadline = BigInt(latestBlock.timestamp + 600);

  const domain = buildEip712Domain(chainId, contractAddress);
  const message = {
    articleKey,
    contentHash: originalHash,
    ipfsCid,
    credibilityScore,
    verifier: userWallet.address,
    nonce,
    deadline,
  };

  const signature = await userWallet.signTypedData(domain, EIP712_TYPES, message);

  const tx = await contract
    .connect(relayer)
    .recordVerificationMeta(
      articleKey,
      originalHash,
      ipfsCid,
      credibilityScore,
      userWallet.address,
      deadline,
      signature
    );
  const receipt = await tx.wait();

  const latest = await contract.getLatestRecord(articleKey);
  const unchangedCheck = await contract.checkArticleChange(articleKey, originalHash);
  const modifiedCheck = await contract.checkArticleChange(articleKey, modifiedHash);

  return {
    txHash: receipt.hash,
    recordId: latest.recordId,
    verifier: userWallet.address,
    relayer: relayer.address,
    articleKey,
    unchangedCheck,
    modifiedCheck,
  };
}

module.exports = { runSmokeTest };
