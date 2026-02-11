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
  userId: string; // Added for secure filtering
  title: string;
  price: number;
  currency: string;
  location: string;
  imageUrl: string;
  category: string;
  isPremium: boolean;
  verificationLevel: VerificationLevel;
  sellerName: string;
  postedAt: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  isVerified: boolean;
}