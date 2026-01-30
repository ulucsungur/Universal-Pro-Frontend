import { useState, useEffect, useCallback } from 'react'; // 🚀 useCallback eklendi
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

  // 🚀 ADIM 1: Fonksiyonları tanımlıyoruz (useEffect'ten önce olmalı)
  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, banners.length]);

  const prevSlide = () => {
    if (banners.length === 0) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // 🚀 ADIM 2: Veri Çekme
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/banners')
      .then((res) => setBanners(res.data))
      .catch((err) => console.error('Slider verisi alınamadı:', err));
  }, []);

  // 🚀 ADIM 3: Otomatik Kaydırma (nextSlide artık bağımlılık olarak güvenli)
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full h-75 md:h-125 group overflow-hidden bg-slate-900">
      {/* 🚀 Tailwind v4: h-[300px] -> h-75 | md:h-[500px] -> md:h-125 */}

      {/* BANNER RESMİ */}
      <div
        style={{ backgroundImage: `url(${banners[currentIndex].imageUrl})` }}
        className="w-full h-full bg-center bg-cover duration-1000 ease-in-out transition-all"
      >
        {/* KARARTMA VE İÇERİK */}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/20 to-transparent flex items-center px-10 md:px-24">
          <div className="max-w-2xl space-y-4 animate-in slide-in-from-left-10 duration-700">
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
              {isTr
                ? banners[currentIndex].titleTr
                : banners[currentIndex].titleEn}
            </h1>
            <p className="text-slate-300 text-sm md:text-lg font-medium max-w-lg">
              {isTr
                ? banners[currentIndex].subtitleTr
                : banners[currentIndex].subtitleEn}
            </p>
            <button
              onClick={() => navigate(banners[currentIndex].link)}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg shadow-purple-600/20 cursor-pointer"
            >
              {isTr ? 'Hemen Keşfet' : 'Explore Now'}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#020617] to-transparent z-10" />

      {/* OKLAR */}
      <button
        onClick={prevSlide}
        className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-black/50 transition-all cursor-pointer"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-black/50 transition-all cursor-pointer"
      >
        <ChevronRight size={24} />
      </button>

      {/* NOKTALAR (DOTS) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${index === currentIndex ? 'bg-purple-500 w-8' : 'bg-white/30 w-3'}`}
          />
        ))}
      </div>
    </div>
  );
};
