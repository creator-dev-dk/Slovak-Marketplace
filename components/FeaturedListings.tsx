import React from 'react';
import { useAppStore } from '../store/useStore';
import ListingCard from './ListingCard';

const FeaturedListings: React.FC = () => {
  const { listings, searchQuery } = useAppStore();

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slovak-blue">
            {searchQuery ? `Výsledky pre "${searchQuery}"` : 'Prémiové Inzeráty'}
          </h2>
          <p className="text-gray-500 mt-1">
            {searchQuery ? `Nájdených ${filteredListings.length} inzerátov` : 'Najlepšie ponuky z celého Slovenska'}
          </p>
        </div>
        {!searchQuery && (
          <a href="#" className="text-slovak-blue font-semibold hover:text-blue-700 transition-colors hidden md:block">
            Zobraziť všetko &rarr;
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
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
           <p className="text-gray-400 mb-2">Ľutujeme, nič sme nenašli.</p>
           <p className="text-gray-600 font-medium">Skúste zmeniť kľúčové slová.</p>
        </div>
      )}
      
      <div className="mt-8 text-center md:hidden">
        <button className="text-slovak-blue font-semibold border border-blue-100 px-6 py-2 rounded-full">
           Zobraziť všetko
        </button>
      </div>
    </section>
  );
};

export default FeaturedListings;