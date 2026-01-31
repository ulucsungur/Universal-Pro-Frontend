// frontend/src/types/auth.ts

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  avatarUrl?: string;
}

export interface Category {
  id: number;
  titleTr: string;
  titleEn: string;
  slug: string;
  imageUrl?: string;
  parentId?: number | null;
  subCount?: number;
}

export interface Listing {
  id: number;
  title: string;
  titleTr?: string;
  titleEn?: string;
  description: string;
  descriptionTr?: string;
  descriptionEn?: string;
  price: number | string;
  currency: string;
  imageUrls?: string[];
  specs?: Record<string, string | number | boolean | null>;
  categoryId: number;
  sellerId?: number;
  seller?: User;
  createdAt: string;

  // 🚀 TİCARET TİPLERİ
  type: 'sale' | 'rent';
  isDaily: 'true' | 'false';
  stock: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

export type UserRole = 'admin' | 'agent' | 'user';

export interface Banner {
  id: number;
  titleTr: string;
  titleEn: string;
  subtitleTr?: string;
  subtitleEn?: string;
  imageUrl: string;
  link: string;
  order: number;
}
