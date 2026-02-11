import React from 'react';
import { ShieldCheck, Zap, UserCheck, Smartphone } from 'lucide-react';

const TrustValues: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative border-t border-slate-800">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 px-3 py-1 rounded-full text-xs font-bold mb-6">
               SECURITY FIRST
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight leading-tight">
              Bezpečnosť je naša <span className="text-indigo-400">priorita</span>.
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Eliminovali sme anonymitu. Vďaka integrácii s bankovými systémami a AI moderáciou vytvárame priestor, kde sa nemusíte báť podvodníkov.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">BankID Verifikácia</h3>
                  <p className="text-slate-400 text-sm mt-1">Každý predajca prechádza overením identity cez svoju banku.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                 <div className="flex-shrink-0 w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Garancia peňazí</h3>
                  <p className="text-slate-400 text-sm mt-1">Platba je uvoľnená predajcovi až po tom, čo potvrdíte prijatie tovaru.</p>
                </div>
              </div>
            </div>

            <button className="mt-10 bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-lg shadow-white/10">
              Zistiť viac o bezpečnosti
            </button>
          </div>

          <div className="relative">
             <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-2xl shadow-indigo-500/10 transform md:rotate-2 hover:rotate-0 transition-transform duration-500 border border-slate-200">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">Transakcia schválená</p>
                        <p className="text-xs text-slate-500">TatraPay Secure Gate</p>
                      </div>
                   </div>
                   <span className="text-emerald-600 font-bold text-sm font-mono">+ 850,00 €</span>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                   <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 animate-pulse"></div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">Apple iPhone 14 Pro</p>
                        <p className="text-xs text-slate-500">Doručené cez Packeta Box</p>
                      </div>
                   </div>
                </div>
                <div className="text-center">
                   <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
                      <ShieldCheck size={10} /> Verified by Prémiov
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustValues;