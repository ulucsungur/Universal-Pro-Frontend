export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
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
  title: string;
  slug: string;
  imageUrl?: string;
}

export interface Listing {
  id: number;
  title: string;
  description?: string;
  price: string | number;
  imageUrls: string[];
  currency: string;
  createdAt: string;
}
