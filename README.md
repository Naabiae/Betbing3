# InitBet

An onchain sportsbook / prediction market built as a Move appchain on Initia. Users place 1X2 bets (Home/Draw/Away) against a shared House Pool, and LPs can provide liquidity to become the counterparty to every bet.

## Initia Hackathon Submission

- **Project Name**: InitBet

### Project Overview

InitBet is a trust-minimized sportsbook where match odds updates and match settlement are verified on-chain via Ed25519 signatures. It’s designed as a local Initia rollup demo (Move VM) with a React frontend that supports wallet connection, transactions, and native Initia UX.

### Implementation Detail

- **The Custom Implementation**: A Move sportsbook contract with a House Pool (LP shares), signed odds updates, and signed batch settlement, plus a frontend that builds and submits Move `execute` messages for betting + LP flows.
- **The Native Feature**: InterwovenKit integration with AutoSign (session-based signing), plus Bridge and `.init` username support surfaced via the InterwovenKit wallet UI.

### How to Run Locally

1. Start your local Initia rollup (Move VM) using the provided script:
   - `bash start_node.sh`
   - RPC: `http://localhost:26657`
   - LCD: `http://localhost:1317`
   - Chain ID: `movegame-1`
2. Deploy and seed the sportsbook module on your local chain. This script builds the Move contract, publishes it, adds liquidity, fetches live matches using RapidAPI, creates the match on-chain, places a bet, and simulates settlement:
   - `python my-initia-project/e2e_test.py`
3. Install frontend dependencies and start the app:
   - `pnpm install`
   - `pnpm dev`
4. Open the app, connect a wallet via InterwovenKit, enable AutoSign, then place a bet and/or provide liquidity.

## Code Pointers

- Core Move logic: [sportsbook.move](file:///workspace/my-initia-project/quadratic_market/sources/sportsbook.move)
- Frontend wallet + native feature entry points: [App.tsx](file:///workspace/src/App.tsx) and [Providers.tsx](file:///workspace/src/Providers.tsx)
