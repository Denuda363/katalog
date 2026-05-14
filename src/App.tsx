import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { Catalog } from './pages/Catalog';
import { Promo } from './pages/Promo';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, MapPin } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-slate-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-teal-600/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">MediCatalog+</p>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Verifikasi Akses...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const Footer = () => {
  const { settings } = useAuth();
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-xl shadow-teal-600/20">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  'M'
                )}
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 italic">{settings?.appName || 'MediCatalog+'}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
              Solusi farmasi digital terpercaya untuk kebutuhan kesehatan keluarga Anda. Dapatkan obat-obatan berkualitas dengan harga terbaik.
            </p>
            {settings?.address && (
              <div className="flex items-start gap-4 text-slate-400 group">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <MapPin size={18} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed pt-1">
                  {settings.address}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Navigasi Utama</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-400">
              <a href="#" className="hover:text-teal-600 transition-colors w-fit">Beranda</a>
              <a href="#" className="hover:text-teal-600 transition-colors w-fit">Katalog Produk</a>
              <a href="#" className="hover:text-teal-600 transition-colors w-fit">Promo Spesial</a>
              <a href="#" className="hover:text-teal-600 transition-colors w-fit">Tentang Kami</a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Hubungi Kami</h4>
            {settings?.contactNumber ? (
              <a 
                href={`https://wa.me/${settings.contactNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem] hover:bg-teal-50 transition-all border border-slate-100 hover:border-teal-200"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp Chat</p>
                  <p className="text-sm font-black text-slate-900 tracking-tight">{settings.contactNumber}</p>
                </div>
              </a>
            ) : (
              <p className="text-sm text-slate-400 font-bold italic">Nomor kontak belum tersedia.</p>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} {settings?.appName || 'MediCatalog+'}. All Rights Reserved
          </div>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Crafted with passion for Health
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingWA = () => {
  const { settings } = useAuth();
  if (!settings?.contactNumber) return null;
  
  const cleanNumber = settings.contactNumber.replace(/[^0-9]/g, '');

  return (
    <motion.a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, y: 100 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-teal-600 text-white rounded-3xl shadow-2xl shadow-teal-900/40 flex items-center justify-center border-4 border-white/20 backdrop-blur-sm"
    >
      <MessageCircle size={32} />
      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-4 border-slate-900 animate-pulse"></span>
    </motion.a>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white selection:bg-teal-100 selection:text-teal-900">
          <Navigation />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/promo" element={<Promo />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <FloatingWA />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
