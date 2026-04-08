import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatOdds } from '../lib/mockData';

const MOCK_BETS = [
  {
    id: 1,
    matchName: 'Arsenal vs Chelsea',
    selection: 'HOME',
    odds: 1.5,
    stake: 100,
    status: 'ACTIVE',
    date: '2026-05-15T18:00:00Z',
  },
  {
    id: 2,
    matchName: 'Real Madrid vs Barcelona',
    selection: 'DRAW',
    odds: 3.2,
    stake: 50,
    status: 'WON',
    date: '2026-05-10T19:00:00Z',
  },
  {
    id: 3,
    matchName: 'Bayern Munich vs Atletico Madrid',
    selection: 'AWAY',
    odds: 3.9,
    stake: 200,
    status: 'LOST',
    date: '2026-05-01T20:00:00Z',
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen pb-32">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-8 border-black dark:border-white inline-block pb-2">
          Portfolio
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Wagered" value="350 INIT" />
        <StatCard title="Total Won" value="160 INIT" />
        <StatCard title="Net PNL" value="-190 INIT" isNegative />
      </div>

      <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white dark:bg-white dark:text-black">
                <th className="p-4 font-black uppercase tracking-widest text-sm border-b-4 border-r-2 border-black dark:border-white">Match</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm border-b-4 border-r-2 border-black dark:border-white">Selection</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm border-b-4 border-r-2 border-black dark:border-white">Stake / Odds</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm border-b-4 border-r-2 border-black dark:border-white">Payout</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm border-b-4 border-black dark:border-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_BETS.map((bet, i) => (
                <tr 
                  key={bet.id} 
                  className={`
                    border-b-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors
                    ${i === MOCK_BETS.length - 1 ? 'border-b-0' : ''}
                  `}
                >
                  <td className="p-4 border-r-2 border-zinc-200 dark:border-zinc-800">
                    <div className="font-bold text-sm mb-1">{bet.matchName}</div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {new Date(bet.date).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 border-r-2 border-zinc-200 dark:border-zinc-800">
                    <span className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 text-xs font-black tracking-widest uppercase">
                      {bet.selection}
                    </span>
                  </td>
                  <td className="p-4 border-r-2 border-zinc-200 dark:border-zinc-800 font-mono">
                    <div className="font-bold">{bet.stake} INIT</div>
                    <div className="text-sm text-zinc-500">@ {formatOdds(bet.odds)}</div>
                  </td>
                  <td className="p-4 border-r-2 border-zinc-200 dark:border-zinc-800 font-mono font-bold text-green-500 dark:text-green-400">
                    {formatOdds(bet.stake * bet.odds)} INIT
                  </td>
                  <td className="p-4">
                    <StatusBadge status={bet.status} />
                    {bet.status === 'WON' && (
                      <button className="mt-2 text-xs bg-green-400 text-black font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:translate-x-px hover:shadow-[0px_0px_0px_rgba(0,0,0,1)] transition-all">
                        Claim
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, isNegative = false }: { title: string, value: string, isNegative?: boolean }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-800 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_rgba(255,255,255,1)]">
      <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">
        {title}
      </div>
      <div className={`text-3xl font-mono font-black ${isNegative ? 'text-red-500' : ''}`}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'WON':
      return (
        <span className="flex items-center space-x-1 text-green-500 font-bold uppercase text-sm">
          <CheckCircle2 className="w-4 h-4" /> <span>Won</span>
        </span>
      );
    case 'LOST':
      return (
        <span className="flex items-center space-x-1 text-red-500 font-bold uppercase text-sm">
          <XCircle className="w-4 h-4" /> <span>Lost</span>
        </span>
      );
    default:
      return (
        <span className="flex items-center space-x-1 text-yellow-500 font-bold uppercase text-sm">
          <Clock className="w-4 h-4" /> <span>Active</span>
        </span>
      );
  }
}