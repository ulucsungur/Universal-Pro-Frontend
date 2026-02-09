import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { CartItem } from '../../types/auth';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const { refreshCart } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const res = await axios.get<CartItem[]>('http://localhost:5000/api/cart');
      setItems(res.data);
    } catch (err) {
      console.error('Sepet çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (cartId: number, newQty: number) => {
    if (newQty < 1) return;
    const item = items.find((i) => i.id === cartId);
    if (!item) return;

    try {
      await axios.post('http://localhost:5000/api/cart', {
        listingId: item.listingId,
        quantity: newQty - item.quantity,
      });
      fetchCart();
      refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (cartId: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartId}`);
      fetchCart();
      refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Toplam fiyat hesabı (listing kontrolü ile)
  const total = items.reduce((acc, item) => {
    const price = item.listing ? Number(item.listing.price) : 0;
    return acc + price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-6 bg-white dark:bg-[#0f172a] rounded-full mb-6">
          <ShoppingBag size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">
          Sepetin Boş
        </h2>
        <p className="text-slate-500 mt-2 mb-8 uppercase text-[10px] font-black tracking-widest">
          Henüz bir ürün eklemedin.
        </p>
        <Link
          to="/"
          className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest no-underline"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-8 lg:p-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-10 italic uppercase tracking-tighter border-l-4 border-purple-600 pl-4">
          Alışveriş Sepeti
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              // 🚀 KRİTİK DÜZELTME: Eğer listing verisi yoksa bu satırı render etme
              if (!item.listing) return null;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-6 shadow-xl"
                >
                  <img
                    src={
                      item.listing.imageUrls?.[0] ||
                      'https://via.placeholder.com/150'
                    }
                    className="w-24 h-24 rounded-2xl object-cover"
                    alt={item.listing.title}
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm line-clamp-1">
                      {item.listing.title}
                    </h3>
                    <p className="text-purple-600 font-black italic mt-1">
                      {item.listing.price} {item.listing.currency}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-2 rounded-2xl border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:text-purple-500 transition-colors cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-black w-8 text-center text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:text-purple-500 transition-colors cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-3 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 sticky top-24 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 italic">
                Sipariş Özeti
              </h3>
              <div className="flex justify-between items-end mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Toplam Tutar:
                </span>
                <span className="text-3xl font-black italic text-slate-900 dark:text-white">
                  {total.toLocaleString()}{' '}
                  <span className="text-purple-600 text-sm">₺</span>
                </span>
              </div>
              <Link
                to="/checkout"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 no-underline transition-all active:scale-95"
              >
                ÖDEMEYE GEÇ <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
