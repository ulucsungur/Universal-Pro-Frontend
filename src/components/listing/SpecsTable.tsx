import { useTranslation } from 'react-i18next';

interface SpecsTableProps {
  // 🚀 Teknik özellikler (Metin, sayı, boolean veya boş olabilir)
  specs?: Record<string, string | number | boolean | null>;
  listingId: number;
  date: string; // 🚀 İlan tarihi (Backend'den gelen createdAt)
}

export const SpecsTable = ({ specs, listingId, date }: SpecsTableProps) => {
  const { t } = useTranslation();

  // Specs verisini listeye çeviriyoruz
  const specList = specs ? Object.entries(specs) : [];

  return (
    <div className="space-y-1">
      {/* 1. SABİT: İLAN NO */}
      <div className="flex justify-between py-3 border-b border-slate-100 dark:border-white/5 text-[11px]">
        <span className="text-slate-500 font-bold uppercase">{t('ad_no')}</span>
        <span className="text-red-600 dark:text-red-400 font-black">
          {listingId}
        </span>
      </div>

      {/* 2. SABİT: İLAN TARİHİ (🚀 Date Hatası Çözüldü) */}
      <div className="flex justify-between py-3 border-b border-slate-100 dark:border-white/5 text-[11px]">
        <span className="text-slate-500 font-bold uppercase">
          {t('ad_date')}
        </span>
        <span className="text-slate-900 dark:text-white font-bold uppercase">
          {date ? new Date(date).toLocaleDateString() : '-'}
        </span>
      </div>

      {/* 3. DİNAMİK: VERİTABANINDAN GELEN ÖZELLİKLER */}
      {specList.map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between py-3 border-b border-slate-100 dark:border-white/5 text-[11px]"
        >
          <span className="text-slate-500 font-bold uppercase">
            {/* 🚀 i18n DESTEĞİ: Key'i küçük harfe çevirip sözlükte arıyoruz */}
            {t(key.toLowerCase())}
          </span>
          <span className="text-slate-900 dark:text-white font-bold uppercase text-right pl-4">
            {/* Boolean değerleri dile göre çeviriyoruz */}
            {typeof value === 'boolean'
              ? value
                ? t('yes') || 'Evet'
                : t('no') || 'Hayır'
              : String(value ?? '-')}
          </span>
        </div>
      ))}
    </div>
  );
};

// import { useTranslation } from 'react-i18next';

// interface SpecsTableProps {
//   // 🚀 TS FIX: Merkezi tipteki tüm ihtimalleri (boolean, null) buraya da ekledik
//   specs?: Record<string, string | number | boolean | null>;
//   listingId: number;
//   date: string;
// }

// export const SpecsTable = ({ specs, listingId, date }: SpecsTableProps) => {
//   const { t } = useTranslation();
//   const specList = specs ? Object.entries(specs) : [];

//   return (
//     <div className="space-y-1">
//       {/* Sabit Bilgiler */}
//       <div className="flex justify-between py-2 border-b border-white/5 text-[11px]">
//         <span className="text-slate-500 font-bold uppercase">{t('ad_no')}</span>
//         <span className="text-red-500 font-black">{listingId}</span>
//       </div>
//       <div className="flex justify-between py-2 border-b border-white/5 text-[11px]">
//         <span className="text-slate-500 font-bold uppercase">
//           {t('ad_date')}
//         </span>
//         <span className="text-white font-bold">
//           {new Date(date).toLocaleDateString()}
//         </span>
//       </div>

//       {/* Dinamik Bilgiler */}
//       {specList.map(([key, value]) => (
//         <div
//           key={key}
//           className="flex justify-between py-2 border-b border-white/5 text-[11px]"
//         >
//           <span className="text-slate-500 font-bold uppercase">{key}</span>
//           <span className="text-white font-bold uppercase">
//             {/* 🚀 Boolean değerleri (true/false) kullanıcı dostu metne çeviriyoruz */}
//             {typeof value === 'boolean'
//               ? value
//                 ? 'Evet'
//                 : 'Hayır'
//               : String(value ?? '-')}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };
