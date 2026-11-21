import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in Backend/ directory or repository root
backend_dir = Path(__file__).resolve().parent
root_dir = backend_dir.parent

if (backend_dir / ".env").exists():
    load_dotenv(dotenv_path=backend_dir / ".env")
elif (root_dir / ".env").exists():
    load_dotenv(dotenv_path=root_dir / ".env")
else:
    load_dotenv()

# AI & Fact Checking
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
FACT_CHECK_API_KEY = os.getenv("FACT_CHECK_API_KEY", "")

# IPFS Pinata
PINATA_API_KEY = os.getenv("PINATA_API_KEY", "")
PINATA_API_SECRET = os.getenv("PINATA_API_SECRET", "")
PINATA_JWT = os.getenv("PINATA_JWT", "")

# Privy
PRIVY_APP_ID = os.getenv("PRIVY_APP_ID", "")
PRIVY_APP_SECRET = os.getenv("PRIVY_APP_SECRET", "")

# Database (Supabase)
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# Blockchain (Ethereum Sepolia)
SEPOLIA_RPC_URL = os.getenv("SEPOLIA_RPC_URL", "https://eth-sepolia.g.alchemy.com/v2/alch_k1MrIcFHb8VacBCF2Msms")
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY", "")
DEPLOYER_PRIVATE_KEY = os.getenv("DEPLOYER_PRIVATE_KEY", "")
RELAYER_PRIVATE_KEY = os.getenv("RELAYER_PRIVATE_KEY", "")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")
