import React from 'react';
import { Search, MapPin, ChevronDown, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { TRANSLATIONS } from '../translations';

const REGION_OPTIONS = [
  'Bratislavský', 
  'Trnavský', 
  'Trenčiansky', 
  'Nitriansky', 
  'Žilinský', 
  'Banskobystrický', 
  'Prešovský', 
  'Košický'
];

const Hero: React.FC = () => {
  const { searchQuery, setSearchQuery, selectedRegion, setRegion, language, fetchListings } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <div className="relative bg-white border-b border-slate-200 overflow-hidden">
      {/* SaaS Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold mb-6 shadow-sm">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
             {t.hero.tagline}
          </div>

          {/* H1 Typography - Dark, Tight, Professional */}
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            {t.hero.titleStart} <span className="text-indigo-600">{t.hero.titleEnd}</span>
          </h1>
          
          <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.hero.subtitle}
          </p>
        </div>

        {/* Search Bar - Filter Bar Aesthetics */}
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xl shadow-slate-200/40 max-w-3xl mx-auto flex flex-col md:flex-row gap-2">
          
          <div className="flex-1 flex items-center bg-transparent px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100">
            <Search className="text-slate-400 mr-3" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="bg-transparent w-full outline-none text-slate-900 placeholder-slate-400 text-sm font-medium"
            />
          </div>
          
          <div className="md:w-64 flex items-center bg-transparent px-4 py-2 relative group cursor-pointer">
            <MapPin className="text-slate-400 mr-3 group-hover:text-indigo-500 transition-colors" size={18} />
            <select 
              value={selectedRegion || ''}
              onChange={(e) => setRegion(e.target.value || null)}
              className="bg-transparent w-full outline-none text-slate-900 appearance-none cursor-pointer text-sm font-medium"
            >
              <option value="">{t.hero.locationAll}</option>
              {REGION_OPTIONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" size={14} />
          </div>

          <button 
            onClick={() => fetchListings()}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg px-6 py-3 md:py-0 transition-all text-sm shadow-sm flex items-center justify-center gap-2"
          >
            {t.hero.searchBtn}
          </button>
        </div>

        {/* Stats / Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-8 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
             <Filter size={14} className="text-indigo-500" />
             1450+ Active Listings
          </span>
           <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
             <ShieldCheck size={14} className="text-emerald-500" />
             BankID Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;