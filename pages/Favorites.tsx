
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';
import { useAppStore } from '../store/useStore';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../translations';

const Favorites: React.FC = () => {
  const { listings, favorites, language } = useAppStore();
  const t = TRANSLATIONS[language];
  
  // Filter all listings by favorites ID list
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-rose-50 p-3 rounded-2xl text-rose-500">
                    <Heart size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.profile.tabs.favorites}</h1>
                    <p className="text-slate-500">{t.featured.found.replace('{count}', favoriteListings.length.toString())}</p>
                </div>
            </div>

            {favoriteListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favoriteListings.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Heart size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t.profile.emptyFavorites}</h3>
                    <Link to="/" className="text-indigo-600 font-bold hover:underline flex items-center justify-center gap-1">
                        <Search size={16} />
                        {t.home.browseCategories}
                    </Link>
                </div>
            )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
