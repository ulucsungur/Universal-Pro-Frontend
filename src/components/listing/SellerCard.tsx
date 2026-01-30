import { User, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User as UserType } from '../../types/auth';

export const SellerCard = ({ seller }: { seller?: UserType }) => {
  const { t } = useTranslation();
  if (!seller) return null;

  return (
    <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 space-y-6 shadow-2xl sticky top-32 transition-colors duration-500">
      <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
          {seller.avatarUrl ? (
            <img
              src={seller.avatarUrl}
              className="w-full h-full object-cover rounded-2xl"
              alt={seller.fullName}
            />
          ) : (
            <User size={30} className="text-white" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white leading-none">
            {seller.fullName}
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">
            {t('verified_store')}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest border border-slate-200 dark:border-white/5 cursor-pointer">
          <Phone size={14} className="text-green-500" /> 0 (555) --- -- --
        </button>
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest shadow-lg shadow-purple-600/20 cursor-pointer active:scale-95">
          <MessageCircle size={14} /> {t('send_message')}
        </button>
      </div>

      <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:text-purple-600 transition-colors">
        {t('add_favorite_seller')}
      </p>
    </div>
  );
};

// import { User, MessageCircle, Phone } from 'lucide-react';
// import { useTranslation } from 'react-i18next'; // 🚀 Eklendi
// import type { User as UserType } from '../../types/auth';

// export const SellerCard = ({ seller }: { seller?: UserType }) => {
//   const { t } = useTranslation(); // 🚀 Eklendi
//   if (!seller) return null;

//   return (
//     <div className="bg-[#0f172a] p-8 rounded-4xl border border-white/5 space-y-6 shadow-2xl sticky top-32">
//       <div className="flex items-center gap-4 border-b border-white/5 pb-6">
//         <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center">
//           {seller.avatarUrl ? (
//             <img
//               src={seller.avatarUrl}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <User size={30} className="text-white" />
//           )}
//         </div>
//         <div>
//           <h3 className="text-xl font-black uppercase tracking-tighter italic text-white">
//             {seller.fullName}
//           </h3>
//           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//             {t('verified_store')}
//           </p>
//         </div>
//       </div>

//       <div className="space-y-3">
//         <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest border border-white/5 cursor-pointer">
//           <Phone size={14} className="text-green-500" /> 0 (555) --- -- --
//         </button>
//         <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest shadow-lg shadow-purple-600/20 cursor-pointer">
//           <MessageCircle size={14} /> {t('send_message')}
//         </button>
//       </div>

//       <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
//         {t('add_favorite_seller')}
//       </p>
//     </div>
//   );
// };
