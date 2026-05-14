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
  FileDown
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
    contactNumber: ''
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
    stock: 0,
    isPromo: false,
    isBundling: false,
    bundlingItems: '',
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
        contactNumber: settings.contactNumber || ''
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
        stock: product.stock,
        isPromo: product.isPromo || false,
        isBundling: product.isBundling || false,
        bundlingItems: product.bundlingItems || '',
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
        stock: 0,
        isPromo: false,
        isBundling: false,
        bundlingItems: '',
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

  return (
    <div className="min-h-screen pt-20 pb-12 bg-slate-50 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Console Admin</h1>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wider">MediCatalog+ Management System</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => excelUtils.downloadTemplate(categories.map(c => c.name))}
              className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-6 py-4 rounded-2xl font-bold hover:bg-indigo-100 transition-all active:scale-95 text-sm"
            >
              <FileDown size={20} />
              Template Excel
            </button>
            <label className="flex items-center gap-3 bg-teal-50 text-teal-700 px-6 py-4 rounded-2xl font-bold hover:bg-teal-100 transition-all active:scale-95 text-sm cursor-pointer">
              {isImporting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-600 border-t-transparent" />
              ) : (
                <FileSpreadsheet size={20} />
              )}
              Import Excel
              <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleImportExcel} disabled={isImporting} />
            </label>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center gap-3 bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 text-sm"
            >
              <Settings size={20} />
              Branding
            </button>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-3 bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 text-sm"
            >
              <Tag size={20} />
              Kategori
            </button>
            <button
              onClick={() => setIsPinModalOpen(true)}
              className="flex items-center gap-3 bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 text-sm"
            >
              <Key size={20} />
              Ubah PIN
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-3 bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all active:scale-95 text-sm"
            >
              <Plus size={20} />
              Tambah Produk Baru
            </button>
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

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cari katalog berdasar nama atau kategori..."
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none text-sm transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl">
                {filteredProducts.length} Entri Ditemukan
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Produk & Deskripsi</th>
                  <th className="px-8 py-5">Kategori</th>
                  <th className="px-8 py-5">Medis & Promo</th>
                  <th className="px-8 py-5">MB & Khusus</th>
                  <th className="px-8 py-5">HK OTC</th>
                  <th className="px-8 py-5">Stok</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-10">
                        <div className="h-16 bg-slate-50 rounded-2xl w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-teal-50/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 shadow-inner p-1">
                            <img src={product.imageUrl || `https://placehold.co/400?text=${encodeURIComponent(product.name)}`} alt={product.name} className="w-full h-full object-cover rounded-xl" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{product.name}</div>
                            <div className="text-[10px] text-slate-400 italic mt-1 line-clamp-1 max-w-[250px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-wider">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-900 leading-tight">
                          {formatCurrency(product.priceMedis)}
                        </div>
                        {product.isPromo && (
                          <div className="text-[10px] font-bold text-teal-600 mt-1 flex items-center gap-1">
                             <Tag size={10} /> {formatCurrency(product.pricePromo || 0)}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-900 leading-tight">
                          {formatCurrency(product.priceMB || 0)}
                        </div>
                        <div className="text-[10px] font-bold text-indigo-600 mt-1">
                          {formatCurrency(product.priceKhusus || 0)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-900 leading-tight">
                          {formatCurrency(product.priceHKOTC || 0)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className={cn(
                            "text-sm font-bold",
                            product.stock < 10 ? "text-red-500" : "text-slate-700"
                          )}>
                            {product.stock} <span className="text-[10px] font-medium text-slate-400 ml-1">pcs</span>
                          </div>
                          {product.isBundling && (
                            <div className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[9px] font-bold uppercase tracking-wider w-fit border border-indigo-100/50">
                              Bundling
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {product.isPromo ? (
                          <span className="inline-flex items-center gap-1.5 text-[9px] font-bold px-3 py-1 bg-teal-100 text-teal-700 rounded-full uppercase tracking-widest border border-teal-200/50">
                            <div className="w-1 h-1 rounded-full bg-teal-500 animate-pulse" /> PROMO
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-3 py-1 bg-slate-100 text-slate-400 rounded-full uppercase tracking-widest border border-slate-200/50">
                            REGULAR
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleOpenModal(product)}
                            className="p-3 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-100"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id!)}
                            className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 bg-slate-50 rounded-[2rem] p-12 max-w-sm mx-auto my-12">
                         <Package size={48} className="text-slate-200" />
                         <p className="text-slate-400 font-bold text-sm">Data katalog kosong.</p>
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
              className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/50"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                    {editingProduct ? 'Perbarui Data Produk' : 'Entri Produk Baru'}
                  </h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Lengkapi informasi mendetail</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 text-slate-400 hover:bg-white hover:text-slate-900 rounded-full transition-all shadow-sm bg-white/50"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Nama Komersial
                      </label>
                      <input 
                        required
                        type="text" 
                        placeholder="Contoh: Paracetamol Forte"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-medium"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Kategori Farmasi
                      </label>
                      <select 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-medium appearance-none"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Deskripsi Indikasi
                      </label>
                      <textarea 
                        rows={4}
                        placeholder="Tuliskan indikasi dan dosis singkat..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-medium resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Harga Medis (IDR)
                      </label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold"
                        value={formData.priceMedis}
                        onChange={(e) => setFormData({...formData, priceMedis: Number(e.target.value)})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          Harga MB (IDR)
                        </label>
                        <input 
                          type="number" 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold"
                          value={formData.priceMB}
                          onChange={(e) => setFormData({...formData, priceMB: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          Harga Khusus (IDR)
                        </label>
                        <input 
                          type="number" 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold"
                          value={formData.priceKhusus}
                          onChange={(e) => setFormData({...formData, priceKhusus: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Harga HK OTC (IDR)
                      </label>
                      <input 
                        type="number" 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold"
                        value={formData.priceHKOTC}
                        onChange={(e) => setFormData({...formData, priceHKOTC: Number(e.target.value)})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          Stok Tersedia
                        </label>
                        <input 
                          required
                          type="number" 
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                        Visual Produk
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <label className="flex-1 flex items-center justify-center gap-3 px-5 py-4 bg-teal-50 border-2 border-dashed border-teal-200 rounded-2xl cursor-pointer hover:bg-teal-100/50 transition-all text-xs font-bold text-teal-700">
                             <Upload size={18} />
                             Pilih Gambar
                             <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'product')} />
                          </label>
                          {formData.imageUrl && (
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100">
                               <img src={formData.imageUrl} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <div className="relative">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                          <input 
                            type="url" 
                            placeholder="Atau tempel URL gambar..."
                            className="w-full pl-10 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-xs font-medium"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                          <Package size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">Paket Bundling</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktifkan untuk paket hemat</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, isBundling: !formData.isBundling})}
                        className={cn(
                          "w-14 h-8 rounded-full transition-all relative shrink-0",
                          formData.isBundling ? "bg-indigo-600" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm",
                          formData.isBundling ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {formData.isBundling && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 ml-1">
                              Isi Paket Bundling
                            </label>
                            <input 
                              type="text" 
                              placeholder="Contoh: 2x Paracetamol, 1x Vitamin C"
                              className="w-full px-5 py-4 bg-indigo-50/30 border border-indigo-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-indigo-700"
                              value={formData.bundlingItems}
                              onChange={(e) => setFormData({...formData, bundlingItems: e.target.value})}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-6 bg-teal-50 rounded-[2rem] border border-teal-100 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm">
                          <Tag size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-teal-950">Kampanye Promo</p>
                          <p className="text-[9px] text-teal-700 uppercase tracking-[0.2em] font-bold">Featured Listing</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, isPromo: !formData.isPromo})}
                        className={cn(
                          "w-14 h-7 rounded-full transition-all relative border-2 border-transparent",
                          formData.isPromo ? "bg-teal-600 ring-4 ring-teal-500/10" : "bg-slate-300"
                        )}
                      >
                        <motion.div 
                          animate={{ x: formData.isPromo ? 28 : 2 }}
                          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {formData.isPromo && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2 ml-1">
                        Harga Promo (IDR)
                      </label>
                      <input 
                        type="number" 
                        className="w-full px-5 py-4 bg-teal-50/30 border border-teal-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold text-teal-700"
                        value={formData.pricePromo}
                        onChange={(e) => setFormData({...formData, pricePromo: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2 ml-1">
                        Badge Teks (Promo Label)
                      </label>
                      <input 
                        type="text" 
                        placeholder="FLASH SALE • HEMAT 25%"
                        className="w-full px-5 py-4 bg-teal-50/30 border border-teal-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold text-teal-700"
                        value={formData.promoText}
                        onChange={(e) => setFormData({...formData, promoText: e.target.value})}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="pt-10 flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4.5 bg-slate-50 text-slate-500 rounded-[1.5rem] font-bold hover:bg-slate-100 transition-all text-sm"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 text-sm active:scale-[0.99]"
                  >
                    <Save size={20} className="text-teal-400" />
                    {editingProduct ? 'Terapkan Perubahan Data' : 'Publikasikan Produk'}
                  </button>
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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Kategori Obat</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kelola klasifikasi farmasi</p>
                </div>
                <button onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                  setCategoryName('');
                }} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCategoryAction} className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
                  {editingCategory ? 'Edit Nama Kategori' : 'Tambah Kategori Baru'}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Suplemen Mata"
                    className="flex-1 px-5 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    {editingCategory ? <Save size={18} /> : <Plus size={18} />}
                    {editingCategory ? 'Update' : 'Tambah'}
                  </button>
                </div>
                {editingCategory && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingCategory(null); setCategoryName(''); }}
                    className="mt-3 text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
                  >
                    Batalkan Edit
                  </button>
                )}
              </form>

              <div className="overflow-y-auto flex-grow pr-2 scrollbar-hide">
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-100 transition-all group">
                      <span className="font-bold text-slate-700">{cat.name}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingCategory(cat); setCategoryName(cat.name); }}
                          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
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
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Branding Toko</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sesuaikan identitas visual</p>
                </div>
                <button onClick={() => setIsSettingsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateSettings} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Nama Aplikasi</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input
                      type="text"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold"
                      value={settingsForm.appName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, appName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Nomor Kontak</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input
                      type="text"
                      placeholder="Contoh: +62 812-3456-7890"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm font-bold"
                      value={settingsForm.contactNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Logo Perusahaan</label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex-1 flex items-center justify-center gap-3 px-5 py-4 bg-teal-50 border-2 border-dashed border-teal-200 rounded-2xl cursor-pointer hover:bg-teal-100 transition-all text-xs font-bold text-teal-700">
                         <Upload size={18} />
                         Upload Logo
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                      </label>
                      {settingsForm.logoUrl && (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white p-1">
                           <img src={settingsForm.logoUrl} className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="url" 
                        placeholder="Atau tempel URL logo..."
                        className="w-full pl-10 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-xs font-medium"
                        value={settingsForm.logoUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
                >
                  <Save size={20} className="text-teal-400" />
                  Simpan Branding
                </button>
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
