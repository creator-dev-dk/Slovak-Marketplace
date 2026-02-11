import React from 'react';
import { ShieldCheck, Zap, UserCheck, Smartphone } from 'lucide-react';

const TrustValues: React.FC = () => {
  return (
    <section className="py-20 bg-slovak-blue text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bezpečnosť je naša priorita.</h2>
            <p className="text-blue-200 text-lg mb-8 leading-relaxed">
              Eliminovali sme anonymitu. Vďaka integrácii s bankovými systémami a AI moderáciou vytvárame priestor, kde sa nemusíte báť podvodníkov.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-slovak-red">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">BankID Verifikácia</h3>
                  <p className="text-blue-200 text-sm">Každý predajca prechádza overením identity cez svoju banku.</p>
                </div>
              </div>

              <div className="flex gap-4">
                 <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-green-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Garancia peňazí</h3>
                  <p className="text-blue-200 text-sm">Platba je uvoľnená predajcovi až po tom, čo potvrdíte prijatie tovaru.</p>
                </div>
              </div>
            </div>

            <button className="mt-10 bg-white text-slovak-blue px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              Zistiť viac o bezpečnosti
            </button>
          </div>

          <div className="relative">
             <div className="bg-white rounded-2xl p-6 text-gray-800 shadow-2xl transform md:rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Transakcia schválená</p>
                        <p className="text-xs text-gray-500">TatraPay Secure Gate</p>
                      </div>
                   </div>
                   <span className="text-green-600 font-bold text-sm">+ 850,00 €</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                   <div className="flex gap-3">
                      <img src="https://picsum.photos/100/100" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-sm">Apple iPhone 14 Pro</p>
                        <p className="text-xs text-gray-500">Doručené cez Packeta Box</p>
                      </div>
                   </div>
                </div>
                <div className="text-center">
                   <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Verified by Prémiov</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustValues;