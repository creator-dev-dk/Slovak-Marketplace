import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, ShieldCheck, Share2, Heart, ArrowLeft, CheckCircle2, BadgeCheck, MessageSquare, Phone, Loader2 } from 'lucide-react';
import { VerificationLevel } from '../types';
import { motion } from 'framer-motion';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, toggleFavorite, favorites, isLoggedIn, openAuthModal, isLoading } = useAppStore();
  const listing = listings.find(l => l.id === id);

  const isFavorite = listing ? favorites.includes(listing.id) : false;

  const handleContact = () => {
      if (!isLoggedIn) {
          openAuthModal();
      } else {
          navigate('/chat');
      }
  }

  // Show loader while waiting for listings fetch (e.g. on page refresh)
  if (isLoading && !listing) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slovak-light">
             <Loader2 className="animate-spin text-slovak-blue" size={40} />
        </div>
      );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slovak-light">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slovak-blue mb-4">Inzerát sa nenašiel</h2>
          <Link to="/" className="text-slovak-gold hover:underline">Späť na domovskú stránku</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slovak-light font-sans">
      <Navbar />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Back */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-slovak-blue flex items-center gap-1 transition-colors">
              <ArrowLeft size={16} /> Späť na výpis
            </Link>
            <span>/</span>
            <span className="capitalize">{listing.category}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{listing.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column: Images & Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Image */}
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-soft group">
                <img 
                  src={listing.imageUrl} 
                  alt={listing.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-3">
                   <motion.button 
                     whileTap={{ scale: 0.8 }}
                     onClick={() => toggleFavorite(listing.id)}
                     className="p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-600 hover:text-slovak-gold hover:bg-white transition-all shadow-lg"
                   >
                      <Heart size={20} fill={isFavorite ? "#C5A059" : "none"} className={isFavorite ? "stroke-slovak-gold" : ""} />
                   </motion.button>
                   <button className="p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-600 hover:text-slovak-blue hover:bg-white transition-all shadow-lg">
                      <Share2 size={20} />
                   </button>
                </div>
                {listing.isPremium && (
                  <div className="absolute top-4 left-4 bg-slovak-blue text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-white/10">
                    Premium Listing
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Popis</h2>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {listing.description || (
                      <>
                        <p>
                            Ponúkame na predaj exkluzívny {listing.title}. Tento produkt spĺňa najvyššie štandardy kvality.
                            Nachádza sa v lokalite {listing.location} a je k dispozícii ihneď k odberu.
                        </p>
                        <p className="mt-4">
                            Stav: <strong>Ako nové</strong><br/>
                            Pôvod: <strong>Slovenská distribúcia</strong><br/>
                            Záruka: <strong>24 mesiacov</strong>
                        </p>
                      </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar / Action Card */}
            <div className="space-y-6">
              
              {/* Price & Seller Card */}
              <div className="bg-white rounded-3xl p-8 shadow-soft border border-gray-100 sticky top-24">
                <div className="mb-6 pb-6 border-b border-gray-50">
                   <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">Cena</span>
                   <div className="flex items-baseline gap-2 mt-1">
                      <h1 className="text-4xl font-bold text-slovak-blue">
                        {listing.price.toLocaleString('sk-SK')} {listing.currency}
                      </h1>
                   </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-start gap-4 mb-8">
                   <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400">
                      {listing.sellerName.charAt(0)}
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900">{listing.sellerName}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        {listing.verificationLevel === VerificationLevel.BANK_ID && (
                          <span className="text-xs text-slovak-blue font-semibold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                             <BadgeCheck size={12} /> BankID Overený
                          </span>
                        )}
                        {listing.verificationLevel === VerificationLevel.CONCIERGE && (
                          <span className="text-xs text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                             <ShieldCheck size={12} /> Concierge
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {listing.location}
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                   <button className="w-full bg-slovak-blue text-white font-bold py-4 rounded-xl hover:bg-slovak-dark transition-all shadow-lg shadow-slovak-blue/20 flex items-center justify-center gap-2">
                      <Phone size={20} />
                      Zobraziť číslo
                   </button>
                   <button 
                      onClick={handleContact}
                      className="w-full bg-white text-gray-700 border border-gray-200 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                   >
                      <MessageSquare size={20} />
                      Napísať správu
                   </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle2 size={18} className="text-green-500" />
                      <span>Garancia vrátenia peňazí</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                      <ShieldCheck size={18} className="text-slovak-blue" />
                      <span>Bezpečná platba cez TatraPay</span>
                   </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;