import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Truck,
  CheckCircle,
  User,
  MapPin,
  PackageCheck,
  Loader2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import type { Order, PerformanceData } from '../../types/auth'; // 🚀 Tip eklendi
import { SalesAnalytics } from '../../components/listing/SalesAnalytics';
import { PerformanceCard } from '../../components/admin/PerformanceCard';
import { RevenueChart } from '../../components/admin/RevenueChart';

export default function MySalesPage() {
  const { t, i18n } = useTranslation();
  const [sales, setSales] = useState<Order[]>([]);
  const [perf, setPerf] = useState<PerformanceData | null>(null); // 🚀 Performans
  const [loading, setLoading] = useState(true);
  const isTr = i18n.language.startsWith('tr');

  // 🚀 TÜM VERİLERİ TEK SEFERDE ÇEKEN MOTOR
  const fetchDashboardData = useCallback(async () => {
    try {
      const [salesRes, perfRes] = await Promise.all([
        axios.get<Order[]>('http://localhost:5000/api/orders/my-sales'),
        axios.get<PerformanceData>(
          'http://localhost:5000/api/stats/performance',
        ),
      ]);
      setSales(salesRes.data);
      setPerf(perfRes.data);
    } catch (err) {
      console.error('Veri çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelBySeller = async (orderId: number) => {
    if (!window.confirm(t('confirm_cancel'))) return;
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        reason: 'seller',
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const sortedSales = useMemo(() => {
    const statusWeight: Record<string, number> = {
      preparing: 1,
      shipped: 2,
      delivered: 3,
      cancelled: 4,
    };
    return [...sales].sort(
      (a, b) =>
        (statusWeight[a.shippingStatus] || 99) -
        (statusWeight[b.shippingStatus] || 99),
    );
  }, [sales]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 🚀 EXECUTIVE HEADER: PERFORMANS VE GRAFİK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            {perf && <PerformanceCard data={perf} />}
          </div>
          <div className="lg:col-span-8">
            <RevenueChart sales={sales} />
          </div>
        </div>

        {/* FİNANSAL DETAYLAR (Kategoriler, Ay, Yıl) */}
        <SalesAnalytics sales={sales} />

        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white border-l-8 border-purple-600 pl-6">
          {t('my_sales')}
        </h1>

        <div className="grid gap-8">
          {sortedSales.map((order) => {
            const isCancelled = order.status === 'cancelled';
            const isBuyerCancelled = order.canceledBy === 'buyer';

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-[#0f172a] p-8 rounded-[40px] border transition-all flex flex-col gap-8 shadow-2xl ${isCancelled ? 'opacity-40 grayscale border-red-500/20' : 'hover:border-purple-500/20'}`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-6">
                    <img
                      src={order.listing?.imageUrls?.[0]}
                      className="w-24 h-24 rounded-3xl object-cover"
                      alt="product"
                    />
                    <div className="space-y-2">
                      <span className="bg-purple-600/10 text-purple-600 text-[9px] font-black px-2 py-1 rounded-md uppercase">
                        ID: #{order.id}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">
                        {isTr ? order.listing?.titleTr : order.listing?.titleEn}
                      </h3>
                      <p className="text-slate-500 font-bold text-sm">
                        Adet: {order.quantity} |{' '}
                        {Number(order.totalPrice).toLocaleString()} ₺
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-black/20 p-5 rounded-3xl border border-slate-100 dark:border-white/5 min-w-62.5">
                    <div className="flex items-center gap-2 mb-2 opacity-50">
                      <User size={14} className="text-blue-500" />
                      <span className="text-[9px] font-black uppercase">
                        {t('buyer_info')}
                      </span>
                    </div>
                    <p className="text-xs font-black dark:text-white uppercase">
                      {order.buyer?.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 lowercase">
                      {order.buyer?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100 dark:border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 opacity-50">
                      <MapPin size={14} className="text-red-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {t('shipping_address_detail')}
                      </span>
                    </div>
                    {order.address ? (
                      <div className="text-xs space-y-2 bg-slate-50 dark:bg-black/30 p-5 rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner">
                        <p className="font-black text-slate-700 dark:text-white uppercase">
                          {order.address.title} / {order.address.fullName}
                        </p>
                        <p className="text-slate-500 italic leading-relaxed">
                          {order.address.addressDetail}
                        </p>
                        <p className="font-black text-purple-600 text-[10px] uppercase">
                          {order.address.district} / {order.address.city} (
                          {order.address.postCode})
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-400 italic text-xs">
                        <AlertCircle size={14} /> {t('address_error')}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center gap-4">
                    {isCancelled ? (
                      <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 text-center uppercase font-black text-xs text-red-500">
                        {isBuyerCancelled
                          ? t('cancelled_by_buyer')
                          : t('cancelled_by_seller')}
                      </div>
                    ) : (
                      <>
                        {order.shippingStatus === 'preparing' && (
                          <>
                            <button
                              onClick={() => updateStatus(order.id, 'shipped')}
                              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-3xl shadow-xl uppercase text-[11px] cursor-pointer active:scale-95 transition-all"
                            >
                              <Truck size={18} className="mr-2 inline" />{' '}
                              {t('mark_as_shipped')}
                            </button>
                            <button
                              onClick={() => cancelBySeller(order.id)}
                              className="w-full bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white font-black py-3 rounded-2xl border border-red-500/20 uppercase text-[10px] active:scale-95 transition-all cursor-pointer"
                            >
                              <XCircle size={14} className="mr-2 inline" />{' '}
                              {t('out_of_stock_cancel')}
                            </button>
                          </>
                        )}
                        {order.shippingStatus === 'shipped' && (
                          <button
                            onClick={() => updateStatus(order.id, 'delivered')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-xl uppercase text-[11px] cursor-pointer active:scale-95 transition-all"
                          >
                            <PackageCheck size={18} className="mr-2 inline" />{' '}
                            {t('mark_as_delivered')}
                          </button>
                        )}
                        {order.shippingStatus === 'delivered' && (
                          <div className="text-green-500 font-black text-[11px] uppercase bg-green-500/5 py-8 rounded-4xl border-2 border-dashed border-green-500/20 text-center">
                            <CheckCircle size={24} className="inline mb-2" />
                            <br />
                            {t('status_delivered')}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// import { useEffect, useState, useCallback, useMemo } from 'react';
// import axios from 'axios';
// import { useTranslation } from 'react-i18next';
// import {
//   Truck,
//   CheckCircle,
//   User,
//   MapPin,
//   PackageCheck,
//   Loader2,
//   XCircle,
//   AlertCircle,
// } from 'lucide-react';
// import type { Order } from '../../types/auth';
// import { SalesAnalytics } from '../../components/listing/SalesAnalytics';

// export default function MySalesPage() {
//   const { t, i18n } = useTranslation();
//   const [sales, setSales] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const isTr = i18n.language.startsWith('tr');

//   const fetchSales = useCallback(async () => {
//     try {
//       const res = await axios.get<Order[]>(
//         'http://localhost:5000/api/orders/my-sales',
//       );
//       setSales(res.data);
//     } catch (err) {
//       console.error('Satış çekme hatası:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchSales();
//   }, [fetchSales]);

//   const updateStatus = async (orderId: number, newStatus: string) => {
//     try {
//       await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
//         status: newStatus,
//       });
//       fetchSales();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const cancelBySeller = async (orderId: number) => {
//     if (!window.confirm(t('confirm_cancel'))) return;
//     try {
//       await axios.patch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
//         reason: 'seller',
//       });
//       fetchSales();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const sortedSales = useMemo(() => {
//     const statusWeight: Record<string, number> = {
//       preparing: 1,
//       shipped: 2,
//       delivered: 3,
//       cancelled: 4,
//     };
//     return [...sales].sort(
//       (a, b) =>
//         (statusWeight[a.shippingStatus] || 99) -
//         (statusWeight[b.shippingStatus] || 99),
//     );
//   }, [sales]);

//   if (loading)
//     return (
//       <div className="min-h-screen bg-[#020617] flex items-center justify-center">
//         <Loader2 className="animate-spin text-purple-600" size={32} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 transition-colors duration-500">
//       <div className="max-w-5xl mx-auto space-y-12">
//         <SalesAnalytics sales={sales} />
//         <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white border-l-8 border-purple-600 pl-6">
//           {t('my_sales')}
//         </h1>

//         <div className="grid gap-8">
//           {sortedSales.map((order) => {
//             const isCancelled = order.status === 'cancelled';
//             // const isBuyerCancelled = order.canceledBy === 'buyer';

//             return (
//               <div
//                 key={order.id}
//                 className={`bg-white dark:bg-[#0f172a] p-8 rounded-[40px] border transition-all flex flex-col gap-8 shadow-2xl ${isCancelled ? 'opacity-40 grayscale border-red-500/20' : 'hover:border-purple-500/20'}`}
//               >
//                 <div className="flex flex-col md:flex-row justify-between gap-6">
//                   <div className="flex gap-6">
//                     <img
//                       src={order.listing?.imageUrls?.[0]}
//                       className="w-24 h-24 rounded-3xl object-cover"
//                       alt="product"
//                     />
//                     <div className="space-y-2">
//                       <span className="bg-purple-600/10 text-purple-600 text-[9px] font-black px-2 py-1 rounded-md uppercase">
//                         ID: #{order.id}
//                       </span>
//                       <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic">
//                         {isTr ? order.listing?.titleTr : order.listing?.titleEn}
//                       </h3>
//                       <p className="text-slate-500 font-bold text-sm">
//                         Adet: {order.quantity} |{' '}
//                         {Number(order.totalPrice).toLocaleString()} ₺
//                       </p>
//                     </div>
//                   </div>
//                   <div className="bg-slate-50 dark:bg-black/20 p-5 rounded-3xl border border-slate-100 dark:border-white/5 min-w-[240px]">
//                     <div className="flex items-center gap-2 mb-2 opacity-50">
//                       <User size={14} className="text-blue-500" />
//                       <span className="text-[9px] font-black uppercase">
//                         {t('buyer_info')}
//                       </span>
//                     </div>
//                     <p className="text-xs font-black dark:text-white uppercase">
//                       {order.buyer?.fullName}
//                     </p>
//                     <p className="text-[10px] text-slate-500 lowercase">
//                       {order.buyer?.email}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100 dark:border-white/5">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-2 opacity-50">
//                       <MapPin size={14} className="text-red-500" />
//                       <span className="text-[9px] font-black uppercase tracking-widest">
//                         {t('shipping_address_detail')}
//                       </span>
//                     </div>
//                     {order.address ? (
//                       <div className="text-xs space-y-2 bg-slate-50 dark:bg-black/30 p-5 rounded-3xl border border-slate-100 dark:border-white/5 shadow-inner">
//                         <p className="font-black text-slate-700 dark:text-white uppercase">
//                           {order.address.title} / {order.address.fullName}
//                         </p>
//                         <p className="text-slate-500 italic leading-relaxed">
//                           {order.address.addressDetail}
//                         </p>
//                         <p className="font-black text-purple-600 text-[10px] uppercase">
//                           {order.address.district} / {order.address.city} (
//                           {order.address.postCode})
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="flex items-center gap-2 text-red-400 italic text-xs">
//                         <AlertCircle size={14} /> {t('address_error')}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col justify-center gap-4">
//                     {isCancelled ? (
//                       <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/20 text-center">
//                         <p className="text-red-500 font-black text-xs uppercase tracking-widest">
//                           {/* 🚀 SATICI EKRANI MANTIĞI */}
//                           {order.canceledBy === 'seller'
//                             ? t('cancelled_by_you')
//                             : t('cancelled_by_other_buyer')}
//                         </p>
//                         <p className="text-[9px] text-red-400/50 mt-1 font-bold">
//                           {t('refund_notice')}
//                         </p>
//                       </div>
//                     ) : (
//                       <>
//                         {order.shippingStatus === 'preparing' && (
//                           <>
//                             <button
//                               onClick={() => updateStatus(order.id, 'shipped')}
//                               className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-3xl shadow-xl uppercase text-[11px] cursor-pointer active:scale-95 transition-all"
//                             >
//                               <Truck size={18} className="mr-2 inline" />{' '}
//                               {t('mark_as_shipped')}
//                             </button>
//                             <button
//                               onClick={() => cancelBySeller(order.id)}
//                               className="w-full bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white font-black py-3 rounded-2xl border border-red-500/20 uppercase text-[10px] active:scale-95 transition-all cursor-pointer"
//                             >
//                               <XCircle size={14} className="mr-2 inline" />{' '}
//                               {t('out_of_stock_cancel')}
//                             </button>
//                           </>
//                         )}
//                         {order.shippingStatus === 'shipped' && (
//                           <button
//                             onClick={() => updateStatus(order.id, 'delivered')}
//                             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl shadow-xl uppercase text-[11px] cursor-pointer active:scale-95 transition-all"
//                           >
//                             <PackageCheck size={18} className="mr-2 inline" />{' '}
//                             {t('mark_as_delivered')}
//                           </button>
//                         )}
//                         {order.shippingStatus === 'delivered' && (
//                           <div className="text-green-500 font-black text-[11px] uppercase bg-green-500/5 py-8 rounded-[32px] border-2 border-dashed border-green-500/20 text-center">
//                             <CheckCircle size={24} className="inline mb-2" />
//                             <br />
//                             {t('status_delivered')}
//                           </div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
