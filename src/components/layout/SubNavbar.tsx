import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { Category } from '../../types/auth'; // 'type' importuna dikkat
import { Menu } from 'lucide-react';

export const SubNavbar = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Backend'deki kategoriler kapısını çalıyoruz
    axios
      .get('http://localhost:5000/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Kategoriler yüklenemedi:', err));
  }, []);

  return (
    <div className="h-12 bg-[#0f172a] border-b border-white/5 flex items-center px-10 overflow-x-auto no-scrollbar gap-8">
      {/* TÜMÜ MENÜSÜ - Amazon Stili */}
      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-purple-500 transition-all shrink-0 cursor-pointer">
        <Menu size={14} />
        Tümü
      </button>

      {/* DİNAMİK KATEGORİ LİSTESİ */}
      <div className="flex items-center gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all shrink-0 no-underline"
          >
            {cat.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
