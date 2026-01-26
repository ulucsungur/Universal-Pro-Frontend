import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { AuthContext } from './AuthContext'; // Az önce oluşturduğumuz objeyi alıyoruz
import type { User } from '../types/auth';

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async (): Promise<void> => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: pass,
      });
      setUser(res.data.user);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      throw new Error(axiosError.response?.data?.error || 'Giriş yapılamadı');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      setUser(null);
      window.location.href = '/';
    } catch {
      console.error('Çıkış işlemi başarısız');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
