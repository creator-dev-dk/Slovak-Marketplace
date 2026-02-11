import React, { useState } from 'react';
import { Search, Plus, User, Menu, X, Globe, ChevronDown, LogOut, Heart, MessageSquare, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import { AnimatePresence, motion } from 'framer-motion';
import { TRANSLATIONS } from '../translations';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const { isLoggedIn, user, openAuthModal, logout, favorites, unreadMessagesCount, language, setLanguage } = useAppStore();
  const t = TRANSLATIONS[language];

  const handleAddListing = () => {
    if (!isLoggedIn) {
      openAuthModal();
    } else {
      navigate('/create');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'SK' ? 'EN' : 'SK');
  };

  return (
    <nav className="sticky top-0 z-[60] w-full bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand - SaaS Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-200 transition-transform group-hover:scale-105">
              P
            </div>
            <span className="font-semibold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Prémiov
            </span>
          </Link>

          {/* Search Bar - SaaS Command Palette Style */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-12 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                placeholder={t.nav.searchPlaceholder}
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                 <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 border border-slate-200 rounded bg-white font-sans text-[10px] font-medium text-slate-400">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher - Minimal */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              <span>{language}</span>
              <ChevronDown size={12} strokeWidth={2.5} />
            </button>

            {isLoggedIn && user ? (
              <div className="flex items-center gap-3 pl-2">
                 {/* Notification Icons */}
                 <div className="flex items-center gap-1 border-r border-slate-200 pr-3 mr-1">
                     <Link to="/profile" className="relative p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors group">
                        <Heart size={18} className={favorites.length > 0 ? "fill-rose-500 stroke-rose-500" : ""} />
                     </Link>

                     <Link to="/chat" className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <MessageSquare size={18} />
                        {unreadMessagesCount > 0 && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
                        )}
                     </Link>
                     
                     <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <Bell size={18} />
                     </button>
                 </div>

                 {/* Profile Avatar */}
                 <Link to="/profile" className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs group-hover:border-indigo-300 transition-colors">
                      {user.avatar}
                    </div>
                 </Link>
              </div>
            ) : (
              <button 
                onClick={openAuthModal}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2"
              >
                {t.nav.login}
              </button>
            )}

            {/* Primary CTA - Solid Indigo */}
            <button 
              onClick={handleAddListing}
              className="ml-2 flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 active:translate-y-0.5"
            >
              <Plus size={16} />
              <span>{t.nav.addListing}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
             {isLoggedIn && (
               <Link to="/chat" className="relative text-slate-600">
                  <MessageSquare size={22} />
                   {unreadMessagesCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white"></span>
                    )}
               </Link>
             )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-indigo-600 p-1"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
        >
          <div className="px-4 py-4 space-y-3">
             <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder={t.nav.searchPlaceholder}
                />
            </div>
            
            {!isLoggedIn && (
               <button onClick={() => { openAuthModal(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                 {t.nav.login}
               </button>
            )}

            {isLoggedIn && (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                  {t.nav.myProfile}
                  {favorites.length > 0 && <span className="text-xs font-bold text-rose-500">{favorites.length}</span>}
                </Link>
                <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                  {t.nav.messages}
                  {unreadMessagesCount > 0 && <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadMessagesCount}</span>}
                </Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                    {t.nav.logout}
                </button>
              </>
            )}

            <div className="border-t border-slate-100 my-2 pt-2">
                <button 
                onClick={() => { handleAddListing(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm shadow-sm"
                >
                <Plus size={16} />
                <span>{t.nav.addListing}</span>
                </button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;