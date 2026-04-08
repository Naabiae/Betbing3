import { create } from 'zustand';

export interface MatchData {
  id: number;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: 'OPEN' | 'SUSPENDED' | 'SETTLED';
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export const MOCK_MATCHES: MatchData[] = [
  {
    id: 101,
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    startTime: '2026-05-15T20:00:00Z',
    status: 'OPEN',
    odds: {
      home: 1.5,
      draw: 3.0,
      away: 4.0,
    }
  },
  {
    id: 102,
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: '2026-05-16T19:00:00Z',
    status: 'OPEN',
    odds: {
      home: 2.1,
      draw: 3.2,
      away: 2.8,
    }
  },
  {
    id: 103,
    homeTeam: 'Bayern Munich',
    awayTeam: 'Atletico Madrid',
    startTime: '2026-05-17T20:00:00Z',
    status: 'OPEN',
    odds: {
      home: 1.8,
      draw: 3.5,
      away: 3.9,
    }
  },
];

export const formatOdds = (val: number) => {
  return val.toFixed(2);
};