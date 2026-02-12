import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Mail, Loader2, KeyRound, User, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS } from '../translations';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, language } = useAppStore();
  const t = TRANSLATIONS[language];
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isRegister) {
        const { error } = await register(email, password, fullName);
        if (error) throw error;
      } else {
        const { error } = await login(email, password);
        if (error) throw error;
      }
      // Modal closes automatically in store on success
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
              <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                <ShieldCheck size={20} />
              </div>
              {isRegister ? 'Registrácia' : t.auth.title}
            </h2>
            <button onClick={closeAuthModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-200 rounded-lg">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-slate-600 mb-3 font-medium">
                {isRegister ? 'Vytvorte si účet a začnite predávať.' : t.auth.subtitle}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                <Lock size={12} />
                {t.auth.secured}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Celé Meno</label>
                   <div className="relative group">
                      <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                      <input 
                        type="text" 
                        required={isRegister}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ján Novák"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-900"
                      />
                   </div>
                </div>
              )}

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                 <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vas@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-900"
                    />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Heslo</label>
                 <div className="relative group">
                    <KeyRound className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-900"
                    />
                 </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                   {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    {isRegister ? 'Vytvoriť účet' : 'Prihlásiť sa'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(null); }}
                className="text-slate-600 font-semibold hover:text-indigo-600 text-sm transition-colors"
              >
                {isRegister ? 'Už máte účet? Prihláste sa' : 'Nemáte účet? Zaregistrujte sa'}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400">
                {t.auth.consent}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;