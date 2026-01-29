import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import type { Listing, Category } from '../../types/auth';
import { Info } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n, t } = useTranslation();

  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false); // 🚀 HIZ İÇİN: Default false

  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/category/${slug}/listings`,
        );
        console.log('Gelen İlanlar:', res.data.listings);
        setListings(res.data.listings || []);
        setCategory(res.data.category || null);
      } catch (err) {
        console.error('API Error:', err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 lg:p-20 transition-all duration-300">
      <div className="max-w-350 mx-auto">
        {/* ÜST BAŞLIK - Her zaman görünür, sayfa yavaşlamaz */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">
            {category ? (isTr ? category.titleTr : category.titleEn) : '...'}
          </h1>
          <p className="text-purple-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4">
            {loading
              ? t('loading')
              : `${listings.length} ${t('picked_for_you')}`}
          </p>
        </div>

        {/* İÇERİK ALANI */}
        {loading ? (
          // 🚀 FULL SCREEN LOADER YERİNE: İskelet Grid (Daha profesyonel hissettirir)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-white/5 rounded-4xl animate-pulse"
              />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
            {listings.map((item) => (
              <Link
                key={item.id}
                to={`/listing/${item.id}`}
                className="no-underline group"
              >
                <div className="bg-[#0f172a] p-6 rounded-4xl border border-white/5 group-hover:border-purple-500/30 transition-all flex flex-col h-full shadow-2xl">
                  <div className="aspect-square rounded-3xl overflow-hidden mb-6 bg-slate-800 border border-white/5">
                    {item.imageUrls && item.imageUrls.length > 0 && (
                      <img
                        src={item.imageUrls[0]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={item.title}
                      />
                    )}
                  </div>
                  <h3 className="font-bold text-lg uppercase truncate text-white italic mb-2">
                    {isTr
                      ? item.titleTr || item.title
                      : item.titleEn || item.title}
                  </h3>
                  <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/5">
                    <span className="text-2xl font-black text-purple-400">
                      {Number(item.price).toLocaleString(
                        isTr ? 'tr-TR' : 'en-US',
                      )}{' '}
                      ₺
                    </span>
                    <span className="bg-white text-black p-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
            <Info size={48} className="text-slate-600" />
            <p className="text-slate-500 font-black uppercase tracking-[0.3em]">
              {t('no_listings_found')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
