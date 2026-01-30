'use client';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('universal_theme') as Theme) || 'dark',
  );

  useEffect(() => {
    const root = window.document.documentElement;
    // 🚀 Önce temizle, sonra tek bir sınıf ekle
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('universal_theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
