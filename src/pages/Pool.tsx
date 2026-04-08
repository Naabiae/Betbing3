import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowDownUp, AlertTriangle } from 'lucide-react';

export default function Pool() {
  const [amount, setAmount] = useState<string>('');

  const handleDeposit = () => {
    alert(`Depositing ${amount} INIT to House Pool`);
    setAmount('');
  };

  const handleWithdraw = () => {
    alert(`Requesting withdrawal of ${amount} INIT from House Pool`);
    setAmount('');
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
          <h3 className="text-2xl font-black uppercase tracking-widest mb-2">Be the House</h3>
          <p className="text-zinc-400 dark:text-zinc-600 font-bold max-w-lg mb-8">
            Provide liquidity to counterparty bets. Earn a share of the protocol fees and net losses from bettors. 
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Value Locked</div>
              <div className="text-3xl font-mono font-black text-green-400 dark:text-green-600">125,000 INIT</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Current APY</div>
              <div className="text-3xl font-mono font-black text-blue-400 dark:text-blue-600">14.2%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deposit Card */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(255,255,255,1)]">
          <h4 className="text-xl font-black uppercase tracking-widest mb-6 border-b-2 border-zinc-200 dark:border-zinc-800 pb-2">
            Deposit Liquidity
          </h4>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm font-bold text-zinc-500">
              <span>Balance</span>
              <span className="font-mono text-black dark:text-white">1,000.00 INIT</span>
            </div>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-white p-4 font-mono font-black text-2xl focus:outline-none focus:ring-4 focus:ring-green-400"
              />
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black uppercase bg-black text-white dark:bg-white dark:text-black px-2 py-1"
                onClick={() => setAmount('1000')}
              >
                MAX
              </button>
            </div>
          </div>

          <button 
            onClick={handleDeposit}
            disabled={!amount || Number(amount) <= 0}
            className="w-full bg-green-400 text-black font-black uppercase tracking-widest py-4 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deposit INIT
          </button>
        </div>

        {/* Withdraw Card */}
        <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(255,255,255,1)]">
          <h4 className="text-xl font-black uppercase tracking-widest mb-6 border-b-2 border-zinc-200 dark:border-zinc-800 pb-2 flex items-center justify-between">
            <span>Withdraw</span>
            <ArrowDownUp className="w-5 h-5 text-zinc-400" />
          </h4>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 p-4 mb-6 flex items-start space-x-3">
            <AlertTriangle className="text-yellow-500 shrink-0 w-5 h-5 mt-0.5" />
            <p className="text-sm font-bold text-yellow-700 dark:text-yellow-500">
              Withdrawals are queued and processed based on available, unallocated liquidity.
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm font-bold text-zinc-500">
              <span>Your LP Shares</span>
              <span className="font-mono text-black dark:text-white">0.00 hINIT</span>
            </div>
            <div className="relative">
              <input 
                type="number" 
                placeholder="0.00"
                disabled
                className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 p-4 font-mono font-black text-2xl focus:outline-none opacity-50 cursor-not-allowed text-zinc-400"
              />
            </div>
          </div>

          <button 
            disabled
            className="w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-black uppercase tracking-widest py-4 border-4 border-zinc-300 dark:border-zinc-700 cursor-not-allowed transition-all"
          >
            Request Withdrawal
          </button>
        </div>
      </div>
    </div>
  );
}