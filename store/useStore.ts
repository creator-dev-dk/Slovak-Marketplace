import { create } from 'zustand';
import { Listing } from '../types';
import { MOCK_LISTINGS } from '../constants';
import { persist } from 'zustand/middleware';

type Language = 'SK' | 'EN';

interface AppState {
  // Config
  language: Language;

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
  setLanguage: (lang: Language) => void;
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
      language: 'SK',
      listings: MOCK_LISTINGS,
      searchQuery: '',
      selectedCategory: null,
      favorites: [], // Stores listing IDs
      unreadMessagesCount: 2,
      isLoggedIn: false,
      user: null,
      isAuthModalOpen: false,

      setLanguage: (lang) => set({ language: lang }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCategory: (category) => set({ selectedCategory: category }),
      
      addListing: (listing) => set((state) => ({ 
        listings: [listing, ...state.listings] 
      })),
      
      // Logic: If id exists, remove it; otherwise, add it.
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
      name: 'premiov-storage',
      partialize: (state) => ({ 
        favorites: state.favorites, 
        isLoggedIn: state.isLoggedIn, 
        user: state.user,
        language: state.language
      }), 
    }
  )
);