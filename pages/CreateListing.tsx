import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera, ChevronRight, ShieldCheck, Loader2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';

// Exact matches for Postgres enum 'region_enum'
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

const CreateListing: React.FC = () => {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { addListing, user, isLoading, isAuthLoading, openAuthModal, categories, fetchCategories } = useAppStore();

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    categoryId: '',
    description: '',
    isPremium: false,
    city: '',
    region: 'Bratislavský' // Default to first valid enum value
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Loading state for auth to prevent FOUC (Flash of Unauthenticated Content)
  if (isAuthLoading) {
      return (
         <div className="min-h-screen bg-slovak-light flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-slovak-blue" size={40} />
         </div>
      );
  }

  // Protect route
  if (!user) {
    return (
       <div className="min-h-screen bg-slovak-light flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center text-center p-4">
             <div>
                <h2 className="text-2xl font-bold mb-4">Pre pridanie inzerátu sa musíte prihlásiť</h2>
                <button onClick={openAuthModal} className="bg-slovak-blue text-white px-6 py-3 rounded-full font-bold">
                   Prihlásiť sa
                </button>
             </div>
          </div>
       </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
       const selectedFiles = Array.from(e.target.files) as File[];
       if (files.length + selectedFiles.length > 3) {
           alert("Maximálne môžete nahrať 3 fotografie.");
           return;
       }
       
       const newFiles = [...files, ...selectedFiles];
       setFiles(newFiles);
       
       // Generate previews
       const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
       setPreviewUrls([...previewUrls, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);

      const newPreviews = [...previewUrls];
      URL.revokeObjectURL(newPreviews[index]); // Cleanup
      newPreviews.splice(index, 1);
      setPreviewUrls(newPreviews);
  };

  const handleNext = () => setStep(prev => prev + 1);

  const handlePublish = async () => {
      if (files.length === 0) {
        alert("Prosím nahrajte aspoň jednu fotku.");
        return;
      }
      
      if (!formData.categoryId) {
          alert("Prosím vyberte kategóriu.");
          return;
      }

      if (!formData.title || !formData.price || !formData.city) {
          alert("Prosím vyplňte všetky povinné polia.");
          return;
      }

      const priceVal = parseFloat(formData.price.replace(',', '.'));
      if (isNaN(priceVal) || priceVal <= 0) {
          alert("Prosím zadajte platnú cenu.");
          return;
      }

      try {
        await addListing(formData, files);
        navigate('/');
      } catch (error) {
         console.error(error);
         alert('Nastala chyba pri vytváraní inzerátu. Skúste to prosím znova.');
      }
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
            
            {/* Step 1: Upload */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Čo chcete predať?</h1>
                <p className="text-gray-500 mb-8">Nahrajte fotky vášho produktu (Max 3).</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md border border-gray-100">
                            <img src={url} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                            <button 
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    
                    {files.length < 3 && (
                        <label 
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-slovak-blue hover:bg-blue-50/30 transition-all group"
                        >
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                            <div className="w-12 h-12 bg-blue-100 text-slovak-blue rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Camera size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-500">Pridať fotku</span>
                        </label>
                    )}
                </div>
                
                {files.length > 0 && (
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
               <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }}>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Doplňte informácie</h1>
                  
                  <div className="space-y-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Názov inzerátu</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium" placeholder="Napr. Audi Q8 S-Line" />
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Cena (€)</label>
                           <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-lg" placeholder="0" />
                        </div>
                         <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Kategória</label>
                           <select 
                              value={formData.categoryId}
                              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue outline-none bg-white appearance-none"
                           >
                              <option value="">Vyberte kategóriu</option>
                              {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                           </select>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Kraj</label>
                             <select 
                                value={formData.region}
                                onChange={(e) => setFormData({...formData, region: e.target.value})}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue outline-none bg-white appearance-none"
                             >
                                {REGION_OPTIONS.map((region) => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                             </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Mesto</label>
                            <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all" placeholder="Napr. Petržalka" />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Popis</label>
                        <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-slovak-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-gray-600"></textarea>
                     </div>
                     
                     <div className="flex items-center gap-2">
                        <input type="checkbox" id="premium" checked={formData.isPremium} onChange={(e) => setFormData({...formData, isPremium: e.target.checked})} className="w-5 h-5 text-slovak-blue rounded border-gray-300 focus:ring-slovak-blue" />
                        <label htmlFor="premium" className="text-gray-700 font-medium select-none">Označiť ako Premium Listing (zvýraznenie)</label>
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
                     <h1 className="text-2xl font-bold text-gray-900">Vyzerá to skvele, {user?.name}!</h1>
                     <p className="text-gray-500">Vaša identita je overená. Inzerát je pripravený.</p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex gap-4 border border-gray-200">
                     {previewUrls.length > 0 && <img src={previewUrls[0]} className="w-24 h-24 object-cover rounded-lg" alt="Preview" />}
                     <div>
                        <h3 className="font-bold text-lg text-gray-900">{formData.title}</h3>
                        <p className="text-slovak-blue font-bold text-xl">{formData.price} €</p>
                        <p className="text-sm text-gray-500">{formData.city}, {formData.region}</p>
                        <div className="flex items-center gap-2 mt-2">
                           {formData.isPremium && <span className="text-xs bg-slovak-gold/20 text-slovak-dark px-2 py-0.5 rounded font-bold">PREMIUM Listing</span>}
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={handlePublish} 
                    disabled={isLoading}
                    className="w-full bg-slovak-blue text-white py-4 rounded-xl font-bold hover:bg-slovak-dark transition-all shadow-xl shadow-slovak-blue/20 hover:shadow-slovak-blue/30 active:scale-95 flex items-center justify-center gap-2"
                  >
                     {isLoading ? <Loader2 className="animate-spin" /> : 'Zverejniť inzerát'}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-4">
                     Kliknutím súhlasíte s podmienkami inzercie.
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