import React, { useState } from 'react';
import { Search, Plus, User, Menu, X, Globe, ChevronDown, LogOut, Heart, MessageCircle } from 'lucide-react';
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
    <nav className="sticky top-0 z-[60] w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-slovak-blue rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slovak-blue/20 transition-transform group-hover:scale-105">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tight text-slovak-blue leading-none">
                Prémiov
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slovak-gold font-semibold">
                Slovakia
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-12">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-slovak-blue transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slovak-blue/20 focus:border-slovak-blue transition-all duration-300"
                placeholder={t.nav.searchPlaceholder}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-slovak-blue transition-colors"
            >
              <Globe size={16} />
              <span>{language}</span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {/* Login / User Profile */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-5">
                 {/* Favorites Icon */}
                 <Link to="/profile" className="relative text-gray-400 hover:text-slovak-red transition-colors group">
                    <Heart size={22} className={favorites.length > 0 ? "fill-slovak-red/10 stroke-slovak-red" : ""} />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slovak-red text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {favorites.length}
                      </span>
                    )}
                 </Link>

                 {/* Messages Icon */}
                 <Link to="/chat" className="relative text-gray-400 hover:text-slovak-blue transition-colors group">
                    <MessageCircle size={22} />
                    {unreadMessagesCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                        {unreadMessagesCount}
                      </span>
                    )}
                 </Link>

                 <div className="h-6 w-px bg-gray-200 mx-1"></div>

                 <Link to="/profile" className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-slovak-blue text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white group-hover:ring-blue-100 transition-all">
                      {user.avatar}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-slovak-blue transition-colors">{user.name}</span>
                 </Link>
                 <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors" title={t.nav.logout}>
                    <LogOut size={18} />
                 </button>
              </div>
            ) : (
              <button 
                onClick={openAuthModal}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-slovak-blue transition-colors"
              >
                <User size={18} />
                <span>{t.nav.login}</span>
              </button>
            )}

            {/* Premium CTA */}
            <button 
              onClick={handleAddListing}
              className="flex items-center gap-2 bg-slovak-blue text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-slovak-dark transition-all shadow-lg shadow-slovak-blue/25 hover:shadow-slovak-blue/40 active:scale-95"
            >
              <Plus size={16} />
              <span>{t.nav.addListing}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
             {isLoggedIn && (
               <Link to="/chat" className="relative text-gray-600">
                  <MessageCircle size={24} />
                   {unreadMessagesCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                    )}
               </Link>
             )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-slovak-blue p-2"
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
          className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl"
        >
          <div className="px-4 pt-4 pb-3 space-y-3">
             <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900"
                  placeholder={t.nav.searchPlaceholder}
                />
            </div>
            
            {!isLoggedIn && (
               <button onClick={() => { openAuthModal(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                 {t.nav.login}
               </button>
            )}

            {isLoggedIn && (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  {t.nav.myProfile}
                  {favorites.length > 0 && <span className="text-xs font-bold text-slovak-red">{favorites.length} {t.nav.favorites}</span>}
                </Link>
                <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  {t.nav.messages}
                  {unreadMessagesCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadMessagesCount}</span>}
                </Link>
              </>
            )}

            <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
              {t.nav.about}
            </Link>
            
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg w-full text-left"
            >
              <Globe size={18} />
              Switch to {language === 'SK' ? 'English' : 'Slovak'}
            </button>

            <div className="border-t border-gray-100 my-2"></div>
            
            <button 
              onClick={() => { handleAddListing(); setIsMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 bg-slovak-blue text-white px-5 py-3 rounded-xl font-semibold"
            >
              <Plus size={18} />
              <span>{t.nav.addListing}</span>
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;