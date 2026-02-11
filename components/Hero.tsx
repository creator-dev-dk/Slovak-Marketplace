import React from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { REGIONS } from '../constants';
import { useAppStore } from '../store/useStore';
import { TRANSLATIONS } from '../translations';

const Hero: React.FC = () => {
  const { searchQuery, setSearchQuery, language } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <div className="relative bg-slovak-gray overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-red-50 rounded-full blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-slovak-red font-bold tracking-widest uppercase text-xs mb-3 block">
            {t.hero.tagline}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slovak-blue tracking-tight mb-6 leading-tight">
            {t.hero.titleStart} <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slovak-blue to-blue-600">
              {t.hero.titleEnd}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Search Component */}
        <div className="bg-white p-2 md:p-3 rounded-2xl shadow-xl shadow-blue-900/5 max-w-4xl mx-auto flex flex-col md:flex-row gap-2 border border-gray-100">
          <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-slovak-blue/30 focus-within:bg-white transition-all">
            <Search className="text-gray-400 mr-3" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>
          
          <div className="md:w-64 flex items-center bg-gray-50 rounded-xl px-4 py-3 relative group cursor-pointer border-l border-white md:border-none">
            <MapPin className="text-gray-400 mr-3" size={20} />
            <select className="bg-transparent w-full outline-none text-gray-800 appearance-none cursor-pointer font-medium">
              <option value="">{t.hero.locationAll}</option>
              {REGIONS.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 text-gray-400 pointer-events-none" size={16} />
          </div>

          <button className="bg-slovak-blue hover:bg-blue-900 text-white font-semibold rounded-xl px-8 py-3 md:py-0 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            {t.hero.searchBtn}
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-sm text-gray-500 font-medium">
          <span className="flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-green-500"></div> 1450+ {t.hero.stats.newListings}
          </span>
          <span className="hidden md:flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-slovak-blue"></div> {t.hero.stats.verified}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;