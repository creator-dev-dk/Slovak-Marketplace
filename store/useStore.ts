import { create } from 'zustand';
import { Listing, VerificationLevel } from '../types';
import { MOCK_LISTINGS } from '../constants';
import { persist } from 'zustand/middleware';

interface AppState {
  // Search & Data
  listings: Listing[];
  searchQuery: string;
  selectedCategory: string | null;
  
  // User Actions
  favorites: string[]; // Array of Listing IDs
  unreadMessagesCount: number;
  
  // Auth State
  isLoggedIn: boolean;
  user: { name: string; type: 'buyer' | 'seller'; avatar?: string } | null;
  
  // UI State
  isAuthModalOpen: boolean;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  addListing: (listing: Listing) => void;
  toggleFavorite: (id: string) => void;
  
  login: () => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  markMessagesRead: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      listings: MOCK_LISTINGS,
      searchQuery: '',
      selectedCategory: null,
      favorites: [],
      unreadMessagesCount: 2, // Mock initial unread count
      isLoggedIn: false,
      user: null,
      isAuthModalOpen: false,

      setSearchQuery: (query) => set({ searchQuery: query }),
      setCategory: (category) => set({ selectedCategory: category }),
      
      addListing: (listing) => set((state) => ({ 
        listings: [listing, ...state.listings] 
      })),
      
      toggleFavorite: (id) => set((state) => {
        const isFavorite = state.favorites.includes(id);
        return {
          favorites: isFavorite 
            ? state.favorites.filter(favId => favId !== id)
            : [...state.favorites, id]
        };
      }),

      login: () => set({ 
        isLoggedIn: true, 
        user: { name: 'Marek Novák', type: 'buyer', avatar: 'M' },
        isAuthModalOpen: false
      }),
      logout: () => set({ isLoggedIn: false, user: null }),
      
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      markMessagesRead: () => set({ unreadMessagesCount: 0 }),
    }),
    {
      name: 'premiov-storage', // unique name
      partialize: (state) => ({ favorites: state.favorites, isLoggedIn: state.isLoggedIn, user: state.user }), // Persist these fields
    }
  )
);