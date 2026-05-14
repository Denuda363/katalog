import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, PackageOpen } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { Product, Category } from '../types';
import { cn } from '../lib/utils';

export const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Semua'>('Semua');
  const { categories, settings } = useAuth();

  const handleChatWhatsApp = () => {
    if (!settings?.contactNumber) {
      alert('Nomor kontak belum diatur.');
      return;
    }
    const cleanNumber = settings.contactNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('Halo, saya butuh bantuan konsultasi apoteker.')}`, '_blank');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await productService.getAllProducts();
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    
    let matchesCategory = false;
    if (selectedCategory === 'Semua') {
      matchesCategory = true;
    } else if (selectedCategory === 'Bundling') {
      matchesCategory = p.isBundling === true;
    } else {
      matchesCategory = p.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-16 bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-8 flex-col shrink-0 sticky top-16 h-[calc(100vh-64px)]">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Kategori Produk</h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
              selectedCategory === 'Semua' 
                ? "bg-teal-50 text-teal-700" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === 'Semua' ? "bg-teal-600 scale-100" : "bg-slate-300 scale-0")} />
            Semua Produk
          </button>
          <button
            onClick={() => setSelectedCategory('Bundling' as any)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
              selectedCategory === 'Bundling' 
                ? "bg-indigo-50 text-indigo-700" 
                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === 'Bundling' ? "bg-indigo-600 scale-100" : "bg-slate-300 scale-0")} />
            Paket Bundling
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all italic",
                selectedCategory === cat.name 
                  ? "bg-teal-50 text-teal-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === cat.name ? "bg-teal-600 scale-100" : "bg-slate-300 scale-0")} />
              {cat.name}
            </button>
          ))}
        </div>

        {/* Bonus banner in sidebar as seen in design */}
        <div className="mt-auto p-5 bg-slate-900 rounded-3xl text-white overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">Butuh bantuan?</p>
            <p className="text-xs font-medium mb-4 text-slate-200">Konsultasi gratis dengan apoteker kami.</p>
            <button onClick={handleChatWhatsApp} className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors">
              Chat Sekarang
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 text-white/5 rotate-12 transition-transform group-hover:scale-110">
            <PackageOpen size={80} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        {/* Banner Section */}
        <section className="mb-10 h-48 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-[2.5rem] relative overflow-hidden flex items-center px-10 md:px-16 shadow-xl shadow-teal-600/20">
          <div className="relative z-10 max-w-lg">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
              Special Promo
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
              Kesehatan Anda, <br/>Prioritas Utama Kami.
            </h2>
            <p className="text-teal-50 text-sm mt-2 opacity-90">
              Dukungan penuh untuk gaya hidup sehat Anda setiap hari.
            </p>
          </div>
          <div className="absolute right-[-40px] top-[-40px] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute right-20 bottom-0 w-48 h-24 bg-white/5 rounded-t-full blur-2xl"></div>
        </section>

        {/* Mobile Category Scroll */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto pb-6 scrollbar-hide">
          <button
              onClick={() => setSelectedCategory('Semua')}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap",
                selectedCategory === 'Semua' 
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" 
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              Semua
          </button>
          <button
              onClick={() => setSelectedCategory('Bundling')}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap",
                selectedCategory === 'Bundling' 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              Bundling
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap",
                selectedCategory === cat.name 
                  ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20" 
                  : "bg-white text-slate-500 border border-slate-200"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Header Table style as seen in design */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-none">Daftar Produk</h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">Menampilkan {filteredProducts.length} produk pilihan</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-teal-600 transition-colors shadow-sm">
              <SlidersHorizontal size={20} />
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-teal-600 transition-colors shadow-sm">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white rounded-3xl animate-pulse flex flex-col p-4 gap-4">
                <div className="flex-grow bg-slate-100 rounded-2xl"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Produk Nihil</h3>
            <p className="text-slate-500 mt-2">Coba filter atau kata kunci pencarian yang berbeda.</p>
          </div>
        )}
      </main>
    </div>
  );
};
