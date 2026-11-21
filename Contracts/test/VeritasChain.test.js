const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

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

function sha256Bytes32(text) {
  return ethers.sha256(ethers.toUtf8Bytes(text));
}

describe("VeritasChain", function () {
  async function deployFixture() {
    const [relayer, userA, userB, attacker] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("VeritasChain");
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    const { chainId } = await ethers.provider.getNetwork();
    const domain = {
      name: "VeritasChain",
      version: "1",
      chainId,
      verifyingContract: await contract.getAddress(),
    };

    return { contract, relayer, userA, userB, attacker, domain };
  }

  describe("Direct Verification & Revision Tracking", function () {
    it("records an article verification and detects unchanged vs modified content", async function () {
      const { contract, userA } = await deployFixture();

      const articleKey = ethers.keccak256(ethers.toUtf8Bytes("https://news.example.id/politik/berita-1"));
      const hashV1 = sha256Bytes32("Isi berita asli versi pertama.");
      const cidV1 = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";

      await expect(contract.connect(userA).recordVerification(articleKey, hashV1, cidV1, 82))
        .to.emit(contract, "VerificationRecorded");

      expect(await contract.totalRecords()).to.equal(1n);

      const rec = await contract.getRecord(1);
      expect(rec.articleKey).to.equal(articleKey);
      expect(rec.contentHash).to.equal(hashV1);
      expect(rec.ipfsCid).to.equal(cidV1);
      expect(rec.credibilityScore).to.equal(82n);
      expect(rec.verifier).to.equal(userA.address);
      expect(rec.revision).to.equal(1n);

      // Rescan with same hash -> unchanged
      const statusSame = await contract.checkArticleChange(articleKey, hashV1);
      expect(statusSame.exists).to.equal(true);
      expect(statusSame.modified).to.equal(false);
      expect(statusSame.latestRecordId).to.equal(1n);
      expect(statusSame.revisionCount).to.equal(1n);

      // Rescan with edited text -> modified
      const hashV2 = sha256Bytes32("Isi berita telah diubah diam-diam oleh penerbit.");
      const statusEdited = await contract.checkArticleChange(articleKey, hashV2);
      expect(statusEdited.exists).to.equal(true);
      expect(statusEdited.modified).to.equal(true);
      expect(statusEdited.latestContentHash).to.equal(hashV1);

      // Record revision 2
      const cidV2 = "bafybeihkoviema7g3gxyt6la7vd5ho32ictqbilu3wnlo3rs7ewhnp7lly";
      await contract.connect(userA).recordVerification(articleKey, hashV2, cidV2, 35);

      expect(await contract.getArticleRevisionCount(articleKey)).to.equal(2n);
      const historyIds = await contract.getArticleHistory(articleKey);
      expect(historyIds).to.deep.equal([1n, 2n]);

      const allRecords = await contract.getArticleRecords(articleKey);
      expect(allRecords.length).to.equal(2);
      expect(allRecords[0].contentHash).to.equal(hashV1);
      expect(allRecords[1].contentHash).to.equal(hashV2);
      expect(allRecords[1].revision).to.equal(2n);
      expect(allRecords[1].credibilityScore).to.equal(35n);

      // Lookup by raw content hash
      expect(await contract.getRecordsByContentHash(hashV2)).to.deep.equal([2n]);
    });

    it("rejects consecutive duplicate contentHash for the same article but allows revert-back revision", async function () {
      const { contract, userA } = await deployFixture();
      const articleKey = ethers.keccak256(ethers.toUtf8Bytes("https://news.example.id/a"));
      const hashA = sha256Bytes32("Versi A");
      const hashB = sha256Bytes32("Versi B");

      await contract.connect(userA).recordVerification(articleKey, hashA, "cidA", 90);

      await expect(
        contract.connect(userA).recordVerification(articleKey, hashA, "cidA2", 90)
      ).to.be.revertedWithCustomError(contract, "DuplicateContentHash");

      await contract.connect(userA).recordVerification(articleKey, hashB, "cidB", 40);
      await contract.connect(userA).recordVerification(articleKey, hashA, "cidA3", 90);

      expect(await contract.getArticleRevisionCount(articleKey)).to.equal(3n);
    });

    it("validates inputs and non-existent lookups", async function () {
      const { contract, userA } = await deployFixture();
      const key = ethers.keccak256(ethers.toUtf8Bytes("url"));
      const hash = sha256Bytes32("body");

      await expect(
        contract.connect(userA).recordVerification(ethers.ZeroHash, hash, "cid", 50)
      ).to.be.revertedWithCustomError(contract, "InvalidArticleKey");

      await expect(
        contract.connect(userA).recordVerification(key, ethers.ZeroHash, "cid", 50)
      ).to.be.revertedWithCustomError(contract, "InvalidContentHash");

      await expect(
        contract.connect(userA).recordVerification(key, hash, "", 50)
      ).to.be.revertedWithCustomError(contract, "EmptyIpfsCid");

      await expect(
        contract.connect(userA).recordVerification(key, hash, "cid", 101)
      ).to.be.revertedWithCustomError(contract, "InvalidCredibilityScore");

      await expect(contract.getRecord(0)).to.be.revertedWithCustomError(contract, "RecordNotFound");
      await expect(contract.getRecord(99)).to.be.revertedWithCustomError(contract, "RecordNotFound");
      await expect(contract.getLatestRecord(key)).to.be.revertedWithCustomError(contract, "ArticleNotFound");

      const unknown = await contract.checkArticleChange(key, hash);
      expect(unknown.exists).to.equal(false);
      expect(unknown.modified).to.equal(false);
      expect(unknown.revisionCount).to.equal(0n);
    });
  });

  describe("Gasless EIP-712 Meta-Transaction Relayer", function () {
    it("records verification submitted by relayer with user EIP-712 signature", async function () {
      const { contract, relayer, userA, domain } = await deployFixture();

      const articleKey = ethers.keccak256(ethers.toUtf8Bytes("https://news.example.id/hoaks-1"));
      const contentHash = sha256Bytes32("Klaim berita viral WhatsApp.");
      const ipfsCid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
      const credibilityScore = 15;
      const nonce = await contract.nonces(userA.address);
      const deadline = BigInt((await time.latest()) + 600);

      const message = {
        articleKey,
        contentHash,
        ipfsCid,
        credibilityScore,
        verifier: userA.address,
        nonce,
        deadline,
      };

      const signature = await userA.signTypedData(domain, EIP712_TYPES, message);

      await expect(
        contract
          .connect(relayer)
          .recordVerificationMeta(
            articleKey,
            contentHash,
            ipfsCid,
            credibilityScore,
            userA.address,
            deadline,
            signature
          )
      )
        .to.emit(contract, "VerificationRecorded")
        .withArgs(
          1n,
          articleKey,
          contentHash,
          userA.address,
          credibilityScore,
          1n,
          ipfsCid,
          (ts) => ts > 0n,
          relayer.address
        );

      const rec = await contract.getLatestRecord(articleKey);
      expect(rec.verifier).to.equal(userA.address);
      expect(await contract.nonces(userA.address)).to.equal(1n);
    });

    it("prevents signature replay, tampering, wrong signer, and expired deadlines", async function () {
      const { contract, relayer, userA, attacker, domain } = await deployFixture();

      const articleKey = ethers.keccak256(ethers.toUtf8Bytes("https://news.example.id/hoaks-2"));
      const contentHash = sha256Bytes32("Berita asli.");
      const ipfsCid = "bafybeicid1";
      const credibilityScore = 75;
      const deadline = BigInt((await time.latest()) + 300);

      const message = {
        articleKey,
        contentHash,
        ipfsCid,
        credibilityScore,
        verifier: userA.address,
        nonce: 0n,
        deadline,
      };
      const signature = await userA.signTypedData(domain, EIP712_TYPES, message);

      // Tampered score must fail
      await expect(
        contract
          .connect(relayer)
          .recordVerificationMeta(articleKey, contentHash, ipfsCid, 99, userA.address, deadline, signature)
      ).to.be.revertedWithCustomError(contract, "InvalidSignature");

      // Wrong verifier address must fail
      await expect(
        contract
          .connect(relayer)
          .recordVerificationMeta(articleKey, contentHash, ipfsCid, credibilityScore, attacker.address, deadline, signature)
      ).to.be.revertedWithCustomError(contract, "InvalidSignature");

      // Valid submission succeeds
      await contract
        .connect(relayer)
        .recordVerificationMeta(articleKey, contentHash, ipfsCid, credibilityScore, userA.address, deadline, signature);

      // Exact replay fails (nonce already incremented)
      await expect(
        contract
          .connect(relayer)
          .recordVerificationMeta(articleKey, contentHash, ipfsCid, credibilityScore, userA.address, deadline, signature)
      ).to.be.revertedWithCustomError(contract, "InvalidSignature");

      // Expired deadline fails
      const expiredDeadline = BigInt((await time.latest()) - 1);
      const expiredSig = await userA.signTypedData(domain, EIP712_TYPES, {
        ...message,
        contentHash: sha256Bytes32("Berita revisi."),
        nonce: 1n,
        deadline: expiredDeadline,
      });

      await expect(
        contract
          .connect(relayer)
          .recordVerificationMeta(
            articleKey,
            sha256Bytes32("Berita revisi."),
            ipfsCid,
            credibilityScore,
            userA.address,
            expiredDeadline,
            expiredSig
          )
      ).to.be.revertedWithCustomError(contract, "SignatureExpired");
    });
  });
});
