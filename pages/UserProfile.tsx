import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppStore } from '../store/useStore';
import { BadgeCheck, LayoutGrid, Heart, Settings, ShieldCheck, Mail, Bell, Smartphone, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from '../components/ListingCard';
import { useNavigate } from 'react-router-dom';

type Tab = 'listings' | 'favorites' | 'settings';

const UserProfile: React.FC = () => {
  const { user, listings, logout } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('listings');
  const navigate = useNavigate();

  // If not logged in (handled simply for prototype)
  if (!user) {
    return (
        <div className="min-h-screen bg-slovak-light flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Prístup zamietnutý</h2>
                    <p className="text-gray-500 mb-6">Pre zobrazenie profilu sa musíte prihlásiť.</p>
                    <button onClick={() => navigate('/')} className="text-slovak-blue font-bold hover:underline">Späť domov</button>
                </div>
            </div>
        </div>
    );
  }

  // Filter Data
  const myListings = listings.filter(l => l.sellerName === user.name);
  // Mock favorites - just take the first 2 listings that aren't mine
  const favoriteListings = listings.filter(l => l.sellerName !== user.name).slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-slovak-light font-sans">
      <Navbar />
      
      <main className="flex-grow pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slovak-blue/5 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none"></div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-slovak-blue text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white">
                            {user.avatar}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-green-500 text-white p-2 rounded-full border-4 border-white shadow-sm" title="BankID Overený">
                            <BadgeCheck size={20} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <span className="bg-blue-50 text-slovak-blue text-xs font-bold px-3 py-1 rounded-full border border-blue-100 mb-1.5 flex items-center gap-1">
                                <ShieldCheck size={12} />
                                BankID Overený
                            </span>
                        </div>
                        <p className="text-gray-500 mb-6">Členom od Októbra 2023 • Bratislava</p>
                        
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <span className="block text-xl font-bold text-slovak-blue">{myListings.length}</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Inzerátov</span>
                            </div>
                             <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                <span className="block text-xl font-bold text-slovak-blue">4.9</span>
                                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Hodnotenie</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 min-w-[160px]">
                        <button className="w-full border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            <Settings size={18} /> Upraviť profil
                        </button>
                        <button onClick={() => { logout(); navigate('/'); }} className="w-full bg-red-50 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                            <LogOut size={18} /> Odhlásiť sa
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex justify-center md:justify-start gap-8 mb-8 border-b border-gray-200 px-4">
                {[
                    { id: 'listings', label: 'Moje inzeráty', icon: <LayoutGrid size={18} /> },
                    { id: 'favorites', label: 'Obľúbené', icon: <Heart size={18} /> },
                    { id: 'settings', label: 'Nastavenia', icon: <Settings size={18} /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`pb-4 px-2 flex items-center gap-2 font-medium text-sm transition-all relative ${
                            activeTab === tab.id ? 'text-slovak-blue' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-slovak-blue rounded-full" 
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
                                            <ListingCard listing={listing} />
                                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-gray-100">Upraviť</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <LayoutGrid size={32} />
                                    </div>
                                    <p className="text-gray-500 font-medium mb-4">Zatiaľ nemáte žiadne aktívne inzeráty.</p>
                                    <button onClick={() => navigate('/create')} className="text-slovak-blue font-bold hover:underline">Pridať prvý inzerát</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'favorites' && (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {favoriteListings.map(listing => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-2xl bg-white rounded-3xl shadow-soft border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Bell size={20} className="text-slovak-blue" />
                                Notifikácie
                            </h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-gray-50">
                                    <div>
                                        <p className="font-bold text-gray-800">Emailové upozornenia</p>
                                        <p className="text-sm text-gray-400">Dostávať správy o nových ponukách</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between py-4 border-b border-gray-50">
                                    <div>
                                        <p className="font-bold text-gray-800">SMS notifikácie</p>
                                        <p className="text-sm text-gray-400">Bezpečnostné kódy a stav objednávok</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>

                                 <div className="flex items-center justify-between py-4">
                                    <div>
                                        <p className="font-bold text-gray-800">Newsletter</p>
                                        <p className="text-sm text-gray-400">Tipy a novinky zo sveta Premium</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mt-8 mb-6 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-slovak-blue" />
                                Zabezpečenie
                            </h3>
                            <button className="text-slovak-blue font-semibold text-sm hover:underline">Zmeniť heslo</button>
                            <br/>
                            <button className="text-slovak-blue font-semibold text-sm hover:underline mt-4">História prihlásení</button>

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