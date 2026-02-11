import { create } from 'zustand';
import { Listing, VerificationLevel } from '../types';
import { MOCK_LISTINGS } from '../constants';

interface AppState {
  // Search & Data
  listings: Listing[];
  searchQuery: string;
  selectedCategory: string | null;
  
  // Auth State
  isLoggedIn: boolean;
  user: { name: string; type: 'buyer' | 'seller'; avatar?: string } | null;
  
  // UI State
  isAuthModalOpen: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  addListing: (listing: Listing) => void;
  
  login: () => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  listings: MOCK_LISTINGS, // Initialize with Mock Data
  searchQuery: '',
  selectedCategory: null,
  isLoggedIn: false,
  user: null,
  isAuthModalOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ selectedCategory: category }),
  
  addListing: (listing) => set((state) => ({ 
    listings: [listing, ...state.listings] 
  })),
  
  login: () => set({ 
    isLoggedIn: true, 
    user: { name: 'Marek Novák', type: 'buyer', avatar: 'M' },
    isAuthModalOpen: false
  }),
  logout: () => set({ isLoggedIn: false, user: null }),
  
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));