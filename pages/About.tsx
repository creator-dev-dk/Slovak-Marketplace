import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, Zap, Globe, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      <main className="flex-grow">
        
        {/* 1. Hero / Mission Statement */}
        <section className="relative pt-24 pb-20 overflow-hidden">
           <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
           
           <div className="max-w-4xl mx-auto px-4 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                  <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-6 inline-block">
                    Naša Misia
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
                    Definujeme nový štandard <br/>
                    <span className="text-slate-400">obchodovania na Slovensku.</span>
                  </h1>
                  <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Prémiov vznikol z frustrácie nad anonymitou a podvodmi. 
                    Prinášame platformu, kde je dôvera garantovaná technológiou BankID.
                  </p>
              </motion.div>
           </div>
        </section>

        {/* 2. Bento Grid Features */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Security (Large) */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="md:col-span-2 bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-white flex flex-col justify-center min-h-[300px]"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30 text-indigo-400">
                           <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">Bezpečnosť bez kompromisov.</h3>
                        <p className="text-slate-400 text-lg max-w-md">
                           Sme prvý marketplace na Slovensku integrovaný priamo s bankovými systémami. 
                           Každý predajca je overený, každá transakcia je chránená.
                        </p>
                    </div>
                </motion.div>

                {/* Card 2: Speed */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                   className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 text-amber-500">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Pravidlo 3 klikov</h3>
                        <p className="text-slate-500">
                           Pridanie inzerátu trvá menej ako 90 sekúnd. AI automaticky vyplní kategórie a parametre z fotiek.
                        </p>
                    </div>
                </motion.div>

                {/* Card 3: Community */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2 }}
                   className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-200"
                >
                     <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                        <Users size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Komunita náročných</h3>
                        <p className="text-indigo-100">
                           Spájame ľudí, ktorí oceňujú kvalitu. Od zberateľov hodiniek po investorov do nehnuteľností.
                        </p>
                    </div>
                </motion.div>

                {/* Card 4: Global Reach (Large) */}
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3 }}
                   className="md:col-span-2 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">Slovenské srdce, svetové štandardy.</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Lokálna podpora v Bratislave (24/7)</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Právna ochrana kupujúceho podľa EÚ noriem</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <span>Transparentné poplatky bez skrytých nákladov</span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/3 aspect-square bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                             <TrendingUp size={64} className="text-slate-200" />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>

        {/* 3. Stats Section */}
        <section className="py-20 border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Dôverujú nám tisíce Slovákov</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">12k+</div>
                        <div className="text-slate-500 font-medium">Aktívnych používateľov</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">€5M+</div>
                        <div className="text-slate-500 font-medium">Objem transakcií</div>
                    </div>
                     <div>
                        <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">98%</div>
                        <div className="text-slate-500 font-medium">Spokojnosť zákazníkov</div>
                    </div>
                     <div>
                        <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">24h</div>
                        <div className="text-slate-500 font-medium">Priemerný čas predaja</div>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default About;