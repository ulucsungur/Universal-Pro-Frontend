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
  isShippable: 'true' | 'false'; // 🚀 Kargo kontrolü
  category?: Category;
  postCode?: string | null;
  // 🚀 TİCARET TİPLERİ
  type: 'sale' | 'rent';
  isDaily: 'true' | 'false';
  stock: number;
  createdAt: string;

  latitude?: string | number;
  longitude?: string | number;
  addressText?: string;
  country?: string;
  city?: string;
  district?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  // 🚀 YENİ EKLENENLER
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
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
export interface Order {
  id: number;
  listingId: number;
  buyerId: number;
  sellerId: number;
  addressId: number | null;
  quantity: number;
  totalPrice: string;
  shippingStatus: 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  listing?: Listing; // Sipariş içindeki ürün bilgisi
  buyer?: User;
  address?: Address;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  canceledAt?: string | null;
  canceledBy?: 'seller' | 'buyer' | null;

  status:
    | 'pending'
    | 'paid'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';
}
export interface Address {
  id: number;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  postCode: string;
  addressDetail: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  listingId: number;
  content: string;
  isRead: 'true' | 'false';
  createdAt: string;

  // İlişkisel veriler
  sender?: User;
  receiver?: User;
  listing?: Listing;
}
// frontend/src/types/auth.ts dosyasının en altına ekleyin:

export interface Booking {
  id: number;
  listingId: number;
  customerId: number;
  startDate: string; // Backend'den ISO string olarak gelir
  endDate: string; // Backend'den ISO string olarak gelir
  totalPrice: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;

  // 🚀 İLİŞKİSEL VERİ (with: { listing: true })
  listing?: Listing;
  customer?: User;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface MetricDetail {
  count: number;
  score: number;
}

export interface PerformanceData {
  totalOrders: number;
  gps: number;
  metrics: {
    odr: MetricDetail;
    lsr: MetricDetail;
    cr: MetricDetail;
  };
}
