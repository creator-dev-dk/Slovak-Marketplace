import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedListings from '../components/FeaturedListings';
import TrustValues from '../components/TrustValues';
import { useAppStore } from '../store/useStore';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TRANSLATIONS } from '../translations';

const Home: React.FC = () => {
  const { 
    searchQuery, 
    selectedCategory, 
    fetchListings,
    openAuthModal,
    isLoggedIn,
    language
  } = useAppStore();
  
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchListings();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, fetchListings]);

  const handleSellClick = () => {
    if (isLoggedIn) {
      navigate('/create');
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      <main className="flex-grow">
        
        {/* 1. Hero Section with Search & Filtering */}
        <Hero />

        {/* 2. Categories Navigation */}
        <div className="bg-white border-b border-slate-200">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
               <CategoryGrid />
           </div>
        </div>

        {/* 3. Main Content - Listings */}
        <div className="bg-slate-50 min-h-[600px]">
           <FeaturedListings />
        </div>

        {/* 4. Trust & Security Section */}
        <TrustValues />

        {/* 5. CTA Section - Drive Supply */}
        <section className="relative py-24 overflow-hidden bg-white border-t border-slate-200">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
           
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="bg-indigo-600 rounded-3xl p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-200 overflow-hidden relative">
                  
                  {/* Decorative Circles */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-700 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                  <div className="max-w-2xl relative z-10">
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                        {t.home.ctaTitle}
                      </h2>
                      <p className="text-indigo-100 text-lg mb-8 md:mb-0 leading-relaxed">
                        {t.home.ctaSubtitle}
                      </p>
                  </div>

                  <div className="relative z-10 flex-shrink-0">
                      <button 
                        onClick={handleSellClick}
                        className="group bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                      >
                         <PlusCircle size={20} />
                         {t.home.ctaButton}
                         <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <p className="text-indigo-200 text-xs text-center mt-3 font-medium">
                        {t.home.ctaNote}
                      </p>
                  </div>
              </div>
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;