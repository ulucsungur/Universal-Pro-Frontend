import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { X, ChevronRight, ArrowLeft, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import type { Category } from '../../types/auth';

interface SidedrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidedrawer = ({ isOpen, onClose }: SidedrawerProps) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  // 🚀 KRİTİK DEĞİŞİKLİK: Menü geçmişini bir dizi (stack) olarak tutuyoruz.
  // Örn: [null, 1, 3] -> Ana Menü > Vasıta > Otomobil
  const [menuHistory, setMenuHistory] = useState<(number | null)[]>([null]);

  const isTr = i18n.language.startsWith('tr');
  const activeParentId = menuHistory[menuHistory.length - 1];

  useEffect(() => {
    if (isOpen) {
      axios
        .get('http://localhost:5000/api/categories')
        .then((res) => setCategories(res.data))
        .catch((err) => console.error('Drawer hatası:', err));
    }
  }, [isOpen]);

  // Mevcut derinlikteki kategorileri filtrele
  const currentCategories = categories.filter(
    (c) => c.parentId === activeParentId,
  );

  // Bir kategorinin alt kategorisi var mı kontrol et
  const hasSub = (id: number) => categories.some((c) => c.parentId === id);

  // Menüde geri git
  const goBack = () => {
    if (menuHistory.length > 1) {
      setMenuHistory((prev) => prev.slice(0, -1));
    }
  };

  // Drawer kapandığında menüyü sıfırla
  const handleClose = () => {
    onClose();
    setTimeout(() => setMenuHistory([null]), 500);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[350px] bg-[#020617] z-[101] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* ÜST KISIM */}
        <div className="h-40 bg-[#0f172a] border-b border-white/5 p-8 flex flex-col justify-end relative">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/40 hover:text-white transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <User size={20} className="text-white" />
              )}
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                {t('hello')}
              </p>
              <p className="text-lg font-black uppercase tracking-tighter italic text-white">
                {user ? user.fullName : t('sign_in')}
              </p>
            </div>
          </div>
        </div>

        {/* MENÜ İÇERİĞİ */}
        <div className="p-4 h-[calc(100%-160px)] overflow-y-auto no-scrollbar">
          {/* GERİ BUTONU (Eğer derinlikteyse) */}
          {menuHistory.length > 1 && (
            <button
              onClick={goBack}
              className="flex items-center gap-3 px-4 py-4 mb-2 text-[10px] font-black text-purple-500 uppercase tracking-widest hover:text-purple-400 transition-all cursor-pointer w-full text-left"
            >
              <ArrowLeft size={14} /> {t('back_to_main')}
            </button>
          )}

          <p className="px-4 py-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            {activeParentId === null
              ? t('all_departments')
              : isTr
                ? categories.find((c) => c.id === activeParentId)?.titleTr
                : categories.find((c) => c.id === activeParentId)?.titleEn}
          </p>

          <div className="space-y-1">
            {currentCategories.map((cat) => (
              <div key={cat.id}>
                {hasSub(cat.id) ? (
                  /* 🚀 Alt kategorisi varsa: Menüyü derinleştir */
                  <div
                    onClick={() => setMenuHistory((prev) => [...prev, cat.id])}
                    className="flex items-center justify-between px-4 py-4 hover:bg-white/5 rounded-2xl cursor-pointer group transition-all"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-300 group-hover:text-purple-400">
                      {isTr ? cat.titleTr : cat.titleEn}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-slate-700 group-hover:text-purple-500"
                    />
                  </div>
                ) : (
                  /* 🚀 Alt kategorisi yoksa: Gerçek link */
                  <Link
                    to={`/category/${cat.slug}`}
                    onClick={handleClose}
                    className="block px-4 py-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-white/5 rounded-2xl no-underline transition-all"
                  >
                    {isTr ? cat.titleTr : cat.titleEn}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
