import { create } from 'zustand';
import { Listing, VerificationLevel } from '../types';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

type Language = 'SK' | 'EN';

interface AppState {
  // Config
  language: Language;

  // Search & Data
  listings: Listing[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string | null;
  
  // User Actions
  favorites: string[];
  unreadMessagesCount: number;
  
  // Auth State
  isLoggedIn: boolean;
  user: { id: string; name: string; email?: string; type: 'buyer' | 'seller'; avatar?: string } | null;
  isAuthModalOpen: boolean;
  
  // Actions
  setLanguage: (lang: Language) => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  
  fetchListings: () => Promise<void>;
  addListing: (listingData: any, file: File) => Promise<void>;
  
  toggleFavorite: (id: string) => void;
  
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  
  openAuthModal: () => void;
  closeAuthModal: () => void;
  markMessagesRead: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'SK',
      listings: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      selectedCategory: null,
      favorites: [],
      unreadMessagesCount: 0,
      isLoggedIn: false,
      user: null,
      isAuthModalOpen: false,

      setLanguage: (lang) => set({ language: lang }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCategory: (category) => set({ selectedCategory: category }),

      // --- REAL DATA FETCHING ---
      fetchListings: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('listings')
            .select(`
              *,
              users (
                full_name,
                avatar_url,
                verification_level
              )
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const mappedListings: Listing[] = (data || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            currency: item.currency || '€',
            location: `${item.city}`,
            imageUrl: item.images && item.images.length > 0 ? item.images[0] : '',
            category: item.category_id || 'other', // In a real app, join categories table
            isPremium: item.is_premium,
            verificationLevel: item.users?.verification_level as VerificationLevel || VerificationLevel.NONE,
            sellerName: item.users?.full_name || 'Predajca',
            postedAt: new Date(item.created_at).toLocaleDateString('sk-SK'),
          }));

          set({ listings: mappedListings, isLoading: false });
        } catch (err: any) {
          console.error('Error fetching listings:', err);
          set({ error: err.message, isLoading: false });
        }
      },

      // --- ADD LISTING + UPLOAD ---
      addListing: async (listingData, file) => {
        const { user, fetchListings } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          // 1. Upload Image
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          const imageUrl = publicUrlData.publicUrl;

          // 2. Insert Listing
          const { error: insertError } = await supabase.from('listings').insert({
            user_id: user.id,
            title: listingData.title,
            price: listingData.price,
            currency: '€',
            city: listingData.location || 'Bratislava',
            region: 'Bratislavský', // Default for MVP
            images: [imageUrl],
            is_premium: listingData.isPremium,
            description: listingData.description,
            category_id: null // Or map to category UUIDs if table exists
          });

          if (insertError) throw insertError;

          // 3. Refresh
          await fetchListings();
        } catch (err: any) {
          console.error('Error creating listing:', err);
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      toggleFavorite: (id) => set((state) => {
        const isFavorite = state.favorites.includes(id);
        return {
          favorites: isFavorite 
            ? state.favorites.filter(favId => favId !== id)
            : [...state.favorites, id]
        };
      }),

      // --- AUTHENTICATION ---
      checkSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({ 
            isLoggedIn: true, 
            user: { 
              id: session.user.id, 
              email: session.user.email,
              name: profile?.full_name || session.user.email?.split('@')[0] || 'User', 
              type: 'buyer', 
              avatar: profile?.avatar_url || 'U' 
            } 
          });
        } else {
          set({ isLoggedIn: false, user: null });
        }
      },

      login: async (email, password) => {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
           await get().checkSession();
           set({ isAuthModalOpen: false });
        }
        return { error };
      },

      register: async (email, password, fullName) => {
        // 1. Sign Up
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { error };

        if (data.user) {
          // 2. Create Profile row manually (if no SQL trigger)
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: email,
              full_name: fullName,
              avatar_url: fullName.charAt(0).toUpperCase()
            });
          
          if (profileError) {
             console.error("Profile creation failed", profileError);
             // Allow login anyway, but profile might be incomplete
          }

          await get().checkSession();
          set({ isAuthModalOpen: false });
        }
        return { error: null };
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ isLoggedIn: false, user: null });
      },
      
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      markMessagesRead: () => set({ unreadMessagesCount: 0 }),
    }),
    {
      name: 'premiov-storage',
      partialize: (state) => ({ 
        favorites: state.favorites, 
        language: state.language
      }), 
    }
  )
);