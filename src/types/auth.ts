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
