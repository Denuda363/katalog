export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  priceMedis: number; // Harga Medis
  pricePromo?: number; // Harga Promo
  priceMB?: number;    // Harga MB
  priceKhusus?: number; // Harga Khusus
  priceHKOTC?: number;  // Harga HK OTC
  imageUrl?: string;
  stock: number;
  isPromo?: boolean;
  isBundling?: boolean;
  bundlingItems?: string;
  promoText?: string;
  createdAt: any;
  updatedAt: any;
}

export type Category = 'Obat Bebas' | 'Obat Terbatas' | 'Obat Keras' | 'Vitamin' | 'Alat Kesehatan' | 'Lainnya';

export const MEDICINE_CATEGORIES: Category[] = [
  'Obat Bebas',
  'Obat Terbatas',
  'Obat Keras',
  'Vitamin',
  'Alat Kesehatan',
  'Lainnya'
];

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
