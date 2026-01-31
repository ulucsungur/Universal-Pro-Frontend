import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Category, Listing } from '../../types/auth';
import { HeroSlider } from '../../components/ui/HeroSlider';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, listRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories?topOnly=true'),
          axios.get('http://localhost:5000/api/listings'),
        ]);
        setCategories(catRes.data);
        setListings(listRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSlider />

      <main className="max-w-350 mx-auto px-6 md:px-10 relative z-30 -mt-16 md:-mt-32 pb-20 w-full flex-1">
        {/* 1. KATEGORİLER: 4'lü Grid ve Temiz Görünüm */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="bg-white dark:bg-[#0f172a] p-1.5 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl hover:scale-[1.05] transition-all duration-500 group no-underline overflow-hidden block"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src={cat.imageUrl}
                    className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 dark:from-[#0f172a]/90 via-transparent to-transparent flex items-end p-5">
                    <span className="font-black uppercase tracking-tighter text-xl italic text-white">
                      {isTr ? cat.titleTr : cat.titleEn}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. İLANLAR: Picked For You Başlık Düzenlemesi */}
        <section className="pt-10">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 border-b border-slate-200 dark:border-white/10 pb-6 italic text-slate-900 dark:text-white">
            {/* 🚀 text-slate-900 sayesinde aydınlık modda jilet gibi görünür */}
            {isTr ? 'Sizin İçin ' : 'Picked For '}
            <span className="text-purple-600">
              {isTr ? 'Seçtiklerimiz' : 'You'}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {listings.map((item: Listing) => {
              const mainImage = item.imageUrls?.[0] || null;
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-[#0f172a] p-6 rounded-4xl border border-slate-200 dark:border-white/5 hover:border-purple-500/30 transition-all group flex flex-col h-full shadow-lg"
                >
                  <div className="aspect-square rounded-3xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-white/5 relative">
                    {/* 🚀 TİCARİ ETİKETLER */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                      {item.type === 'sale' ? (
                        <span className="bg-purple-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-widest">
                          {t('for_sale')}
                        </span>
                      ) : (
                        <>
                          <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-widest">
                            {t('for_rent')}
                          </span>
                          {item.isDaily === 'true' && (
                            <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md shadow-lg uppercase tracking-tighter text-center">
                              {t('daily')}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 italic text-[10px] font-bold uppercase tracking-widest">
                        {t('image_coming_soon')}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg uppercase truncate text-slate-900 dark:text-white italic mb-2">
                    {isTr
                      ? item.titleTr || item.title
                      : item.titleEn || item.title}
                  </h3>

                  <div className="flex justify-between items-center mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                    <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                      {Number(item.price).toLocaleString(
                        isTr ? 'tr-TR' : 'en-US',
                      )}{' '}
                      ₺
                    </span>
                    <Link to={`/listing/${item.id}`}>
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-black p-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95">
                        →
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
