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
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16 flex items-center shrink-0">
      <div className="w-full max-w-[1600px] mx-auto px-6 flex items-center justify-between gap-8 text-slate-800">
        <div className="flex items-center gap-2 shrink-0">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105 overflow-hidden shadow-lg shadow-teal-600/20">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              )}
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors hidden sm:block">
              {settings?.appName || 'MediCatalog+'}
            </span>
          </NavLink>
        </div>

        {/* Search - Desktop */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Cari obat, vitamin, atau suplemen..." 
              className="w-full px-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none"
            />
            <div className="absolute right-3 top-2 text-slate-400">
              <Search size={18} />
            </div>
          </div>
        </div>

          <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6">
            <NavLink to="/" className={({isActive}) => cn("text-sm font-semibold transition-colors", isActive ? "text-teal-600" : "text-slate-500 hover:text-teal-600")}>
              Produk
            </NavLink>
            <NavLink to="/promo" className={({isActive}) => cn("text-sm font-semibold transition-colors", isActive ? "text-teal-600" : "text-slate-500 hover:text-teal-600")}>
              Promo
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({isActive}) => cn("text-sm font-semibold transition-colors", isActive ? "text-teal-600" : "text-slate-500 hover:text-teal-600")}>
                Admin
              </NavLink>
            )}
          </div>
          
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">Administrator</p>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full uppercase tracking-wider">Admin Mode</span>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-slate-200 shadow-sm shrink-0 flex items-center justify-center text-teal-600">
                <User size={20} />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <NavLink 
              to="/login" 
              className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all active:scale-95"
            >
              Masuk
            </NavLink>
          )}

          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 right-0 md:hidden bg-white border-b border-slate-200 overflow-hidden shadow-xl"
          >
            <div className="px-6 py-8 space-y-4">
              <div className="relative mb-6">
                <input 
                  type="text" 
                  placeholder="Cari obat..." 
                  className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                />
              </div>
              <NavLink 
                to="/" 
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors"
              >
                Semua Produk
              </NavLink>
              <NavLink 
                to="/promo" 
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors"
              >
                Promo Spesial
              </NavLink>
              {isAdmin && (
                <NavLink 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors"
                >
                  Dashboard Admin
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
