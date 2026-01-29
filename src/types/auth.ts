export type UserRole = 'admin' | 'agent' | 'user';
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
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
  imageUrls: string[];
  categoryId: number;
  specs: Record<string, string | number | boolean | null>;
  sellerId?: number;
  createdAt: string;
}
