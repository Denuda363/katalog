import React from 'react';
import { motion } from 'motion/react';
import { Plus, Tag, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { settings } = useAuth();
  
  const handleChatWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!settings?.contactNumber) {
      alert('Nomor kontak belum diatur oleh admin.');
      return;
    }
    const cleanNumber = settings.contactNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Halo, saya tertarik dengan produk ${product.name}. Bisakah saya mendapatkan informasi lebih lanjut?`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-sm hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-500 flex flex-col group h-full relative"
    >
      <div className="relative aspect-[4/3] bg-slate-50 rounded-[2rem] mb-6 overflow-hidden flex items-center justify-center border border-slate-50 group-hover:border-teal-100/50">
        <img 
          src={product.imageUrl || `https://placehold.co/400?text=${encodeURIComponent(product.name)}`} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {product.isPromo && (
          <div className="absolute top-4 left-4 bg-teal-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl shadow-teal-600/20 uppercase tracking-widest">
            <Tag size={10} strokeWidth={3} />
            {product.promoText || 'PROMO'}
          </div>
        )}
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-teal-600 border border-white/50 shadow-lg shadow-teal-900/5 uppercase tracking-widest">
          {product.category}
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-sm font-bold text-slate-900 leading-tight group-hover:text-teal-600 transition-colors line-clamp-1">
            {product.name}
          </h4>
          {product.isBundling && (
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[8px] font-bold uppercase tracking-widest border border-indigo-100/50 shrink-0">
              Bundling
            </span>
          )}
        </div>
        
        {product.isBundling && product.bundlingItems ? (
          <div className="p-3 bg-indigo-50/30 border border-indigo-50 rounded-2xl mb-4">
             <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1.5 leading-none">Isi Paket</p>
             <p className="text-[10px] text-indigo-700 font-bold line-clamp-2 leading-tight">{product.bundlingItems}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mb-5 line-clamp-2 italic leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-col">
            {product.isPromo && product.pricePromo ? (
              <>
                <p className="text-[10px] text-slate-400 line-through leading-none font-bold mb-1">
                  {formatCurrency(product.priceMedis)}
                </p>
                <p className="text-lg font-black text-teal-600 tracking-tight">
                  {formatCurrency(product.pricePromo)}
                </p>
              </>
            ) : (
              <p className="text-lg font-black text-slate-900 tracking-tight">
                {formatCurrency(product.priceMedis)}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleChatWhatsApp}
              className="p-3.5 bg-teal-50 text-teal-600 rounded-[1.2rem] hover:bg-teal-600 hover:text-white transition-all active:scale-90"
              title="Chat Sekarang"
            >
              <MessageCircle size={18} />
            </button>
            <button 
              onClick={() => onAddToCart?.(product)}
              className="p-3.5 bg-slate-900 text-white rounded-[1.2rem] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
