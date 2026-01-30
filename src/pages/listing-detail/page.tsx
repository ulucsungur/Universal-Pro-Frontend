import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ImageOff, Loader2 } from 'lucide-react';
import type { Listing } from '../../types/auth';
import { useTranslation } from 'react-i18next';
import { SpecsTable } from '../../components/listing/SpecsTable';
import { SellerCard } from '../../components/listing/SellerCard';

export default function ListingDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/listings/${id}`)
        .then((res) => {
          setListing(res.data);
          if (res.data.imageUrls?.length > 0) {
            setActiveImage(res.data.imageUrls[0]);
          }
        })
        .catch((err) => console.error('Detay hatası:', err));
    }
  }, [id]);

  if (!listing)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-purple-500" size={40} />
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
          {t('loading')}
        </p>
      </div>
    );

  const displayTitle = isTr
    ? listing.titleTr || listing.title
    : listing.titleEn || listing.title;
  const displayDescription = isTr
    ? listing.descriptionTr || listing.description
    : listing.descriptionEn || listing.description;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-700">
        {/* SOL KOLON */}
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <div className="aspect-16/10 bg-white dark:bg-[#0f172a] rounded-4xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl relative">
              {activeImage ? (
                <img
                  src={activeImage}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt={displayTitle}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
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
                  key={url}
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square rounded-2xl border-2 cursor-pointer overflow-hidden transition-all duration-300 ${activeImage === url ? 'border-purple-500 scale-95 shadow-lg' : 'border-slate-200 dark:border-white/5 hover:border-purple-400'}`}
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

          <div className="bg-white dark:bg-[#0f172a] p-10 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
            <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-8 underline decoration-2 underline-offset-8 italic">
              {t('description_title')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-wrap font-medium">
              {displayDescription}
            </p>
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4 mb-8">
            <span className="bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block italic border border-purple-600/20">
              {t('listing_detail')}
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-tight text-slate-900 dark:text-white">
              {displayTitle}
            </h1>
          </div>

          {/* FİYAT KARTI */}
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl flex justify-between items-end border-b-4 border-b-purple-600">
            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-2">
              {t('price')}
            </span>
            <span className="text-4xl font-black text-slate-900 dark:text-white">
              {Number(listing.price).toLocaleString(isTr ? 'tr-TR' : 'en-US')}
              <span className="text-purple-600 text-xl ml-2 italic">
                {listing.currency}
              </span>
            </span>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl">
            <SpecsTable
              specs={listing.specs}
              listingId={listing.id}
              date={listing.createdAt}
            />
          </div>

          <SellerCard seller={listing.seller} />
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { ImageOff } from 'lucide-react';
// import type { Listing } from '../../types/auth';
// import { useTranslation } from 'react-i18next';
// import { SpecsTable } from '../../components/listing/SpecsTable';
// import { SellerCard } from '../../components/listing/SellerCard';

// export default function ListingDetailPage() {
//   const { t, i18n } = useTranslation();
//   const { id } = useParams<{ id: string }>();
//   const [listing, setListing] = useState<Listing | null>(null);
//   const [activeImage, setActiveImage] = useState<string>('');

//   const isTr = i18n.language.startsWith('tr');

//   useEffect(() => {
//     if (id) {
//       axios
//         .get(`http://localhost:5000/api/listings/${id}`)
//         .then((res) => {
//           setListing(res.data);
//           if (res.data.imageUrls && res.data.imageUrls.length > 0) {
//             setActiveImage(res.data.imageUrls[0]);
//           }
//         })
//         .catch((err) => console.error('Detay hatası:', err));
//     }
//   }, [id]);

//   if (!listing)
//     return (
//       <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-500 font-black uppercase tracking-widest animate-pulse">
//         {t('loading')}
//       </div>
//     );

//   const displayTitle = isTr
//     ? listing.titleTr || listing.title
//     : listing.titleEn || listing.title;
//   const displayDescription = isTr
//     ? listing.descriptionTr || listing.description
//     : listing.descriptionEn || listing.description;

//   return (
//     <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 lg:p-20">
//       <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
//         {/* SOL KOLON: GALERİ VE AÇIKLAMA */}
//         <div className="lg:col-span-8 space-y-12">
//           <div className="space-y-6">
//             <div className="aspect-16/10 bg-[#0f172a] rounded-4xl border border-white/5 overflow-hidden shadow-2xl relative">
//               {activeImage ? (
//                 <img
//                   src={activeImage}
//                   className="w-full h-full object-cover transition-all duration-700"
//                   alt={displayTitle}
//                 />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
//                   <ImageOff size={48} className="mb-2 opacity-20" />
//                   <span className="text-xs font-bold uppercase opacity-20">
//                     {t('noimage')}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-5 gap-4">
//               {listing.imageUrls?.map((url, i) => (
//                 <div
//                   key={i}
//                   onClick={() => setActiveImage(url)}
//                   className={`aspect-square rounded-2xl border-2 cursor-pointer overflow-hidden transition-all ${activeImage === url ? 'border-purple-500 scale-95' : 'border-white/5'}`}
//                 >
//                   <img
//                     src={url}
//                     className="w-full h-full object-cover"
//                     alt={`Resim ${i + 1}`}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* SAHİBİNDEN USULÜ AÇIKLAMA KUTUSU (Alt tarafta) */}
//           <div className="bg-[#0f172a] p-10 rounded-4xl border border-white/5 shadow-xl">
//             <h3 className="text-xs font-black text-purple-500 uppercase tracking-[0.4em] mb-6 underline decoration-2 underline-offset-8">
//               {t('description_title')}
//             </h3>
//             <p className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap italic">
//               {displayDescription}
//             </p>
//           </div>
//         </div>

//         {/* SAĞ KOLON: BİLGİLER, TABLO VE SATICI */}
//         <div className="lg:col-span-4 space-y-6">
//           <div className="space-y-4">
//             <span className="bg-purple-600/20 text-purple-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block italic">
//               {t('listing_detail')}
//             </span>
//             <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
//               {displayTitle}
//             </h1>
//           </div>

//           {/* FİYAT KARTI */}
//           <div className="bg-[#0f172a] p-8 rounded-4xl border border-white/5 shadow-2xl flex justify-between items-end">
//             <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-2">
//               {t('price')}
//             </span>
//             <span className="text-5xl font-black text-white">
//               {Number(listing.price).toLocaleString(isTr ? 'tr-TR' : 'en-US')}
//               <span className="text-purple-600 text-xl ml-2 italic">
//                 {listing.currency}
//               </span>
//             </span>
//           </div>

//           {/* TEKNİK TABLO */}
//           <div className="bg-[#0f172a] p-8 rounded-4xl border border-white/5 shadow-2xl">
//             <SpecsTable
//               specs={listing.specs}
//               listingId={listing.id}
//               date={listing.createdAt}
//             />
//           </div>

//           {/* SATICI KARTI */}
//           <SellerCard seller={listing.seller} />
//         </div>
//       </div>
//     </div>
//   );
// }
