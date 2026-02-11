-- 1. ENUMS
CREATE TYPE region_enum AS ENUM (
  'Bratislavský', 'Trnavský', 'Trenčiansky', 'Nitriansky', 
  'Žilinský', 'Banskobystrický', 'Prešovský', 'Košický'
);

CREATE TYPE verification_level_enum AS ENUM ('NONE', 'PHONE', 'BANK_ID', 'CONCIERGE');

-- 2. TABLES

-- Users Table
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  avatar_url TEXT,
  verification_level verification_level_enum DEFAULT 'NONE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_name TEXT, -- Reference to Lucide icon name
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings Table
CREATE TABLE public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  
  region region_enum NOT NULL,
  city TEXT NOT NULL,
  
  images TEXT[], -- Array of image URLs
  
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  views_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. POLICIES (Row Level Security)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public listings are viewable by everyone."
  ON public.listings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own listings."
  ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
