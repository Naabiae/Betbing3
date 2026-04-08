import React from 'react';
import { useBetSlipStore } from '../store/useBetSlipStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Receipt, CheckCircle } from 'lucide-react';
import { formatOdds } from '../lib/mockData';

export default function BetSlip() {
  const { selections, stake, setStake, removeSelection, clear, isOpen, setIsOpen } = useBetSlipStore();

  if (selections.length === 0) return null;

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  const potentialPayout = stake * totalOdds;

  const handlePlaceBet = () => {
    // Integrate Initia TX here
    alert(`Placing bet: ${stake} INIT to win ${potentialPayout.toFixed(2)} INIT`);
    clear();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          className="fixed bottom-0 right-0 md:top-20 md:bottom-auto w-full md:w-96 bg-white dark:bg-zinc-900 border-t-4 md:border-l-4 md:border-t-0 border-black dark:border-white shadow-[-8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[-8px_0px_0px_rgba(255,255,255,1)] z-40"
          style={{ height: 'calc(100vh - 80px)' }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b-4 border-black dark:border-white bg-green-400 dark:bg-green-500">
              <div className="flex items-center space-x-2 text-black font-black uppercase tracking-tighter text-xl">
                <Receipt className="w-6 h-6" />
                <span>Bet Slip</span>
                <span className="bg-black text-white px-2 py-0.5 text-sm">{selections.length}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-black hover:bg-black hover:text-green-400 p-1 border-2 border-transparent hover:border-black transition-colors"
              >
                <X className="w-6 h-6" strokeWidth={3} />
              </button>
            </div>

            {/* Selections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950">
              {selections.map((s) => (
                <div key={`${s.match_id}-${s.outcome_id}`} className="bg-white dark:bg-zinc-900 p-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)] relative">
                  <button 
                    onClick={() => removeSelection(s.match_id)}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">
                    {s.matchName}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="font-black text-lg">{s.label}</div>
                    <div className="font-mono font-black text-xl text-green-500">{formatOdds(s.odds)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer / Actions */}
            <div className="p-4 border-t-4 border-black dark:border-white bg-white dark:bg-zinc-900 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-widest text-zinc-500">Total Odds</span>
                <span className="font-mono font-black text-2xl">{formatOdds(totalOdds)}</span>
              </div>
              
              <div className="space-y-2">
                <label className="font-bold uppercase tracking-widest text-sm text-zinc-500">Stake (INIT)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={stake}
                    onChange={(e) => setStake(Number(e.target.value))}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-white p-3 font-mono font-black text-xl focus:outline-none focus:ring-4 focus:ring-green-400 dark:focus:ring-green-500"
                    min="1"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400">INIT</div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold uppercase tracking-widest text-zinc-500">To Win</span>
                <span className="font-mono font-black text-3xl text-green-500 dark:text-green-400">
                  {formatOdds(potentialPayout)}
                </span>
              </div>

              <button 
                onClick={handlePlaceBet}
                className="w-full bg-black text-white dark:bg-white dark:text-black font-black uppercase tracking-widest py-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_rgba(0,255,102,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_rgba(0,255,102,1)] transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-6 h-6" />
                <span>Place Bet</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}