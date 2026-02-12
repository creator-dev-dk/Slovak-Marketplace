import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Camera, ChevronRight, ShieldCheck, Loader2, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import { TRANSLATIONS } from '../translations';

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
  const { addListing, user, isLoading, isAuthLoading, openAuthModal, categories, fetchCategories, language } = useAppStore();
  const t = TRANSLATIONS[language];

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    categoryId: '',
    description: '',
    isPremium: false,
    city: '',
    region: 'Bratislavský'
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
      return () => {
          previewUrls.forEach(url => URL.revokeObjectURL(url));
      };
  }, [previewUrls]);

  if (isAuthLoading) {
      return (
         <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-indigo-600" size={40} />
         </div>
      );
  }

  if (!user) {
    return (
       <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <div className="flex-grow flex items-center justify-center text-center p-4">
             <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <ShieldCheck size={48} className="mx-auto text-indigo-600 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.profile.accessDenied}</h2>
                <p className="text-slate-500 mb-6">{t.profile.loginRequired}</p>
                <button onClick={openAuthModal} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                   {t.nav.login}
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
       const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
       setPreviewUrls([...previewUrls, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
      const newPreviews = [...previewUrls];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      setPreviewUrls(newPreviews);
  };

  const handleNext = () => setStep(prev => prev + 1);

  const handlePublish = async () => {
      if (files.length === 0) { alert("Prosím nahrajte aspoň jednu fotku."); return; }
      if (!formData.categoryId) { alert("Prosím vyberte kategóriu."); return; }
      if (!formData.title || !formData.price || !formData.city) { alert("Prosím vyplňte všetky povinné polia."); return; }

      const priceVal = parseFloat(formData.price.replace(',', '.'));
      if (isNaN(priceVal) || priceVal <= 0) { alert("Prosím zadajte platnú cenu."); return; }

      try {
        await addListing(formData, files);
        navigate('/');
      } catch (error) {
         console.error(error);
         alert('Nastala chyba pri vytváraní inzerátu.');
      }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>1. {t.create.steps.photo}</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>2. {t.create.steps.details}</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${step >= 3 ? 'text-indigo-600' : 'text-slate-400'}`}>3. {t.create.steps.verify}</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-600"
                initial={{ width: '0%' }}
                animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 relative overflow-hidden">
            
            {/* Step 1: Upload */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{t.create.uploadTitle}</h1>
                <p className="text-slate-500 mb-8">{t.create.uploadDesc}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-slate-200">
                            <img src={url} className="w-full h-full object-cover" alt={`Preview ${index}`} />
                            <button 
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    
                    {files.length < 3 && (
                        <label 
                            className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/10 transition-all group"
                        >
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                <Camera size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600">{t.create.selectFiles}</span>
                        </label>
                    )}
                </div>
                
                {files.length > 0 && (
                   <div className="mt-8 pt-6 border-t border-slate-100">
                      <button onClick={handleNext} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                        {t.common.continue} <ChevronRight size={20} />
                      </button>
                   </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Details Form */}
            {step === 2 && (
               <motion.div initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }}>
                  <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">{t.create.steps.details}</h1>
                  
                  <div className="space-y-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.title}</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400" placeholder={t.create.form.titlePlaceholder} />
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.price}</label>
                           <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold text-lg text-slate-900" placeholder="0" />
                        </div>
                         <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.category}</label>
                           <div className="relative">
                               <select 
                                  value={formData.categoryId}
                                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white appearance-none text-slate-900 cursor-pointer"
                               >
                                  <option value="">{t.create.form.selectCategory}</option>
                                  {categories.map((cat) => (
                                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                                  ))}
                               </select>
                               <ChevronRight className="absolute right-4 top-3.5 text-slate-400 rotate-90 pointer-events-none" size={16} />
                           </div>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.region}</label>
                             <div className="relative">
                                 <select 
                                    value={formData.region}
                                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white appearance-none text-slate-900 cursor-pointer"
                                 >
                                    {REGION_OPTIONS.map((region) => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                 </select>
                                 <ChevronRight className="absolute right-4 top-3.5 text-slate-400 rotate-90 pointer-events-none" size={16} />
                             </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.city}</label>
                            <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-900" placeholder={t.create.form.cityPlaceholder} />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.desc}</label>
                        <textarea rows={5} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400" placeholder={t.create.form.descPlaceholder}></textarea>
                     </div>
                     
                     <div className="bg-indigo-50 p-4 rounded-xl flex items-start gap-3 border border-indigo-100">
                        <input type="checkbox" id="premium" checked={formData.isPremium} onChange={(e) => setFormData({...formData, isPremium: e.target.checked})} className="mt-1 w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        <div>
                            <label htmlFor="premium" className="text-indigo-900 font-bold select-none cursor-pointer">{t.create.premium}</label>
                            <p className="text-xs text-indigo-600/80 mt-0.5">{t.create.premiumDesc}</p>
                        </div>
                     </div>

                     <div className="pt-6 flex gap-4">
                        <button onClick={() => setStep(1)} className="px-8 bg-white text-slate-700 border border-slate-200 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
                           {t.common.back}
                        </button>
                        <button onClick={handleNext} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                           {t.common.check} <ChevronRight size={20} />
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Step 3: Verification & Preview */}
            {step === 3 && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="text-center mb-10">
                     <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-emerald-50">
                        <ShieldCheck size={40} />
                     </div>
                     <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{t.create.almostDone}</h1>
                     <p className="text-slate-500 max-w-md mx-auto">{t.create.verifyDesc}</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 mb-8 flex gap-5 border border-slate-200 items-center">
                     {previewUrls.length > 0 && <img src={previewUrls[0]} className="w-24 h-24 object-cover rounded-lg shadow-sm" alt="Preview" />}
                     <div>
                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{formData.title}</h3>
                        <p className="text-indigo-600 font-bold text-2xl my-1">{formData.price} €</p>
                        <p className="text-sm text-slate-500 font-medium">{formData.city}, {formData.region}</p>
                     </div>
                  </div>

                  <button 
                    onClick={handlePublish} 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                     {isLoading ? <Loader2 className="animate-spin" /> : t.create.publish}
                  </button>
                  
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                     <AlertCircle size={14} />
                     <p>{t.create.terms}</p>
                  </div>
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