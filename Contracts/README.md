# VeritasChain Smart Contracts (Ethereum Sepolia)

Smart contract **VeritasChain** untuk pencatatan bukti verifikasi berita yang tidak bisa dihapus/diubah (*append-only*) serta pelacakan revisi artikel pada **Ethereum Sepolia Testnet** (`chainId: 11155111`).

## Spesifikasi Teknis
- **Bahasa & EVM**: Solidity `^0.8.28` (dikunci compile `0.8.28` di `hardhat.config.js`), target EVM `cancun`
- **Standar Gasless**: EIP-712 Typed Data + `nonces` & `deadline` per signer (`@openzeppelin/contracts` `EIP712` + `ECDSA`)
- **Immutability**: Tanpa fungsi `delete`, `update`, atau role admin/owner; relayer on-chain permissionless agar tahan sensor

## Fungsi Utama (`contracts/VeritasChain.sol`)
- `recordVerification(articleKey, contentHash, ipfsCid, credibilityScore)` — Catat langsung dari wallet user.
- `recordVerificationMeta(articleKey, contentHash, ipfsCid, credibilityScore, verifier, deadline, signature)` — Catat *gasless* via backend relayer menggunakan tanda tangan EIP-712 dari wallet Privy user.
- `checkArticleChange(articleKey, currentContentHash)` — Cek cepat untuk tombol *Rescan*: kembalikan `exists`, `modified` (`false` = unchanged, `true` = modified), `latestRecordId`, `latestContentHash`, `revisionCount`.
- `getRecord(recordId)`, `getLatestRecord(articleKey)`, `getArticleHistory(articleKey)`, `getArticleRecords(articleKey)`, `getRecordsByContentHash(contentHash)` — Query riwayat audit publik.

## Artefak Handoff (Role Frontend & Backend)
- `Contracts/abi/VeritasChain.json` — ABI JSON + `eip712Types` siap import tanpa perlu compile Hardhat.
- `Contracts/deployments/sepolia.json` — Otomatis dibuat saat `npm run deploy:sepolia` (isi: `address`, `chainId`, `txHash`, `explorerUrl`, `eip712`, `abi`) dan wajib di-commit ke Git.

> **Catatan Koordinasi Frontend (`main`):** Target jaringan terkunci di **Ethereum Sepolia (`11155111`)**. Di `Frontend/`, pastikan `Web3Provider.tsx` memakai `sepolia` (bukan `baseSepolia`) dan `ProofBadge.tsx` mengarah ke `https://sepolia.etherscan.io/tx/<txHash>`.
>
> **Catatan Koordinasi Backend:** Panggil `checkArticleChange(articleKey, contentHash)` sebelum meminta signature EIP-712 user. Jika `exists == true && modified == false`, kembalikan record lama agar tidak terkena revert `DuplicateContentHash`.

## Konvensi Hash
- `articleKey` (`bytes32`): `keccak256(normalizedUrl)` untuk input URL, atau sama dengan `contentHash` untuk input teks langsung.
- `contentHash` (`bytes32`): `SHA-256` dari teks artikel yang sudah dinormalisasi.
- `credibilityScore` (`uint8`): `0`–`100` dari Gemini 2.0 Flash.
- `ipfsCid` (`string`): CID Pinata berisi snapshot artikel & hasil analisis lengkap.

## Cara Menjalankan

```bash
cd Contracts
npm install
npm run compile
npm test
npm run export:abi
```

## Deploy & Smoke Test ke Ethereum Sepolia Testnet

1. Salin root `.env.example` menjadi root `.env`, lalu isi:
   ```env
   SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
   RELAYER_PRIVATE_KEY="0x..."
   ETHERSCAN_API_KEY="..."
   ```
2. Pastikan wallet `RELAYER_PRIVATE_KEY` memiliki Sepolia ETH dari faucet.
3. Deploy + auto-verify Etherscan + generate `deployments/sepolia.json`:
   ```bash
   npm run deploy:sepolia
   ```
4. Jalankan smoke test gasless EIP-712 nyata di Ethereum Sepolia (pakai wallet 0 ETH sebagai simulasi user Privy):
   ```bash
   npm run smoke:sepolia
   ```
5. Salin `address` hasil deploy ke `CONTRACT_ADDRESS` di `.env` dan commit `Contracts/deployments/sepolia.json`.
