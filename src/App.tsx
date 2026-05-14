import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { Catalog } from './pages/Catalog';
import { Promo } from './pages/Promo';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Memverifikasi akses...</p>
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
    <footer className="bg-white border-t border-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm overflow-hidden">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              'M'
            )}
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">{settings?.appName || 'MediCatalog+'}</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-teal-600">Beranda</a>
            <a href="#" className="hover:text-teal-600">Produk</a>
            <a href="#" className="hover:text-teal-600">Promo</a>
          </div>
          {settings?.contactNumber && (
            <div className="h-4 w-px bg-slate-100 hidden md:block" />
          )}
          {settings?.contactNumber && (
            <a 
              href={`https://wa.me/${settings.contactNumber.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-widest text-teal-600 hover:text-teal-700 flex items-center gap-2"
            >
              Contact: {settings.contactNumber}
            </a>
          )}
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} {settings?.appName || 'MediCatalog+'}. Powered by MediCatalog+
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Navigation />
          <main>
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
