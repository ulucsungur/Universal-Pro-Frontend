import { useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { AuthContext } from './AuthContext';
import type { User } from '../types/auth';

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // 🚀 1. BİLDİRİM FONKSİYONU
  const refreshUnreadCount = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/messages/unread-count',
      );
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error('Bildirim sayısı alınamadı', err);
      setUnreadCount(0);
    }
  }, []);

  // 🚀 2. OTURUM KONTROLÜ
  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      if (res.data) {
        setUser(res.data);
        await refreshUnreadCount();
      }
    } catch {
      setUser(null);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [refreshUnreadCount]); // Bağımlılık mühürlendi

  // 🚀 3. ANA EFEKT (Bağımlılık Hatası BURADA BİTTİ)
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
      await refreshUnreadCount();
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
      window.location.href = '/';
    } catch {
      console.error('Çıkış işlemi başarısız');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, unreadCount, refreshUnreadCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
