import React, { useState } from 'react';
import { Listing, VerificationLevel } from '../types';
import { Heart, MapPin, ShieldCheck, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useStore';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [imgSrc, setImgSrc] = useState(listing.imageUrl);
  const [isError, setIsError] = useState(false);
  
  const { favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(listing.id);

  // Fallback image in case the main one fails
  const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  return (
    <Link to={`/listing/${listing.id}`} className="block h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-soft hover:shadow-2xl hover:border-slovak-blue/20 transition-all duration-300 cursor-pointer h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img 
            src={isError ? fallbackImage : imgSrc}
            alt={listing.title} 
            onError={() => {
              if (!isError) {
                setIsError(true);
                setImgSrc(fallbackImage);
              }
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Favorite Button */}
          <motion.button 
            whileTap={{ scale: 0.8 }}
            className={`absolute top-3 right-3 p-2 backdrop-blur-md rounded-full transition-all shadow-sm z-10 ${
              isFavorite 
                ? 'bg-white text-slovak-gold' 
                : 'bg-white/90 text-gray-400 hover:text-slovak-gold hover:bg-white'
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart 
              size={18} 
              fill={isFavorite ? "#C5A059" : "none"} 
              className={isFavorite ? "stroke-slovak-gold" : ""}
            />
          </motion.button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {listing.isPremium && (
              <div className="bg-slovak-blue/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-white/10">
                Premium
              </div>
            )}
            {listing.verificationLevel === VerificationLevel.BANK_ID && (
              <div className="bg-white/90 backdrop-blur-md text-slovak-blue text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <BadgeCheck size={12} className="text-blue-600" />
                BankID
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-slovak-blue transition-colors">
              {listing.title}
            </h3>
          </div>

          <div className="flex items-center text-gray-500 text-sm mb-4 gap-1">
            <MapPin size={14} className="text-gray-400" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Cena</span>
              <span className="font-bold text-xl text-slovak-blue">
                {listing.price.toLocaleString('sk-SK')} {listing.currency}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {listing.verificationLevel === VerificationLevel.CONCIERGE && (
                  <div className="w-8 h-8 rounded-full bg-slovak-gold/10 flex items-center justify-center text-slovak-gold" title="Concierge Service">
                    <ShieldCheck size={16} />
                  </div>
              )}
              <div className="text-xs text-gray-400 text-right">
                  {listing.postedAt}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ListingCard;