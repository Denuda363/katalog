import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  Package,
  Search,
  Tag,
  Key,
  Phone,
  Settings,
  Upload,
  Globe,
  FileSpreadsheet,
  FileDown,
  MapPin
} from 'lucide-react';
import { productService } from '../services/productService';
import { settingsService, AppSettings } from '../services/settingsService';
import { useAuth } from '../context/AuthContext';
import { excelUtils } from '../lib/excelUtils';
import { categoryService, CategoryItem } from '../services/categoryService';
import { Product, Category } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const { settings, categories, refreshSettings, refreshCategories } = useAuth();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  
  // Category Management State
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // App Settings Form
  const [settingsForm, setSettingsForm] = useState({
    appName: '',
    logoUrl: '',
    contactNumber: '',
    address: ''
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priceMedis: 0,
    pricePromo: 0,
    priceMB: 0,
    priceKhusus: 0,
    priceHKOTC: 0,
    imageUrl: '',
    isPromo: false,
    isBundling: false,
    bundlingItems: '',
    benefits: '',
    ingredients: '',
    usageInstructions: '',
    promoText: ''
  });

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

  useEffect(() => {
    fetchProducts();
    if (settings) {
      setSettingsForm({
        appName: settings.appName,
        logoUrl: settings.logoUrl,
        contactNumber: settings.contactNumber || '',
        address: settings.address || ''
      });
    }
  }, [settings]);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await productService.getAllProducts();
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category as Category,
        priceMedis: product.priceMedis || 0,
        pricePromo: product.pricePromo || 0,
        priceMB: product.priceMB || 0,
        priceKhusus: product.priceKhusus || 0,
        priceHKOTC: product.priceHKOTC || 0,
        imageUrl: product.imageUrl || '',
        isPromo: product.isPromo || false,
        isBundling: product.isBundling || false,
        bundlingItems: product.bundlingItems || '',
        benefits: product.benefits || '',
        ingredients: product.ingredients || '',
        usageInstructions: product.usageInstructions || '',
        promoText: product.promoText || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category: categories.length > 0 ? categories[0].name : '',
        priceMedis: 0,
        pricePromo: 0,
        priceMB: 0,
        priceKhusus: 0,
        priceHKOTC: 0,
        imageUrl: '',
        isPromo: false,
        isBundling: false,
        bundlingItems: '',
        benefits: '',
        ingredients: '',
        usageInstructions: '',
        promoText: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct?.id) {
        await productService.updateProduct(editingProduct.id, formData);
        setMessage({ type: 'success', text: 'Produk berhasil diperbarui' });
      } else {
        await productService.createProduct(formData);
        setMessage({ type: 'success', text: 'Produk berhasil ditambahkan' });
      }
      setIsModalOpen(false);
      fetchProducts();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan sistem' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await productService.deleteProduct(id);
        setMessage({ type: 'success', text: 'Produk berhasil dihapus' });
        fetchProducts();
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal menghapus produk' });
      }
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsService.updateAdminPin(newPin);
      setMessage({ type: 'success', text: 'PIN Admin berhasil diubah' });
      setIsPinModalOpen(false);
      setNewPin('');
      await refreshSettings();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal mengubah PIN' });
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settingsService.updateSettings(settingsForm);
      setMessage({ type: 'success', text: 'Pengaturan aplikasi berhasil diperbarui' });
      setIsSettingsModalOpen(false);
      await refreshSettings();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memperbarui pengaturan' });
    }
  };

  const handleCategoryAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, categoryName);
        setMessage({ type: 'success', text: 'Kategori berhasil diperbarui' });
      } else {
        await categoryService.addCategory(categoryName, categories.length);
        setMessage({ type: 'success', text: 'Kategori baru ditambahkan' });
      }
      setCategoryName('');
      setEditingCategory(null);
      await refreshCategories();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memproses kategori' });
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`Hapus kategori "${name}"? Ini tidak akan menghapus produk dalam kategori ini.`)) {
      try {
        await categoryService.deleteCategory(id);
        setMessage({ type: 'success', text: 'Kategori dihapus' });
        await refreshCategories();
        setTimeout(() => setMessage(null), 3000);
      } catch (err) {
        setMessage({ type: 'error', text: 'Gagal menghapus kategori' });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'product' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // ~800KB limit for base64 storage in firestore doc (1MB limit total)
        alert('File terlalu besar. Maksimum 800KB untuk efisiensi sistem.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (field === 'product') {
          setFormData({ ...formData, imageUrl: base64String });
        } else {
          setSettingsForm({ ...settingsForm, logoUrl: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const importedProducts = await excelUtils.parseExcelFile(file, categories.map(c => c.name));
      
      // Batch upload (simplified for now by iterating)
      for (const productData of importedProducts) {
        await productService.createProduct(productData);
      }

      setMessage({ type: 'success', text: `Berhasil mengimpor ${importedProducts.length} produk` });
      fetchProducts();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error importing excel:', err);
      setMessage({ type: 'error', text: 'Gagal mengimpor file Excel. Pastikan format benar.' });
    } finally {
      setIsImporting(false);
      e.target.value = ''; // Reset input
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    promoActive: products.filter(p => p.isPromo).length,
    totalValue: products.reduce((acc, p) => acc + (p.priceMedis), 0)
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#fafafa] px-6 sm:px-10 lg:px-16 selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-[1700px] mx-auto">
        {/* Modern Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 bg-teal-500 rounded-full" />
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-[0.4em]">Control Room Engine</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter italic leading-none mb-4">
              Administrator <span className="text-slate-300">/</span> Console
            </h1>
            <p className="text-slate-500 text-sm font-medium italic max-w-md">
              Manajemen inventaris farmasi terintegrasi. Pantau, manipulasi, dan optimalkan data produk Anda dalam satu antarmuka presisi.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenModal()}
              className="px-10 py-5 bg-slate-950 text-white rounded-[2rem] font-black shadow-2xl shadow-slate-900/20 hover:bg-teal-600 transition-all flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] group"
            >
              <Plus size={20} strokeWidth={3} className="text-teal-400 group-hover:text-white transition-colors" />
              Entri Produk
            </motion.button>
          </div>
        </div>

        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-teal-500 group-hover:text-white transition-all">
              <Package size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Produk</p>
            <h3 className="text-4xl font-black text-slate-950 tracking-tight italic">{stats.totalProducts}</h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Tag size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kategori</p>
            <h3 className="text-4xl font-black text-slate-950 tracking-tight italic">{stats.totalCategories}</h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Promo Aktif</p>
            <h3 className="text-4xl font-black text-teal-600 tracking-tight italic">{stats.promoActive}</h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-8 bg-slate-950 rounded-[2.5rem] shadow-2xl shadow-slate-950/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Metrik Produk</p>
              <h3 className="text-2xl font-black text-white tracking-tighter italic leading-tight uppercase">
                Enterprise Catalog
              </h3>
              <p className="text-[8px] text-teal-500 font-bold uppercase tracking-[0.2em] mt-2">Active Management</p>
            </div>
          </motion.div>
        </div>

        {/* Global Controls Panel */}
        <div className="flex flex-col xl:flex-row gap-8 mb-12">
          <div className="flex-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
            <div className="relative flex-grow min-w-[300px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Cari katalog berdasar nama atau kategori..."
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-transparent rounded-3xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm font-medium transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-5 bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100"
                title="Branding"
              >
                <Settings size={22} />
              </button>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="p-5 bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100"
                title="Kategori"
              >
                <Tag size={22} />
              </button>
              <button
                onClick={() => setIsPinModalOpen(true)}
                className="p-5 bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100"
                title="Ubah PIN"
              >
                <Key size={22} />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-center gap-6 overflow-x-auto scrollbar-hide shrink-0">
            <div className="shrink-0 space-y-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Alat Bantu</p>
              <p className="text-xs font-bold text-white uppercase tracking-widest">Excel Sync</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={() => excelUtils.downloadTemplate(categories.map(c => c.name))}
                className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                <FileDown size={18} className="text-teal-400" />
                Template
              </button>
              <label className="flex items-center gap-3 px-6 py-4 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 transition-all cursor-pointer shadow-xl shadow-teal-600/20">
                {isImporting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <FileSpreadsheet size={18} />
                )}
                Import Data
                <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImportExcel} disabled={isImporting} />
              </label>
            </div>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-8 p-5 rounded-2xl flex items-center gap-3 font-bold text-sm",
              message.type === 'success' ? "bg-teal-50 text-teal-700 border border-teal-100" : "bg-red-50 text-red-700 border border-red-100"
            )}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            {message.text}
          </motion.div>
        )}

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identitas Produk</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Kategori</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Finansial</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Tipe</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-10 py-10">
                        <div className="h-20 bg-slate-50 rounded-[2rem] w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#fcfdfd] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-3xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                            <img 
                              src={product.imageUrl || `https://placehold.co/400?text=${encodeURIComponent(product.name)}`} 
                              alt={product.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="font-black text-slate-950 text-lg tracking-tight italic group-hover:text-teal-600 transition-colors leading-none">{product.name}</div>
                            <div className="text-[10px] text-slate-400 italic line-clamp-1 max-w-[250px] font-medium">{product.description}</div>
                            <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest pt-1">ID: {product.id?.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-[0.15em]">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-1.5">
                          <div className="text-sm font-black text-slate-950 italic">
                            {formatCurrency(product.priceMedis)}
                          </div>
                          {product.isPromo && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 text-teal-600 rounded-lg text-[10px] font-black border border-teal-100">
                               <Tag size={10} /> {formatCurrency(product.pricePromo || 0)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-2">
                          {product.isBundling ? (
                             <div className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-wider w-fit border border-indigo-100">
                              Bundling
                            </div>
                          ) : (
                            <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-wider w-fit border border-slate-100">
                              Single
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        {product.isPromo ? (
                          <div className="flex flex-col gap-2">
                             <span className="inline-flex items-center gap-2 text-[9px] font-black px-4 py-1.5 bg-teal-600 text-white rounded-full uppercase tracking-[0.2em] shadow-lg shadow-teal-600/20">
                              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> PROMO
                            </span>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest pl-1">{product.promoText || 'Spesial'}</p>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black px-4 py-1.5 bg-slate-50 text-slate-300 rounded-full uppercase tracking-[0.2em] border border-slate-100">
                            REGULAR
                          </span>
                        )}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <motion.button 
                            whileHover={{ scale: 1.1, backgroundColor: '#f0fdfa' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenModal(product)}
                            className="w-12 h-12 text-slate-300 hover:text-teal-600 rounded-2xl transition-all shadow-sm bg-white border border-slate-100 flex items-center justify-center"
                          >
                            <Pencil size={20} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1, backgroundColor: '#fef2f2' }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product.id!)}
                            className="w-12 h-12 text-slate-300 hover:text-red-600 rounded-2xl transition-all shadow-sm bg-white border border-slate-100 flex items-center justify-center"
                          >
                            <Trash2 size={20} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
                         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                           <Package size={48} />
                         </div>
                         <div>
                           <p className="text-slate-900 font-black text-xl italic tracking-tight">Katalog Kosong</p>
                           <p className="text-slate-400 text-xs font-medium mt-2">Mulai tambahkan produk pertama Anda atau gunakan fitur import excel.</p>
                         </div>
                         <button
                           onClick={() => handleOpenModal()}
                           className="px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-600/20"
                         >
                           Inisialisasi Produk
                         </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white"
            >
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 backdrop-blur-md">
                <div>
                  <h2 className="text-3xl font-black text-slate-950 italic tracking-tighter leading-none">
                    {editingProduct ? 'Modifikasi' : 'Inisialisasi'} <span className="text-slate-300">/</span> Produk
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Data Registry Farmasi v2.0</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 flex items-center justify-center text-slate-300 hover:bg-white hover:text-slate-950 rounded-full transition-all shadow-sm bg-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-12 scrollbar-hide bg-[#fdfdfd]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  {/* Left Column: Essential Info */}
                  <div className="md:col-span-7 space-y-10">
                    <section className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Identitas Dasar</p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                          Nama Komersial
                        </label>
                        <input 
                          required
                          type="text" 
                          placeholder="Produk Spesifik..."
                          className="w-full px-6 py-5 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all text-sm font-black italic text-slate-900 shadow-sm"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                          Klasifikasi
                        </label>
                        <div className="relative">
                           <select 
                            className="w-full px-6 py-5 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all text-sm font-black italic text-slate-900 appearance-none shadow-sm cursor-pointer"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                             <Plus size={16} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                          Deskripsi & Indikasi
                        </label>
                        <textarea 
                          rows={4}
                          placeholder="Fungsi utama produk..."
                          className="w-full px-6 py-5 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all text-sm font-medium italic text-slate-600 resize-none shadow-sm"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                    </section>

                    <section className="p-8 bg-slate-950 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                       <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/10 blur-3xl rounded-full" />
                       <div className="relative z-10 space-y-6">
                          <div className="flex items-center gap-3">
                            <Package size={20} className="text-teal-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory Management</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-6">
                               <button 
                                  type="button"
                                  onClick={() => setFormData({...formData, isBundling: !formData.isBundling})}
                                  className={cn(
                                    "flex items-center gap-3 px-6 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                                    formData.isBundling ? "bg-teal-600 text-white" : "bg-white/5 text-slate-400 border border-white/10"
                                  )}
                                >
                                  {formData.isBundling ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                                  Paket Bundling
                                </button>
                          </div>
                          
                          <AnimatePresence>
                            {formData.isBundling && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pt-2"
                              >
                                <input 
                                  type="text" 
                                  placeholder="Isi Paket: 1x Item A, 2x Item B"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-[11px] font-bold italic outline-none focus:bg-white/10 focus:border-indigo-400 transition-all text-indigo-200"
                                  value={formData.bundlingItems}
                                  onChange={(e) => setFormData({...formData, bundlingItems: e.target.value})}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                    </section>
                  </div>

                  {/* Right Column: Pricing & Content */}
                  <div className="md:col-span-5 space-y-10">
                    <section className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Matriks Harga</p>
                      </div>
                      <div className="space-y-4">
                        <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
                          <div>
                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Tier: Medis (Base)</label>
                            <input 
                              required
                              type="number" 
                              className="w-full py-2 text-2xl font-black italic text-slate-950 bg-transparent outline-none border-b border-slate-100 focus:border-teal-500 transition-all"
                              value={formData.priceMedis}
                              onChange={(e) => setFormData({...formData, priceMedis: Number(e.target.value)})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">MB</label>
                              <input 
                                type="number" 
                                className="w-full py-1 text-sm font-black italic text-slate-600 bg-transparent outline-none border-b border-slate-50 focus:border-slate-300 transition-all"
                                value={formData.priceMB}
                                onChange={(e) => setFormData({...formData, priceMB: Number(e.target.value)})}
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Khusus</label>
                              <input 
                                type="number" 
                                className="w-full py-1 text-sm font-black italic text-slate-600 bg-transparent outline-none border-b border-slate-50 focus:border-slate-300 transition-all"
                                value={formData.priceKhusus}
                                onChange={(e) => setFormData({...formData, priceKhusus: Number(e.target.value)})}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl space-y-4">
                          <div className="flex items-center justify-between">
                             <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Kampanye Promo</label>
                             <button
                                type="button"
                                onClick={() => setFormData({...formData, isPromo: !formData.isPromo})}
                                className={cn(
                                  "w-10 h-5 rounded-full relative transition-all",
                                  formData.isPromo ? "bg-teal-500" : "bg-slate-200"
                                )}
                              >
                                <div className={cn(
                                  "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                  formData.isPromo ? "right-1" : "left-1"
                                )} />
                             </button>
                          </div>
                          
                          <AnimatePresence>
                            {formData.isPromo && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-4 pt-2"
                              >
                                <input 
                                  type="number" 
                                  placeholder="Harga Promo"
                                  className="w-full py-2 text-xl font-black italic text-teal-600 bg-transparent outline-none border-b border-teal-100 focus:border-teal-500 transition-all"
                                  value={formData.pricePromo}
                                  onChange={(e) => setFormData({...formData, pricePromo: Number(e.target.value)})}
                                />
                                <input 
                                  type="text" 
                                  placeholder="Badge Teks (e.g. FLASH SALE)"
                                  className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-teal-500 bg-transparent outline-none border-b border-teal-50 focus:border-teal-200 transition-all"
                                  value={formData.promoText}
                                  onChange={(e) => setFormData({...formData, promoText: e.target.value})}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Media Asset</p>
                      </div>
                      <div className="space-y-4">
                        <div className="w-full aspect-square rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden relative group">
                           {formData.imageUrl ? (
                             <>
                               <img src={formData.imageUrl} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, imageUrl: ''})}
                                    className="p-3 bg-red-500 text-white rounded-full shadow-xl"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                               </div>
                             </>
                           ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-300 italic">
                                <ImageIcon size={48} strokeWidth={1} />
                                <p className="text-[10px] font-bold uppercase tracking-widest">No Image Defined</p>
                             </div>
                           )}
                        </div>
                        <label className="w-full flex items-center justify-center gap-3 py-4 bg-slate-950 text-white rounded-2xl cursor-pointer hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-widest">
                           <Upload size={16} className="text-teal-400" />
                           Upload Image
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'product')} />
                        </label>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="pt-20 flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ backgroundColor: '#f1f5f9' }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                  >
                    Discard Changes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: '#0f172a' }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="flex-[2] py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/40 transition-all flex items-center justify-center gap-4"
                  >
                    <Save size={20} className="text-teal-400" />
                    {editingProduct ? 'Commit Changes' : 'Publish Product'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Management Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-12 border border-white max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-950 italic tracking-tighter leading-none">
                    Kategori <span className="text-slate-300">/</span> Farmasi
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Taksonomi Produk v1.4</p>
                </div>
                <button onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                  setCategoryName('');
                }} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-950 rounded-full transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCategoryAction} className="mb-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
                  {editingCategory ? 'Update Identitas' : 'Inisialisasi Baru'}
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Nama Kategori..."
                    className="flex-1 px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all text-sm font-black italic text-slate-900"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-teal-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
                  >
                    {editingCategory ? <Save size={16} /> : <Plus size={16} />}
                    {editingCategory ? 'Commit' : 'Inject'}
                  </button>
                </div>
                {editingCategory && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingCategory(null); setCategoryName(''); }}
                    className="mt-4 text-[9px] font-black text-red-500 hover:text-red-600 uppercase tracking-widest ml-1"
                  >
                    Aborsi Operasi
                  </button>
                )}
              </form>

              <div className="overflow-y-auto flex-grow pr-2 scrollbar-hide">
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-teal-500 transition-all group shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <span className="font-black text-slate-900 italic tracking-tight">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingCategory(cat); setCategoryName(cat.name); }}
                          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* App Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl p-12 border border-white max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-950 italic tracking-tighter leading-none">
                    Branding <span className="text-slate-300">/</span> Identitas
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Environment Configuration v3.2</p>
                </div>
                <button onClick={() => setIsSettingsModalOpen(false)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:bg-slate-50 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateSettings} className="space-y-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">App Nomenclature</label>
                    <div className="relative">
                      <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="text"
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all text-sm font-black italic text-slate-950 shadow-sm"
                        value={settingsForm.appName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, appName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Contact Protocol</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input
                        type="text"
                        placeholder="Communication Number..."
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all text-sm font-black italic text-slate-950 shadow-sm"
                        value={settingsForm.contactNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contactNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Company Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-7 text-slate-300" size={20} />
                      <textarea
                        rows={3}
                        placeholder="Official Physical Address..."
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all text-sm font-black italic text-slate-950 shadow-sm resize-none"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Visual Logomark</label>
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-100 shadow-inner bg-slate-50 p-4 flex items-center justify-center shrink-0">
                           {settingsForm.logoUrl ? (
                             <img src={settingsForm.logoUrl} className="w-full h-full object-contain" />
                           ) : (
                             <ImageIcon size={32} className="text-slate-200" />
                           )}
                        </div>
                        <label className="flex-1 w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-950 text-white rounded-2xl cursor-pointer hover:bg-teal-600 transition-all text-[10px] font-black uppercase tracking-widest">
                           <Upload size={18} className="text-teal-400" />
                           Upload New Mark
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                        </label>
                      </div>
                      <div className="relative">
                        <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="url" 
                          placeholder="Or Deploy via Asset URL..."
                          className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-8 focus:ring-teal-500/5 focus:border-teal-500 outline-none transition-all text-[10px] font-black placeholder:text-slate-300 italic"
                          value={settingsForm.logoUrl}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/40 transition-all flex items-center justify-center gap-4"
                  >
                    <Save size={20} className="text-teal-400" />
                    Commit Environment Settings
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PIN Update Modal */}
      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPinModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Ubah PIN Admin</h2>
                <button onClick={() => setIsPinModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdatePin} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">PIN Baru</label>
                  <input
                    type="password"
                    maxLength={10}
                    placeholder="Masukkan PIN Baru"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full text-center text-3xl tracking-[0.5em] font-bold py-6 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={newPin.length < 1}
                  className="w-full py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={20} />
                  Simpan PIN Baru
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
