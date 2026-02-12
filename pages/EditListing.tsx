import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronRight, ShieldCheck, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useStore';
import { CreateListingPayload } from '../types';
import { supabase } from '../lib/supabase';
import { TRANSLATIONS } from '../translations';

const REGION_OPTIONS = [
    'Bratislavský', 'Trnavský', 'Trenčiansky', 'Nitriansky', 
    'Žilinský', 'Banskobystrický', 'Prešovský', 'Košický'
];

const EditListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateListing, user, isLoading, fetchListingById, currentListing, categories, fetchCategories, language } = useAppStore();
  const t = TRANSLATIONS[language];
  
  const [formData, setFormData] = useState<CreateListingPayload>({
    title: '',
    price: '',
    categoryId: '',
    description: '',
    isPremium: false,
    city: '',
    region: 'Bratislavský'
  });

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    if (id) {
        // Fetch fresh data
        const load = async () => {
            await fetchListingById(id);
            setInitialLoading(false);
        };
        load();
    }
  }, [id, fetchCategories, fetchListingById]);

  useEffect(() => {
    if (currentListing && !initialLoading) {
        // Check ownership
        if (user && currentListing.userId !== user.id) {
            alert("Nemáte oprávnenie upravovať tento inzerát.");
            navigate('/');
            return;
        }

        const fetchRaw = async () => {
             const { data } = await supabase.from('listings').select('category_id').eq('id', id).single();
             if(data) {
                 setFormData({
                    title: currentListing.title,
                    price: currentListing.price.toString(),
                    categoryId: data.category_id, 
                    description: currentListing.description || '',
                    isPremium: currentListing.isPremium,
                    city: currentListing.location.split(',')[0], // Approximation
                    region: REGION_OPTIONS.find(r => currentListing.location.includes(r)) || 'Bratislavský'
                 });
             }
        }
        fetchRaw();
    }
  }, [currentListing, initialLoading, user]);

  const handleUpdate = async () => {
      if (!formData.title || !formData.price || !formData.city) { alert("Prosím vyplňte všetky povinné polia."); return; }

      const priceVal = parseFloat(formData.price.replace(',', '.'));
      if (isNaN(priceVal) || priceVal <= 0) { alert("Prosím zadajte platnú cenu."); return; }

      try {
        if(id) await updateListing(id, formData);
        navigate('/profile');
      } catch (error) {
         console.error(error);
         alert('Nastala chyba pri úprave inzerátu.');
      }
  }

  if (initialLoading || !user) {
      return (
         <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
             <Loader2 className="animate-spin text-indigo-600" size={40} />
         </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
                <ArrowLeft size={20} /> {t.common.back}
            </button>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 relative overflow-hidden">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.create.editTitle}</h1>
                    {/* Image editing hint */}
                    <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{t.create.noPhotoEdit}</span>
                  </div>
                  
                  <div className="space-y-6">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.title}</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-900" />
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.price}</label>
                           <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold text-lg text-slate-900" />
                        </div>
                         <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.category}</label>
                           <div className="relative">
                               <select 
                                  value={formData.categoryId}
                                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white appearance-none text-slate-900 cursor-pointer"
                               >
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
                            <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-900" />
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t.create.form.desc}</label>
                        <textarea rows={8} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none text-slate-700" ></textarea>
                     </div>
                     
                     <div className="bg-indigo-50 p-4 rounded-xl flex items-start gap-3 border border-indigo-100">
                        <input type="checkbox" id="premium" checked={formData.isPremium} onChange={(e) => setFormData({...formData, isPremium: e.target.checked})} className="mt-1 w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        <div>
                            <label htmlFor="premium" className="text-indigo-900 font-bold select-none cursor-pointer">{t.create.premium}</label>
                            <p className="text-xs text-indigo-600/80 mt-0.5">{t.create.premiumDesc}</p>
                        </div>
                     </div>

                     <div className="pt-6 flex gap-4">
                        <button onClick={() => navigate('/profile')} className="px-8 bg-white text-slate-700 border border-slate-200 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
                           {t.common.cancel}
                        </button>
                        <button onClick={handleUpdate} disabled={isLoading} className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                           {isLoading ? <Loader2 className="animate-spin" /> : t.create.save}
                        </button>
                     </div>
                  </div>
               </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditListing;