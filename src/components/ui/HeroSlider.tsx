import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Banner } from '../../types/auth';

export const HeroSlider = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isTr = i18n.language.startsWith('tr');

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/banners')
      .then((res) => setBanners(res.data));
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const handleNavigation = (url: string) => {
    if (!url) return;
    console.log('Navigating to:', url); // 🚀 Kontrol için
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      navigate(url);
    }
  };

  if (banners.length === 0) return null;
  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-80 md:h-130 overflow-hidden bg-[#eaeded] dark:bg-[#020617]">
      {/* 1. ARKA PLAN RESMİ */}
      <div
        style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
        className="absolute inset-0 bg-center bg-cover duration-1000 ease-in-out"
      />

      {/* 🚀 2. İÇERİK KATMANI (Z-INDEX YÜKSELTİLDİ: z-30) */}
      <div className="absolute inset-0 flex items-center px-10 md:px-24 z-30">
        <div className="max-w-xl space-y-6 animate-in slide-in-from-left-10 duration-700">
          <h1 className="text-3xl md:text-6xl font-black text-white uppercase italic drop-shadow-2xl leading-tight">
            {isTr ? currentBanner.titleTr : currentBanner.titleEn}
          </h1>

          <p className="text-white/90 text-sm md:text-xl font-bold italic tracking-wide drop-shadow-md border-l-4 border-purple-600 pl-4 bg-black/10 backdrop-blur-sm p-3 rounded-r-lg">
            {isTr ? currentBanner.subtitleTr : currentBanner.subtitleEn}
          </p>

          <button
            onClick={() => handleNavigation(currentBanner.link)}
            className="group flex items-center gap-3 bg-[#ffd814] hover:bg-[#f7ca00] text-black px-10 py-4 rounded-2xl font-black shadow-2xl transition-all uppercase text-[11px] tracking-widest cursor-pointer active:scale-95"
          >
            {isTr ? 'Hemen Keşfet' : 'Explore Now'}
          </button>
        </div>
      </div>

      {/* 🚀 3. GRADIENT GEÇİŞ (Z-INDEX DÜŞÜRÜLDİ: z-10) */}
      {/* Artık butonun (z-30) altında kaldığı için tıklamayı engellemez */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-[#eaeded] dark:from-[#020617] to-transparent z-10 pointer-events-none" />

      {/* 4. OKLAR (Z-INDEX: z-40) */}
      <button
        onClick={prevSlide}
        className="absolute top-[40%] left-5 z-40 p-2 text-white/50 hover:text-white cursor-pointer transition-all active:scale-90"
      >
        <ChevronLeft size={48} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-[40%] right-5 z-40 p-2 text-white/50 hover:text-white cursor-pointer transition-all active:scale-90"
      >
        <ChevronRight size={48} />
      </button>
    </div>
  );
};
