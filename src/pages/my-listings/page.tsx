// frontend/src/pages/my-listings/page.tsx
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  Box,
  Tag,
  Calendar,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Listing } from '../../types/auth';

export default function MyListingsPage() {
  const { t, i18n } = useTranslation();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const isTr = i18n.language.startsWith('tr');

  const fetchMyListings = useCallback(async () => {
    try {
      const res = await axios.get<Listing[]>(
        'http://localhost:5000/api/my-listings',
      );
      setMyListings(res.data);
    } catch (err) {
      console.error('İlan çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        t('confirm_delete') || 'Bu ilanı silmek istediğinize emin misiniz?',
      )
    )
      return;
    try {
      await axios.delete(`http://localhost:5000/api/listings/${id}`);
      setMyListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
              {t('my_listings_title') || 'İLAN YÖNETİMİ'}
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
              <Box size={14} className="text-purple-600" /> TOPLAM{' '}
              {myListings.length} AKTİF İLAN
            </p>
          </div>
          <Link
            to="/add-listing"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl shadow-purple-500/20 no-underline transition-all active:scale-95"
          >
            <Plus size={18} /> {t('add_new_listing') || 'YENİ İLAN EKLE'}
          </Link>
        </div>

        {/* LİSTE */}
        <div className="grid gap-6">
          {myListings.length === 0 ? (
            <div className="bg-white dark:bg-[#0f172a] p-20 rounded-[40px] text-center border border-dashed border-slate-200 dark:border-white/10">
              <p className="text-slate-500 font-black uppercase tracking-widest italic">
                Henüz ilanınız bulunmuyor.
              </p>
            </div>
          ) : (
            myListings.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#0f172a] p-6 rounded-4xlborder border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all group"
              >
                {/* GÖRSEL */}
                <div className="relative w-full md:w-32 h-32 shrink-0">
                  <img
                    src={item.imageUrls?.[0]}
                    className="w-full h-full object-cover rounded-3xl shadow-lg"
                    alt=""
                  />
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase">
                    {item.type === 'sale' ? 'Satılık' : 'Kiralık'}
                  </div>
                </div>

                {/* BİLGİLER */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <h3 className="text-lg font-black dark:text-white uppercase italic leading-tight group-hover:text-purple-600 transition-colors">
                    {isTr ? item.titleTr : item.titleEn}
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider italic">
                    <span className="flex items-center gap-1">
                      <Tag size={12} className="text-purple-500" />{' '}
                      {isTr ? item.category?.titleTr : item.category?.titleEn}
                    </span>
                    <span className="flex items-center gap-1">
                      <Box size={12} className="text-blue-500" /> STOK:{' '}
                      {item.stock}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-amber-500" />{' '}
                      {new Date(item.createdAt).toLocaleDateString(
                        isTr ? 'tr-TR' : 'en-US',
                      )}
                    </span>
                  </div>
                </div>

                {/* FİYAT */}
                <div className="text-center md:text-right min-w-32">
                  <p className="text-2xl font-black text-slate-900 dark:text-white italic">
                    {Number(item.price).toLocaleString()}{' '}
                    <span className="text-sm text-purple-600">₺</span>
                  </p>
                </div>

                {/* AKSİYONLAR */}
                <div className="flex gap-2">
                  <Link
                    to={`/listing/${item.id}`}
                    className="p-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link
                    to={`/listing/${item.id}/edit`}
                    className="p-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
