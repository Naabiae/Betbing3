import { create } from 'zustand';

export interface Market {
  id: number;
  name: string;
  outcomes: { id: number; label: string; odds: number }[];
}

export interface MatchData {
  id: number;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  status: 'OPEN' | 'SUSPENDED' | 'SETTLED';
  markets: Market[];
}

export const MOCK_MATCHES: MatchData[] = [
  {
    id: 101,
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    startTime: '2026-05-15T20:00:00Z',
    status: 'OPEN',
    markets: [
      {
        id: 1,
        name: '1X2',
        outcomes: [
          { id: 0, label: 'HOME', odds: 1.5 },
          { id: 1, label: 'DRAW', odds: 3.0 },
          { id: 2, label: 'AWAY', odds: 4.0 },
        ]
      },
      {
        id: 2,
        name: 'O/U 2.5 Goals',
        outcomes: [
          { id: 0, label: 'OVER', odds: 1.85 },
          { id: 1, label: 'UNDER', odds: 1.90 },
        ]
      }
    ]
  },
  {
    id: 102,
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    startTime: '2026-05-16T19:00:00Z',
    status: 'OPEN',
    markets: [
      {
        id: 1,
        name: '1X2',
        outcomes: [
          { id: 0, label: 'HOME', odds: 2.1 },
          { id: 1, label: 'DRAW', odds: 3.2 },
          { id: 2, label: 'AWAY', odds: 2.8 },
        ]
      },
      {
        id: 2,
        name: 'O/U 2.5 Goals',
        outcomes: [
          { id: 0, label: 'OVER', odds: 1.65 },
          { id: 1, label: 'UNDER', odds: 2.10 },
        ]
      }
    ]
  },
  {
    id: 103,
    homeTeam: 'Bayern Munich',
    awayTeam: 'Atletico Madrid',
    startTime: '2026-05-17T20:00:00Z',
    status: 'OPEN',
    markets: [
      {
        id: 1,
        name: '1X2',
        outcomes: [
          { id: 0, label: 'HOME', odds: 1.8 },
          { id: 1, label: 'DRAW', odds: 3.5 },
          { id: 2, label: 'AWAY', odds: 3.9 },
        ]
      },
      {
        id: 2,
        name: 'O/U 2.5 Goals',
        outcomes: [
          { id: 0, label: 'OVER', odds: 2.05 },
          { id: 1, label: 'UNDER', odds: 1.70 },
        ]
      }
    ]
  },
];

export const formatOdds = (val: number) => {
  return val.toFixed(2);
};