import React from 'react';
import { motion } from 'motion/react';
import { Plus, Tag, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
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
      onClick={() => onClick?.(product)}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(13,148,136,0.1)] transition-all duration-500 flex flex-col group h-full relative cursor-pointer"
    >
      <div className="relative aspect-square bg-slate-50/50 rounded-[1.5rem] mb-4 overflow-hidden flex items-center justify-center group-hover:bg-teal-50/50 transition-colors duration-500">
        <motion.img 
          src={product.imageUrl || `https://placehold.co/400?text=${encodeURIComponent(product.name)}`} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {product.isPromo && (
            <div className="bg-white/90 backdrop-blur-md text-teal-600 text-[7px] font-black px-2 py-1 rounded-full flex items-center gap-1 border border-white uppercase tracking-[0.15em] shadow-lg shadow-teal-900/5">
              <Tag size={8} strokeWidth={3} />
              {product.promoText || 'PROMO'}
            </div>
          )}
          
          <div className="bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-full text-[7px] font-black text-white uppercase tracking-[0.15em] shadow-lg shadow-slate-900/10 ml-auto leading-none">
            {product.category}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow px-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="text-base font-black text-slate-900 leading-[1.2] group-hover:text-teal-600 transition-colors tracking-tight italic line-clamp-2">
            {product.name}
          </h4>
          {product.isBundling && (
            <div className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[6px] font-black uppercase tracking-[0.1em] mt-0.5 shrink-0">
              Bundle
            </div>
          )}
        </div>
        
        {product.isBundling && product.bundlingItems ? (
          <div className="p-2.5 bg-indigo-50/50 border border-indigo-100/50 rounded-xl mb-4 overflow-y-auto max-h-16 pr-1">
             <p className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.15em] mb-1 leading-none">Isi Paket</p>
             <p className="text-[9px] text-indigo-900 font-bold leading-tight italic">{product.bundlingItems}</p>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 font-medium mb-4 italic leading-relaxed overflow-y-auto max-h-16 pr-1">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-4 border-t border-slate-50/50">
          <div className="flex flex-col min-w-0">
            {product.isPromo && product.pricePromo ? (
              <>
                <p className="text-[8px] text-slate-300 line-through leading-none font-black mb-1 uppercase tracking-wider truncate">
                  {formatCurrency(product.priceMedis)}
                </p>
                <p className="text-base font-black text-teal-600 tracking-tighter italic truncate">
                  {formatCurrency(product.pricePromo)}
                </p>
              </>
            ) : (
              <p className="text-base font-black text-slate-900 tracking-tighter italic truncate">
                {formatCurrency(product.priceMedis)}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleChatWhatsApp}
              className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
              title="Chat WA"
            >
              <MessageCircle size={16} strokeWidth={2.5} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product);
              }}
              className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-teal-600 transition-all shadow-md shadow-slate-900/10"
              title="Tambah"
            >
              <Plus size={16} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
