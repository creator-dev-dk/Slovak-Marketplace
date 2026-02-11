import React, { useState } from 'react';
import { Listing, VerificationLevel } from '../types';
import { Heart, MapPin, ShieldCheck, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import { TRANSLATIONS } from '../translations';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [imgSrc, setImgSrc] = useState(listing.imageUrl);
  const [isError, setIsError] = useState(false);
  
  const { favorites, toggleFavorite, language } = useAppStore();
  const t = TRANSLATIONS[language];
  const isFavorite = favorites.includes(listing.id);

  // Fallback image in case the main one fails
  const fallbackImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  return (
    <Link to={`/listing/${listing.id}`} className="block h-full group">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all duration-200 h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-100">
          <img 
            src={isError ? fallbackImage : imgSrc}
            alt={listing.title} 
            onError={() => {
              if (!isError) {
                setIsError(true);
                setImgSrc(fallbackImage);
              }
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-95 group-hover:opacity-100"
            loading="lazy"
          />
          
          {/* Favorite Button (Subtle) */}
          <button 
            className={`absolute top-2 right-2 p-1.5 rounded-md transition-all ${
              isFavorite 
                ? 'bg-white text-rose-500 shadow-sm border border-rose-100' 
                : 'bg-black/20 text-white hover:bg-white hover:text-rose-500 backdrop-blur-sm'
            }`}
            onClick={handleFavoriteClick}
          >
            <Heart 
              size={16} 
              fill={isFavorite ? "currentColor" : "none"} 
            />
          </button>

          {/* Badges - Pill Style */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {listing.isPremium && (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                PREMIUM
              </span>
            )}
             {listing.verificationLevel === VerificationLevel.BANK_ID && (
              <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                <ShieldCheck size={10} />
                VERIFIED
              </span>
            )}
          </div>
        </div>
        
        {/* Content - Data Dense */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2">
            <h3 className="font-semibold text-sm text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors leading-tight">
              {listing.title}
            </h3>
            <div className="flex items-center text-slate-500 text-xs mt-1 gap-1">
              <MapPin size={12} />
              <span className="truncate">{listing.location}</span>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="font-semibold text-slate-900">
              {listing.price.toLocaleString('sk-SK')} <span className="text-slate-500 text-xs font-normal">{listing.currency}</span>
            </div>
            
            <div className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                {listing.postedAt}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ListingCard;