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
        metadata_val = data.get("data", "\"0x1\"")
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

    print("Funding Alice, Bob, and Charlie...")
    for user in ["alice", "bob", "charlie"]:
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

    # 5. Create Matches
    print("Admin creates matches for Multibet...")
    matches_data = bot.fetch_football_data()
    matches = matches_data.get("matches", [])[:2] # Get 2 matches
    
    match1 = matches[0]
    match2 = matches[1]
    
    match1_id = match1['id']
    match2_id = match2['id']
    
    start_time = int(time.time()) + 3600
    
    tx_execute("create_match", [
        f"u64:{match1_id}",
        f"u64:{start_time}",
        "vector<u8>:1",
        "vector<u64>:15000,30000,40000"
    ], "Validator", admin_addr)
    
    tx_execute("create_match", [
        f"u64:{match2_id}",
        f"u64:{start_time}",
        "vector<u8>:1",
        "vector<u64>:20000,30000,40000"
    ], "Validator", admin_addr)

    # 6. Update Odds
    print(f"Bot updates odds for M1 ({match1['homeTeam']['name']} vs {match1['awayTeam']['name']})...")
    odds1 = bot.compute_odds(match1)
    payload1 = bot.serialize_update_odds_payload(match1_id, 1, odds1, False)
    sig1 = priv_key.sign(payload1).hex()
    tx_execute("update_odds", [
        f"u64:{match1_id}",
        "u8:1",
        f"vector<u64>:{odds1[0]},{odds1[1]},{odds1[2]}",
        "bool:false",
        f"raw_hex:{sig1}"
    ], "Validator", admin_addr)
    
    print(f"Bot updates odds for M2 ({match2['homeTeam']['name']} vs {match2['awayTeam']['name']})...")
    odds2 = bot.compute_odds(match2)
    payload2 = bot.serialize_update_odds_payload(match2_id, 1, odds2, False)
    sig2 = priv_key.sign(payload2).hex()
    tx_execute("update_odds", [
        f"u64:{match2_id}",
        "u8:1",
        f"vector<u64>:{odds2[0]},{odds2[1]},{odds2[2]}",
        "bool:false",
        f"raw_hex:{sig2}"
    ], "Validator", admin_addr)

    # 7. Place Multibets (Bob & Charlie)
    print("Bob places a Multibet (Parlay) on M1 (Home) & M2 (Home)...")
    bob_addr = json.loads(run_cmd(["minitiad", "keys", "show", "bob", "--keyring-backend", "test", "--output", "json"]))["address"]
    charlie_addr = json.loads(run_cmd(["minitiad", "keys", "show", "charlie", "--keyring-backend", "test", "--output", "json"]))["address"]
    
    bob_bal_before = query_balance(bob_addr)
    charlie_bal_before = query_balance(charlie_addr)
    
    # Bob bets M1 Home, M2 Home
    tx_execute("place_bet", [
        f"vector<u64>:{match1_id},{match2_id}",
        "vector<u8>:1,1",
        "vector<u8>:0,0", # Home, Home
        "u64:100000000" # 100 INIT stake
    ], "bob", admin_addr)
    
    # Charlie bets M1 Home, M2 Away
    print("Charlie places a Multibet on M1 (Home) & M2 (Away)...")
    tx_execute("place_bet", [
        f"vector<u64>:{match1_id},{match2_id}",
        "vector<u8>:1,1",
        "vector<u8>:0,2", # Home, Away
        "u64:100000000" # 100 INIT stake
    ], "charlie", admin_addr)
    
    # 8. Settle Matches
    winner1_id = bot.compute_winner(match1) if match1.get('status') == 'FINISHED' else 0
    winner2_id = bot.compute_winner(match2) if match2.get('status') == 'FINISHED' else 0
    
    print(f"Bot settles M1 (Winner ID: {winner1_id})...")
    payload_settle1 = bot.serialize_batch_settle_payload(match1_id, [1], [winner1_id])
    sig_settle1 = priv_key.sign(payload_settle1).hex()
    tx_execute("batch_settle_match", [
        f"u64:{match1_id}",
        "vector<u8>:1",
        f"vector<u8>:{winner1_id}",
        f"raw_hex:{sig_settle1}"
    ], "Validator", admin_addr)
    
    print(f"Bot settles M2 (Winner ID: {winner2_id})...")
    payload_settle2 = bot.serialize_batch_settle_payload(match2_id, [1], [winner2_id])
    sig_settle2 = priv_key.sign(payload_settle2).hex()
    tx_execute("batch_settle_match", [
        f"u64:{match2_id}",
        "vector<u8>:1",
        f"vector<u8>:{winner2_id}",
        f"raw_hex:{sig_settle2}"
    ], "Validator", admin_addr)

    # 9. Claim Payouts
    print("Bob attempts to claim payout...")
    # Since next_slip_id starts at 1, Bob's slip is 1, Charlie's is 2
    tx_execute("claim_payout", ["u64:1"], "bob", admin_addr)
    
    print("Charlie attempts to claim payout...")
    tx_execute("claim_payout", ["u64:2"], "charlie", admin_addr)

    bob_bal_after = query_balance(bob_addr)
    charlie_bal_after = query_balance(charlie_addr)
    print(f"Bob balance before bet: {bob_bal_before}")
    print(f"Bob balance after claim: {bob_bal_after}")
    print(f"Charlie balance before bet: {charlie_bal_before}")
    print(f"Charlie balance after claim: {charlie_bal_after}")
    
    # 10. LP Requests Withdraw and Admin Processes
    print("Alice requests withdraw...")
    tx_execute("request_withdraw", ["u64:4999999000"], "alice", admin_addr) # all shares minus 1000 minimum liquidity
    print("Admin processes withdrawal...")
    tx_execute("process_withdrawals", ["u64:10"], "Validator", admin_addr)

    print("End-to-End Test Complete!")

if __name__ == "__main__":
    main()
