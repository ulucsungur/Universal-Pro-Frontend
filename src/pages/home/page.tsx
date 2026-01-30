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
        console.error('Veri çekme hatası:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <HeroSlider />
      <main className="max-w-350 mx-auto px-6 md:px-10 relative z-30 -mt-20 md:-mt-44">
        {/* 1. KATEGORİLER SEKSİYONU */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="bg-[#0f172a] p-1 rounded-3xl border border-white/5 shadow-2xl hover:scale-[1.02] transition-all duration-300 group no-underline"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src={
                      cat.imageUrl ||
                      'https://images.unsplash.com/photo-1461376226594-32937e499bca?w=500'
                    }
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-transparent to-transparent flex items-end p-5">
                    <span className="font-black uppercase tracking-tighter text-lg italic text-white drop-shadow-md">
                      {isTr ? cat.titleTr : cat.titleEn}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. İLANLAR SEKSİYONU */}
        <section>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 border-b border-white/5 pb-6 italic">
            {isTr ? 'Sizin İçin ' : 'Picked For '}
            <span className="text-purple-600">
              {isTr ? 'Seçtiklerimiz' : 'You'}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((item: Listing) => {
              // 🚀 TS Fix: Güvenli resim kontrolü
              const hasImages =
                Array.isArray(item.imageUrls) && item.imageUrls.length > 0;
              const mainImage = hasImages ? item.imageUrls![0] : null;

              return (
                <div
                  key={item.id}
                  className="bg-[#0f172a] p-6 rounded-4xl border border-white/5 hover:border-purple-500/30 transition-all group flex flex-col"
                >
                  {/* İLAN GÖRSELİ */}
                  <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-800 flex items-center justify-center border border-white/5 relative">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <span className="text-slate-600 italic text-[10px] font-bold uppercase tracking-widest text-center px-4">
                        {t('image_coming_soon')}
                      </span>
                    )}
                  </div>

                  {/* İLAN BİLGİLERİ */}
                  <h3 className="font-bold text-lg uppercase mb-2 truncate text-white italic">
                    {isTr
                      ? item.titleTr || item.title
                      : item.titleEn || item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {isTr
                      ? item.descriptionTr || item.description
                      : item.descriptionEn || item.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                    <span className="text-2xl font-black text-purple-400">
                      {Number(item.price).toLocaleString(
                        isTr ? 'tr-TR' : 'en-US',
                      )}{' '}
                      ₺
                    </span>
                    <Link to={`/listing/${item.id}`}>
                      <button className="bg-white text-black p-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all cursor-pointer shadow-lg active:scale-90">
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
