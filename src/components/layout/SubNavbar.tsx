import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../types/auth';
import { Menu } from 'lucide-react';

export const SubNavbar = ({ onOpenDrawer }: { onOpenDrawer: () => void }) => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/categories?topOnly=true')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Kategoriler yüklenemedi:', err));
  }, []);

  return (
    // 🚀 bg-[#0f172a] ve text-white ile SABİTLEDİK (Light modda değişmez)
    <div className="h-12 bg-[#0f172a] border-b border-white/5 flex items-center px-6 md:px-10 gap-8 overflow-x-auto no-scrollbar z-40 relative">
      <button
        onClick={onOpenDrawer}
        className="flex items-center gap-2 text-[10px] font-black uppercase text-white hover:text-purple-400 transition-all shrink-0 cursor-pointer"
      >
        <Menu size={14} className="text-white" />
        <span className="text-white">{t('all')}</span>
      </button>

      <div className="flex items-center gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="text-[10px] font-bold uppercase text-white/80 hover:text-white transition-all shrink-0 no-underline"
          >
            {isTr ? cat.titleTr : cat.titleEn}
          </Link>
        ))}
      </div>
    </div>
  );
};
