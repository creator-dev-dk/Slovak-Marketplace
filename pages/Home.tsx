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

  // Re-fetch listings whenever filters change
  // This ensures the server-side filtering works dynamically
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchListings();
    }, 400); // 400ms debounce to avoid spamming API while typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedRegion, fetchListings]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slovak-light">
      <Navbar />
      
      <main className="flex-grow">
        {/* Modular Hero Section */}
        <Hero />

        {/* Categories with negative margin overlap for visual depth */}
        <div className="relative -mt-8 md:-mt-16 z-20 mb-12">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-soft border border-white/20 p-6 md:p-8">
                 <CategoryGrid />
              </div>
           </div>
        </div>

        {/* Trust & Safety Values */}
        <TrustValues />

        {/* Listings Section */}
        <div className="bg-slovak-light pt-10">
           <FeaturedListings />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;