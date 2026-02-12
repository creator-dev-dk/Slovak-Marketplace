import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppStore } from '../store/useStore';
import { Camera, Save, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TRANSLATIONS } from '../translations';

const EditProfile: React.FC = () => {
  const { user, updateProfile, isLoading, language } = useAppStore();
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  
  const [fullName, setFullName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
        setFullName(user.name);
        // If avatar is a URL, show it
        if (user.avatar && user.avatar.length > 5) {
            setPreviewUrl(user.avatar);
        }
    } else {
        navigate('/');
    }
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setAvatarFile(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await updateProfile(fullName, avatarFile || undefined);
          navigate('/profile');
      } catch (err) {
          console.error(err);
          alert(t.common.error);
      }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
            <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors">
                <ArrowLeft size={20} /> {t.common.back}
            </button>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">{t.profile.editPageTitle}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-slate-300">{user.name.charAt(0)}</span>
                                )}
                            </div>
                            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                <Camera size={32} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="mt-3 text-sm text-slate-500">{t.profile.changePhoto}</p>
                    </div>

                    {/* Inputs */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">{t.profile.fullName}</label>
                        <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-900"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {t.common.save}</>}
                    </button>
                </form>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfile;