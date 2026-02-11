import { create } from 'zustand';
import { Listing, VerificationLevel, Category } from '../types';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

type Language = 'SK' | 'EN';

interface CreateListingPayload {
  title: string;
  price: string;
  categoryId: string;
  description: string;
  isPremium: boolean;
  city: string;
  region: string;
}

interface AppState {
  // Config
  language: Language;

  // Search & Data
  listings: Listing[];
  categories: Category[]; 
  isLoading: boolean;
  isAuthLoading: boolean;
  error: string | null;
  
  // Filters
  searchQuery: string;
  selectedCategory: string | null;
  selectedRegion: string | null;
  
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
  setRegion: (region: string | null) => void;
  
  fetchListings: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addListing: (listingData: CreateListingPayload, files: File[]) => Promise<void>;
  
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
      categories: [],
      isLoading: false,
      isAuthLoading: true,
      error: null,
      
      // Filter State
      searchQuery: '',
      selectedCategory: null,
      selectedRegion: null,
      
      favorites: [],
      unreadMessagesCount: 0,
      isLoggedIn: false,
      user: null,
      isAuthModalOpen: false,

      setLanguage: (lang) => set({ language: lang }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCategory: (category) => set({ selectedCategory: category }),
      setRegion: (region) => set({ selectedRegion: region }),

      // --- FETCH CATEGORIES ---
      fetchCategories: async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            
            if (error) throw error;
            
            const mappedCategories: Category[] = (data || []).map((c: any) => ({
                id: c.id,
                name: c.name,
                icon: c.icon_name || 'box',
                count: 0 
            }));
            
            set({ categories: mappedCategories });
        } catch (err: any) {
            console.error('Error fetching categories:', err);
        }
      },

      // --- FETCH LISTINGS (Server-Side Filtering) ---
      fetchListings: async () => {
        set({ isLoading: true, error: null });
        const { searchQuery, selectedCategory, selectedRegion } = get();

        try {
          // Dynamic Query Construction
          // We join users and categories to get related data efficiently
          let query = supabase
            .from('listings')
            .select(`
              *,
              users (
                full_name,
                avatar_url,
                verification_level
              ),
              categories (
                 name,
                 icon_name
              )
            `)
            .eq('is_active', true);

          // Apply Search Filter (Server-side ILIKE)
          if (searchQuery && searchQuery.trim() !== '') {
            query = query.ilike('title', `%${searchQuery}%`);
          }

          // Apply Category Filter
          if (selectedCategory) {
            query = query.eq('category_id', selectedCategory);
          }

          // Apply Region Filter
          if (selectedRegion && selectedRegion !== '') {
            query = query.eq('region', selectedRegion);
          }

          // Order results
          query = query.order('created_at', { ascending: false });

          const { data, error } = await query;

          if (error) throw error;

          const mappedListings: Listing[] = (data || []).map((item: any) => ({
            id: item.id,
            userId: item.user_id, // Map Supabase user_id to local userId for secure filtering
            title: item.title,
            price: item.price,
            currency: item.currency || '€',
            location: `${item.city}, ${item.region}`,
            imageUrl: item.images && item.images.length > 0 ? item.images[0] : '',
            category: item.categories?.name || 'Iné',
            isPremium: item.is_premium,
            verificationLevel: item.users?.verification_level as VerificationLevel || VerificationLevel.NONE,
            sellerName: item.users?.full_name || 'Predajca',
            postedAt: new Date(item.created_at).toLocaleDateString('sk-SK'),
            description: item.description,
          }));

          set({ listings: mappedListings, isLoading: false });
        } catch (err: any) {
          console.error('Error fetching listings:', err);
          set({ error: err.message, isLoading: false });
        }
      },

      // --- ADD LISTING ---
      addListing: async (listingData, files) => {
        const { user, fetchListings } = get();
        if (!user) return;

        set({ isLoading: true, error: null });

        try {
          const priceString = listingData.price.replace(',', '.');
          const priceValue = parseFloat(priceString);
          
          if (isNaN(priceValue) || priceValue < 0) {
             throw new Error("Neplatná cena.");
          }

          const imageUrls: string[] = [];
          
          // Parallel upload could be implemented here for speed, doing sequential for simplicity/safety
          for (const file of files) {
              const fileExt = file.name.split('.').pop();
              const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
              const filePath = `${user.id}/${fileName}`;

              const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

              if (uploadError) throw uploadError;

              const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
                
              imageUrls.push(publicUrlData.publicUrl);
          }

          const { error: insertError } = await supabase.from('listings').insert({
            user_id: user.id,
            title: listingData.title,
            price: priceValue,
            currency: 'EUR',
            city: listingData.city,
            region: listingData.region,
            category_id: listingData.categoryId,
            images: imageUrls,
            is_premium: listingData.isPremium,
            description: listingData.description
          });

          if (insertError) throw insertError;

          // Refresh listings to show the new one immediately
          await fetchListings();
        } catch (err: any) {
          console.error('Error creating listing:', err);
          set({ error: err.message || 'Chyba pri vytváraní inzerátu', isLoading: false });
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
        try {
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
        } catch (error) {
            console.error('Session check failed:', error);
            set({ isLoggedIn: false, user: null });
        } finally {
            set({ isAuthLoading: false });
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
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { error };

        if (data.user) {
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