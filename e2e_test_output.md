# End-to-End Test Output

```
Getting admin (Validator) address...

Running: minitiad keys show Validator --keyring-backend test --output json
Admin Bech32: init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg
Admin Hex: 0x4AC3EF7D007CAEFE44AE2E9F4FD2A057612B206D
Updating Move.toml with admin address: 0x4AC3EF7D007CAEFE44AE2E9F4FD2A057612B206D
Compiling Contract...

Running: minitiad move build -p /workspace/my-initia-project/quadratic_market
Publishing Contract...

Running: minitiad tx move publish /workspace/my-initia-project/quadratic_market/build/quadratic_market/bytecode_modules/sportsbook.mv --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 50000000umin --yes --output json
Contract published!
Getting umin metadata address...

Running: minitiad q move view 0x1 coin metadata_address --args ["address:0x1", "string:umin"] --output json
Umin Metadata: 0x25c4855dbee8a475c72526cc888c20562befd9cac8ceb78367ed490e1b0dab3
Initializing House Pool...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook init_house_pool --args ["address:0x25c4855dbee8a475c72526cc888c20562befd9cac8ceb78367ed490e1b0dab3", "raw_hex:edc8af2863b6aaa48c31b3405b15f2f044acedbf32c89e01fb62ec4e4efd59a7", "u64:500000000000000"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 5967EC52C6EF0F0463F7192120315E3139D0BE3199BED510DC2F094C0BA61A5F
Funding Alice and Bob...

Running: minitiad tx bank send Validator init1klqzak25p67ur2trgacc3m8fnnc2daphyaep7g 10000000000umin --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 20000umin --yes --output json
Funded alice (init1klqzak25p67ur2trgacc3m8fnnc2daphyaep7g) - Code: 0

Running: minitiad tx bank send Validator init1rj7u3wdjd8s2el3t0xfdj0c2y7zptcvrwgvruy 10000000000umin --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 20000umin --yes --output json
Funded bob (init1rj7u3wdjd8s2el3t0xfdj0c2y7zptcvrwgvruy) - Code: 0
Alice adds liquidity...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook add_liquidity --args ["u64:5000000000"] --from alice --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: FEBC41946800DE96BD9157428506A2EF95C9D8662D8DA6D6E3695EEE0E7474F0
Admin creates match...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook create_match --args ["u64:4837469", "u64:1776943174", "vector<u8>:1", "vector<u64>:15000,30000,40000"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: A9C27B646DD8103ADD7C8333EA352780C5941D3EA1C19F878F476F733068B02D
Bot updates odds for Real Madrid vs Real Oviedo...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook update_odds --args ["u64:4837469", "u8:1", "vector<u64>:15000,30000,40000", "bool:false", "raw_hex:aa8649bcbb4220eab6d4fb9c554d200c660c2135546fcfff3e265b2e45eed7a0dd720876fc8706c29f5e429a0c1b1ff3a9d5ce29c93d7c3b789d84890b2f0702"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 91DFABBE8306315840258A7862648BF07815E9200A72C42CF93E8D2204739C79
Bob places a bet on Home (1.50)...

Running: minitiad keys show bob --keyring-backend test --output json

Running: minitiad q bank balances init1rj7u3wdjd8s2el3t0xfdj0c2y7zptcvrwgvruy --output json

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook place_bet --args ["vector<u64>:4837469", "vector<u8>:1", "vector<u8>:0", "u64:1000000000"] --from bob --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 7F45C0FAD7CBD5522F00FD92D6423ADD9B345973E1277065A1E95FEE96CFCD26
Bot settles match (Winner ID: 0)...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook batch_settle_match --args ["u64:4837469", "vector<u8>:1", "vector<u8>:0", "raw_hex:c3f26136ed59f0dad733914e28c0fd1c4e09be686c35346fb8ec0faf5503cfa947b328222bd9cbc6b312de3764d012581af362f29245d1752a62d09a53117709"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 2A4CBD64F4E895D0F70D3DE1FFC12E2B6B2C4C8E630BADA58E20C6B082782798
Bob claims payout...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook claim_payout --args ["u64:1"] --from bob --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: FECA44E3112372B3F08509F7B37605BE42FF331569B954520D1B8FF5569EDAE4

Running: minitiad q bank balances init1rj7u3wdjd8s2el3t0xfdj0c2y7zptcvrwgvruy --output json
Bob balance before bet: 10000000000
Bob balance after claim: 10496000000
Alice requests withdraw...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook request_withdraw --args ["u64:4999999000"] --from alice --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 5ACB41EE13EBC152FB4BD06CB2E123DCF3EA52C8E1C17E700E08D9D3737CCB94
Admin processes withdrawal...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook process_withdrawals --args ["u64:10"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 42374210A76655A2CB85C104068CC52846B438D34B3BB1263020BA41BA7ABB12
End-to-End Test Complete!
```