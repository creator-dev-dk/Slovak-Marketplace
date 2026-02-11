import { Category, Listing, Region, VerificationLevel } from './types';
import { Car, Home, Watch, Smartphone, Briefcase, Music } from 'lucide-react';
import React from 'react';

export const REGIONS: Region[] = [
  { id: 'ba', name: 'Bratislavský kraj' },
  { id: 'tt', name: 'Trnavský kraj' },
  { id: 'tn', name: 'Trenčiansky kraj' },
  { id: 'nr', name: 'Nitriansky kraj' },
  { id: 'za', name: 'Žilinský kraj' },
  { id: 'bb', name: 'Banskobystrický kraj' },
  { id: 'po', name: 'Prešovský kraj' },
  { id: 'ke', name: 'Košický kraj' },
];

export const CATEGORIES: (Category & { iconComponent: React.ReactNode })[] = [
  { id: 'auto', name: 'Auto-Moto', icon: 'car', count: 1240, iconComponent: <Car size={24} /> },
  { id: 'real', name: 'Nehnuteľnosti', icon: 'home', count: 850, iconComponent: <Home size={24} /> },
  { id: 'fashion', name: 'Móda & Luxury', icon: 'watch', count: 3200, iconComponent: <Watch size={24} /> },
  { id: 'electro', name: 'Elektronika', icon: 'smartphone', count: 1500, iconComponent: <Smartphone size={24} /> },
  { id: 'services', name: 'Služby', icon: 'briefcase', count: 420, iconComponent: <Briefcase size={24} /> },
  { id: 'art', name: 'Umenie', icon: 'music', count: 150, iconComponent: <Music size={24} /> },
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: '3-izbový byt, Sky Park Tower 2',
    price: 450000,
    currency: '€',
    location: 'Bratislava - Staré Mesto',
    // Architecture / Modern Building
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    category: 'real',
    isPremium: true,
    verificationLevel: VerificationLevel.CONCIERGE,
    sellerName: 'Ing. Milan K.',
    postedAt: 'Pred 30 min.',
  },
  {
    id: '2',
    title: 'Mercedes-Benz S-Class Long',
    price: 98900,
    currency: '€',
    location: 'Žilina',
    // Luxury Car Interior
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800',
    category: 'auto',
    isPremium: true,
    verificationLevel: VerificationLevel.BANK_ID,
    sellerName: 'Auto Centrum ZA',
    postedAt: 'Pred 2 hod.',
  },
  {
    id: '3',
    title: 'Apple iPhone 15 Pro Max Titanium',
    price: 1150,
    currency: '€',
    location: 'Košice - Juh',
    // Tech / Phone
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    category: 'electro',
    isPremium: false,
    verificationLevel: VerificationLevel.BANK_ID,
    sellerName: 'Jana N.',
    postedAt: 'Pred 4 hod.',
  },
  {
    id: '4',
    title: 'Rolex Submariner Date',
    price: 14500,
    currency: '€',
    location: 'Bratislava - Ružinov',
    // Luxury Watch
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
    category: 'fashion',
    isPremium: true,
    verificationLevel: VerificationLevel.CONCIERGE,
    sellerName: 'Luxury Watches SK',
    postedAt: 'Včera',
  },
];

export const PRD_CONTENT = `...`;