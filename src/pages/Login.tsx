import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { settingsService } from '../services/settingsService';

export const Login = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/admin";

  useEffect(() => {
    if (isAdmin) {
      navigate(from, { replace: true });
    }
  }, [isAdmin, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const correctPin = await settingsService.getAdminPin();
      if (pin === correctPin) {
        await login(pin);
      } else {
        setError('PIN yang Anda masukkan salah.');
        setPin('');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Gagal memverifikasi PIN. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">Mengalihkan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-10 text-center border border-white"
      >
        <div className="w-20 h-20 bg-teal-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-teal-600 shadow-inner">
          <KeyRound size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Admin Login</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          Masukkan 5 digit PIN admin untuk mengakses sistem manajemen katalog.
        </p>

        {error && (
          <div className="mb-8 p-5 bg-red-50 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-3 text-left border border-red-100">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="password"
            maxLength={10}
            placeholder="•••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center text-3xl tracking-[1em] font-bold py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
            autoFocus
          />
          
          <button
            type="submit"
            disabled={loading || pin.length < 1}
            className="w-full py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={20} />
                Masuk
              </>
            )}
          </button>
        </form>

        <p className="mt-10 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          MediCatalog+ Secure Access
        </p>
      </motion.div>
    </div>
  );
};
