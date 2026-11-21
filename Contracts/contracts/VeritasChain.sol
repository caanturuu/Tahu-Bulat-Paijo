// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title VeritasChain
/// @notice Append-only news verification ledger and article change tracker with EIP-712 gasless meta-transactions.
contract VeritasChain is EIP712 {
    struct VerificationRecord {
        uint256 recordId;
        bytes32 articleKey;
        bytes32 contentHash;
        address verifier;
        uint8 credibilityScore;
        uint64 timestamp;
        uint24 revision;
        string ipfsCid;
    }

    bytes32 public constant VERIFICATION_TYPEHASH = keccak256(
        "RecordVerification(bytes32 articleKey,bytes32 contentHash,string ipfsCid,uint8 credibilityScore,address verifier,uint256 nonce,uint256 deadline)"
    );

    uint256 public totalRecords;

    mapping(uint256 => VerificationRecord) private _records;
    mapping(bytes32 => uint256[]) private _articleHistory;
    mapping(bytes32 => uint256[]) private _contentRecords;
    mapping(address => uint256) public nonces;

    event VerificationRecorded(
        uint256 indexed recordId,
        bytes32 indexed articleKey,
        bytes32 indexed contentHash,
        address verifier,
        uint8 credibilityScore,
        uint24 revision,
        string ipfsCid,
        uint64 timestamp,
        address relayer
    );

    error InvalidArticleKey();
    error InvalidContentHash();
    error EmptyIpfsCid();
    error InvalidCredibilityScore(uint8 score);
    error DuplicateContentHash(bytes32 articleKey, bytes32 contentHash);
    error InvalidVerifier();
    error SignatureExpired(uint256 deadline, uint256 currentTimestamp);
    error InvalidSignature();
    error RecordNotFound(uint256 recordId);
    error ArticleNotFound(bytes32 articleKey);

    constructor() EIP712("VeritasChain", "1") {}

    /// @notice Record a verification directly from the caller's wallet.
    function recordVerification(
        bytes32 articleKey,
        bytes32 contentHash,
        string calldata ipfsCid,
        uint8 credibilityScore
    ) external returns (uint256 recordId) {
        recordId = _record(articleKey, contentHash, ipfsCid, credibilityScore, msg.sender, msg.sender);
    }

    /// @notice Record a verification via backend relayer using the verifier's EIP-712 signature (gasless for user).
    function recordVerificationMeta(
        bytes32 articleKey,
        bytes32 contentHash,
        string calldata ipfsCid,
        uint8 credibilityScore,
        address verifier,
        uint256 deadline,
        bytes calldata signature
    ) external returns (uint256 recordId) {
        if (verifier == address(0)) revert InvalidVerifier();
        if (block.timestamp > deadline) revert SignatureExpired(deadline, block.timestamp);

        uint256 currentNonce = nonces[verifier];
        bytes32 structHash = keccak256(
            abi.encode(
                VERIFICATION_TYPEHASH,
                articleKey,
                contentHash,
                keccak256(bytes(ipfsCid)),
                credibilityScore,
                verifier,
                currentNonce,
                deadline
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        address recoveredSigner = ECDSA.recover(digest, signature);
        if (recoveredSigner != verifier) revert InvalidSignature();

        unchecked {
            nonces[verifier] = currentNonce + 1;
        }

        recordId = _record(articleKey, contentHash, ipfsCid, credibilityScore, verifier, msg.sender);
    }

    function getRecord(uint256 recordId) external view returns (VerificationRecord memory) {
        if (recordId == 0 || recordId > totalRecords) revert RecordNotFound(recordId);
        return _records[recordId];
    }

    function getLatestRecord(bytes32 articleKey) external view returns (VerificationRecord memory) {
        uint256[] storage history = _articleHistory[articleKey];
        if (history.length == 0) revert ArticleNotFound(articleKey);
        return _records[history[history.length - 1]];
    }

    function getArticleHistory(bytes32 articleKey) external view returns (uint256[] memory) {
        return _articleHistory[articleKey];
    }

    function getArticleRecords(bytes32 articleKey) external view returns (VerificationRecord[] memory records) {
        uint256[] storage history = _articleHistory[articleKey];
        uint256 len = history.length;
        records = new VerificationRecord[](len);
        for (uint256 i = 0; i < len; ) {
            records[i] = _records[history[i]];
            unchecked {
                ++i;
            }
        }
    }

    function getArticleRevisionCount(bytes32 articleKey) external view returns (uint256) {
        return _articleHistory[articleKey].length;
    }

    function getRecordsByContentHash(bytes32 contentHash) external view returns (uint256[] memory) {
        return _contentRecords[contentHash];
    }

    /// @notice Compare a rescanned SHA-256 content hash against the latest on-chain hash for an article.
    function checkArticleChange(
        bytes32 articleKey,
        bytes32 currentContentHash
    )
        external
        view
        returns (
            bool exists,
            bool modified,
            uint256 latestRecordId,
            bytes32 latestContentHash,
            uint256 revisionCount
        )
    {
        uint256[] storage history = _articleHistory[articleKey];
        revisionCount = history.length;
        if (revisionCount == 0) {
            return (false, false, 0, bytes32(0), 0);
        }

        latestRecordId = history[revisionCount - 1];
        latestContentHash = _records[latestRecordId].contentHash;
        exists = true;
        modified = latestContentHash != currentContentHash;
    }

    function domainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    function _record(
        bytes32 articleKey,
        bytes32 contentHash,
        string calldata ipfsCid,
        uint8 credibilityScore,
        address verifier,
        address relayer
    ) internal returns (uint256 recordId) {
        if (articleKey == bytes32(0)) revert InvalidArticleKey();
        if (contentHash == bytes32(0)) revert InvalidContentHash();
        if (bytes(ipfsCid).length == 0) revert EmptyIpfsCid();
        if (credibilityScore > 100) revert InvalidCredibilityScore(credibilityScore);

        uint24 revision;
        {
            uint256[] storage history = _articleHistory[articleKey];
            uint256 prevCount = history.length;

            // Prevent consecutive duplicate records when article content has not changed.
            if (prevCount > 0 && _records[history[prevCount - 1]].contentHash == contentHash) {
                revert DuplicateContentHash(articleKey, contentHash);
            }

            unchecked {
                recordId = ++totalRecords;
            }

            revision = uint24(prevCount + 1);
            history.push(recordId);
        }

        uint64 ts = uint64(block.timestamp);
        VerificationRecord storage rec = _records[recordId];
        rec.recordId = recordId;
        rec.articleKey = articleKey;
        rec.contentHash = contentHash;
        rec.verifier = verifier;
        rec.credibilityScore = credibilityScore;
        rec.timestamp = ts;
        rec.revision = revision;
        rec.ipfsCid = ipfsCid;

        _contentRecords[contentHash].push(recordId);

        emit VerificationRecorded(
            recordId,
            articleKey,
            contentHash,
            verifier,
            credibilityScore,
            revision,
            ipfsCid,
            ts,
            relayer
        );
    }
}
