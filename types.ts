
export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Region {
  id: string;
  name: string;
}

export enum VerificationLevel {
  NONE = 'NONE',
  PHONE = 'PHONE',
  BANK_ID = 'BANK_ID',
  CONCIERGE = 'CONCIERGE'
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  imageUrl: string;
  category: string;
  isPremium: boolean;
  isActive?: boolean; // Added for status management
  viewsCount?: number; // Added for analytics
  verificationLevel: VerificationLevel;
  sellerName: string;
  postedAt: string;
  description?: string;
}

export interface CreateListingPayload {
  title: string;
  price: string;
  categoryId: string;
  description: string;
  isPremium: boolean;
  city: string;
  region: string;
}

export interface User {
  id: string;
  name: string;
  isVerified: boolean;
}

// --- CHAT TYPES ---

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  
  // Joined Data
  listing?: {
    title: string;
    images: string[];
    price: number;
  };
  otherUser?: {
    id: string;
    full_name: string;
    avatar_url: string;
    verification_level: VerificationLevel;
  };
  lastMessage?: string;
}
