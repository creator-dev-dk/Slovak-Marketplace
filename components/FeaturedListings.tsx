import React from 'react';
import { useAppStore } from '../store/useStore';
import ListingCard from './ListingCard';
import { ArrowRight, Search } from 'lucide-react';

const FeaturedListings: React.FC = () => {
  const { listings, searchQuery } = useAppStore();

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {searchQuery ? `Výsledky pre "${searchQuery}"` : 'Najnovšie ponuky'}
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            {searchQuery ? `Nájdených ${filteredListings.length} inzerátov` : 'Vybrané pre vás z celého Slovenska'}
          </p>
        </div>
        {!searchQuery && (
          <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors hidden md:flex items-center gap-1 text-sm">
            Zobraziť všetko <ArrowRight size={16} />
          </a>
        )}
      </div>

      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
           </div>
           <p className="text-slate-900 font-medium mb-1">Ľutujeme, nič sme nenašli.</p>
           <p className="text-slate-500 text-sm">Skúste zmeniť kľúčové slová alebo odstrániť filtre.</p>
        </div>
      )}
      
      <div className="mt-8 text-center md:hidden">
        <button className="text-indigo-600 font-semibold border border-indigo-100 px-6 py-2.5 rounded-lg w-full">
           Zobraziť všetko
        </button>
      </div>
    </section>
  );
};

export default FeaturedListings;