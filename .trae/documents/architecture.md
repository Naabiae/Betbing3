## 1. Architecture Design

```mermaid
graph TD
    A[User Wallet (InterwovenKit)] --> B[Frontend (Next.js / React)]
    B --> C[Initia Node / RPC]
    C --> D[Move Smart Contract (Sportsbook)]
    B --> E[Real API (Optional / Display Data)]
```

## 2. Technology Description
- **Frontend**: React 18 + Next.js (App Router) + Tailwind CSS v3 + Framer Motion
- **Web3 Integration**: `@initia/interwovenkit` for wallet connection + `initia.js` for transaction construction and state querying
- **State Management**: React Query (for fetching match data and user balances) + Zustand (optional, for complex UI state like the Bet Slip)
- **UI Components**: `lucide-react` for icons, raw Tailwind for custom brutalist components

## 3. Route Definitions
| Route | Purpose |
|-------|---------|
| `/` | Home page displaying live/upcoming matches and odds |
| `/portfolio` | User's active and settled bets (claims) |
| `/pool` | Liquidity Provider interface for the House Pool |

## 4. API Definitions (Smart Contract Interaction)
The frontend will primarily communicate directly with the Initia node via RPC/REST.

**Key Queries (via `initia.js`):**
- `minitiad q move view`: Query `HousePool` state, `SportsbookState` (matches and markets), and `BettingState` (user slips).
- `minitiad q bank balances`: Fetch user's `umin` balance for betting and LPing.

**Key Transactions (via InterwovenKit):**
- `place_bet(match_ids, market_ids, outcome_ids, stake_amount)`
- `claim_payout(slip_id)`
- `add_liquidity(amount)`
- `request_withdraw(shares)`

## 5. State Management (Bet Slip)
The Bet Slip state will be managed locally in React:
```typescript
interface Selection {
  match_id: number;
  market_id: number;
  outcome_id: number;
  odds: number;
  label: string; // "Home", "Draw", "Away"
  matchName: string; // "Arsenal vs Chelsea"
}

interface BetSlipState {
  selections: Selection[];
  stake: number;
  addSelection: (s: Selection) => void;
  removeSelection: (match_id: number) => void;
  setStake: (amt: number) => void;
  clear: () => void;
}
```

## 6. Initialization Tool
- `npx create-next-app@latest frontend --typescript --tailwind --eslint --app`
- Install dependencies: `npm install @initia/interwovenkit @initia/initia.js framer-motion lucide-react @tanstack/react-query`