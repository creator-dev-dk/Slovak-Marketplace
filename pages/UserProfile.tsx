
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppStore } from '../store/useStore';
import { BadgeCheck, LayoutGrid, Heart, Settings, ShieldCheck, Bell, LogOut, Trash2, Eye, EyeOff, Loader2, Pencil, Star, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '../components/ListingCard';
import { useNavigate, useParams } from 'react-router-dom';
import { TRANSLATIONS } from '../translations';

type Tab = 'listings' | 'favorites' | 'settings' | 'reviews';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // If id present = Public View
  const { user, userListings, listings, logout, favorites, deleteListing, toggleListingStatus, fetchUserListings, fetchUserProfile, viewedProfile, reviews, fetchReviews, addReview, isLoggedIn, openAuthModal, language } = useAppStore();
  const t = TRANSLATIONS[language];
  
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const navigate = useNavigate();

  // Determine which profile to show
  const isOwnProfile = !id || (user && user.id === id);
  const profileId = id || user?.id;

  useEffect(() => {
    if (profileId) {
        if (isOwnProfile) {
            // My Dashboard Mode
            fetchUserListings(); 
            fetchReviews(profileId);
        } else {
            // Public View Mode
            fetchUserProfile(profileId);
            fetchUserListings(profileId); // Fetch listings for this specific user
            fetchReviews(profileId);
        }
    }
  }, [profileId, isOwnProfile, fetchUserListings, fetchUserProfile, fetchReviews]);

  if (!profileId) {
     return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }
  
  // Decide which data object to use
  const profileData = isOwnProfile ? user : viewedProfile;

  // Access Denied / Not Found
  if (!profileData) {
     if (isOwnProfile && !isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">{t.profile.accessDenied}</h2>
                        <p className="text-slate-500 mb-6">{t.profile.loginRequired}</p>
                        <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">{t.profile.backHome}</button>
                    </div>
                </div>
            </div>
        );
     }
     return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const myListings = userListings;
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  // --- Handlers ---

  const handleReviewSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isLoggedIn) return openAuthModal();
      if (!profileId) return;
      
      try {
          await addReview(profileId, rating, comment);
          setIsReviewModalOpen(false);
          setComment('');
      } catch (e) {
          alert(t.common.error);
      }
  };

  const handleDelete = async (e: React.MouseEvent, listId: string) => {
    e.preventDefault();
    if (window.confirm(t.listing.deleteConfirm)) {
        setProcessingId(listId);
        await deleteListing(listId);
        setProcessingId(null);
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent, listId: string, currentStatus: boolean | undefined) => {
      e.preventDefault();
      setProcessingId(listId);
      const newStatus = currentStatus === false ? true : false;
      await toggleListingStatus(listId, newStatus);
      setProcessingId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-600 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white overflow-hidden">
                             {profileData.avatar && profileData.avatar.length > 5 ? (
                                <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                             ) : (
                                (profileData.name || 'U').charAt(0)
                             )}
                        </div>
                        {profileData.verificationLevel === 'BANK_ID' && (
                            <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-2 rounded-full border-4 border-white shadow-sm">
                                <BadgeCheck size={20} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{profileData.name}</h1>
                            {profileData.verificationLevel === 'BANK_ID' && (
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 mb-1.5 flex items-center gap-1">
                                    <ShieldCheck size={12} />
                                    {t.listing.verifiedBank}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 mb-6 font-medium">{t.profile.memberSince} Októbra 2023</p>
                        
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                                <span className="block text-xl font-bold text-slate-900">{myListings.length}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wide font-bold">{t.profile.listings}</span>
                            </div>
                             <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-1 justify-center md:justify-start">
                                    <span className="block text-xl font-bold text-slate-900">{profileData.rating?.toFixed(1) || '0.0'}</span>
                                    <Star size={16} className="text-amber-400 fill-amber-400 mb-0.5" />
                                </div>
                                <span className="text-xs text-slate-400 uppercase tracking-wide font-bold">{reviews.length} {t.profile.tabs.reviews}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 min-w-[160px]">
                        {isOwnProfile ? (
                            <>
                                <button onClick={() => navigate('/settings')} className="w-full border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                    <Settings size={18} /> {t.profile.editProfile}
                                </button>
                                <button onClick={() => { logout(); navigate('/'); }} className="w-full bg-rose-50 text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                                    <LogOut size={18} /> {t.profile.logout}
                                </button>
                            </>
                        ) : (
                             <button onClick={() => setIsReviewModalOpen(true)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                                 <Star size={18} /> {t.profile.reviews.writeReview}
                             </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center md:justify-start gap-8 mb-8 border-b border-slate-200 px-4 overflow-x-auto">
                <button onClick={() => setActiveTab('listings')} className={`pb-4 px-2 flex items-center gap-2 font-bold text-sm transition-all relative ${activeTab === 'listings' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <LayoutGrid size={18} /> {t.profile.tabs.listings}
                    {activeTab === 'listings' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                </button>
                
                <button onClick={() => setActiveTab('reviews')} className={`pb-4 px-2 flex items-center gap-2 font-bold text-sm transition-all relative ${activeTab === 'reviews' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Star size={18} /> {t.profile.tabs.reviews}
                    {activeTab === 'reviews' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                </button>

                {isOwnProfile && (
                    <>
                        <button onClick={() => setActiveTab('favorites')} className={`pb-4 px-2 flex items-center gap-2 font-bold text-sm transition-all relative ${activeTab === 'favorites' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Heart size={18} /> {t.profile.tabs.favorites}
                            {activeTab === 'favorites' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`pb-4 px-2 flex items-center gap-2 font-bold text-sm transition-all relative ${activeTab === 'settings' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Settings size={18} /> {t.profile.tabs.settings}
                            {activeTab === 'settings' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                        </button>
                    </>
                )}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'listings' && (
                        <div>
                             {myListings.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {myListings.map(listing => (
                                        <div key={listing.id} className="relative group">
                                            {/* Listing Card opacity if inactive */}
                                            <div className={listing.isActive === false ? 'opacity-60 grayscale' : ''}>
                                                <ListingCard listing={listing} />
                                            </div>
                                            
                                            {isOwnProfile && (
                                                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <button onClick={(e) => {e.preventDefault(); navigate(`/edit/${listing.id}`)}} className="bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-full shadow-lg hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200"><Pencil size={16} /></button>
                                                    <button onClick={(e) => handleToggleStatus(e, listing.id, listing.isActive)} className="bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-full shadow-lg hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200">{processingId === listing.id ? <Loader2 className="animate-spin" size={16} /> : (listing.isActive === false ? <Eye size={16} /> : <EyeOff size={16} />)}</button>
                                                    <button onClick={(e) => handleDelete(e, listing.id)} className="bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 border border-slate-200">{processingId === listing.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} /></button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <LayoutGrid size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium mb-4">{t.profile.emptyListings}</p>
                                    {isOwnProfile && <button onClick={() => navigate('/create')} className="text-indigo-600 font-bold hover:underline">{t.profile.addFirst}</button>}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="max-w-3xl">
                             {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map(review => (
                                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                                    {review.reviewerAvatar ? <img src={review.reviewerAvatar} className="w-full h-full object-cover" /> : <span className="font-bold text-slate-400">{review.reviewerName.charAt(0)}</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-bold text-slate-900">{review.reviewerName}</h4>
                                                    <span className="text-xs text-slate-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex gap-0.5 text-amber-400 mb-2">
                                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-amber-400" : "text-slate-200"} />)}
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             ) : (
                                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                                    <Star size={32} className="mx-auto mb-3 opacity-30" />
                                    <p>{t.profile.reviews.noReviews}</p>
                                </div>
                             )}
                        </div>
                    )}

                    {isOwnProfile && activeTab === 'favorites' && (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {favoriteListings.length > 0 ? (
                                favoriteListings.map(listing => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-slate-400 font-medium">
                                    {t.profile.emptyFavorites}
                                </div>
                            )}
                        </div>
                    )}

                    {isOwnProfile && activeTab === 'settings' && (
                        <div className="max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Bell size={20} className="text-indigo-600" />
                                {t.profile.notifications}
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-slate-50">
                                    <div>
                                        <p className="font-bold text-slate-900">{t.profile.emailNotif}</p>
                                        <p className="text-sm text-slate-400">{t.profile.emailNotifDesc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 transition-colors after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
            
            {/* Review Modal */}
            <AnimatePresence>
                {isReviewModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold mb-4">{t.profile.reviews.writeReview}</h2>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="flex justify-center gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setRating(star)} className="p-1 transition-transform hover:scale-110">
                                            <Star size={32} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    className="w-full border border-slate-200 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
                                    placeholder={t.profile.reviews.commentPlaceholder}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsReviewModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">{t.common.cancel}</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">{t.common.submit}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
