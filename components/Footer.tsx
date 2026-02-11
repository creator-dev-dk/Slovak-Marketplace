import React from 'react';
import { Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { TRANSLATIONS } from '../translations';

const Footer: React.FC = () => {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                  P
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-white leading-none">
                    Prémiov
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold mt-1">
                    Slovakia
                  </span>
                </div>
             </div>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">
               {t.footer.slogan}
             </p>
             <div className="flex gap-4">
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white text-slate-400 transition-all border border-slate-700 hover:border-indigo-500">
                   <Facebook size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white text-slate-400 transition-all border border-slate-700 hover:border-indigo-500">
                   <Instagram size={16} />
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white text-slate-400 transition-all border border-slate-700 hover:border-indigo-500">
                   <Linkedin size={16} />
                </a>
             </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">{t.footer.col1}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.footer.links.howItWorks}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.footer.links.pricing}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.footer.links.concierge}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.footer.links.business}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">{t.footer.col2}</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.footer.links.about}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.footer.links.career}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.footer.links.press}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t.footer.links.contact}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">{t.footer.col3}</h4>
            <p className="text-slate-400 text-sm mb-4">
              {t.footer.newsletterDesc}
            </p>
            <div className="relative">
               <input 
                 type="email" 
                 placeholder={t.footer.emailPlaceholder}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
               />
               <button className="absolute right-1.5 top-1.5 bg-indigo-600 p-1.5 rounded-md text-white hover:bg-indigo-500 transition-colors">
                  <Send size={14} />
               </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; 2024 Prémiov Slovensko s.r.o. {t.footer.rights}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
             <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
             <a href="#" className="hover:text-white transition-colors">{t.footer.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;