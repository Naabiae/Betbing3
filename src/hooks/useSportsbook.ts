import { useWallet, useAddress } from '@initia/react-wallet-widget';
import { MsgExecuteJSON, LCDClient } from '@initia/initia.js';
import { useMutation } from '@tanstack/react-query';

export const ADMIN_ADDRESS = "init1gf5kplcufd4w258pu87ncw3xxg4lundeclvhgd";
export const MODULE_NAME = "sportsbook";

// Note: For local testing, ensure your wallet is connected to the local network (movegame-1)
export const lcdUrl = 'http://localhost:1317'; // Adjust if your local node uses a different REST port

export const useSportsbook = () => {
  const { requestTx } = useWallet();
  const address = useAddress();

  const placeBetMutation = useMutation({
    mutationFn: async ({
      matchIds,
      marketIds,
      outcomeIds,
      stakeAmount
    }: {
      matchIds: number[];
      marketIds: number[];
      outcomeIds: number[];
      stakeAmount: number;
    }) => {
      if (!address) throw new Error("Wallet not connected");

      // umin is 6 decimals, so multiply stake by 1,000,000
      const stakeInUmin = (stakeAmount * 1_000_000).toString();

      const msg = new MsgExecuteJSON(
        address,
        ADMIN_ADDRESS, // Contract is deployed to the admin's address
        MODULE_NAME,
        "place_bet",
        [], // No type args
        [
          JSON.stringify(matchIds.map(String)), // vector<u64>
          JSON.stringify(marketIds), // vector<u8>
          JSON.stringify(outcomeIds), // vector<u8>
          JSON.stringify(stakeInUmin) // u64
        ]
      );

      const txHash = await requestTx({
        msgs: [msg],
        memo: "Place Bet via InitBet"
      });

      return txHash;
    }
  });

  const claimPayoutMutation = useMutation({
    mutationFn: async (slipId: number) => {
      if (!address) throw new Error("Wallet not connected");

      const msg = new MsgExecuteJSON(
        address,
        ADMIN_ADDRESS,
        MODULE_NAME,
        "claim_payout",
        [],
        [
          JSON.stringify(slipId.toString()) // u64
        ]
      );

      const txHash = await requestTx({
        msgs: [msg],
        memo: "Claim Payout via InitBet"
      });

      return txHash;
    }
  });

  const addLiquidityMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!address) throw new Error("Wallet not connected");

      const amountInUmin = (amount * 1_000_000).toString();

      const msg = new MsgExecuteJSON(
        address,
        ADMIN_ADDRESS,
        MODULE_NAME,
        "add_liquidity",
        [],
        [
          JSON.stringify(amountInUmin) // u64
        ]
      );

      const txHash = await requestTx({
        msgs: [msg],
        memo: "Add Liquidity to House Pool"
      });

      return txHash;
    }
  });

  const requestWithdrawMutation = useMutation({
    mutationFn: async (shares: number) => {
      if (!address) throw new Error("Wallet not connected");

      const sharesInUmin = (shares * 1_000_000).toString();

      const msg = new MsgExecuteJSON(
        address,
        ADMIN_ADDRESS,
        MODULE_NAME,
        "request_withdraw",
        [],
        [
          JSON.stringify(sharesInUmin) // u64
        ]
      );

      const txHash = await requestTx({
        msgs: [msg],
        memo: "Request Withdraw from House Pool"
      });

      return txHash;
    }
  });

  return {
    placeBet: placeBetMutation.mutateAsync,
    isPlacingBet: placeBetMutation.isPending,
    claimPayout: claimPayoutMutation.mutateAsync,
    isClaiming: claimPayoutMutation.isPending,
    addLiquidity: addLiquidityMutation.mutateAsync,
    isAddingLiquidity: addLiquidityMutation.isPending,
    requestWithdraw: requestWithdrawMutation.mutateAsync,
    isRequestingWithdraw: requestWithdrawMutation.isPending,
  };
};