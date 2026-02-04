import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Truck,
  CheckCircle,
  User,
  MapPin,
  PackageCheck,
  Loader2,
  BarChart3,
  Calendar,
  LayoutGrid,
  TrendingUp,
} from 'lucide-react';
import type { Order } from '../../types/auth';

export default function MySalesPage() {
  const { t, i18n } = useTranslation();
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isTr = i18n.language.startsWith('tr');

  const fetchSales = async () => {
    try {
      const res = await axios.get<Order[]>(
        'http://localhost:5000/api/orders/my-sales',
      );
      setSales(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // 🚀 SATIŞ İSTATİSTİKLERİ HESAPLAMA (Memoize edilmiş)
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce(
      (acc, sale) => acc + Number(sale.totalPrice),
      0,
    );

    // 🚀 1. Kategori Bazlı Dağılım
    const categoryMap = new Map<string, { count: number; total: number }>();

    // 🚀 2. Zaman Bazlı Dağılım (Ay ve Yıl)
    const monthlyMap = new Map<string, number>();
    const yearlyMap = new Map<string, number>();

    sales.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString(i18n.language, { month: 'long' });
      const monthYearKey = `${month} ${year}`;

      // Kategori Mantığı
      const catName = isTr
        ? sale.listing?.category?.titleTr || 'Diğer'
        : sale.listing?.category?.titleEn || 'Other';

      const currentCat = categoryMap.get(catName) || { count: 0, total: 0 };
      categoryMap.set(catName, {
        count: currentCat.count + 1,
        total: currentCat.total + Number(sale.totalPrice),
      });

      // Zaman Mantığı
      monthlyMap.set(
        monthYearKey,
        (monthlyMap.get(monthYearKey) || 0) + Number(sale.totalPrice),
      );
      yearlyMap.set(year, (yearlyMap.get(year) || 0) + Number(sale.totalPrice));
    });

    return {
      totalRevenue,
      totalCount: sales.length,
      categoryList: Array.from(categoryMap),
      monthlyList: Array.from(monthlyMap),
      yearlyList: Array.from(yearlyMap),
    };
  }, [sales, isTr, i18n.language]);

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      fetchSales();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* 🚀 KOMPAKT FİNANSAL ANALİZ LİSTESİ */}
        <div className="bg-white dark:bg-[#0f172a] rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
          {/* Toplam Hasılat Barı */}
          <div className="bg-purple-600 p-6 px-10 flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em]">
                {t('sales_stats')}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold opacity-70 uppercase">
                {t('total_revenue')}
              </p>
              <p className="text-3xl font-black italic">
                {stats.totalRevenue.toLocaleString()} ₺
              </p>
            </div>
          </div>

          {/* İstatistik Detayları */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* KATEGORİ BAZLI */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={14} /> {t('category_breakdown')}
              </h4>
              <div className="space-y-3">
                {stats.categoryList.map(([name, data]) => (
                  <div
                    key={name}
                    className="flex justify-between border-b border-slate-50 dark:border-white/5 pb-2"
                  >
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {name}
                    </span>
                    <span className="text-xs font-black dark:text-white">
                      {data.total.toLocaleString()} ₺
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AYLIK ANALİZ */}
            <div className="space-y-4 border-x border-slate-100 dark:border-white/5 px-0 md:px-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 size={14} /> {t('monthly_report')}
              </h4>
              <div className="space-y-3">
                {stats.monthlyList.map(([date, total]) => (
                  <div
                    key={date}
                    className="flex justify-between border-b border-slate-50 dark:border-white/5 pb-2"
                  >
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {date}
                    </span>
                    <span className="text-xs font-black text-purple-600">
                      {total.toLocaleString()} ₺
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* YILLIK ANALİZ */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> {t('yearly_report')}
              </h4>
              <div className="space-y-3">
                {stats.yearlyList.map(([year, total]) => (
                  <div
                    key={year}
                    className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-3 rounded-xl"
                  >
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {year}
                    </span>
                    <span className="text-sm font-black text-green-500">
                      {total.toLocaleString()} ₺
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white border-l-8 border-purple-600 pl-6">
          {t('my_sales')}
        </h1>

        {/* İLAN LİSTESİ BAŞLANGIÇ */}
        <div className="grid gap-8">
          {sales.length > 0 ? (
            sales.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#0f172a] p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl space-y-8 group transition-all hover:border-purple-500/20 animate-in slide-in-from-bottom-4"
              >
                {/* Üst Bilgiler (Resim, Başlık, Alıcı) */}
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 shadow-inner">
                      {order.listing?.imageUrls && (
                        <img
                          src={order.listing.imageUrls[0]}
                          className="w-full h-full object-cover"
                          alt="product"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <span className="bg-purple-600/10 text-purple-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                        Sipariş #{order.id}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic leading-tight line-clamp-1">
                        {isTr ? order.listing?.titleTr : order.listing?.titleEn}
                      </h3>
                      <p className="text-slate-500 font-bold text-sm">
                        Adet: {order.quantity} |{' '}
                        <span className="text-slate-900 dark:text-slate-200">
                          {Number(order.totalPrice).toLocaleString()} ₺
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-3xl border border-slate-100 dark:border-white/5 min-w-62.5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 opacity-50">
                      <User size={14} className="text-blue-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {t('buyer_info')}
                      </span>
                    </div>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                      {order.buyer?.fullName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium lowercase">
                      {order.buyer?.email}
                    </p>
                  </div>
                </div>

                {/* Alt Kısım (Adres ve Kargo Butonları) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-slate-100 dark:border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 opacity-50">
                      <MapPin size={14} className="text-red-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {t('shipping_address_detail')}
                      </span>
                    </div>
                    {order.address ? (
                      <div className="text-xs space-y-2 bg-slate-50 dark:bg-[#020617] p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                        <p className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-tighter">
                          {order.address.title} / {order.address.fullName}
                        </p>
                        <p className="text-slate-500 leading-relaxed italic">
                          {order.address.addressDetail}
                        </p>
                        <p className="font-black text-purple-600 text-[10px] uppercase tracking-[0.2em]">
                          {order.address.district} / {order.address.city} -{' '}
                          {order.address.postCode}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          Tel: {order.address.phone}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs italic text-red-400 bg-red-400/5 p-4 rounded-xl border border-red-400/20">
                        {t('address_not_found')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-center gap-4">
                    {order.shippingStatus === 'preparing' && (
                      <button
                        onClick={() => updateStatus(order.id, 'shipped')}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-widest shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer"
                      >
                        <Truck size={18} /> {t('mark_as_shipped')}
                      </button>
                    )}
                    {order.shippingStatus === 'shipped' && (
                      <button
                        onClick={() => updateStatus(order.id, 'delivered')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 cursor-pointer"
                      >
                        <PackageCheck size={18} /> {t('mark_as_delivered')}
                      </button>
                    )}
                    {order.shippingStatus === 'delivered' && (
                      <div className="flex flex-col items-center justify-center gap-2 text-green-500 font-black text-[11px] uppercase bg-green-500/5 py-8 rounded-4xl border-2 border-dashed border-green-500/20">
                        <CheckCircle size={24} /> {t('status_delivered')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* BOŞ DURUM (Hata aldığınız yer burasıydı) */
            <div className="py-40 text-center opacity-20 flex flex-col items-center gap-4">
              <BarChart3 size={64} />
              <p className="font-black uppercase tracking-[0.4em] text-sm">
                {isTr ? 'Henüz bir satışınız bulunmuyor' : 'No sales found yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
