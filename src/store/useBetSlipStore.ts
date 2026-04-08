import { create } from 'zustand';

export interface Selection {
  match_id: number;
  market_id: number;
  outcome_id: number;
  odds: number;
  label: string; // e.g. "Home", "Draw", "Away"
  matchName: string; // e.g. "Arsenal vs Chelsea"
}

interface BetSlipState {
  selections: Selection[];
  stake: number;
  isOpen: boolean;
  addSelection: (s: Selection) => void;
  removeSelection: (match_id: number) => void;
  setStake: (amt: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  clear: () => void;
}

export const useBetSlipStore = create<BetSlipState>((set) => ({
  selections: [],
  stake: 10,
  isOpen: false,
  
  // Single-game betting logic for now. Selecting a new game clears the old one.
  addSelection: (s) => set((state) => {
    // If the same selection is clicked, remove it (toggle off)
    const exists = state.selections.find(
      (existing) => existing.match_id === s.match_id && existing.outcome_id === s.outcome_id
    );
    
    if (exists) {
      return { selections: [], isOpen: false };
    }
    
    return { 
      selections: [s], 
      isOpen: true 
    };
  }),
  
  removeSelection: (match_id) => set((state) => ({
    selections: state.selections.filter((s) => s.match_id !== match_id),
    isOpen: state.selections.length <= 1 ? false : state.isOpen
  })),
  
  setStake: (amt) => set({ stake: amt }),
  setIsOpen: (isOpen) => set({ isOpen }),
  clear: () => set({ selections: [], stake: 10, isOpen: false }),
}));