import React from 'react';
import { useBetSlipStore } from '../store/useBetSlipStore';
import { MOCK_MATCHES, formatOdds } from '../lib/mockData';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Check, ShieldAlert } from 'lucide-react';
import BetSlip from '../components/BetSlip';

export default function Home() {
  const { addSelection, selections } = useBetSlipStore();

  const handleOddsClick = (match: any, marketId: number, outcomeId: number, label: string, odds: number) => {
    addSelection({
      match_id: match.id,
      market_id: marketId,
      outcome_id: outcomeId,
      odds,
      label,
      matchName: `${match.homeTeam} vs ${match.awayTeam}`
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] pb-32">
      {/* Hero Section */}
      <div className="bg-black dark:bg-white text-white dark:text-black p-8 md:p-12 mb-12 shadow-[8px_8px_0px_rgba(0,255,102,1)] border-4 border-black dark:border-white">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
          Prediction <br />
          <span className="text-green-400 dark:text-green-600">Market</span>
        </h1>
        <p className="text-xl font-bold max-w-2xl mb-8 text-zinc-300 dark:text-zinc-700">
          Decentralized. Transparent. Non-custodial. Bet on your favorite teams with cryptographically verified oracle data on Initia.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-zinc-900 dark:bg-zinc-100 p-6 border-2 border-zinc-800 dark:border-zinc-300">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="text-green-400" />
              <span className="font-bold uppercase text-sm tracking-widest text-zinc-400 dark:text-zinc-600">House Pool TVL</span>
            </div>
            <div className="text-3xl font-mono font-bold">$125,000</div>
          </div>
          <div className="bg-zinc-900 dark:bg-zinc-100 p-6 border-2 border-zinc-800 dark:border-zinc-300">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="text-blue-400" />
              <span className="font-bold uppercase text-sm tracking-widest text-zinc-400 dark:text-zinc-600">Active Bets</span>
            </div>
            <div className="text-3xl font-mono font-bold">1,432</div>
          </div>
          <div className="bg-zinc-900 dark:bg-zinc-100 p-6 border-2 border-zinc-800 dark:border-zinc-300">
            <div className="flex items-center space-x-3 mb-2">
              <ShieldAlert className="text-yellow-400" />
              <span className="font-bold uppercase text-sm tracking-widest text-zinc-400 dark:text-zinc-600">Oracle Status</span>
            </div>
            <div className="text-3xl font-mono font-bold text-green-400 dark:text-green-600 flex items-center">
              SECURE <Check className="ml-2 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black dark:border-white inline-block pb-2">
          Live & Upcoming Matches
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_MATCHES.map((match) => (
          <motion.div 
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(0,255,102,0.3)] transition-all hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                {new Date(match.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-xs font-black tracking-widest uppercase">
                {match.status}
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="text-2xl font-black tracking-tight w-2/5 text-right truncate">
                {match.homeTeam}
              </div>
              <div className="text-zinc-400 font-black px-4">VS</div>
              <div className="text-2xl font-black tracking-tight w-2/5 text-left truncate">
                {match.awayTeam}
              </div>
            </div>

            {/* Markets Container */}
            <div className="space-y-6">
              {match.markets.map((market) => (
                <div key={market.id}>
                  <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">
                    {market.name}
                  </div>
                  <div className={`grid gap-4 ${market.outcomes.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {market.outcomes.map((outcome) => (
                      <OddsButton 
                        key={outcome.id}
                        match={match}
                        marketId={market.id}
                        outcomeId={outcome.id} 
                        label={outcome.label} 
                        odds={outcome.odds} 
                        onClick={handleOddsClick}
                        isSelected={selections.some(s => s.match_id === match.id && s.market_id === market.id && s.outcome_id === outcome.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <BetSlip />
    </div>
  );
}

function OddsButton({ match, marketId, outcomeId, label, odds, onClick, isSelected }: any) {
  return (
    <button
      onClick={() => onClick(match, marketId, outcomeId, label, odds)}
      className={`
        flex flex-col items-center py-3 px-2 border-2 transition-all
        ${isSelected 
          ? 'border-black bg-green-400 text-black dark:border-white dark:bg-green-500 shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)] translate-x-[-2px] translate-y-[-2px]' 
          : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 hover:border-black hover:bg-zinc-200 dark:hover:border-white dark:hover:bg-zinc-800'
        }
      `}
    >
      <span className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">{label}</span>
      <span className="text-xl font-mono font-black">{formatOdds(odds)}</span>
    </button>
  );
}