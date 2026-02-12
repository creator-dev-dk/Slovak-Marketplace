import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';
import { 
  MapPin, 
  ShieldCheck, 
  Share2, 
  Heart, 
  ArrowLeft, 
  CheckCircle2, 
  BadgeCheck, 
  MessageSquare, 
  Phone, 
  Loader2,
  Calendar,
  Eye,
  Flag,
  EyeOff,
  Pencil,
  Trash2
} from 'lucide-react';
import { VerificationLevel } from '../types';
import { motion } from 'framer-motion';
import { TRANSLATIONS } from '../translations';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentListing, 
    fetchListingById, 
    toggleFavorite, 
    favorites, 
    isLoggedIn, 
    openAuthModal, 
    isLoading, 
    user, 
    startConversation,
    listings,
    incrementViewCount,
    deleteListing,
    toggleListingStatus,
    language
  } = useAppStore();
  
  const t = TRANSLATIONS[language];
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
        fetchListingById(id);
        incrementViewCount(id);
    }
  }, [id, fetchListingById, incrementViewCount]);

  // Find similar listings (same category, excluding current)
  const similarListings = currentListing 
    ? listings.filter(l => l.category === currentListing.category && l.id !== currentListing.id).slice(0, 4)
    : [];

  // Loading state
  if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
           <Navbar />
           <div className="flex-grow flex items-center justify-center">
               <Loader2 className="animate-spin text-indigo-600" size={40} />
           </div>
           <Footer />
        </div>
      );
  }

  if (!currentListing) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Inzerát sa nenašiel</h2>
            <Link to="/" className="text-indigo-600 hover:underline font-medium">{t.profile.backHome}</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const listing = currentListing;
  const isFavorite = favorites.includes(listing.id);
  const isOwner = user?.id === listing.userId;

  const handleContact = async () => {
      if (!isLoggedIn) {
          openAuthModal();
          return;
      }
      
      if (isOwner) {
          alert("Nemôžete poslať správu sami sebe.");
          return;
      }

      setIsStartingChat(true);
      try {
          await startConversation(listing.id, listing.userId);
          navigate('/chat');
      } catch (error) {
          console.error("Failed to start chat", error);
          alert("Nepodarilo sa začať konverzáciu.");
      } finally {
          setIsStartingChat(false);
      }
  }

  const handleToggleStatus = async () => {
      setIsProcessing(true);
      const newStatus = listing.isActive === false ? true : false;
      await toggleListingStatus(listing.id, newStatus);
      setIsProcessing(false);
  };

  const handleDelete = async () => {
      if (window.confirm(t.listing.deleteConfirm)) {
          setIsProcessing(true);
          await deleteListing(listing.id);
          navigate('/');
      }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-hidden whitespace-nowrap">
            <Link to="/" className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
              <ArrowLeft size={16} /> {t.common.back}
            </Link>
            <span className="text-slate-300">/</span>
            <Link to="/" className="hover:text-indigo-600 transition-colors capitalize">{listing.category}</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-medium truncate">{listing.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Images & Content (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Main Gallery */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200 group">
                <img 
                  src={listing.imageUrl} 
                  alt={listing.title} 
                  className={`w-full h-full object-cover ${listing.isActive === false ? 'grayscale' : ''}`}
                />
                
                {listing.isActive === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                        <span className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-xl uppercase tracking-widest shadow-xl">{t.listing.sold}</span>
                    </div>
                )}
                
                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                   <motion.button 
                     whileTap={{ scale: 0.9 }}
                     onClick={() => toggleFavorite(listing.id)}
                     className={`p-2.5 rounded-xl backdrop-blur-md border transition-all ${isFavorite ? 'bg-white text-rose-500 border-rose-100' : 'bg-black/20 text-white border-white/20 hover:bg-white hover:text-rose-500'}`}
                   >
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                   </motion.button>
                   <button className="p-2.5 bg-black/20 backdrop-blur-md rounded-xl text-white border border-white/20 hover:bg-white hover:text-indigo-600 transition-all">
                      <Share2 size={20} />
                   </button>
                </div>

                {listing.isPremium && (
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg z-20">
                    {t.listing.premium}
                  </div>
                )}
              </div>

              {/* Meta Info Bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>{t.listing.added} {listing.postedAt}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <Eye size={16} />
                      <span>{listing.viewsCount || 0} {t.listing.views}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>{listing.location}</span>
                  </div>
                  <button className="ml-auto flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors text-xs font-medium">
                      <Flag size={14} /> {t.listing.report}
                  </button>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">{t.listing.about}</h2>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {listing.description || (
                      <>
                        <p>
                            Ponúkame na predaj exkluzívny {listing.title}. Tento produkt spĺňa najvyššie štandardy kvality a je pripravený pre nového majiteľa.
                            Nachádza sa v lokalite {listing.location} a je k dispozícii ihneď k odberu.
                        </p>
                        <p>
                            Pre viac informácií alebo dohodnutie obhliadky ma neváhajte kontaktovať správou alebo telefonicky.
                        </p>
                      </>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Sticky Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200 sticky top-24">
                
                <div className="mb-6">
                   <p className="text-sm text-slate-500 font-medium mb-1">{t.listing.price}</p>
                   <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900 tracking-tight">
                        {listing.price.toLocaleString('sk-SK')}
                      </span>
                      <span className="text-xl font-medium text-slate-400">{listing.currency}</span>
                   </div>
                </div>

                {/* Seller Info */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                      {listing.sellerName.charAt(0)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate">{listing.sellerName}</h3>
                      <div className="flex items-center gap-1">
                        {listing.verificationLevel === VerificationLevel.BANK_ID && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                             <ShieldCheck size={10} /> {t.listing.verifiedBank}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">• {t.listing.replyTime}</span>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                   {!isOwner ? (
                       <>
                        <button 
                            onClick={handleContact}
                            disabled={isStartingChat || listing.isActive === false}
                            className={`w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-[0.98] ${listing.isActive === false ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {isStartingChat ? <Loader2 className="animate-spin" size={20}/> : <MessageSquare size={20} />}
                            {listing.isActive === false ? t.listing.sold : t.listing.contact}
                        </button>
                        <button className="w-full bg-white text-slate-700 border border-slate-200 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            <Phone size={20} />
                            {t.listing.showNumber}
                        </button>
                       </>
                   ) : (
                       <div className="space-y-3">
                           <button 
                               onClick={() => navigate(`/edit/${listing.id}`)}
                               className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                           >
                               <Pencil size={18} />
                               {t.listing.edit}
                           </button>
                           
                           <div className="grid grid-cols-2 gap-3">
                               <button 
                                   onClick={handleToggleStatus}
                                   className={`font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border ${listing.isActive !== false ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}
                               >
                                   {isProcessing ? <Loader2 className="animate-spin" size={18} /> : (listing.isActive !== false ? <EyeOff size={18} /> : <Eye size={18} />)}
                                   {listing.isActive !== false ? t.listing.hide : t.listing.activate}
                               </button>

                               <button 
                                   onClick={handleDelete}
                                   className="bg-white text-rose-600 border border-slate-200 font-bold py-3.5 rounded-xl hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
                               >
                                   {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                   {t.common.delete}
                               </button>
                           </div>
                           
                           {listing.isActive === false && (
                               <div className="text-center p-3 bg-indigo-50 text-indigo-800 rounded-xl text-sm font-medium border border-indigo-100 flex items-center justify-center gap-2">
                                   <EyeOff size={16} />
                                   {t.listing.hidden}
                               </div>
                           )}
                       </div>
                   )}
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                   <div className="flex items-start gap-3">
                      <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600 mt-0.5">
                         <CheckCircle2 size={16} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">{t.listing.moneyBack}</p>
                         <p className="text-xs text-slate-500">{t.listing.moneyBackDesc}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600 mt-0.5">
                         <ShieldCheck size={16} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">{t.listing.securePay}</p>
                         <p className="text-xs text-slate-500">{t.listing.securePayDesc}</p>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          </div>
          
          {/* Similar Listings Section */}
          {similarListings.length > 0 && (
            <div className="mt-24 pt-10 border-t border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.listing.similar}</h2>
                    <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                        Zobraziť viac
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {similarListings.map(item => (
                        <ListingCard key={item.id} listing={item} />
                    ))}
                </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;