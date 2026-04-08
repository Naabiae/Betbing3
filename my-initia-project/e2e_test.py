import json
import subprocess
import time
import sys
import re

def run_cmd(cmd):
    print(f"\nRunning: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return None
    return result.stdout.strip()

def tx_execute(func, args, sender, package_addr):
    cmd = [
        "minitiad", "tx", "move", "execute",
        package_addr, "sportsbook", func,
        "--args", json.dumps(args),
        "--from", sender,
        "--keyring-backend", "test",
        "--chain-id", "movegame-1",
        "--gas", "auto",
        "--gas-adjustment", "1.5",
        "--fees", "2000000umin",
        "--yes",
        "--output", "json"
    ]
    out = run_cmd(cmd)
    if not out:
        return None
    try:
        data = json.loads(out)
        tx_hash = data.get("txhash")
        print(f"Tx Hash: {tx_hash}")
        time.sleep(3)
        return tx_hash
    except Exception as e:
        print(f"Failed to parse tx response: {e}")
        return None

def query_balance(addr, denom="umin"):
    cmd = ["minitiad", "q", "bank", "balances", addr, "--output", "json"]
    out = run_cmd(cmd)
    if out:
        data = json.loads(out)
        for coin in data.get("balances", []):
            if coin["denom"] == denom:
                return int(coin["amount"])
    return 0

def main():
    print("Getting admin (Validator) address...")
    admin_addr = json.loads(run_cmd(["minitiad", "keys", "show", "Validator", "--keyring-backend", "test", "--output", "json"]))["address"]
    print(f"Admin Bech32: {admin_addr}")
    
    # Convert to Hex
    res = subprocess.run(["minitiad", "keys", "parse", admin_addr, "--output", "json"], capture_output=True, text=True)
    admin_hex = "0x" + json.loads(res.stdout)["bytes"]
    print(f"Admin Hex: {admin_hex}")
    
    # Update Move.toml with admin address
    print(f"Updating Move.toml with admin address: {admin_hex}")
    with open("/workspace/my-initia-project/quadratic_market/Move.toml", "r") as f:
        content = f.read()
    content = re.sub(r'quadratic_market = ".*"', f'quadratic_market = "{admin_hex}"', content)
    with open("/workspace/my-initia-project/quadratic_market/Move.toml", "w") as f:
        f.write(content)

    # 0. Compile Contract
    print("Compiling Contract...")
    cmd = ["minitiad", "move", "build", "-p", "/workspace/my-initia-project/quadratic_market"]
    run_cmd(cmd)

    # 1. Publish Contract
    print("Publishing Contract...")
    cmd = [
        "minitiad", "tx", "move", "publish",
        "/workspace/my-initia-project/quadratic_market/build/quadratic_market/bytecode_modules/sportsbook.mv",
        "--from", "Validator",
        "--keyring-backend", "test",
        "--chain-id", "movegame-1", "--gas", "auto", "--gas-adjustment", "1.5", "--fees", "50000000umin",
        "--yes", "--output", "json"
    ]
    out = run_cmd(cmd)
    if out:
        print("Contract published!")
        time.sleep(4)
    
    # 2. Get Metadata Address of umin
    print("Getting umin metadata address...")
    cmd = [
        "minitiad", "q", "move", "view",
        "0x1", "coin", "metadata_address",
        "--args", json.dumps(["address:0x1", "string:umin"]),
        "--output", "json"
    ]
    out = run_cmd(cmd)
    metadata_addr = "0x1"
    if out:
        data = json.loads(out)
        metadata_val = data.get("data", ["0x1"])[0]
        metadata_addr = metadata_val.replace('"', '')
        print(f"Umin Metadata: {metadata_addr}")
    
    if metadata_addr == "0x" or not metadata_addr or metadata_addr == "0x1":
        print("Using fallback metadata address for umin")
        metadata_addr = "0x1"

    # 3. Init House Pool
    import bot
    priv_key = bot.load_or_generate_key()
    pub_key_bytes = bot.get_public_key_bytes(priv_key)
    pub_key_hex = pub_key_bytes.hex()
    
    print("Initializing House Pool...")
    tx_execute("init_house_pool", [
        f"address:{metadata_addr}",
        f"raw_hex:{pub_key_hex}",
        "u64:500000000000000" # max exposure 500M umin
    ], "Validator", admin_addr)

    print("Funding Alice and Bob...")
    for user in ["alice", "bob"]:
        # Find or create user
        cmd = ["minitiad", "keys", "show", user, "--keyring-backend", "test", "--output", "json"]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if "not found" in res.stderr or "not a valid name" in res.stderr:
            cmd = ["minitiad", "keys", "add", user, "--keyring-backend", "test", "--output", "json"]
            res = subprocess.run(cmd, capture_output=True, text=True)
            
        try:
            addr = json.loads(res.stdout)["address"]
        except:
            addr = json.loads(res.stderr)["address"]
        
        # Fund
        cmd = [
            "minitiad", "tx", "bank", "send",
            "Validator", addr, "10000000000umin",
            "--keyring-backend", "test",
            "--chain-id", "movegame-1",
            "--gas", "auto", "--gas-adjustment", "1.5", "--fees", "20000umin", "--yes", "--output", "json"
        ]
        out = run_cmd(cmd)
        if out:
            data = json.loads(out)
            print(f"Funded {user} ({addr}) - Code: {data.get('code')}")
            time.sleep(4)
    time.sleep(2)

    # 4. LP Adds Liquidity (Alice)
    print("Alice adds liquidity...")
    tx_execute("add_liquidity", ["u64:5000000000"], "alice", admin_addr) # 5k INIT

    # 5. Create Match
    print("Admin creates match...")
    start_time = int(time.time()) + 3600
    match_id = int(time.time()) % 1000000
    tx_execute("create_match", [
        f"u64:{match_id}",
        f"u64:{start_time}",
        "vector<u8>:1", # Market 1
        "vector<vector<u64>>:15000,30000,40000"
    ], "Validator", admin_addr)

    # 6. Update Odds
    print("Bot updates odds...")
    new_odds = [18000, 28000, 42000]
    payload = bot.serialize_update_odds_payload(match_id, 1, new_odds, False)
    sig = priv_key.sign(payload).hex()
    tx_execute("update_odds", [
        f"u64:{match_id}",
        "u8:1",
        "vector<u64>:18000,28000,42000",
        "bool:false",
        f"raw_hex:{sig}"
    ], "Validator", admin_addr)

    # 7. Place Bet (Bob)
    print("Bob places a bet on Home (1.80)...")
    bob_addr = json.loads(run_cmd(["minitiad", "keys", "show", "bob", "--keyring-backend", "test", "--output", "json"]))["address"]
    bob_bal_before = query_balance(bob_addr)
    tx_execute("place_bet", [
        f"vector<u64>:{match_id}",
        "vector<u8>:1",
        "vector<u8>:0", # Home
        "u64:1000000000" # 1000 INIT stake
    ], "bob", admin_addr)
    
    # 8. Settle Match
    print("Bot settles match (Home wins)...")
    payload = bot.serialize_batch_settle_payload(match_id, [1], [0])
    sig = priv_key.sign(payload).hex()
    tx_execute("batch_settle_match", [
        f"u64:{match_id}",
        "vector<u8>:1",
        "vector<u8>:0",
        f"raw_hex:{sig}"
    ], "Validator", admin_addr)

    # 9. Claim Payout (Bob)
    print("Bob claims payout...")
    tx_execute("claim_payout", ["u64:2"], "bob", admin_addr)

    bob_bal_after = query_balance(bob_addr)
    print(f"Bob balance before bet: {bob_bal_before}")
    print(f"Bob balance after claim: {bob_bal_after}")
    
    # 10. LP Requests Withdraw and Admin Processes
    print("Alice requests withdraw...")
    tx_execute("request_withdraw", ["u64:5000000000"], "alice", admin_addr) # all shares
    print("Admin processes withdrawal...")
    tx_execute("process_withdrawals", ["u64:10"], "Validator", admin_addr)

    print("End-to-End Test Complete!")

if __name__ == "__main__":
    main()
