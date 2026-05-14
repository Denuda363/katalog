import React, { createContext, useContext, useEffect, useState } from 'react';

import { settingsService, AppSettings } from '../services/settingsService';

interface AuthContextType {
  isAdmin: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  settings: AppSettings | null;
  refreshSettings: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  isAdmin: false, 
  login: async () => false, 
  logout: () => {}, 
  loading: true,
  settings: null,
  refreshSettings: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const refreshSettings = async () => {
    const data = await settingsService.getSettings();
    setSettings(data);
  };

  useEffect(() => {
    const saved = localStorage.getItem('medikatalog_admin');
    if (saved === 'true') {
      setIsAdmin(true);
    }
    refreshSettings().then(() => setLoading(false));
  }, []);

  const login = async (pin: string) => {
    setIsAdmin(true);
    localStorage.setItem('medikatalog_admin', 'true');
    return true;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('medikatalog_admin');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading, settings, refreshSettings }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
