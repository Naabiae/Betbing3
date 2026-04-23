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
Funding Alice, Bob, and Charlie...

Running: minitiad tx bank send Validator init1z7y6t0u4uh4au6ar4h5pz930vvnj95n0aqem8s 10000000000umin --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 20000umin --yes --output json
Funded alice (init1z7y6t0u4uh4au6ar4h5pz930vvnj95n0aqem8s) - Code: 0

Running: minitiad tx bank send Validator init1wgd33x8jkt87w7dfcsdcty3rgtx8fperwm7dxe 10000000000umin --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 20000umin --yes --output json
Funded bob (init1wgd33x8jkt87w7dfcsdcty3rgtx8fperwm7dxe) - Code: 0

Running: minitiad tx bank send Validator init1ps08mk48kvrp4sh5xy8g7spju96ldlu6d4qzta 10000000000umin --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 20000umin --yes --output json
Funded charlie (init1ps08mk48kvrp4sh5xy8g7spju96ldlu6d4qzta) - Code: 0
Alice adds liquidity...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook add_liquidity --args ["u64:5000000000"] --from alice --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: CAB684D50D018DC8065FDF9F75420C3A3240B1BA7A50DD81DE05028E902C87B9
Admin creates matches for Multibet...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook create_match --args ["u64:4837469", "u64:1776944376", "vector<u8>:1", "vector<u64>:15000,30000,40000"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 3BBAC5C920FF0E3CC22240F76CC10D5254B1D5CA4721E1A96A20CF084450BBC3

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook create_match --args ["u64:5189963", "u64:1776944376", "vector<u8>:1", "vector<u64>:20000,30000,40000"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: D866FFF24C39FEE1D2EF5B19C0B05CFF717F0778A9877F6EB575869E746BF4E9
Bot updates odds for M1 (Real Madrid vs Real Oviedo)...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook update_odds --args ["u64:4837469", "u8:1", "vector<u64>:15000,30000,40000", "bool:false", "raw_hex:aa8649bcbb4220eab6d4fb9c554d200c660c2135546fcfff3e265b2e45eed7a0dd720876fc8706c29f5e429a0c1b1ff3a9d5ce29c93d7c3b789d84890b2f0702"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: EF90680F817C2156261C99E0A56486ED877E1C99AE0936D0300877073558041B
Bot updates odds for M2 (Viking (W) vs Frigg (W))...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook update_odds --args ["u64:5189963", "u8:1", "vector<u64>:15000,30000,40000", "bool:false", "raw_hex:defe6ad252b473594c0108c4799c38ffa137366f570f2554cc65fafc9d912ba315f151a2ef642924f5872596e40c85ef086d93cdbf0756025253d94ca1373f06"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 5900256732B7F4BF2FC0797562CCDBFD7F3397587DFD987CEF3ACB72582ABB0A
Bob places a Multibet (Parlay) on M1 (Home) & M2 (Home)...

Running: minitiad keys show bob --keyring-backend test --output json

Running: minitiad keys show charlie --keyring-backend test --output json

Running: minitiad q bank balances init1wgd33x8jkt87w7dfcsdcty3rgtx8fperwm7dxe --output json

Running: minitiad q bank balances init1ps08mk48kvrp4sh5xy8g7spju96ldlu6d4qzta --output json

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook place_bet --args ["vector<u64>:4837469,5189963", "vector<u8>:1,1", "vector<u8>:0,0", "u64:100000000"] --from bob --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: FED8D581EA6B221FD2EE38938F37CBAB2C24B0721ECE80FF16B0AA987F41E526
Charlie places a Multibet on M1 (Home) & M2 (Away)...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook place_bet --args ["vector<u64>:4837469,5189963", "vector<u8>:1,1", "vector<u8>:0,2", "u64:100000000"] --from charlie --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 656ADD91521A51A42196C3DC3EF21095099AA775C6523C5DEF3602328E5DC087
Bot settles M1 (Winner ID: 0)...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook batch_settle_match --args ["u64:4837469", "vector<u8>:1", "vector<u8>:0", "raw_hex:c3f26136ed59f0dad733914e28c0fd1c4e09be686c35346fb8ec0faf5503cfa947b328222bd9cbc6b312de3764d012581af362f29245d1752a62d09a53117709"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 88F240F90D1DDDDCEDE3D9D8D3D1EC00FF5D6A35D196503ED2C8DE93FE98FA61
Bot settles M2 (Winner ID: 0)...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook batch_settle_match --args ["u64:5189963", "vector<u8>:1", "vector<u8>:0", "raw_hex:09afea7827014650ff3116dffeb674c6c17b82186c584f1bf19122670c2d644e06bdd6011d2dca2e505f2b2aaf46f3123ad7801d9f4ff29b560861ca4565df03"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: BB99EC648885E1CDDEA8191AA94F877F2F28290000128E1E20FBB92930DE7A0A
Bob attempts to claim payout...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook claim_payout --args ["u64:1"] --from bob --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 862B1F6F5756D425AAD3B1F6C81E02AE3A23F0302FF7FC13647500D08E42E6D9
Charlie attempts to claim payout...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook claim_payout --args ["u64:2"] --from charlie --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: 3499386EBA27E8188C5BC4B4BF7B7C9851D5D6C7B3342994494302FEF9B05D81

Running: minitiad q bank balances init1wgd33x8jkt87w7dfcsdcty3rgtx8fperwm7dxe --output json

Running: minitiad q bank balances init1ps08mk48kvrp4sh5xy8g7spju96ldlu6d4qzta --output json
Bob balance before bet: 10000000000
Bob balance after claim: 10121000000
Charlie balance before bet: 10000000000
Charlie balance after claim: 9896000000
Alice requests withdraw...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook request_withdraw --args ["u64:4999999000"] --from alice --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: F9C8FE892A52A7FA65B479DE0BDEFC72921BD334F8C72C96735B83D3FA6F359A
Admin processes withdrawal...

Running: minitiad tx move execute init1ftp77lgq0jh0u39w9605l54q2asjkgrdcdy8hg sportsbook process_withdrawals --args ["u64:10"] --from Validator --keyring-backend test --chain-id movegame-1 --gas auto --gas-adjustment 1.5 --fees 2000000umin --yes --output json
Tx Hash: D89541B7C94C701BEA688D16AB3C6E88D209C6924D090350B3C339925C7BA48D
End-to-End Test Complete!
