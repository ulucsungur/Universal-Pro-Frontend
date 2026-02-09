// frontend/src/pages/favorites/page.tsx
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Listing } from '../../types/auth';

export default function FavoritesPage() {
  const { t, i18n } = useTranslation();
  const { refreshFavorites, refreshCart } = useAuth();
  const [favListings, setFavListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const isTr = i18n.language.startsWith('tr');

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await axios.get<Listing[]>(
        'http://localhost:5000/api/favorites',
      );
      setFavListings(res.data);
    } catch (err) {
      console.error('Favori çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFavorite = async (id: number) => {
    try {
      await axios.post('http://localhost:5000/api/favorites/toggle', {
        listingId: id,
      });
      await refreshFavorites(); // Navbar'daki sayıyı güncelle
      setFavListings((prev) => prev.filter((item) => item.id !== id)); // Listeden anında sil
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (id: number) => {
    try {
      await axios.post('http://localhost:5000/api/cart', {
        listingId: id,
        quantity: 1,
      });
      await refreshCart();
      alert(t('added_to_cart') || 'Sepete eklendi!');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-8 lg:p-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white border-l-8 border-red-500 pl-6">
          {t('my_favorites') || 'FAVORİLERİM'}
        </h1>

        {favListings.length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] p-20 rounded-[50px] text-center border border-dashed border-slate-200 dark:border-white/10">
            <Heart size={60} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-xl font-black uppercase italic dark:text-white">
              Henüz favorin yok
            </h2>
            <Link
              to="/"
              className="text-purple-600 font-black uppercase text-xs mt-4 inline-block hover:underline"
            >
              Keşfetmeye Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favListings.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* GÖRSEL */}
                <div className="relative aspect-square">
                  <img
                    src={item.imageUrls?.[0]}
                    className="w-full h-full object-cover"
                    alt={item.title}
                  />
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-2xl text-red-500 shadow-xl hover:scale-110 transition-all cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* İÇERİK */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-black uppercase dark:text-white line-clamp-1 italic">
                      {isTr ? item.titleTr : item.titleEn}
                    </h3>
                    <p className="text-purple-600 font-black text-xl mt-1">
                      {Number(item.price).toLocaleString()} ₺
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/listing/${item.id}`}
                      className="flex-1 bg-slate-100 dark:bg-white/5 dark:text-white p-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest no-underline hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                      DETAY <ArrowRight size={14} />
                    </Link>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="p-4 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-all active:scale-95 cursor-pointer"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
