import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import type { Listing, Category } from '../../types/auth';
import { Info, Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation();

  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState<Category | null>(null);

  // 🚀 FIX 1: Loading state'ini varsayılan olarak 'true' başlatıyoruz.
  // Bu, React'ın beklediği "başlangıçta zaten yüklüyor" durumudur.
  const [loading, setLoading] = useState(true);

  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    // 🚀 FIX 2: Eğer slug değişirse (bir kategoriden diğerine geçiş),
    // loading'i asenkron işleme girmeden hemen önce güncelliyoruz.
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true); // Kategoriler arası geçişte loader'ı tekrar tetikler
      try {
        const res = await axios.get(
          `http://localhost:5000/api/category/${slug}/listings`,
        );
        if (isMounted) {
          setListings(res.data.listings || []);
          setCategory(res.data.category || null);
        }
      } catch (err) {
        console.error('Veri çekme hatası:', err);
        if (isMounted) setListings([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    }; // Cleanup (Hafıza yönetimi)
  }, [slug]);

  // 🚀 YÜKLEME EKRANI (Daha profesyonel ve hafif)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center gap-4 transition-colors duration-500">
        <Loader2 className="animate-spin text-purple-500" size={40} />
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
          {t('loading')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-350 mx-auto">
        {/* KATEGORİ BAŞLIĞI */}
        <div className="mb-12 border-b border-slate-200 dark:border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
              {category ? (isTr ? category.titleTr : category.titleEn) : '...'}
            </h1>
            <p className="text-purple-600 font-bold text-[10px] uppercase tracking-[0.4em] mt-4">
              {listings.length} {t('picked_for_you')}
            </p>
          </div>
        </div>

        {/* İLAN LİSTESİ */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {listings.map((item: Listing) => {
              const mainImage = item.imageUrls?.[0] || null;
              const displayTitle = isTr
                ? item.titleTr || item.title
                : item.titleEn || item.title;

              return (
                <Link
                  key={item.id}
                  to={`/listing/${item.id}`}
                  className="no-underline group"
                >
                  <div className="bg-white dark:bg-[#0f172a] p-6 rounded-4xl border border-slate-200 dark:border-white/5 hover:border-purple-500/30 transition-all flex flex-col h-full shadow-lg">
                    <div className="aspect-square rounded-3xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-white/5 relative">
                      {/* 🚀 TİCARİ ETİKETLER (BADGES) */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                        {item.type === 'sale' ? (
                          <span className="bg-purple-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-xl uppercase tracking-widest animate-in slide-in-from-left-2">
                            {t('for_sale')}
                          </span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-xl uppercase tracking-widest animate-in slide-in-from-left-2">
                              {t('for_rent')}
                            </span>
                            {/* Eğer Airbnb moduysa (Günlükse) ek etiket çıkar */}
                            {item.isDaily === 'true' && (
                              <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md shadow-lg uppercase tracking-tighter text-center">
                                {t('daily')}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={displayTitle}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 italic text-[10px] font-bold uppercase">
                          {t('image_coming_soon')}
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg uppercase truncate text-slate-900 dark:text-white italic mb-2">
                      {displayTitle}
                    </h3>

                    <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                      <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                        {Number(item.price).toLocaleString(
                          isTr ? 'tr-TR' : 'en-US',
                        )}{' '}
                        ₺
                      </span>
                      <span className="bg-slate-900 dark:bg-white text-white dark:text-black p-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                        {t('details_btn')}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <Info size={48} className="text-slate-400" />
            <p className="text-slate-500 font-black uppercase tracking-[0.3em]">
              {t('no_listings_found')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
