import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Sparkles, PackageOpen } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

export const Promo = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useAuth();

  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      const data = await productService.getPromoProducts();
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchPromos();
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-slate-50 p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-12 relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl shadow-slate-900/20">
          <div className="relative z-10 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-teal-500/20 w-fit rounded-full text-[10px] font-bold tracking-widest uppercase border border-teal-500/30"
            >
              <Sparkles size={14} className="text-teal-400" />
              Special Offers Only
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              Penawaran <br/><span className="text-teal-500 underline decoration-teal-500/30 underline-offset-8">Terbaik</span> Hari Ini
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl max-w-lg mb-0"
            >
              Hemat lebih banyak untuk produk kesehatan esensial keluarga Anda. Exclusive Offer!
            </motion.p>
          </div>

          <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12 transition-transform hover:scale-110 duration-1000">
            <Tag size={500} strokeWidth={1} />
          </div>
          
          {/* Accent blobs */}
          <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-64 h-64 bg-teal-600/20 rounded-full blur-[100px]"></div>
        </header>

        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
              <Tag size={20} />
            </div>
            Daftar Produk Promo
          </h2>
          <div className="text-sm font-bold text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">
            {products.length} Aktif
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white rounded-3xl animate-pulse p-4 flex flex-col gap-4">
                <div className="flex-grow bg-slate-100 rounded-2xl"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 mx-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Belum Ada Promo</h3>
            <p className="text-slate-500 mt-2">Nantikan promo menarik lainnya segera di {settings?.appName || 'Medikatalog'}.</p>
          </div>
        )}
      </div>
    </div>
  );
};
