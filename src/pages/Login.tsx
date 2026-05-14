import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, ShieldAlert, KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { settingsService } from '../services/settingsService';
import { Link } from 'react-router-dom';

export const Login = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
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
    setIsWrong(false);
    try {
      const correctPin = await settingsService.getAdminPin();
      if (pin === correctPin) {
        await login(pin);
      } else {
        setError('PIN yang Anda masukkan salah.');
        setIsWrong(true);
        setTimeout(() => setIsWrong(false), 500);
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full shadow-2xl shadow-teal-500/20"
          />
          <p className="text-teal-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Establishing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden selection:bg-teal-500/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-teal-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="w-full max-w-lg relative">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 text-slate-500 hover:text-white transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-teal-500/50 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kembali ke Katalog</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            x: isWrong ? [0, -10, 10, -10, 10, 0] : 0
          }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 100,
            x: { duration: 0.4 }
          }}
          className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/5 p-10 md:p-14 relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-10 text-teal-500 border border-white/10 shadow-2xl"
            >
              <KeyRound size={40} strokeWidth={1.5} className="drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter italic">
                Control Room <br />
                <span className="text-teal-500">Access.</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-12 max-w-xs mx-auto">
                Masukkan kunci otentikasi digital Anda untuk mengelola ekosistem katalog medis.
              </p>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-10 overflow-hidden"
              >
                <div className="p-5 bg-red-500/10 text-red-500 text-[10px] font-black rounded-2xl flex items-center gap-4 border border-red-500/20 uppercase tracking-widest leading-none">
                  <ShieldAlert size={18} strokeWidth={3} className="shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="relative">
                <input
                  type="password"
                  maxLength={10}
                  placeholder="•••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full text-center text-5xl tracking-[0.8em] font-black py-6 bg-white/5 border border-white/10 rounded-3xl text-teal-500 placeholder:text-slate-800 focus:bg-white/10 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                  autoFocus
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || pin.length < 1}
                className="w-full h-20 bg-teal-600 text-[11px] font-black uppercase tracking-[0.3em] text-white rounded-[2rem] flex items-center justify-center gap-4 transition-all disabled:opacity-20 disabled:grayscale shadow-2xl shadow-teal-500/20 hover:bg-teal-500"
              >
                {loading ? (
                  <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Enter Control Room</span>
                    <LogIn size={20} strokeWidth={3} />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-14 flex items-center justify-center gap-4"
            >
              <div className="h-px bg-white/5 flex-1" />
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck size={14} className="text-teal-900" />
                <p className="text-[9px] font-black uppercase tracking-[0.25em]">MediCatalog Cloud Link</p>
              </div>
              <div className="h-px bg-white/5 flex-1" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
