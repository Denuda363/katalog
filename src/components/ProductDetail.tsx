import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ShoppingCart, ShieldCheck, Info, FlaskConical, Stethoscope, Heart, Share2, Star } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

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

  const handleChatWhatsApp = () => {
    if (!contactNumber) return;
    const cleanNumber = contactNumber.replace(/[^0-9]/g, '');
    const message = `Halo, saya tertarik dengan produk: ${product.name}. Bisakah saya pesan sekarang?`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:max-h-[90vh] border border-white/20"
          >
            {/* Close Button Mobile */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-30 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center text-white md:hidden border border-white/20"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            {/* Left: Image Section - Cinematic Style */}
            <div className="w-full md:w-5/12 bg-slate-900 relative group overflow-hidden h-72 md:h-auto shrink-0">
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                src={product.imageUrl || `https://placehold.co/800?text=${encodeURIComponent(product.name)}`} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
              
              {/* Image Footer Info */}
              <div className="absolute bottom-10 left-10 right-10 z-10 hidden md:block">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                    Pilihan 500+ Pelanggan
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 backdrop-blur-md rounded-full border border-teal-500/30 text-teal-400 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                    <Star size={10} fill="currentColor" />
                    Produk Unggulan
                  </div>
                </motion.div>
              </div>

              {/* Price Tag Floating Mobile */}
              <div className="absolute bottom-6 left-6 md:hidden">
                 {product.isPromo && (
                  <div className="bg-teal-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                    Promo {product.promoText || 'Spesial'}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Content Section */}
            <div className="w-full md:w-7/12 flex flex-col h-full bg-white relative">
               {/* Header Toolbar */}
               <div className="absolute top-8 left-8 right-8 z-20 flex items-center justify-between pointer-events-none md:pointer-events-auto">
                 <div className="hidden md:flex items-center gap-2">
                   <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                     Ref: {product.id.slice(0, 8).toUpperCase()}
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <button className="w-12 h-12 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all border border-slate-100 hidden md:flex">
                     <Share2 size={20} />
                   </button>
                   <button 
                    onClick={onClose}
                    className="w-12 h-12 bg-slate-900 text-white hover:bg-teal-600 rounded-2xl hidden md:flex items-center justify-center transition-all shadow-xl shadow-slate-900/10"
                  >
                    <X size={24} strokeWidth={2.5} />
                  </button>
                 </div>
               </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-14 pt-24 md:pt-32 pb-12 md:pb-20 pr-6 md:pr-10 scrollbar-thin">
                <div className="space-y-12 pb-10">
                  {/* Title & Badge */}
                  <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="h-1.5 w-12 bg-teal-500 rounded-full" />
                      <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em]">
                        {product.category}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic leading-[0.95] mb-8">
                      {product.name}
                    </h2>
                    <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-semibold italic border-l-4 border-slate-100 pl-6">
                      {product.description}
                    </p>
                  </motion.div>

                  {/* Pricing Display */}
                  <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible" className="flex items-end gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <ShieldCheck size={120} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Investasi Kesehatan</p>
                      <div className="flex flex-col">
                        {product.isPromo && product.pricePromo ? (
                          <>
                            <p className="text-sm text-slate-300 line-through font-black mb-1 uppercase tracking-widest">
                              {formatCurrency(product.priceMedis)}
                            </p>
                            <p className="text-5xl font-black text-teal-600 tracking-tighter italic">
                              {formatCurrency(product.pricePromo)}
                            </p>
                          </>
                        ) : (
                          <p className="text-5xl font-black text-slate-900 tracking-tighter italic">
                            {formatCurrency(product.priceMedis)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="pb-2 hidden sm:block">
                      <div className="px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-slate-100 text-[9px] font-black text-teal-600 uppercase tracking-widest leading-none">
                        Produk Terverifikasi
                      </div>
                    </div>
                  </motion.div>

                  {/* Bundling & Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.isBundling && (
                      <motion.div custom={2} variants={contentVariants} initial="hidden" animate="visible" className="col-span-full p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                              <ShoppingCart size={22} />
                            </div>
                            <div>
                              <h4 className="text-sm font-black uppercase tracking-widest leading-none mb-1">Paket Bundling Modern</h4>
                              <p className="text-[10px] text-indigo-100/60 font-medium uppercase tracking-widest">Hemat hingga 20%</p>
                            </div>
                          </div>
                          <p className="text-base font-bold italic leading-relaxed text-indigo-50">
                            "{product.bundlingItems || 'Menyediakan beragam solusi medis dalam satu paket hemat.'}"
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Detailed Cards */}
                    <motion.div custom={3} variants={contentVariants} initial="hidden" animate="visible" className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-900/5 transition-all">
                      <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 border border-teal-100 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <Stethoscope size={22} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-slate-900">Khasiat & Manfaat</h4>
                      <p className="text-sm text-slate-500 leading-relaxed italic font-medium">
                        {product.benefits || 'Membantu menjaga kesehatan tubuh dan mempercepat proses pemulihan secara intensif.'}
                      </p>
                    </motion.div>

                    <motion.div custom={4} variants={contentVariants} initial="hidden" animate="visible" className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <FlaskConical size={22} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 text-slate-900">Komposisi Medis</h4>
                      <p className="text-sm text-slate-500 leading-relaxed italic font-medium">
                        {product.ingredients || 'Formula terstandar tinggi dengan bahan-bahan medis pilihan yang aman.'}
                      </p>
                    </motion.div>

                    <motion.div custom={5} variants={contentVariants} initial="hidden" animate="visible" className="col-span-full p-8 md:p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group border border-white/5">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full group-hover:bg-teal-500/20 transition-all duration-700" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-5 mb-8">
                          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 text-teal-400">
                            <Info size={24} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500 mb-1">Protokol Keamanan</h4>
                            <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-white">Aturan Pakai</h4>
                          </div>
                        </div>
                        <p className="text-base md:text-lg text-slate-300 leading-relaxed italic font-medium pr-6">
                          {product.usageInstructions || 'Gunakan sesuai petunjuk dokter atau instruksi yang tertera pada kemasan secara disiplin untuk hasil terbaik.'}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Trust Factors */}
                  <motion.div custom={6} variants={contentVariants} initial="hidden" animate="visible" className="flex flex-wrap items-center gap-10 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 shadow-sm">
                        <ShieldCheck size={16} strokeWidth={3} />
                      </div>
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">100% Original</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 shadow-sm">
                        <Star size={14} fill="currentColor" />
                      </div>
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Premium Quality</span>
                    </div>
                  </motion.div>

                  {/* Extra padding to ensure anything scrolling is reachable */}
                  <div className="h-20" />
                </div>
              </div>

              {/* Action Sidebar/Footer */}
              <div className="p-8 md:px-14 md:py-12 bg-white border-t border-slate-50">
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChatWhatsApp}
                    className="flex-1 px-10 py-6 bg-teal-600 hover:bg-teal-500 text-white rounded-3xl flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-teal-600/20 transition-all border-b-4 border-teal-800 active:border-b-0"
                  >
                    <MessageCircle size={20} strokeWidth={3} />
                    Konsultasi via WA
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onAddToCart?.(product);
                      onClose();
                    }}
                    className="flex-1 px-10 py-6 bg-slate-900 text-white rounded-3xl flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/10 hover:bg-slate-800 transition-all border-b-4 border-slate-950 active:border-b-0"
                  >
                    <ShoppingCart size={20} strokeWidth={3} />
                    Tambahkan
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

