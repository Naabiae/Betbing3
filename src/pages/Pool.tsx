import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowDownUp, AlertTriangle, Loader2 } from 'lucide-react';
import { useSportsbook } from '../hooks/useSportsbook';
import { useInterwovenKit } from '@initia/interwovenkit-react';

export default function Pool() {
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  
  const { initiaAddress } = useInterwovenKit();
  const { 
    addLiquidity, 
    isAddingLiquidity, 
    requestWithdraw, 
    isRequestingWithdraw 
  } = useSportsbook();

  const handleDeposit = async () => {
    if (!initiaAddress) {
      alert("Please connect your wallet first.");
      return;
    }
    
    try {
      const txHash = await addLiquidity(Number(depositAmount));
      alert(`Deposited successfully! Tx Hash: ${txHash}`);
      setDepositAmount('');
    } catch (error: any) {
      console.error("Deposit failed:", error);
      alert(`Failed to deposit: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleWithdraw = async () => {
    if (!initiaAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const txHash = await requestWithdraw(Number(withdrawAmount));
      alert(`Withdrawal requested successfully! Tx Hash: ${txHash}`);
      setWithdrawAmount('');
    } catch (error: any) {
      console.error("Withdrawal request failed:", error);
      alert(`Failed to request withdrawal: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen pb-32 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-8 border-black dark:border-white inline-block pb-2">
          House Pool
        </h2>
      </div>

      <div className="bg-black text-white dark:bg-white dark:text-black p-8 mb-12 shadow-[8px_8px_0px_rgba(0,255,102,1)] border-4 border-black dark:border-white relative overflow-hidden">
        <Layers className="absolute -right-8 -bottom-8 w-64 h-64 opacity-10 text-green-400" />
        <div className="relative z-10">
          <h3 className="text-3xl font-black uppercase tracking-widest mb-2 text-green-400 dark:text-green-600">Bet on the House</h3>
          <p className="text-zinc-400 dark:text-zinc-600 font-bold max-w-2xl mb-8 text-lg">
            This is the ultimate prediction market. You are betting that the collective wisdom of the crowd is wrong.
            When bettors lose, their stakes flow directly into this pool. When they win, this pool pays them out.
            <span className="block mt-2 text-white dark:text-black">Are you ready to be the counterparty to every bet on the protocol?</span>
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            <div className="bg-zinc-900 dark:bg-zinc-100 p-4 border-2 border-zinc-800 dark:border-zinc-300">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">House Pool TVL</div>
              <div className="text-2xl font-mono font-black text-white dark:text-black">125,000 INIT</div>
            </div>
            <div className="bg-zinc-900 dark:bg-zinc-100 p-4 border-2 border-zinc-800 dark:border-zinc-300">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">House Edge (APY)</div>
              <div className="text-2xl font-mono font-black text-green-400 dark:text-green-600">14.2%</div>
            </div>
            <div className="bg-zinc-900 dark:bg-zinc-100 p-4 border-2 border-zinc-800 dark:border-zinc-300">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Net Bettor Losses</div>
              <div className="text-2xl font-mono font-black text-blue-400 dark:text-blue-600">+12,450 INIT</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deposit Card */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(255,255,255,1)] flex flex-col justify-between">
          <div>
            <h4 className="text-2xl font-black uppercase tracking-widest mb-2">
              Back the House
            </h4>
            <p className="text-sm font-bold text-zinc-500 mb-6 border-b-2 border-zinc-200 dark:border-zinc-800 pb-4">
              Deposit INIT to mint <span className="text-green-500 font-black">hINIT</span> (House Shares). As bettors lose, the value of your shares increases.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold text-zinc-500">
                <span>Wallet Balance</span>
                <span className="font-mono text-black dark:text-white">1,000.00 INIT</span>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-white p-4 font-mono font-black text-2xl focus:outline-none focus:ring-4 focus:ring-green-400"
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black uppercase bg-black text-white dark:bg-white dark:text-black px-2 py-1 hover:bg-green-400 hover:text-black transition-colors"
                  onClick={() => setDepositAmount('1000')}
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleDeposit}
            disabled={!depositAmount || Number(depositAmount) <= 0 || isAddingLiquidity}
            className="w-full flex justify-center items-center space-x-2 bg-green-400 text-black font-black uppercase tracking-widest py-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingLiquidity && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Take the Bet (Deposit)</span>
          </button>
        </div>

        {/* Withdraw Card */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(255,255,255,1)] flex flex-col justify-between">
          <div>
            <h4 className="text-2xl font-black uppercase tracking-widest mb-2 flex items-center justify-between">
              <span>Cash Out</span>
              <ArrowDownUp className="w-6 h-6 text-zinc-400" />
            </h4>
            <p className="text-sm font-bold text-zinc-500 mb-6 border-b-2 border-zinc-200 dark:border-zinc-800 pb-4">
              Burn your <span className="text-yellow-500 font-black">hINIT</span> shares to claim your principal plus any accrued bettor losses.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 p-4 mb-6 flex items-start space-x-3">
              <AlertTriangle className="text-yellow-500 shrink-0 w-5 h-5 mt-0.5" />
              <p className="text-sm font-bold text-yellow-700 dark:text-yellow-500 leading-tight">
                Withdrawals are queued. You cannot withdraw funds that are currently locked in active bets.
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold text-zinc-500">
                <span>Your House Shares</span>
                <span className="font-mono text-black dark:text-white">1000.00 hINIT</span>
              </div>
              <div className="relative">
                <input 
                  type="number" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-white p-4 font-mono font-black text-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400"
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black uppercase bg-black text-white dark:bg-white dark:text-black px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors"
                  onClick={() => setWithdrawAmount('1000')}
                >
                  MAX
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleWithdraw}
            disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || isRequestingWithdraw}
            className="w-full flex justify-center items-center space-x-2 bg-yellow-400 text-black font-black uppercase tracking-widest py-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRequestingWithdraw && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>Claim Profits (Withdraw)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
