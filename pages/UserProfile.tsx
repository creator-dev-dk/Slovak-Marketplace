import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppStore } from '../store/useStore';
import { BadgeCheck, LayoutGrid, Heart, Settings, ShieldCheck, Bell, LogOut, Trash2, Eye, EyeOff, Loader2, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '../components/ListingCard';
import { useNavigate } from 'react-router-dom';

type Tab = 'listings' | 'favorites' | 'settings';

const UserProfile: React.FC = () => {
  const { user, userListings, listings, logout, favorites, deleteListing, toggleListingStatus, fetchUserListings } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user listings on mount to see all items (including inactive)
  useEffect(() => {
    if (user) {
      fetchUserListings();
    }
  }, [user, fetchUserListings]);

  // If not logged in
  if (!user) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Prístup zamietnutý</h2>
                    <p className="text-slate-500 mb-6">Pre zobrazenie profilu sa musíte prihlásiť.</p>
                    <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">Späť domov</button>
                </div>
            </div>
        </div>
    );
  }

  // Use userListings (private full list) instead of public listings
  const myListings = userListings;
  
  // Filter favorites from public listings (to ensure they are active/valid)
  const favoriteListings = listings.filter(l => favorites.includes(l.id));

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.confirm('Naozaj chcete odstrániť tento inzerát? Táto akcia je nevratná.')) {
        setProcessingId(id);
        await deleteListing(id);
        setProcessingId(null);
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent, id: string, currentStatus: boolean | undefined) => {
      e.preventDefault();
      setProcessingId(id);
      // If undefined, assume true (active) and toggle to false
      const newStatus = currentStatus === false ? true : false;
      await toggleListingStatus(id, newStatus);
      setProcessingId(null);
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      navigate(`/edit/${id}`);
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
                             {user.avatar && user.avatar.length > 5 ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                             ) : (
                                user.avatar
                             )}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-2 rounded-full border-4 border-white shadow-sm" title="BankID Overený">
                            <BadgeCheck size={20} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 mb-1.5 flex items-center gap-1">
                                <ShieldCheck size={12} />
                                BankID Overený
                            </span>
                        </div>
                        <p className="text-slate-500 mb-6 font-medium">Členom od Októbra 2023 • Bratislava</p>
                        
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                                <span className="block text-xl font-bold text-slate-900">{myListings.length}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wide font-bold">Inzerátov</span>
                            </div>
                             <div className="bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
                                <span className="block text-xl font-bold text-slate-900">4.9</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wide font-bold">Hodnotenie</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 min-w-[160px]">
                        <button onClick={() => navigate('/settings')} className="w-full border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                            <Settings size={18} /> Upraviť profil
                        </button>
                        <button onClick={() => { logout(); navigate('/'); }} className="w-full bg-rose-50 text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                            <LogOut size={18} /> Odhlásiť sa
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center md:justify-start gap-8 mb-8 border-b border-slate-200 px-4">
                {[
                    { id: 'listings', label: 'Moje inzeráty', icon: <LayoutGrid size={18} /> },
                    { id: 'favorites', label: 'Obľúbené', icon: <Heart size={18} /> },
                    { id: 'settings', label: 'Nastavenia', icon: <Settings size={18} /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`pb-4 px-2 flex items-center gap-2 font-bold text-sm transition-all relative ${
                            activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" 
                            />
                        )}
                    </button>
                ))}
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
                                            
                                            {/* Status Badge Overlays */}
                                            {listing.isActive === false && (
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/80 text-white px-4 py-2 rounded-xl font-bold backdrop-blur-sm z-10 pointer-events-none">
                                                    PREDANÉ
                                                </div>
                                            )}

                                            {/* Action Buttons Overlay */}
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                <button 
                                                    onClick={(e) => handleEdit(e, listing.id)}
                                                    className="bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-full shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200"
                                                    title="Upraviť"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleToggleStatus(e, listing.id, listing.isActive)}
                                                    className="bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-full shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-200"
                                                    title={listing.isActive === false ? "Označiť ako aktívne" : "Označiť ako predané"}
                                                >
                                                    {processingId === listing.id ? <Loader2 className="animate-spin" size={16} /> : (listing.isActive === false ? <Eye size={16} /> : <EyeOff size={16} />)}
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDelete(e, listing.id)}
                                                    className="bg-white/90 backdrop-blur-sm text-slate-700 p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-all border border-slate-200"
                                                    title="Odstrániť"
                                                >
                                                    {processingId === listing.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <LayoutGrid size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium mb-4">Zatiaľ nemáte žiadne aktívne inzeráty.</p>
                                    <button onClick={() => navigate('/create')} className="text-indigo-600 font-bold hover:underline">Pridať prvý inzerát</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {favoriteListings.length > 0 ? (
                                favoriteListings.map(listing => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 text-slate-400 font-medium">
                                    Zatiaľ nemáte žiadne obľúbené inzeráty.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Bell size={20} className="text-indigo-600" />
                                Notifikácie
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-slate-50">
                                    <div>
                                        <p className="font-bold text-slate-900">Emailové upozornenia</p>
                                        <p className="text-sm text-slate-400">Dostávať správy o nových ponukách</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;