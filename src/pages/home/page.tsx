import { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
  id: number;
  title: string;
  imageUrl?: string;
}

interface Listing {
  id: number;
  title: string;
  description?: string;
  price: string | number;
  currency: string;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get('http://localhost:5000/api/categories');
        const listRes = await axios.get('http://localhost:5000/api/listings');
        setCategories(catRes.data);
        setListings(listRes.data);
      } catch (err) {
        console.error('Veri çekme hatası:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="max-w-350 mx-auto p-10 space-y-20">
      {/* KATEGORİLER */}
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-8">
          Kategorileri Keşfet
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/5">
                <img
                  src={
                    cat.imageUrl ||
                    'https://images.unsplash.com/photo-1461376226594-32937e499bca?w=500'
                  }
                  alt={cat.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <span className="font-black uppercase tracking-tighter text-xl">
                    {cat.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* İLANLAR */}
      <section>
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 border-b border-white/5 pb-6">
          Sizin İçin <span className="text-purple-600">Seçtiklerimiz</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f172a] p-6 rounded-[32px] border border-white/5 hover:border-purple-500/30 transition-all group"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-slate-800 flex items-center justify-center text-slate-600 italic text-xs">
                Görsel Gelecek
              </div>
              <h3 className="font-bold text-lg uppercase mb-2 truncate">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-purple-400">
                  {Number(item.price).toLocaleString()} ₺
                </span>
                <button className="bg-white text-black p-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all">
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
