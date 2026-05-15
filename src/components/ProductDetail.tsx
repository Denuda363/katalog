import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ShoppingCart, ShieldCheck, Info, FlaskConical, Stethoscope, Heart, Share2, Star, Package } from 'lucide-react';
import { Product } from '../types';
import { cn, formatCurrency, isPromoActive } from '../lib/utils';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
  contactNumber?: string;
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.1,
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1]
    }
  })
};

export const ProductDetail = ({ product, onClose, onAddToCart, contactNumber }: ProductDetailProps) => {
  if (!product) return null;
  const activePromo = isPromoActive(product);

  const handleChatWhatsApp = () => {
    if (!contactNumber) return;
    const cleanNumber = contactNumber.replace(/[^0-9]/g, '');
    const message = `Halo, saya tertarik dengan produk: ${product.name}. Bisakah saya pesan sekarang?`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col md:flex-row h-full md:h-[650px] max-h-[95vh] border border-white/40"
          >
            {/* Left Column: Image Display */}
            <div className="w-full h-64 md:h-full md:w-1/2 bg-slate-50 relative group flex items-center justify-center shrink-0">
              <motion.img 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                src={product.imageUrl || `https://placehold.co/800?text=${encodeURIComponent(product.name)}`} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Overlay Elements */}
              <div className="absolute top-4 left-4 md:top-8 md:left-8">
                <div className="px-3 py-1 md:px-5 md:py-2 bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-sm">
                  <span className="text-[8px] md:text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">
                    {product.category}
                  </span>
                </div>
              </div>

              {activePromo && product.isPromo && (
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                  <div className="px-3 py-1 md:px-5 md:py-2 bg-teal-600 text-white rounded-full shadow-lg">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-none">
                       {product.promoText || 'Spesial Promo'}
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 md:hidden w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 border border-white/20 shadow-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Right Column: Information & Actions */}
            <div className="w-full md:w-1/2 flex flex-col bg-white overflow-hidden">
              {/* Header Container */}
              <div className="p-6 md:p-10 pb-0 flex justify-between items-start">
                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                      Tersedia Sekarang
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {product.name}
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="hidden md:flex w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full items-center justify-center transition-all border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6 md:py-8 scrollbar-hide">
                <div className="space-y-6 md:space-y-8">
                  {/* Price Section */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Harga Satuan</p>
                      <div className="flex items-baseline gap-3">
                        {activePromo && product.isPromo && product.pricePromo ? (
                          <>
                            <span className="text-2xl md:text-3xl font-black text-teal-600 italic tracking-tighter">
                              {formatCurrency(product.pricePromo)}
                            </span>
                            <span className="text-xs md:text-sm text-slate-300 font-bold line-through">
                              {formatCurrency(product.priceMedis)}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter">
                            {formatCurrency(product.priceMedis)}
                          </span>
                        )}
                      </div>
                      {activePromo && product.isPromo && (product.promoStartDate || product.promoEndDate) && (
                        <p className="text-[9px] font-bold text-teal-600 uppercase tracking-widest mt-1">
                          Berlaku: {product.promoStartDate || '?'} s/d {product.promoEndDate || '?'}
                        </p>
                      )}
                    </div>

                    {/* Multi Units Display */}
                    {product.units && product.units.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 p-1">
                        {product.units.map((unit, idx) => (
                          <div key={idx} className="p-4 bg-slate-50/80 border border-slate-100 rounded-2xl group hover:border-teal-300 transition-all">
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2 group-hover:text-teal-500 transition-colors">{unit.name}</p>
                            <p className="text-lg font-black text-slate-950 italic tracking-tight leading-none">{formatCurrency(unit.price)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Deskripsi Produk</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {product.description}
                    </p>
                  </div>

                  {/* Product Specification Grid */}
                  <div className="grid grid-cols-1 gap-6">
                    {product.ingredients && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FlaskConical size={14} className="text-teal-600" />
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Komposisi / Kandungan</p>
                        </div>
                        <p className="text-sm text-slate-700 font-bold italic leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {product.ingredients}
                        </p>
                      </div>
                    )}

                    {product.benefits && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={14} className="text-teal-600" />
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Khasiat & Manfaat</p>
                        </div>
                        <p className="text-sm text-slate-700 font-bold italic leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {product.benefits}
                        </p>
                      </div>
                    )}
                    
                    {product.packaging && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-teal-600" />
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Kemasan</p>
                        </div>
                        <p className="text-sm text-slate-700 font-bold italic leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          {product.packaging}
                        </p>
                      </div>
                    )}

                    {activePromo && product.isBundling && (
                      <div className="p-6 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group shadow-lg shadow-indigo-600/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <ShoppingCart size={48} />
                        </div>
                        <div className="relative z-10 space-y-3">
                          <div className="flex items-center gap-2">
                            <Star size={12} className="text-indigo-200 fill-indigo-200" />
                            <p className="text-[9px] font-black text-indigo-100 uppercase tracking-[0.3em]">Paket Bundling Spesial</p>
                          </div>
                          <p className="text-sm font-bold italic leading-relaxed text-white">
                            {product.bundlingItems || 'Dapatkan kombinasi produk terbaik dalam satu paket hemat.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-teal-600 shadow-sm mb-3">
                        <ShieldCheck size={16} />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Kualitas</p>
                      <p className="text-xs font-bold text-slate-800 uppercase">100% Original</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-teal-600 shadow-sm mb-3">
                        <Heart size={16} />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Keamanan</p>
                      <p className="text-xs font-bold text-slate-800 uppercase">Sesuai Standar</p>
                    </div>
                  </div>

                  {/* Usage / Important Info */}
                  <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Info size={48} />
                    </div>
                    <div className="relative z-10 space-y-2">
                       <p className="text-[9px] font-black text-teal-500 uppercase tracking-[0.3em]">Instruksi Penggunaan</p>
                       <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                         {product.usageInstructions || 'Gunakan sesuai dosis yang dianjurkan oleh ahli atau petunjuk pada label untuk hasil yang maksimal.'}
                       </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-10 pt-6 bg-white border-t border-slate-50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChatWhatsApp}
                    className="flex-1 px-8 py-5 bg-teal-600 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-600/20 hover:bg-teal-500 transition-all"
                  >
                    <MessageCircle size={18} strokeWidth={3} />
                    Tanya via WA
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onAddToCart?.(product);
                      onClose();
                    }}
                    className="flex-1 px-8 py-5 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-950/10 hover:bg-slate-800 transition-all"
                  >
                    <ShoppingCart size={18} strokeWidth={3} />
                    Pesan Produk
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

