import struct
import requests
import json
import time
import os
import subprocess
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

# --- BCS Serialization ---
def uleb128_encode(value: int) -> bytes:
    result = bytearray()
    while True:
        byte = value & 0x7f
        value >>= 7
        if value != 0:
            byte |= 0x80
            result.append(byte)
        else:
            result.append(byte)
            break
    return bytes(result)

def serialize_u8(value: int) -> bytes:
    return struct.pack('<B', value)

def serialize_u64(value: int) -> bytes:
    return struct.pack('<Q', value)

def serialize_bool(value: bool) -> bytes:
    return b'\x01' if value else b'\x00'

def serialize_vector_u8(values: list[int]) -> bytes:
    res = uleb128_encode(len(values))
    for v in values:
        res += serialize_u8(v)
    return res

def serialize_vector_u64(values: list[int]) -> bytes:
    res = uleb128_encode(len(values))
    for v in values:
        res += serialize_u64(v)
    return res

def serialize_update_odds_payload(match_id: int, market_id: int, new_odds: list[int], suspended: bool) -> bytes:
    return serialize_u64(match_id) + serialize_u8(market_id) + serialize_vector_u64(new_odds) + serialize_bool(suspended)

def serialize_batch_settle_payload(match_id: int, market_ids: list[int], winning_outcomes: list[int]) -> bytes:
    return serialize_u64(match_id) + serialize_vector_u8(market_ids) + serialize_vector_u8(winning_outcomes)

# --- Key Management ---
KEY_FILE = "oracle_key.pem"

def load_or_generate_key() -> ed25519.Ed25519PrivateKey:
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "rb") as f:
            return serialization.load_pem_private_key(f.read(), password=None)
    else:
        priv_key = ed25519.Ed25519PrivateKey.generate()
        with open(KEY_FILE, "wb") as f:
            f.write(priv_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        return priv_key

def get_public_key_bytes(priv_key: ed25519.Ed25519PrivateKey) -> bytes:
    return priv_key.public_key().public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )

# --- API Fetcher ---
def get_mock_data():
    return {
        "matches": [
            {
                "id": 101,
                "homeTeam": {"name": "Arsenal"},
                "awayTeam": {"name": "Chelsea"},
                "utcDate": "2026-05-15T20:00:00Z",
                "status": "FINISHED",
                "score": {
                    "fullTime": {"home": 2, "away": 1}
                }
            }
        ]
    }

def fetch_football_data():
    url = "https://api.football-data.org/v4/matches"
    token = os.environ.get("FOOTBALL_DATA_TOKEN")
    if not token:
        print("FOOTBALL_DATA_TOKEN not set. Falling back to mock data.")
        return get_mock_data()
    headers = {"X-Auth-Token": token}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"API Error {response.status_code}: {response.text}")
            return get_mock_data()
    except Exception as e:
        print(f"Falling back to mocked data due to: {e}")
        return get_mock_data()

def compute_odds(match):
    return [15000, 30000, 40000]

def compute_winner(match):
    home_score = match['score']['fullTime']['home']
    away_score = match['score']['fullTime']['away']
    if home_score > away_score:
        return 0
    elif home_score == away_score:
        return 1
    else:
        return 2

# --- Initia CLI Interaction ---
def execute_move_tx(func_name: str, args: list):
    cmd = [
        "minitiad", "tx", "move", "execute",
        "0x42", "sportsbook",
        func_name,
        "--args", json.dumps(args),
        "--from", "admin",
        "--yes"
    ]
    print(f"Executing: {' '.join(cmd)}")

def run_bot():
    priv_key = load_or_generate_key()
    pub_key_bytes = get_public_key_bytes(priv_key)
    print(f"Oracle Public Key (Hex): {pub_key_bytes.hex()}")

    print("Fetching football data...")
    data = fetch_football_data()
    matches = data.get("matches", [])

    for match in matches:
        match_id = match['id']
        market_id = 1
        new_odds = compute_odds(match)
        suspended = False
        
        odds_payload = serialize_update_odds_payload(match_id, market_id, new_odds, suspended)
        odds_sig = priv_key.sign(odds_payload)
        
        print(f"\n--- Update Odds ---")
        print(f"Match: {match['homeTeam']['name']} vs {match['awayTeam']['name']}")
        print(f"Payload (Hex): {odds_payload.hex()}")
        print(f"Signature (Hex): {odds_sig.hex()}")
        
        execute_move_tx("update_odds", [
            f"u64:{match_id}",
            f"u8:{market_id}",
            f"vector<u64>:{','.join(map(str, new_odds))}",
            f"bool:{str(suspended).lower()}",
            f"raw_hex:{odds_sig.hex()}"
        ])

        if match['status'] == "FINISHED":
            winner_id = compute_winner(match)
            market_ids = [market_id]
            winning_outcomes = [winner_id]

            settle_payload = serialize_batch_settle_payload(match_id, market_ids, winning_outcomes)
            settle_sig = priv_key.sign(settle_payload)

            print(f"\n--- Batch Settle ---")
            print(f"Winner: {winner_id} (0=Home, 1=Draw, 2=Away)")
            print(f"Payload (Hex): {settle_payload.hex()}")
            print(f"Signature (Hex): {settle_sig.hex()}")

            execute_move_tx("batch_settle_match", [
                f"u64:{match_id}",
                f"vector<u8>:{','.join(map(str, market_ids))}",
                f"vector<u8>:{','.join(map(str, winning_outcomes))}",
                f"raw_hex:{settle_sig.hex()}"
            ])

if __name__ == "__main__":
    run_bot()
