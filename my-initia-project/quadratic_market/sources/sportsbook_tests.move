#[test_only]
module quadratic_market::sportsbook_tests {
    use std::signer;
    use std::vector;
    use initia_std::coin;
    use initia_std::timestamp;
    use initia_std::ed25519;
    use std::bcs;
    use quadratic_market::sportsbook::{Self, BatchSettlePayload};

    struct FakeCoin {}

    #[test(admin = @quadratic_market, user = @0x123)]
    fun test_full_flow(admin: &signer, user: &signer) {
        timestamp::set_time_has_started_for_testing(admin);
        timestamp::update_global_time_for_test(10000000); // 10s

        // Generate oracle keys
        let (sk, pk) = ed25519::generate_keys();

        // Initialize fake coin for testing
        let (mint_cap, _, _) = coin::initialize(
            admin, 
            std::option::none(),
            std::string::utf8(b"Fake Coin"),
            std::string::utf8(b"FAKE"),
            6,
            std::string::utf8(b""),
            std::string::utf8(b""),
        );
        let coin_metadata = coin::metadata(signer::address_of(admin), std::string::utf8(b"FAKE"));

        let lp_amount = 1000000000; // 1000 FAKE
        let user_amount = 50000000; // 50 FAKE
        
        let lp_coins = coin::mint(&mint_cap, lp_amount);
        coin::deposit(signer::address_of(admin), lp_coins);

        let user_coins = coin::mint(&mint_cap, user_amount);
        coin::deposit(signer::address_of(user), user_coins);

        // Init house pool
        sportsbook::init_house_pool(admin, initia_std::object::convert(coin_metadata), pk, 500000000);

        // Add liquidity
        sportsbook::add_liquidity(admin, lp_amount);

        // Create match
        let market_ids = vector::empty<u8>();
        vector::push_back(&mut market_ids, 1);

        let initial_odds = vector::empty<vector<u64>>();
        let market1_odds = vector::empty<u64>();
        vector::push_back(&mut market1_odds, 15000); // Home 1.50
        vector::push_back(&mut market1_odds, 30000); // Draw 3.00
        vector::push_back(&mut market1_odds, 40000); // Away 4.00
        vector::push_back(&mut initial_odds, market1_odds);

        sportsbook::create_match(
            admin,
            101, // match_id
            20000000, // start time in future
            market_ids,
            initial_odds
        );

        // User places bet
        let bet_match_ids = vector::empty<u64>();
        vector::push_back(&mut bet_match_ids, 101);
        
        let bet_market_ids = vector::empty<u8>();
        vector::push_back(&mut bet_market_ids, 1);

        let bet_outcome_ids = vector::empty<u8>();
        vector::push_back(&mut bet_outcome_ids, 0); // Home (1.50)

        sportsbook::place_bet(
            user,
            bet_match_ids,
            bet_market_ids,
            bet_outcome_ids,
            10000000 // 10 FAKE stake
        );

        // Advance time past match start and end
        timestamp::update_global_time_for_test(30000000);

        // Settle match (Home won)
        let winning_outcomes = vector::empty<u8>();
        vector::push_back(&mut winning_outcomes, 0);

        let settle_payload = sportsbook::new_batch_settle_payload(
            101,
            market_ids,
            winning_outcomes
        );
        let settle_msg = bcs::to_bytes(&settle_payload);
        let settle_sig = ed25519::sign(settle_msg, sk);

        sportsbook::batch_settle_match(
            admin,
            101,
            market_ids,
            winning_outcomes,
            settle_sig
        );

        // User claims payout
        sportsbook::claim_payout(user, 1); // slip_id is 1

        // Check user balance (50 - 10 stake + 15 payout = 55 FAKE)
        assert!(coin::balance(signer::address_of(user), initia_std::object::convert(coin_metadata)) == 55000000, 1);

        // Test LP Withdrawal Request & Process
        sportsbook::request_withdraw(admin, lp_amount);
        sportsbook::process_withdrawals(admin, 1);
        // Admin gets back remainder after paying 5 FAKE profit from 1000 deposit => 995 FAKE
        assert!(coin::balance(signer::address_of(admin), initia_std::object::convert(coin_metadata)) == 995000000, 2);
    }
}
