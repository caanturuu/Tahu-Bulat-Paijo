# VeritasChain Smart Contracts (Ethereum Sepolia)

Smart contract **VeritasChain** untuk pencatatan bukti verifikasi berita yang tidak bisa dihapus/diubah (*append-only*) serta pelacakan revisi artikel pada jaringan **Ethereum Sepolia Testnet** (`chainId: 11155111`).

## Spesifikasi Teknis
- **Bahasa & EVM**: Solidity `0.8.28`, target EVM `cancun`
- **Standar Gasless**: EIP-712 Typed Data + nonce & deadline per signer (`@openzeppelin/contracts` `EIP712` + `ECDSA`)
- **Immutability**: Tidak ada fungsi `delete`, `update`, atau role admin/owner yang bisa menghapus data on-chain

## Fungsi Utama (`contracts/VeritasChain.sol`)
- `recordVerification(articleKey, contentHash, ipfsCid, credibilityScore)` — Catat langsung dari wallet user.
- `recordVerificationMeta(articleKey, contentHash, ipfsCid, credibilityScore, verifier, deadline, signature)` — Catat *gasless* via backend relayer menggunakan tanda tangan EIP-712 dari wallet Privy user.
- `checkArticleChange(articleKey, currentContentHash)` — Cek cepat untuk tombol *Rescan*: kembalikan status `exists`, `modified` (`false` = unchanged, `true` = modified), `latestRecordId`, `latestContentHash`, dan `revisionCount`.
- `getRecord(recordId)`, `getLatestRecord(articleKey)`, `getArticleHistory(articleKey)`, `getArticleRecords(articleKey)`, `getRecordsByContentHash(contentHash)` — Query riwayat audit publik.

## Konvensi Hash (Frontend & Backend)
- `articleKey` (`bytes32`): `keccak256(normalizedUrl)` untuk artikel berbasis URL, atau sama dengan `contentHash` untuk input teks langsung.
- `contentHash` (`bytes32`): `SHA-256` dari teks artikel yang sudah dinormalisasi.
- `credibilityScore` (`uint8`): rentang `0`–`100` dari Gemini 2.0 Flash.
- `ipfsCid` (`string`): CID Pinata berisi snapshot artikel dan laporan analisis lengkap.

## Skema EIP-712 (Privy / Ethers v6 / Viem)
```js
const domain = {
  name: "VeritasChain",
  version: "1",
  chainId: 11155111, // Ethereum Sepolia
  verifyingContract: "<DEPLOYED_CONTRACT_ADDRESS>",
};

const types = {
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
```

## Cara Menjalankan

```bash
cd Contracts
npm install
npm run compile
npm test
```

## Deploy ke Ethereum Sepolia Testnet

1. Isi variabel berikut di `.env` (root repo atau `Contracts/.env`, lihat `.env.example`):
   ```env
   SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
   DEPLOYER_PRIVATE_KEY=0x...
   ETHERSCAN_API_KEY=...
   ```
2. Pastikan wallet deployer memiliki Sepolia ETH (dari faucet).
3. Jalankan deploy:
   ```bash
   npm run deploy:sepolia
   ```
   Script otomatis memverifikasi source code di Sepolia Etherscan jika `ETHERSCAN_API_KEY` diisi.
