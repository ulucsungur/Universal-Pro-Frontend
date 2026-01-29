import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ImageOff } from 'lucide-react';
import type { Listing } from '../../types/auth';
import { useTranslation } from 'react-i18next';

export default function ListingDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  // 🚀 Dil Kontrolü: TR mi EN mi?
  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/listings/${id}`)
        .then((res) => {
          setListing(res.data);
          if (res.data.imageUrls && res.data.imageUrls.length > 0) {
            setActiveImage(res.data.imageUrls[0]);
          }
        })
        .catch((err) => console.error('Detay hatası:', err));
    }
  }, [id]);

  if (!listing)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500 font-black uppercase tracking-widest animate-pulse">
        {t('loading')}
      </div>
    );

  // 🚀 Dinamik Veri Seçimi
  const displayTitle = isTr
    ? listing.titleTr || listing.title
    : listing.titleEn || listing.title;
  const displayDescription = isTr
    ? listing.descriptionTr || listing.description
    : listing.descriptionEn || listing.description;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-20">
      <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* SOL: AMAZON STİLİ GALERİ */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-16/10 bg-[#0f172a] rounded-4xl border border-white/5 overflow-hidden shadow-2xl relative">
            {activeImage ? (
              <img
                src={activeImage}
                className="w-full h-full object-cover transition-all duration-700"
                alt={displayTitle}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                <ImageOff size={48} className="mb-2 opacity-20" />
                <span className="text-xs font-bold uppercase opacity-20">
                  {t('noimage')}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-5 gap-4">
            {listing.imageUrls?.map((url, i) => (
              <div
                key={i}
                onClick={() => setActiveImage(url)}
                className={`aspect-square rounded-2xl border-2 cursor-pointer overflow-hidden transition-all duration-300 ${
                  activeImage === url
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20 scale-95'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <img
                  src={url}
                  className="w-full h-full object-cover"
                  alt={`Resim ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ: BİLGİ ALANI */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="bg-purple-600/20 text-purple-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block italic">
              {t('listing_detail')}
            </span>
            {/* 🚀 DİNAMİK BAŞLIK */}
            <h1 className="text-5xl font-black uppercase tracking-tighter italic leading-none">
              {displayTitle}
            </h1>
            {/* 🚀 DİNAMİK AÇIKLAMA */}
            <p className="text-slate-400 leading-relaxed text-sm">
              {displayDescription}
            </p>
          </div>

          <div className="bg-[#0f172a] p-8 rounded-4xl border border-white/5 space-y-6 shadow-2xl">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                {t('price')}
              </span>
              <span className="text-5xl font-black text-white">
                {/* 🚀 RAKAM FORMATI DİLE GÖRE DEĞİŞİR */}
                {Number(listing.price).toLocaleString(isTr ? 'tr-TR' : 'en-US')}
                <span className="text-purple-600 text-xl ml-2 italic">
                  {listing.currency}
                </span>
              </span>
            </div>
            <button className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-purple-600 hover:text-white transition-all transform active:scale-95 uppercase tracking-widest text-[10px]">
              {t('contact_seller')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
