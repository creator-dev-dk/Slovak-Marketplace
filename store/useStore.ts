import { create } from 'zustand';
import { Listing, VerificationLevel, Category, Conversation, Message } from '../types';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

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
  currentListing: Listing | null;
  categories: Category[]; 
  isLoading: boolean;
  isAuthLoading: boolean;
  error: string | null;
  
  // Chat Data
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isChatLoading: boolean;
  
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
  fetchListingById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addListing: (listingData: CreateListingPayload, files: File[]) => Promise<void>;
  
  // Chat Actions
  fetchConversations: () => Promise<void>;
  startConversation: (listingId: string, sellerId: string) => Promise<string>;
  setActiveConversation: (id: string | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;

  toggleFavorite: (id: string) => void;
  
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  
  openAuthModal: () => void;
  closeAuthModal: () => void;
  markMessagesRead: () => void;
}

// Keep track of subscription outside store to avoid serialization issues
let messageSubscription: RealtimeChannel | null = null;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'SK',
      listings: [],
      currentListing: null,
      categories: [],
      isLoading: false,
      isAuthLoading: true,
      error: null,
      
      // Chat State
      conversations: [],
      activeConversationId: null,
      messages: [],
      isChatLoading: false,
      
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

      // --- FETCH LISTINGS ---
      fetchListings: async () => {
        set({ isLoading: true, error: null });
        const { searchQuery, selectedCategory, selectedRegion } = get();

        try {
          let query = supabase
            .from('listings')
            .select(`
              *,
              users ( full_name, avatar_url, verification_level ),
              categories ( name, icon_name )
            `)
            .eq('is_active', true);

          if (searchQuery?.trim()) query = query.ilike('title', `%${searchQuery}%`);
          if (selectedCategory) query = query.eq('category_id', selectedCategory);
          if (selectedRegion) query = query.eq('region', selectedRegion);

          query = query.order('created_at', { ascending: false });
          const { data, error } = await query;
          if (error) throw error;

          const mappedListings: Listing[] = (data || []).map((item: any) => ({
            id: item.id,
            userId: item.user_id,
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

      fetchListingById: async (id: string) => {
        set({ isLoading: true, error: null, currentListing: null });
        try {
           const { data, error } = await supabase
            .from('listings')
            .select(`
              *,
              users ( full_name, avatar_url, verification_level ),
              categories ( name, icon_name )
            `)
            .eq('id', id)
            .single();

           if (error) throw error;
           if (!data) throw new Error('Listing not found');

           const mappedListing: Listing = {
             id: data.id,
             userId: data.user_id,
             title: data.title,
             price: data.price,
             currency: data.currency || '€',
             location: `${data.city}, ${data.region}`,
             imageUrl: data.images && data.images.length > 0 ? data.images[0] : '',
             category: data.categories?.name || 'Iné',
             isPremium: data.is_premium,
             verificationLevel: data.users?.verification_level as VerificationLevel || VerificationLevel.NONE,
             sellerName: data.users?.full_name || 'Predajca',
             postedAt: new Date(data.created_at).toLocaleDateString('sk-SK'),
             description: data.description,
           };

           set({ currentListing: mappedListing, isLoading: false });
        } catch (err: any) {
           console.error('Error fetching listing:', err);
           set({ error: err.message, isLoading: false });
        }
      },

      addListing: async (listingData, files) => {
        const { user, fetchListings } = get();
        if (!user) return;
        set({ isLoading: true, error: null });

        try {
          const priceValue = parseFloat(listingData.price.replace(',', '.'));
          if (isNaN(priceValue) || priceValue < 0) throw new Error("Neplatná cena.");

          const imageUrls: string[] = [];
          for (const file of files) {
              const fileExt = file.name.split('.').pop();
              const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
              const filePath = `${user.id}/${fileName}`;
              const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
              if (uploadError) throw uploadError;
              const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
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
          await fetchListings();
        } catch (err: any) {
          console.error('Error creating listing:', err);
          set({ error: err.message || 'Chyba pri vytváraní inzerátu', isLoading: false });
          throw err;
        }
      },

      // --- CHAT LOGIC ---

      fetchConversations: async () => {
        const { user } = get();
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('conversations')
                .select(`
                    *,
                    listings ( title, images, price ),
                    buyer:users!buyer_id ( id, full_name, avatar_url, verification_level ),
                    seller:users!seller_id ( id, full_name, avatar_url, verification_level )
                `)
                .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            const mappedConversations: Conversation[] = (data || []).map((c: any) => {
                const isBuyer = c.buyer_id === user.id;
                // Handle cases where users/listings might be deleted
                const otherUserData = isBuyer ? c.seller : c.buyer;
                
                return {
                    id: c.id,
                    listing_id: c.listing_id,
                    buyer_id: c.buyer_id,
                    seller_id: c.seller_id,
                    created_at: c.created_at,
                    updated_at: c.updated_at,
                    listing: {
                        title: c.listings?.title || 'Odstránený inzerát',
                        images: c.listings?.images || [],
                        price: c.listings?.price || 0
                    },
                    otherUser: {
                        id: otherUserData?.id || 'deleted',
                        full_name: otherUserData?.full_name || 'Odstránený používateľ',
                        avatar_url: otherUserData?.avatar_url,
                        verification_level: otherUserData?.verification_level || VerificationLevel.NONE
                    },
                    lastMessage: ''
                };
            });

            set({ conversations: mappedConversations });
        } catch (err) {
            console.error('Error fetching conversations:', err);
        }
      },

      startConversation: async (listingId: string, sellerId: string) => {
        const { user } = get();
        if (!user) throw new Error("Not logged in");

        try {
            const { data: existing } = await supabase
                .from('conversations')
                .select('id')
                .eq('listing_id', listingId)
                .eq('buyer_id', user.id)
                .eq('seller_id', sellerId)
                .single();

            if (existing) {
                set({ activeConversationId: existing.id });
                return existing.id;
            }

            const { data: newConv, error } = await supabase
                .from('conversations')
                .insert({
                    listing_id: listingId,
                    buyer_id: user.id,
                    seller_id: sellerId
                })
                .select('id')
                .single();

            if (error) throw error;
            
            await get().fetchConversations();
            set({ activeConversationId: newConv.id });
            return newConv.id;
        } catch (err: any) {
            console.error('Error starting conversation:', err);
            throw err;
        }
      },

      setActiveConversation: (id) => {
          // Clear messages immediately to avoid showing old chat content
          set({ activeConversationId: id, messages: [] });
      },

      fetchMessages: async (conversationId: string) => {
          set({ isChatLoading: true });
          try {
              const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });
            
              if (error) throw error;
              set({ messages: data as Message[] });
              get().subscribeToMessages();
          } catch (err) {
              console.error('Error fetching messages:', err);
          } finally {
              set({ isChatLoading: false });
          }
      },

      sendMessage: async (content: string) => {
          const { user, activeConversationId } = get();
          if (!user || !activeConversationId) return;

          try {
              const { error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: activeConversationId,
                    sender_id: user.id,
                    content: content
                });

              if (error) throw error;
              
              await supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', activeConversationId);
                
              // Refresh sidebar to sort by newest
              get().fetchConversations();

          } catch (err) {
              console.error('Error sending message:', err);
          }
      },

      subscribeToMessages: () => {
          const { activeConversationId } = get();
          if (!activeConversationId) return;

          if (messageSubscription) {
              supabase.removeChannel(messageSubscription);
          }

          messageSubscription = supabase
            .channel('chat-room')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${activeConversationId}`
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    set((state) => ({
                        messages: [...state.messages, newMessage]
                    }));
                    // Refresh sidebar to update timestamps/order
                    get().fetchConversations();
                }
            )
            .subscribe();
      },

      unsubscribeFromMessages: () => {
          if (messageSubscription) {
              supabase.removeChannel(messageSubscription);
              messageSubscription = null;
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
        set({ isAuthLoading: true });
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
                  // Use metadata or email prefix if profile doesn't exist yet
                  name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User', 
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
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: { full_name: fullName }
            }
        });
        if (error) return { error };

        if (data.user) {
          // Attempt to create profile, but don't block if it fails (can happen via triggers)
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: email,
              full_name: fullName,
              avatar_url: fullName.charAt(0).toUpperCase()
            });
          
          if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
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
        language: state.language,
        activeConversationId: state.activeConversationId
      }), 
    }
  )
);