import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, LayoutGrid, Calendar } from 'lucide-react';
import type { Order } from '../../types/auth';

export const SalesAnalytics = ({ sales }: { sales: Order[] }) => {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language.startsWith('tr');

  const stats = useMemo(() => {
    let totalRevenue = 0;
    const categoryMap = new Map<string, number>();
    const timeAndCategoryMap = new Map<string, Record<string, number>>();

    // Sadece iptal edilmemiş siparişleri hesapla
    const activeSales = sales.filter((s) => s.status !== 'cancelled');

    activeSales.forEach((sale) => {
      const price = Number(sale.totalPrice || 0);
      totalRevenue += price;

      // Zaman Anahtarı (Örn: "Ocak 2026")
      const date = new Date(sale.createdAt);
      const monthYear = date.toLocaleString(i18n.language, {
        month: 'long',
        year: 'numeric',
      });

      // Kategori Adı
      const catName = isTr
        ? sale.listing?.category?.titleTr || 'Diğer'
        : sale.listing?.category?.titleEn || 'Other';

      // 1. Kategori Bazlı Toplam
      categoryMap.set(catName, (categoryMap.get(catName) || 0) + price);

      // 2. Ay Bazlı Kategori Dağılımı
      const monthData = timeAndCategoryMap.get(monthYear) || {};
      monthData[catName] = (monthData[catName] || 0) + price;
      timeAndCategoryMap.set(monthYear, monthData);
    });

    return {
      totalRevenue,
      categoryList: Array.from(categoryMap),
      timeData: Array.from(timeAndCategoryMap),
    };
  }, [sales, isTr, i18n.language]);

  return (
    <div className="bg-[#0f172a] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-700">
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

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Kategori Bazlı Genel Toplam */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid size={14} /> {t('category_breakdown')}
          </h4>
          <div className="space-y-3">
            {stats.categoryList.map(([name, total]) => (
              <div
                key={name}
                className="flex justify-between border-b border-white/5 pb-2"
              >
                <span className="text-xs font-bold text-slate-400">{name}</span>
                <span className="text-xs font-black text-white">
                  {total.toLocaleString()} ₺
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ay Bazında Hangi Kategoriden Ne Kadar Satıldı */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} /> {t('monthly_report')}
          </h4>
          {stats.timeData.map(([month, categories]) => (
            <div key={month} className="bg-white/5 p-4 rounded-2xl space-y-2">
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-tighter">
                {month}
              </p>
              {Object.entries(categories).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between text-[11px]">
                  <span className="text-slate-500 font-bold">{cat}</span>
                  <span className="text-white font-black">
                    {amount.toLocaleString()} ₺
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
