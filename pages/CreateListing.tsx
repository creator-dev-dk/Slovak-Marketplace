import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera, Check, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import { VerificationLevel } from '../types';

const CreateListing: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { addListing, user } = useAppStore();

  // Mock Form State
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    // Use a reliable Macbook image
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800'
  });

  const handleNext = () => setStep(prev => prev + 1);
  
  const handleUploadSimulation = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // AI Simulation: Auto-fill data
      setFormData(prev => ({
        ...prev,
        title: 'Apple MacBook Pro 14" M3',
        price: '1850',
        category: 'Elektro',
        description: 'Predám takmer nepoužívaný MacBook Pro M3. Batéria 100%, bez škrabancov. Kompletné balenie.'
      }));
    }, 1500);
  };

  const handlePublish = () => {
      const newListing = {
          id: Math.random().toString(36).substr(2, 9),
          title: formData.title,
          price: Number(formData.price),
          currency: '€',
          location: 'Bratislava - Staré Mesto', // Default for prototype
          imageUrl: formData.imageUrl,
          category: 'electro', // Simplified for prototype
          isPremium: true,
          verificationLevel: VerificationLevel.BANK_ID,
          sellerName: user?.name || 'Marek Novák',
          postedAt: 'Práve teraz',
      };

      addListing(newListing);
      navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slovak-light font-sans">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-bold ${step >= 1 ? 'text-slovak-blue' : 'text-gray-400'}`}>Fotografie</span>
              <span className={`text-sm font-bold ${step >= 2 ? 'text-slovak-blue' : 'text-gray-400'}`}>Detaily</span>
              <span className={`text-sm font-bold ${step >= 3 ? 'text-slovak-blue' : 'text-gray-400'}`}>Verifikácia</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-slovak-blue"
                initial={{ width: '0%' }}
                animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-12 relative overflow-hidden">
            
            {/* Step 1: Upload & AI */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Čo chcete predať?</h1>
                <p className="text-gray-500 mb-8">Nahrajte fotky a naša AI automaticky vyplní detaily.</p>

                <div 
                  onClick={handleUploadSimulation}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-slovak-blue hover:bg-blue-50/30 transition-all group"
                >
                  {isUploading ? (
                     <div className="flex flex-col items-center text-slovak-blue">
                        <Sparkles className="animate-spin mb-4" size={32} />
                        <span className="font-semibold animate-pulse">Analyzujem fotografie...</span>
                     </div>
                  ) : formData.title ? (
                     <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <img src={formData.imageUrl} className="object-cover w-full h-full" alt="Uploaded" />
                        <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                           <Check size={12} /> AI Rozpoznané
                        </div>
                     </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-100 text-slovak-blue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Camera size={32} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">Nahrať fotografie</h3>
                      <p className="text-sm text-gray-400 mt-2">JPG, PNG (Max 10MB)</p>
                    </>
                  )}
                </div>
                
                {formData.title && (
                   <div className="mt-8">
                      <button onClick={handleNext} className="w-full bg-slovak-blue text-white py-4 rounded-xl font-bold hover:bg-slovak-dark transition-all flex items-center justify-center gap-2">
                        Pokračovať na detaily <ChevronRight size={20} />
                      </button>
                   </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Details Form */}
            {step === 2 && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Skontrolujte detaily</h1>
                  
                  <div className="space-y-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Názov inzerátu</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium" />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Cena (€)</label>
                           <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-lg" />
                        </div>
                         <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Kategória</label>
                           <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue outline-none bg-white">
                              <option>{formData.category}</option>
                              <option>Auto-Moto</option>
                              <option>Nehnuteľnosti</option>
                           </select>
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Popis</label>
                        <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-gray-600"></textarea>
                     </div>

                     <div className="pt-4 flex gap-4">
                        <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all">
                           Späť
                        </button>
                        <button onClick={handleNext} className="flex-[2] bg-slovak-blue text-white py-4 rounded-xl font-bold hover:bg-slovak-dark transition-all flex items-center justify-center gap-2">
                           Pokračovať <ChevronRight size={20} />
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Step 3: Verification & Preview */}
            {step === 3 && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="text-center mb-8">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} />
                     </div>
                     <h1 className="text-2xl font-bold text-gray-900">Vyzerá to skvele, {user ? user.name.split(' ')[0] : 'Užívateľ'}!</h1>
                     <p className="text-gray-500">Vaša identita je overená cez <span className="font-bold text-slovak-blue">Tatra Banka a.s.</span></p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex gap-4 border border-gray-200">
                     <img src={formData.imageUrl} className="w-24 h-24 object-cover rounded-lg" alt="Preview" />
                     <div>
                        <h3 className="font-bold text-lg text-gray-900">{formData.title}</h3>
                        <p className="text-slovak-blue font-bold text-xl">{formData.price} €</p>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-xs bg-slovak-gold/20 text-slovak-dark px-2 py-0.5 rounded font-bold">PREMIUM Listing</span>
                        </div>
                     </div>
                  </div>

                  <button onClick={handlePublish} className="w-full bg-slovak-blue text-white py-4 rounded-xl font-bold hover:bg-slovak-dark transition-all shadow-xl shadow-slovak-blue/20 hover:shadow-slovak-blue/30 active:scale-95">
                     Zverejniť inzerát
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-4">
                     Kliknutím súhlasíte s podmienkami inzercie. Váš inzerát bude viditeľný okamžite.
                  </p>
               </motion.div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateListing;