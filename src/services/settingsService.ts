import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SETTINGS_DOC_ID = 'admin_config';
const COLLECTION = 'settings';

export interface AppSettings {
  adminPin: string;
  appName: string;
  logoUrl: string;
  contactNumber: string;
  address?: string;
}

export const settingsService = {
  async getSettings(): Promise<AppSettings> {
    try {
      const docRef = doc(db, COLLECTION, SETTINGS_DOC_ID);
      const snap = await getDoc(docRef);
      const defaultSettings: AppSettings = {
        adminPin: '12345',
        appName: 'MediCatalog+',
        logoUrl: '',
        contactNumber: '',
        address: ''
      };

      if (snap.exists()) {
        return {
          ...defaultSettings,
          ...snap.data()
        } as AppSettings;
      }
      
      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return {
        adminPin: '12345',
        appName: 'MediCatalog+',
        logoUrl: '',
        contactNumber: '',
        address: ''
      };
    }
  },

  async getAdminPin(): Promise<string> {
    const settings = await this.getSettings();
    return settings.adminPin;
  },

  async updateAdminPin(newPin: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, SETTINGS_DOC_ID);
      await updateDoc(docRef, { adminPin: newPin });
    } catch (error) {
      console.error('Error updating PIN:', error);
      throw error;
    }
  },

  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, SETTINGS_DOC_ID);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};
