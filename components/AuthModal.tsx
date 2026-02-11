import React from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { useAppStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAppStore();

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
          className="absolute inset-0 bg-slovak-dark/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slovak-light p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slovak-blue flex items-center gap-2">
              <ShieldCheck className="text-slovak-gold" />
              Prihlásenie
            </h2>
            <button onClick={closeAuthModal} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-2">Pre pokračovanie zvoľte svoju banku.</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-100">
                <Lock size={12} />
                Zabezpečené cez BankID
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Tatra Banka', color: '#000000' },
                { name: 'Slovenská Sporiteľňa', color: '#007ac2' },
                { name: 'VÚB Banka', color: '#f7941d' },
                { name: 'ČSOB', color: '#00558f' }
              ].map((bank) => (
                <button
                  key={bank.name}
                  onClick={login}
                  className="w-full group flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-slovak-blue hover:bg-blue-50/50 transition-all duration-200"
                >
                  <span className="font-semibold text-gray-700 group-hover:text-slovak-blue">{bank.name}</span>
                  <div className="w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: bank.color }}></div>
                </button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                Prihlásením súhlasíte s <a href="#" className="underline hover:text-slovak-blue">podmienkami používania</a>.
                Vaše údaje sú chránené podľa GDPR.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;