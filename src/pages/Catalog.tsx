import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, SlidersHorizontal, PackageOpen, MessageCircle } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductDetail } from '../components/ProductDetail';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { Product, Category } from '../types';
import { cn } from '../lib/utils';

export const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Semua'>('Semua');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
    const searchLower = search.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                         p.description.toLowerCase().includes(searchLower) ||
                         p.category.toLowerCase().includes(searchLower) ||
                         (p.bundlingItems && p.bundlingItems.toLowerCase().includes(searchLower));
    
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Polished & Immersive */}
      <section className="relative overflow-hidden bg-white pt-12 md:pt-16 pb-16 md:pb-24 px-6">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-teal-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-emerald-50 rounded-full blur-[100px] opacity-40 pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto relative px-0 lg:px-10">
          <div className="max-w-4xl text-center md:text-left mx-auto md:mx-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-teal-600 text-white rounded-full text-[9px] font-black uppercase tracking-[0.25em] mb-8 shadow-xl shadow-teal-600/20 border-4 border-white"
            >
              <Filter size={12} strokeWidth={3} />
              Solusi Kesehatan Digital
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-4xl sm:text-6xl md:text-[8rem] font-black text-slate-900 leading-[0.9] md:leading-[0.85] tracking-tighter mb-8 italic"
            >
              Eksplorasi <br />
              <span className="text-teal-600">Terapi &</span> Nutrisi.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xs sm:text-sm md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mb-12 mx-auto md:mx-0"
            >
              Temukan ribuan katalog obat-obatan, vitamin, dan suplemen terpilih. 
              Dikelola secara profesional untuk menjamin ketersediaan solusi kesehatan Anda.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative max-w-2xl mx-auto md:mx-0"
            >
              <div className="absolute inset-0 bg-teal-600/5 blur-3xl rounded-[3rem]" />
              <div className="relative flex items-center bg-white p-2 rounded-[2rem] shadow-2xl shadow-teal-900/10 border border-slate-50 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                <div className="pl-5 text-slate-300">
                  <Search size={24} strokeWidth={2.5} />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari kebutuhan medis Anda..."
                  className="w-full px-4 py-4 bg-transparent outline-none text-lg font-bold text-slate-900 placeholder:text-slate-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1600px] mx-auto px-6 pb-32">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Refined & Modern */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-10">
              <div className="space-y-5">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.25em]">Klasifikasi</h3>
                  <SlidersHorizontal size={14} className="text-slate-300" />
                </div>
                
                {/* Mobile: Horizontal Scroll, Desktop: Vertical Stack */}
                <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
                  <button
                    onClick={() => setSelectedCategory('Semua')}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                      selectedCategory === 'Semua' 
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                        : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-100"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === 'Semua' ? "bg-teal-400 scale-125" : "bg-slate-200")} />
                    Semua
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Bundling')}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                      selectedCategory === 'Bundling' 
                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                        : "bg-white text-slate-500 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100"
                    )}
                  >
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === 'Bundling' ? "bg-white scale-125" : "bg-indigo-100")} />
                    Bundling
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={cn(
                        "flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                        selectedCategory === cat.name 
                          ? "bg-teal-50 text-teal-700 border border-teal-100" 
                          : "bg-white text-slate-500 hover:bg-teal-50/30 hover:text-teal-900 border border-slate-100"
                      )}
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full transition-all", selectedCategory === cat.name ? "bg-teal-600 scale-125" : "bg-slate-200")} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Card - Hidden on mobile if not needed or more compact */}
              <div className="hidden lg:block relative group overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md">
                    <MessageCircle size={20} className="text-teal-400" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight mb-3 leading-tight italic">Konsultasi <br/>Cepat</h4>
                  <p className="text-slate-400 text-[10px] font-bold leading-relaxed mb-8">Tim apoteker kami siap melayani Anda 24/7.</p>
                  <button 
                    onClick={handleChatWhatsApp}
                    className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-teal-900/40 active:scale-95"
                  >
                    Chat Sekarang
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Feed */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-12 px-4 md:px-0">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">
                  {selectedCategory === 'Semua' ? 'Koleksi Medis' : selectedCategory}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-1 w-6 bg-teal-600 rounded-full" />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                    {filteredProducts.length} Produk
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-4 border border-slate-100/50 animate-pulse space-y-4">
                    <div className="aspect-square bg-slate-50 rounded-[1.5rem]" />
                    <div className="h-4 bg-slate-50 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-50 rounded-full w-1/2" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 bg-slate-50 rounded-full w-1/3" />
                      <div className="h-9 bg-slate-50 rounded-xl w-9" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onClick={setSelectedProduct}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-100"
              >
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-900/5">
                  <PackageOpen size={48} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Hasil Kosong</h3>
                <p className="text-slate-400 text-xs font-bold mt-3 max-w-xs mx-auto leading-relaxed px-6">
                  Tidak ada produk yang sesuai dengan kriteria pencarian Anda.
                </p>
                <button 
                  onClick={() => { setSearch(''); setSelectedCategory('Semua'); }}
                  className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                >
                  Reset Filter
                </button>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <ProductDetail 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        contactNumber={settings?.contactNumber}
      />
    </div>
  );
};
