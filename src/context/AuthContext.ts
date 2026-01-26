import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

// Bu dosya SADECE Context objesini oluşturur ve ihraç eder.
// Bileşen içermediği için Fast Refresh hatası vermez.
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
