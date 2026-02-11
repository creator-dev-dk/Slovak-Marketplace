import React from 'react';
import { Facebook, Instagram, Linkedin, Send } from 'lucide-react';

const Footer: React.FC = () => {
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
               Definujeme nový štandard online obchodu na Slovensku. 
               Bezpečnosť, rýchlosť a prémiový zážitok v každom detaile.
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
            <h4 className="font-bold text-white mb-6 text-lg">Inzercia</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-slovak-gold transition-colors">Ako funguje BankID</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">Cenník Premium</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">Concierge Služby</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">Pre firmy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Spoločnosť</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-slovak-gold transition-colors">O nás</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">Kariéra</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">Press kit</a></li>
              <li><a href="#" className="hover:text-slovak-gold transition-colors">Kontakt</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Získajte prístup k exkluzívnym ponukám ako prví.
            </p>
            <div className="relative">
               <input 
                 type="email" 
                 placeholder="Váš email" 
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
          <p>&copy; 2024 Prémiov Slovensko s.r.o. Všetky práva vyhradené.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white transition-colors">Podmienky</a>
             <a href="#" className="hover:text-white transition-colors">Súkromie</a>
             <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;