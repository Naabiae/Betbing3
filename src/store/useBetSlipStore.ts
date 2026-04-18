import { create } from 'zustand';

export interface Selection {
  match_id: number;
  market_id: number;
  outcome_id: number;
  odds: number;
  label: string; // e.g. "Home", "Draw", "Away", "Over 2.5"
  matchName: string; // e.g. "Arsenal vs Chelsea"
}

interface BetSlipState {
  selections: Selection[];
  stake: number;
  isOpen: boolean;
  addSelection: (s: Selection) => void;
  removeSelection: (match_id: number, market_id: number) => void;
  setStake: (amt: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  clear: () => void;
}

export const useBetSlipStore = create<BetSlipState>((set) => ({
  selections: [],
  stake: 10,
  isOpen: false,
  
  // Accumulator/Multibet logic: Allow selections from different matches or non-conflicting markets.
  addSelection: (s) => set((state) => {
    // If the exact same outcome is clicked, toggle it off
    const isExactMatch = state.selections.find(
      (existing) => existing.match_id === s.match_id && existing.market_id === s.market_id && existing.outcome_id === s.outcome_id
    );
    
    if (isExactMatch) {
      const newSelections = state.selections.filter(
        (existing) => !(existing.match_id === s.match_id && existing.market_id === s.market_id && existing.outcome_id === s.outcome_id)
      );
      return { selections: newSelections, isOpen: newSelections.length > 0 ? state.isOpen : false };
    }
    
    // If a different outcome from the SAME match and SAME market is clicked, replace it
    const newSelections = state.selections.filter(
      (existing) => !(existing.match_id === s.match_id && existing.market_id === s.market_id)
    );
    
    newSelections.push(s);
    
    return { 
      selections: newSelections, 
      isOpen: true 
    };
  }),
  
  removeSelection: (match_id, market_id) => set((state) => {
    const newSelections = state.selections.filter((s) => !(s.match_id === match_id && s.market_id === market_id));
    return {
      selections: newSelections,
      isOpen: newSelections.length === 0 ? false : state.isOpen
    };
  }),
  
  setStake: (amt) => set({ stake: amt }),
  setIsOpen: (isOpen) => set({ isOpen }),
  clear: () => set({ selections: [], stake: 10, isOpen: false }),
}));