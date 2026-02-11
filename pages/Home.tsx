import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedListings from '../components/FeaturedListings';
import TrustValues from '../components/TrustValues';
import { useAppStore } from '../store/useStore';

const Home: React.FC = () => {
  const { searchQuery, selectedCategory, selectedRegion, fetchListings } = useAppStore();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchListings();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedRegion, fetchListings]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <Navbar />
      
      <main className="flex-grow">
        {/* Modular Hero Section */}
        <Hero />

        {/* Categories Section - Clean Separation */}
        <div className="border-b border-slate-200 bg-white">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <CategoryGrid />
           </div>
        </div>

        {/* Listings Section */}
        <div className="bg-slate-50">
           <FeaturedListings />
        </div>

        {/* Trust & Safety Values */}
        <TrustValues />
      </main>

      <Footer />
    </div>
  );
};

export default Home;