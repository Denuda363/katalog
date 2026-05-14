import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category, DEFAULT_CATEGORIES } from '../types';

const COLLECTION_NAME = 'categories';

export interface CategoryItem {
  id: string;
  name: string;
  order: number;
}

export const categoryService = {
  async getCategories(): Promise<CategoryItem[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CategoryItem[];

      if (categories.length === 0) {
        // Initialize with default categories if empty
        const initialCategories: CategoryItem[] = [];
        for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
          const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            name: DEFAULT_CATEGORIES[i],
            order: i,
            createdAt: serverTimestamp()
          });
          initialCategories.push({
            id: docRef.id,
            name: DEFAULT_CATEGORIES[i],
            order: i
          });
        }
        return initialCategories;
      }

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default if error
      return DEFAULT_CATEGORIES.map((name, index) => ({
        id: `default-${index}`,
        name,
        order: index
      }));
    }
  },

  async addCategory(name: string, order: number): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name,
        order,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, name: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { name, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};
