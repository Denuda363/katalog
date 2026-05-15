import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function isPromoActive(product: any) {
  if (!product.isPromo && !product.isBundling) return false;
  
  // If no dates are set, assume it's always active if isPromo/isBundling is true
  if (!product.promoStartDate && !product.promoEndDate) return true;
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (product.promoStartDate) {
    const start = new Date(product.promoStartDate);
    start.setHours(0, 0, 0, 0);
    if (now < start) return false;
  }
  
  if (product.promoEndDate) {
    const end = new Date(product.promoEndDate);
    end.setHours(23, 59, 59, 999);
    if (now > end) return false;
  }
  
  return true;
}
