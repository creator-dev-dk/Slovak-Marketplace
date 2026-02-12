
import { create } from 'zustand';
import { Listing, VerificationLevel, Category, Conversation, Message, CreateListingPayload, User, Review } from '../types';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type Language = 'SK' | 'EN';

interface AppState {
  // Config
  language: Language;

  // Search & Data
  listings: Listing[];
  userListings: Listing[]; 
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
  favorites: string[]; // List of IDs
  reviews: Review[];
  viewedProfile: User | null; // For public profiles
  
  unreadMessagesCount: number;
  
  // Auth State
  isLoggedIn: boolean;
  user: User | null;
  isAuthModalOpen: boolean;
  
  // Actions
  setLanguage: (lang: Language) => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  setRegion: (region: string | null) => void;
  
  fetchListings: () => Promise<void>;
  fetchUserListings: (userId?: string) => Promise<void>;
  fetchListingById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addListing: (listingData: CreateListingPayload, files: File[]) => Promise<void>;
  updateListing: (id: string, listingData: Partial<CreateListingPayload>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  toggleListingStatus: (id: string, isActive: boolean) => Promise<void>;
  incrementViewCount: (id: string) => Promise<void>;
  
  // User Profile Actions
  fetchUserProfile: (userId: string) => Promise<void>;
  updateProfile: (fullName: string, avatarFile?: File) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (listingId: string) => Promise<void>;
  fetchReviews: (userId: string) => Promise<void>;
  addReview: (revieweeId: string, rating: number, comment: string) => Promise<void>;

  // Chat Actions
  fetchConversations: () => Promise<void>;
  startConversation: (listingId: string, sellerId: string) => Promise<string>;
  setActiveConversation: (id: string | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  fetchUnreadCount: () => Promise<void>;
  
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  
  openAuthModal: () => void;
  closeAuthModal: () => void;
  markMessagesRead: () => void;
}

let messageSubscription: RealtimeChannel | null = null;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'SK',
      listings: [],
      userListings: [],
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
      reviews: [],
      viewedProfile: null,
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
            const { data } = await supabase.from('categories').select('*').order('name');
            const mappedCategories: Category[] = (data || []).map((c: any) => ({
                id: c.id,
                name: c.name,
                icon: c.icon_name || 'box',
                count: 0 
            }));
            set({ categories: mappedCategories });
        } catch (err) { console.error(err); }
      },

      // --- FETCH LISTINGS ---
      fetchListings: async () => {
        set({ isLoading: true, error: null });
        const { searchQuery, selectedCategory, selectedRegion } = get();

        try {
          let query = supabase
            .from('listings')
            .select(`*, users ( full_name, avatar_url, verification_level ), categories ( name, icon_name )`)
            .eq('is_active', true);

          if (searchQuery?.trim()) query = query.ilike('title', `%${searchQuery}%`);
          if (selectedCategory) query = query.eq('category_id', selectedCategory);
          if (selectedRegion) query = query.eq('region', selectedRegion);

          query = query.order('created_at', { ascending: false });
          const { data, error } = await query;
          if (error) throw error;

          const mappedListings = (data || []).map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            title: item.title,
            price: item.price,
            currency: item.currency || '€',
            location: `${item.city}, ${item.region}`,
            imageUrl: item.images && item.images.length > 0 ? item.images[0] : '',
            category: item.categories?.name || 'Iné',
            isPremium: item.is_premium,
            isActive: item.is_active,
            viewsCount: item.views_count,
            verificationLevel: item.users?.verification_level as VerificationLevel || VerificationLevel.NONE,
            sellerName: item.users?.full_name || 'Predajca',
            postedAt: new Date(item.created_at).toLocaleDateString('sk-SK'),
            description: item.description,
          }));

          set({ listings: mappedListings, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      fetchUserListings: async (userId) => {
        // If userId is provided, fetch for that user. Else fetch for logged in user.
        const targetId = userId || get().user?.id;
        if (!targetId) return;
        set({ isLoading: true });

        try {
          const { data, error } = await supabase
            .from('listings')
            .select(`*, users ( full_name, avatar_url, verification_level ), categories ( name, icon_name )`)
            .eq('user_id', targetId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const mappedListings = (data || []).map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            title: item.title,
            price: item.price,
            currency: item.currency || '€',
            location: `${item.city}, ${item.region}`,
            imageUrl: item.images && item.images.length > 0 ? item.images[0] : '',
            category: item.categories?.name || 'Iné',
            isPremium: item.is_premium,
            isActive: item.is_active,
            viewsCount: item.views_count,
            verificationLevel: item.users?.verification_level as VerificationLevel || VerificationLevel.NONE,
            sellerName: item.users?.full_name || 'Predajca',
            postedAt: new Date(item.created_at).toLocaleDateString('sk-SK'),
            description: item.description,
          }));

          set({ userListings: mappedListings, isLoading: false });
        } catch (err) { console.error(err); set({ isLoading: false }); }
      },

      fetchListingById: async (id: string) => {
        set({ isLoading: true, error: null, currentListing: null });
        try {
           const { data, error } = await supabase
            .from('listings')
            .select(`*, users ( full_name, avatar_url, verification_level ), categories ( name, icon_name )`)
            .eq('id', id)
            .single();

           if (error) throw error;
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
             isActive: data.is_active,
             viewsCount: data.views_count,
             verificationLevel: data.users?.verification_level as VerificationLevel || VerificationLevel.NONE,
             sellerName: data.users?.full_name || 'Predajca',
             postedAt: new Date(data.created_at).toLocaleDateString('sk-SK'),
             description: data.description,
           };
           set({ currentListing: mappedListing, isLoading: false });
        } catch (err: any) { set({ error: err.message, isLoading: false }); }
      },

      addListing: async (listingData, files) => {
        const { user } = get();
        if (!user) return;
        set({ isLoading: true });
        try {
          const priceValue = parseFloat(listingData.price.replace(',', '.'));
          const imageUrls: string[] = [];
          for (const file of files) {
              const fileExt = file.name.split('.').pop();
              const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
              const filePath = `${user.id}/${fileName}`;
              await supabase.storage.from('images').upload(filePath, file);
              const { data } = supabase.storage.from('images').getPublicUrl(filePath);
              imageUrls.push(data.publicUrl);
          }
          const { error } = await supabase.from('listings').insert({
            user_id: user.id,
            title: listingData.title,
            price: priceValue,
            city: listingData.city,
            region: listingData.region,
            category_id: listingData.categoryId,
            images: imageUrls,
            is_premium: listingData.isPremium,
            description: listingData.description
          });
          if (error) throw error;
          await Promise.all([get().fetchListings(), get().fetchUserListings()]);
        } catch (err: any) { set({ error: err.message, isLoading: false }); throw err; }
      },

      updateListing: async (id, listingData) => {
        set({ isLoading: true });
        try {
          const updates: any = { ...listingData, updated_at: new Date().toISOString() };
          if (listingData.price) updates.price = parseFloat(listingData.price.replace(',', '.'));
          await supabase.from('listings').update(updates).eq('id', id);
          await Promise.all([get().fetchListings(), get().fetchUserListings(), get().fetchListingById(id)]);
        } catch (err: any) { set({ error: err.message, isLoading: false }); } finally { set({ isLoading: false }); }
      },

      deleteListing: async (id) => {
        set({ isLoading: true });
        try {
            await supabase.from('listings').delete().eq('id', id);
            const newListings = get().listings.filter(l => l.id !== id);
            const newUserListings = get().userListings.filter(l => l.id !== id);
            set({ listings: newListings, userListings: newUserListings });
        } catch (err: any) { console.error(err); } finally { set({ isLoading: false }); }
      },

      toggleListingStatus: async (id, isActive) => {
        try {
            await supabase.from('listings').update({ is_active: isActive }).eq('id', id);
            const { currentListing } = get();
            if (currentListing?.id === id) set({ currentListing: { ...currentListing, isActive } });
            await Promise.all([get().fetchListings(), get().fetchUserListings()]);
        } catch (err) { console.error(err); }
      },

      incrementViewCount: async (id) => {
         try { await supabase.rpc('increment_views', { row_id: id }); } catch (e) { /* ignore */ }
      },

      // --- USER PROFILE & REVIEWS ---
      fetchUserProfile: async (userId) => {
          set({ isLoading: true, viewedProfile: null });
          try {
              const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
              if (error) throw error;
              
              // Calculate avg rating
              const { data: reviews } = await supabase.from('reviews').select('rating').eq('reviewee_id', userId);
              const avg = reviews?.length ? reviews.reduce((a, b) => a + b.rating, 0) / reviews.length : 0;
              
              set({ 
                  viewedProfile: {
                      id: data.id,
                      name: data.full_name,
                      avatar: data.avatar_url,
                      verificationLevel: data.verification_level,
                      rating: avg,
                      reviewsCount: reviews?.length || 0
                  },
                  isLoading: false
              });
          } catch(e) { console.error(e); set({ isLoading: false }); }
      },

      updateProfile: async (fullName, avatarFile) => {
        const { user } = get();
        if (!user) return;
        set({ isLoading: true });
        try {
            let avatarUrl = user.avatar;
            if (avatarFile) {
                const filePath = `${user.id}/avatar_${Date.now()}`;
                await supabase.storage.from('images').upload(filePath, avatarFile);
                const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                avatarUrl = data.publicUrl;
            }
            await supabase.from('users').update({ full_name: fullName, avatar_url: avatarUrl }).eq('id', user.id);
            set({ user: { ...user, name: fullName, avatar: avatarUrl } });
        } catch (err: any) { console.error(err); } finally { set({ isLoading: false }); }
      },

      fetchFavorites: async () => {
          const { user } = get();
          if(!user) return;
          const { data } = await supabase.from('favorites').select('listing_id').eq('user_id', user.id);
          if(data) set({ favorites: data.map(f => f.listing_id) });
      },

      toggleFavorite: async (listingId) => {
          const { user, favorites } = get();
          const isFav = favorites.includes(listingId);
          
          // Optimistic update
          set({ favorites: isFav ? favorites.filter(id => id !== listingId) : [...favorites, listingId] });

          if (user) {
              if (isFav) {
                  await supabase.from('favorites').delete().match({ user_id: user.id, listing_id: listingId });
              } else {
                  await supabase.from('favorites').insert({ user_id: user.id, listing_id: listingId });
              }
          }
      },

      fetchReviews: async (userId) => {
          const { data } = await supabase
            .from('reviews')
            .select(`*, reviewer:users!reviewer_id(full_name, avatar_url)`)
            .eq('reviewee_id', userId)
            .order('created_at', { ascending: false });
            
          if(data) {
              const mapped: Review[] = data.map((r: any) => ({
                  id: r.id,
                  reviewerId: r.reviewer_id,
                  reviewerName: r.reviewer?.full_name || 'Anonymous',
                  reviewerAvatar: r.reviewer?.avatar_url,
                  rating: r.rating,
                  comment: r.comment,
                  createdAt: r.created_at
              }));
              set({ reviews: mapped });
          }
      },

      addReview: async (revieweeId, rating, comment) => {
          const { user } = get();
          if(!user) return;
          const { error } = await supabase.from('reviews').insert({
              reviewer_id: user.id,
              reviewee_id: revieweeId,
              rating,
              comment
          });
          if(error) throw error;
          await get().fetchReviews(revieweeId);
      },

      // --- CHAT LOGIC ---
      fetchConversations: async () => {
        const { user } = get();
        if (!user) return;
        try {
            const { data } = await supabase
                .from('conversations')
                .select(`*, listings(title, images, price), buyer:users!buyer_id(id, full_name, avatar_url), seller:users!seller_id(id, full_name, avatar_url)`)
                .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
                .order('updated_at', { ascending: false });
                
            const mapped = (data || []).map((c: any) => ({
                id: c.id,
                listing_id: c.listing_id,
                buyer_id: c.buyer_id,
                seller_id: c.seller_id,
                created_at: c.created_at,
                updated_at: c.updated_at,
                listing: { title: c.listings?.title, images: c.listings?.images || [], price: c.listings?.price },
                otherUser: c.buyer_id === user.id ? c.seller : c.buyer,
                lastMessage: ''
            }));
            set({ conversations: mapped });
        } catch (err) { console.error(err); }
      },

      startConversation: async (listingId, sellerId) => {
        const { user } = get();
        if (!user) throw new Error("Not logged in");
        const { data: existing } = await supabase.from('conversations').select('id').eq('listing_id', listingId).eq('buyer_id', user.id).eq('seller_id', sellerId).single();
        if (existing) {
            set({ activeConversationId: existing.id });
            return existing.id;
        }
        const { data: newConv } = await supabase.from('conversations').insert({ listing_id: listingId, buyer_id: user.id, seller_id: sellerId }).select('id').single();
        await get().fetchConversations();
        set({ activeConversationId: newConv.id });
        return newConv.id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id, messages: [] }),

      fetchMessages: async (conversationId) => {
          set({ isChatLoading: true });
          const { user } = get();
          const { data } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
          set({ messages: data as Message[], isChatLoading: false });
          if(user) {
              await supabase.from('messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', user.id).eq('is_read', false);
              get().fetchUnreadCount();
          }
          get().subscribeToMessages();
      },

      fetchUnreadCount: async () => {
          const { user } = get();
          if(!user) return;
          // Simplified unread count
          const { count } = await supabase.from('messages').select('*', { count: 'exact', head: true }).neq('sender_id', user.id).eq('is_read', false);
          set({ unreadMessagesCount: count || 0 });
      },

      sendMessage: async (content) => {
          const { user, activeConversationId } = get();
          if (!user || !activeConversationId) return;
          await supabase.from('messages').insert({ conversation_id: activeConversationId, sender_id: user.id, content });
          await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', activeConversationId);
          get().fetchConversations();
      },

      subscribeToMessages: () => {
          const { activeConversationId, user } = get();
          if (!activeConversationId) return;
          if (messageSubscription) supabase.removeChannel(messageSubscription);
          messageSubscription = supabase.channel('chat-room').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversationId}` }, (payload) => {
              const newMessage = payload.new as Message;
              set((state) => ({ messages: [...state.messages, newMessage] }));
              if (user && newMessage.sender_id !== user.id) {
                   supabase.from('messages').update({ is_read: true }).eq('id', newMessage.id).then(() => get().fetchUnreadCount());
              }
              get().fetchConversations();
          }).subscribe();
      },

      unsubscribeFromMessages: () => { if (messageSubscription) { supabase.removeChannel(messageSubscription); messageSubscription = null; } },

      // --- AUTH ---
      checkSession: async () => {
        set({ isAuthLoading: true });
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              const { data: profile } = await supabase.from('users').select('*').eq('id', session.user.id).single();
              
              // Calculate stats for logged in user
              const { data: reviews } = await supabase.from('reviews').select('rating').eq('reviewee_id', session.user.id);
              const avg = reviews?.length ? reviews.reduce((a: any, b: any) => a + b.rating, 0) / reviews.length : 0;

              set({ 
                isLoggedIn: true, 
                user: { 
                  id: session.user.id, 
                  email: session.user.email,
                  name: profile?.full_name || 'User', 
                  type: 'buyer', 
                  avatar: profile?.avatar_url,
                  verificationLevel: profile?.verification_level as VerificationLevel,
                  rating: avg,
                  reviewsCount: reviews?.length || 0
                } 
              });
              get().fetchFavorites();
              get().fetchUnreadCount();
            } else {
              set({ isLoggedIn: false, user: null });
            }
        } catch { set({ isLoggedIn: false, user: null }); } finally { set({ isAuthLoading: false }); }
      },

      login: async (email, password) => {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) { await get().checkSession(); set({ isAuthModalOpen: false }); }
        return { error };
      },

      register: async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
        if (!error && data.user) {
            await supabase.from('users').insert({ id: data.user.id, email, full_name: fullName, avatar_url: fullName.charAt(0).toUpperCase() });
            await get().checkSession(); set({ isAuthModalOpen: false });
        }
        return { error };
      },

      logout: async () => { await supabase.auth.signOut(); set({ isLoggedIn: false, user: null, favorites: [] }); },
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      markMessagesRead: () => set({ unreadMessagesCount: 0 }),
    }),
    {
      name: 'premiov-storage',
      partialize: (state) => ({ favorites: state.favorites, language: state.language }), 
    }
  )
);
