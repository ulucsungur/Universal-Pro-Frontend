import { useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { AuthContext } from './AuthContext';
import type { User, CartItem, AuthContextType } from '../types/auth';

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // 🚀 TİCARİ STATE'LER
  const [cartCount, setCartCount] = useState<number>(0);
  const [favIds, setFavIds] = useState<number[]>([]);

  const refreshUnreadCount = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/messages/unread-count',
      );
      setUnreadCount(res.data.count || 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  // 🚀 SEPET TAZELEME (TS Fix: any silindi)
  const refreshCart = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<CartItem[]>('http://localhost:5000/api/cart');
      const total = res.data.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  }, []);

  // 🚀 FAVORİ TAZELEME
  const refreshFavorites = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<number[]>(
        'http://localhost:5000/api/favorites/ids',
      );
      setFavIds(res.data);
    } catch {
      setFavIds([]);
    }
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      if (res.data) {
        setUser(res.data);
        await Promise.all([
          refreshUnreadCount(),
          refreshCart(),
          refreshFavorites(),
        ]);
      }
    } catch {
      setUser(null);
      setUnreadCount(0);
      setCartCount(0);
      setFavIds([]);
    } finally {
      setLoading(false);
    }
  }, [refreshUnreadCount, refreshCart, refreshFavorites]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, pass: string): Promise<void> => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: pass,
      });
      setUser(res.data.user);
      await Promise.all([
        refreshUnreadCount(),
        refreshCart(),
        refreshFavorites(),
      ]);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      throw new Error(axiosError.response?.data?.error || 'Giriş yapılamadı');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      setUser(null);
      setUnreadCount(0);
      setCartCount(0);
      setFavIds([]);
      window.location.href = '/';
    } catch {
      console.error('Çıkış hatası');
    }
  };

  // 🚀 TÜM DEĞİŞKENLER MÜHÜRLENDİ
  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    unreadCount,
    refreshUnreadCount,
    cartCount,
    refreshCart,
    favorites: favIds,
    refreshFavorites,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
