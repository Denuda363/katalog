import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  Menu, 
  X, 
  User, 
  ShoppingBag, 
  LayoutDashboard,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Navigation = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAdmin, logout, settings } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 h-20 flex items-center shrink-0">
      <div className="w-full max-w-[1600px] mx-auto px-6 flex items-center justify-between gap-12">
        {/* Brand */}
        <div className="flex items-center gap-4 shrink-0">
          <NavLink to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white transition-all group-hover:scale-105 group-hover:rotate-6 overflow-hidden shadow-xl shadow-teal-600/20 border-4 border-white">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-sm font-black tracking-widest leading-none">MK</span>
              )}
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-teal-600 transition-colors hidden sm:block italic">
              {settings?.appName || 'MediCatalog+'}
            </span>
          </NavLink>
        </div>

        {/* Global Nav Links - Desktop */}
        <div className="hidden lg:flex items-center gap-10">
          <NavLink 
            to="/" 
            className={({isActive}) => cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-2",
              isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-900"
            )}
          >
            {({ isActive }) => (
              <>
                Katalog
                {isActive && <motion.div layoutId="navline" className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full" />}
              </>
            )}
          </NavLink>
          <NavLink 
            to="/promo" 
            className={({isActive}) => cn(
              "text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-2",
              isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-900"
            )}
          >
            {({ isActive }) => (
              <>
                Promo Spesial
                {isActive && <motion.div layoutId="navline" className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full" />}
              </>
            )}
          </NavLink>
          {isAdmin && (
            <NavLink 
              to="/admin" 
              className={({isActive}) => cn(
                "text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-2",
                isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-900"
              )}
            >
              {({ isActive }) => (
                <>
                  Control Room
                  {isActive && <motion.div layoutId="navline" className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full" />}
                </>
              )}
            </NavLink>
          )}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-4 p-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="pl-3 text-slate-300">
              <Search size={16} strokeWidth={3} />
            </div>
            <input 
              type="text" 
              placeholder="Cari Solusi Medis..."
              className="bg-transparent text-[10px] font-black uppercase tracking-[0.1em] placeholder:text-slate-300 outline-none w-48"
            />
          </div>

          <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>

          {isAdmin ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-[9px] font-black text-slate-900 leading-none mb-1 uppercase tracking-widest">Administrator</p>
                <div className="flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
                  <span className="text-[8px] font-black text-teal-600 uppercase tracking-[0.2em]">Live & Secure</span>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-teal-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-12 h-12 rounded-2xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center text-teal-600 shadow-sm Group-hover:border-teal-100 transition-all">
                  <User size={20} strokeWidth={2.5} />
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                title="Keluar Sesi"
              >
                <LogOut size={20} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <NavLink 
              to="/login" 
              className="px-8 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Access Portal
            </NavLink>
          )}

          <button 
            className="lg:hidden w-12 h-12 flex items-center justify-center text-slate-900 bg-slate-50 rounded-2xl border border-slate-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav - Reimagined */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-20 bg-slate-900/40 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute top-[88px] left-6 right-6 z-50 bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-10"
            >
              <div className="space-y-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em]">Navigasi</p>
                  <div className="grid gap-4">
                    <NavLink to="/" onClick={() => setIsOpen(false)} className="text-3xl font-black text-slate-900 tracking-tighter italic hover:text-teal-600 transition-colors">Eksplorasi Obat</NavLink>
                    <NavLink to="/promo" onClick={() => setIsOpen(false)} className="text-3xl font-black text-slate-900 tracking-tighter italic hover:text-teal-600 transition-colors">Promo Terkini</NavLink>
                    {isAdmin && (
                      <NavLink to="/admin" onClick={() => setIsOpen(false)} className="text-3xl font-black text-slate-900 tracking-tighter italic hover:text-teal-600 transition-colors">Panel Kontrol</NavLink>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-50">
                  <div className="p-8 bg-teal-50 rounded-[2rem] flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-teal-600 shadow-xl shadow-teal-600/10 mb-6">
                      <Heart size={32} fill="currentColor" className="opacity-20" />
                    </div>
                    <h5 className="text-lg font-black text-slate-900 italic mb-2 tracking-tight">Kesehatan Prioritas Kami</h5>
                    <p className="text-xs text-slate-500 font-bold mb-6">Butuh konsultasi mendadak? Tim kami siap membantu Anda.</p>
                    <button className="w-full py-4 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-600/20">Chat Sekarang</button>
                  </div>
                </div>

                {isAdmin && (
                  <button 
                    onClick={handleLogout}
                    className="w-full py-5 border-2 border-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3"
                  >
                    <LogOut size={18} />
                    Akhiri Sesi Admin
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
