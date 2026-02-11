import React from 'react';
import { Facebook, Instagram, Linkedin, Send } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { TRANSLATIONS } from '../translations';

const Footer: React.FC = () => {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-slovak-dark text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slovak-blue font-bold text-xl shadow-glow">
                  P
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl tracking-tight text-white leading-none">
                    Prémiov
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slovak-gold font-semibold">
                    Slovakia
                  </span>
                </div>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed mb-6">
               {t.footer.slogan}
             </p>
             <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-slovak-blue hover:text-white text-gray-400 transition-all">
                   <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-slovak-blue hover:text-white text-gray-400 transition-all">
                   <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-slovak-blue hover:text-white text-gray-400 transition-all">
                   <Linkedin size={18} />
                </a>
             </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">{t.footer.col1}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-slovak-gold transition-colors">{t.footer.links.howItWorks}</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">{t.footer.links.pricing}</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">{t.footer.links.concierge}</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">{t.footer.links.business}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-lg">{t.footer.col2}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-slovak-gold transition-colors">{t.footer.links.about}</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">{t.footer.links.career}</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">{t.footer.links.press}</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">{t.footer.links.contact}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">{t.footer.col3}</h4>
            <p className="text-gray-400 text-sm mb-4">
              {t.footer.newsletterDesc}
            </p>
            <div className="relative">
               <input 
                 type="email" 
                 placeholder={t.footer.emailPlaceholder}
                 className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-slovak-gold transition-colors"
               />
               <button className="absolute right-2 top-2 bg-slovak-gold p-1.5 rounded-lg text-slovak-dark hover:bg-white transition-colors">
                  <Send size={16} />
               </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
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