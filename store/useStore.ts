import { create } from 'zustand';
import { Listing, VerificationLevel, Category, Conversation, Message, CreateListingPayload } from '../types';
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
  fetchUserListings: () => Promise<void>;
  fetchListingById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addListing: (listingData: CreateListingPayload, files: File[]) => Promise<void>;
  updateListing: (id: string, listingData: Partial<CreateListingPayload>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  toggleListingStatus: (id: string, isActive: boolean) => Promise<void>;
  incrementViewCount: (id: string) => Promise<void>;
  
  // User Profile Actions
  updateProfile: (fullName: string, avatarFile?: File) => Promise<void>;

  // Chat Actions
  fetchConversations: () => Promise<void>;
  startConversation: (listingId: string, sellerId: string) => Promise<string>;
  setActiveConversation: (id: string | null) => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  fetchUnreadCount: () => Promise<void>;

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

      // --- FETCH LISTINGS (PUBLIC) ---
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
            isActive: item.is_active,
            viewsCount: item.views_count,
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

      // --- FETCH USER LISTINGS (PRIVATE) ---
      fetchUserListings: async () => {
        const { user } = get();
        if (!user) return;
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase
            .from('listings')
            .select(`
              *,
              users ( full_name, avatar_url, verification_level ),
              categories ( name, icon_name )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

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
            isActive: item.is_active,
            viewsCount: item.views_count,
            verificationLevel: item.users?.verification_level as VerificationLevel || VerificationLevel.NONE,
            sellerName: item.users?.full_name || 'Predajca',
            postedAt: new Date(item.created_at).toLocaleDateString('sk-SK'),
            description: item.description,
          }));

          set({ userListings: mappedListings, isLoading: false });
        } catch (err: any) {
          console.error('Error fetching user listings:', err);
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
             isActive: data.is_active,
             viewsCount: data.views_count,
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
        const { user, fetchListings, fetchUserListings } = get();
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
          await Promise.all([fetchListings(), fetchUserListings()]);
        } catch (err: any) {
          console.error('Error creating listing:', err);
          set({ error: err.message || 'Chyba pri vytváraní inzerátu', isLoading: false });
          throw err;
        }
      },

      updateListing: async (id, listingData) => {
        set({ isLoading: true, error: null });
        try {
          const updates: any = {};
          if (listingData.title) updates.title = listingData.title;
          if (listingData.price) updates.price = parseFloat(listingData.price.replace(',', '.'));
          if (listingData.description) updates.description = listingData.description;
          if (listingData.categoryId) updates.category_id = listingData.categoryId;
          if (listingData.city) updates.city = listingData.city;
          if (listingData.region) updates.region = listingData.region;
          if (listingData.isPremium !== undefined) updates.is_premium = listingData.isPremium;
          updates.updated_at = new Date().toISOString();

          const { error } = await supabase
            .from('listings')
            .update(updates)
            .eq('id', id);

          if (error) throw error;
          
          await Promise.all([
             get().fetchListings(),
             get().fetchUserListings(),
             get().fetchListingById(id)
          ]);
        } catch (err: any) {
           console.error('Error updating listing:', err);
           set({ error: err.message, isLoading: false });
           throw err;
        } finally {
            set({ isLoading: false });
        }
      },

      deleteListing: async (id: string) => {
        set({ isLoading: true });
        try {
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            
            // Optimistic update for both lists
            const newListings = get().listings.filter(l => l.id !== id);
            const newUserListings = get().userListings.filter(l => l.id !== id);
            set({ listings: newListings, userListings: newUserListings });
        } catch (err: any) {
            console.error('Error deleting listing:', err);
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
      },

      toggleListingStatus: async (id: string, isActive: boolean) => {
        try {
            const { error } = await supabase
                .from('listings')
                .update({ is_active: isActive })
                .eq('id', id);

            if (error) throw error;
            
            // Update currentListing if it matches
            const { currentListing } = get();
            if (currentListing && currentListing.id === id) {
                set({ currentListing: { ...currentListing, isActive } });
            }

            // Refresh lists
            await Promise.all([
                get().fetchListings(),
                get().fetchUserListings()
            ]);
        } catch (err: any) {
            console.error('Error updating listing status:', err);
        }
      },

      incrementViewCount: async (id: string) => {
          try {
              // Attempt RPC call
              const { error } = await supabase.rpc('increment_views', { row_id: id });
              
              if (error) {
                  // Fallback: Read-Modify-Write if RPC is missing
                  // Not atomic, but sufficient for view counts
                  const { data } = await supabase.from('listings').select('views_count').eq('id', id).single();
                  if (data) {
                      await supabase.from('listings').update({ views_count: (data.views_count || 0) + 1 }).eq('id', id);
                  }
              }
          } catch (e) {
              // Ignore analytics errors
          }
      },

      updateProfile: async (fullName, avatarFile) => {
        const { user } = get();
        if (!user) return;
        set({ isLoading: true });

        try {
            let avatarUrl = user.avatar;

            // Upload new avatar if provided
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `avatar_${Date.now()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;
                
                const { error: uploadError } = await supabase.storage.from('images').upload(filePath, avatarFile);
                if (uploadError) throw uploadError;
                
                const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                avatarUrl = data.publicUrl;
            }

            // Update user profile in DB
            const { error } = await supabase
                .from('users')
                .update({ 
                    full_name: fullName,
                    avatar_url: avatarUrl !== user.avatar ? avatarUrl : undefined
                })
                .eq('id', user.id);

            if (error) throw error;

            // Update local state
            set({ 
                user: {
                    ...user,
                    name: fullName,
                    avatar: avatarUrl && avatarUrl.startsWith('http') ? (
                        // If it's a URL, we can't easily put it in the avatar field which expects a string/node
                        // For this app, we'll store the URL. Navbar handles it.
                         avatarUrl 
                    ) : fullName.charAt(0).toUpperCase()
                }
            });

        } catch (err: any) {
            console.error('Error updating profile:', err);
            set({ error: err.message });
            throw err;
        } finally {
            set({ isLoading: false });
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
          const { user } = get();
          try {
              const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });
            
              if (error) throw error;
              set({ messages: data as Message[] });
              
              // Mark as read if user is logged in
              if (user) {
                  await supabase
                    .from('messages')
                    .update({ is_read: true })
                    .eq('conversation_id', conversationId)
                    .neq('sender_id', user.id) // Only mark incoming messages
                    .eq('is_read', false);
                    
                   // Refresh global unread count
                   get().fetchUnreadCount(); 
              }

              get().subscribeToMessages();
          } catch (err) {
              console.error('Error fetching messages:', err);
          } finally {
              set({ isChatLoading: false });
          }
      },

      fetchUnreadCount: async () => {
          const { user } = get();
          if (!user) return;
          try {
             // We need to find messages where receiver is me. 
             // Since we don't have receiver_id, we check conversations where I am a participant
             // But simpler query: messages where sender_id is NOT me and is_read is false,
             // JOIN conversations... this is complex via client.
             // Simplified: Get count of messages in my conversations not sent by me.
             // Best effort for this schema:
             
             // 1. Get my conversation IDs
             const { data: convs } = await supabase
                 .from('conversations')
                 .select('id')
                 .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
             
             if (!convs || convs.length === 0) {
                 set({ unreadMessagesCount: 0 });
                 return;
             }
             
             const convIds = convs.map(c => c.id);
             
             const { count } = await supabase
                 .from('messages')
                 .select('*', { count: 'exact', head: true })
                 .in('conversation_id', convIds)
                 .neq('sender_id', user.id)
                 .eq('is_read', false);
                 
             set({ unreadMessagesCount: count || 0 });

          } catch (e) {
              console.error(e);
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
          const { activeConversationId, user } = get();
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
                    
                    // If the message is incoming (not from me), clear unread immediately as we are viewing it
                    if (user && newMessage.sender_id !== user.id) {
                         supabase
                            .from('messages')
                            .update({ is_read: true })
                            .eq('id', newMessage.id)
                            .then(() => get().fetchUnreadCount());
                    }

                    // Refresh sidebar
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
                  avatar: profile?.avatar_url || (profile?.full_name || 'U').charAt(0).toUpperCase()
                } 
              });
              
              // Init fetch unread
              get().fetchUnreadCount();

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