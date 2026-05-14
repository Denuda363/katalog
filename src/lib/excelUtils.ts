import * as XLSX from 'xlsx';
import { Product, Category, DEFAULT_CATEGORIES } from '../types';

export const excelUtils = {
  downloadTemplate: (categories: string[] = DEFAULT_CATEGORIES) => {
    const templateData = [
      {
        Nama: 'Contoh Produk A',
        Deskripsi: 'Deskripsi produk di sini',
        Kategori: categories[0] || 'Umum',
        'Harga Medis': 50000,
        'Harga Promo': 45000,
        'Harga MB': 48000,
        'Harga Khusus': 40000,
        'Harga HK OTC': 42000,
        Stok: 100,
        'Is Promo (Y/N)': 'Y',
        'Promo Text': 'Diskon 10%',
        'Is Bundling (Y/N)': 'N',
        'Isi Paket Bundling': '',
        'URL Gambar': 'https://example.com/image.jpg'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'Template_MediCatalog.xlsx');
  },

  parseExcelFile: async (file: File, categories: string[] = DEFAULT_CATEGORIES): Promise<Partial<Product>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

          const products: Partial<Product>[] = jsonData.map(row => {
            const rowCategory = String(row.Kategori || '');
            const defaultCat = categories.length > 0 ? categories[0] : 'Umum';
            
            return {
              name: String(row.Nama || ''),
              description: String(row.Deskripsi || ''),
              category: (categories.includes(rowCategory) ? rowCategory : defaultCat) as Category,
              priceMedis: Number(row['Harga Medis'] || 0),
              pricePromo: row['Harga Promo'] ? Number(row['Harga Promo']) : undefined,
              priceMB: row['Harga MB'] ? Number(row['Harga MB']) : undefined,
              priceKhusus: row['Harga Khusus'] ? Number(row['Harga Khusus']) : undefined,
              priceHKOTC: row['Harga HK OTC'] ? Number(row['Harga HK OTC']) : undefined,
              stock: Number(row.Stok || 0),
              isPromo: String(row['Is Promo (Y/N)']).toUpperCase() === 'Y',
              promoText: String(row['Promo Text'] || ''),
              isBundling: String(row['Is Bundling (Y/N)']).toUpperCase() === 'Y',
              bundlingItems: String(row['Isi Paket Bundling'] || ''),
              imageUrl: String(row['URL Gambar'] || '')
            };
          });

          resolve(products);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });
  }
};
