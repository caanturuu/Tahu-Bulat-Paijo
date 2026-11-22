from typing import Dict, Any
import httpx
from config import PINATA_JWT

PINATA_PIN_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

async def pin_json_to_ipfs(payload: Dict[str, Any], name: str = "VeritasChain-Report") -> str:
    """
    Pin verification report JSON metadata to IPFS via Pinata.
    Returns the IPFS CID (IpfsHash).
    """
    if PINATA_JWT:
        headers = {
            "Authorization": f"Bearer {PINATA_JWT}",
            "Content-Type": "application/json",
        }
        body = {
            "pinataOptions": {"cidVersion": 1},
            "pinataMetadata": {"name": name},
            "pinataContent": payload,
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(PINATA_PIN_JSON_URL, json=body, headers=headers)
                if res.status_code in (200, 201):
                    data = res.json()
                    return data.get("IpfsHash", "")
                else:
                    print(f"[IPFSService] Pinata API returned status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"[IPFSService] Exception during Pinata upload: {e}")

    return ""
