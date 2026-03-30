import { create } from 'zustand';
import { Couple, Guest, InvitationStats } from './types';

interface AppStore {
  currentCouple: Couple | null;
  setCoupleData: (couple: Couple) => void;
  
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  addGuest: (guest: Guest) => void;
  
  stats: InvitationStats;
  setStats: (stats: InvitationStats) => void;
  
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentCouple: null,
  setCoupleData: (couple) => set({ currentCouple: couple }),
  
  guests: [],
  setGuests: (guests) => set({ guests }),
  addGuest: (guest) => set((state) => ({ guests: [...state.guests, guest] })),
  
  stats: { total: 0, accepted: 0, declined: 0, pending: 0 },
  setStats: (stats) => set({ stats }),
  
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
