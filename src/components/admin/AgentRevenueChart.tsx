// frontend/src/components/admin/AgentRevenueChart.tsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Loader2 } from 'lucide-react'; // 🚀 Loader2 eklendi

interface RevenueData {
  name: string;
  revenue: number;
}

export const AgentRevenueChart = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<RevenueData[]>([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState(new Date().getMonth().toString());
  const [loading, setLoading] = useState(false); // 🚀 Artık aktif kullanılacak

  const months = useMemo(
    () => [
      { v: '0', l: t('month_jan') || 'Ocak' },
      { v: '1', l: t('month_feb') || 'Şubat' },
      { v: '2', l: t('month_mar') || 'Mart' },
      { v: '3', l: t('month_apr') || 'Nisan' },
      { v: '4', l: t('month_may') || 'Mayıs' },
      { v: '5', l: t('month_jun') || 'Haziran' },
      { v: '6', l: t('month_jul') || 'Temmuz' },
      { v: '7', l: t('month_aug') || 'Ağustos' },
      { v: '8', l: t('month_sep') || 'Eylül' },
      { v: '9', l: t('month_oct') || 'Ekim' },
      { v: '10', l: t('month_nov') || 'Kasım' },
      { v: '11', l: t('month_dec') || 'Aralık' },
    ],
    [t],
  );

  const fetchRevenue = useCallback(async () => {
    setLoading(true); // 🚀 Yükleme başladı
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/agent-revenue-analysis?year=${year}&month=${month}`,
      );
      setData(res.data);
    } catch (err) {
      console.error('Ciro verisi çekilemedi:', err);
    } finally {
      // 🚀 Küçük bir gecikme ile yüklemeyi bitir (Görsel akıcılık için)
      setTimeout(() => setLoading(false), 300);
    }
  }, [year, month]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  return (
    <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <DollarSign size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase italic dark:text-white">
              {t('agent_revenue_analysis') || 'ACENTE CİRO ANALİZİ'}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              {t('top_sellers') || 'En Çok Satış Yapanlar'}
            </p>
          </div>
        </div>

        {/* FİLTRELER */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-black/20 p-2 rounded-2xl border border-slate-100 dark:border-white/5">
          <Calendar size={16} className="text-slate-400 ml-2" />
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-transparent border-none text-[10px] font-black uppercase dark:text-white outline-none cursor-pointer"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
          <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent border-none text-[10px] font-black uppercase dark:text-white outline-none cursor-pointer pr-2"
          >
            {months.map((m) => (
              <option key={m.v} value={m.v}>
                {m.l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRAFİK ALANI */}
      <div className="h-87.5 w-full relative">
        {/* 🚀 LOADING EKRANI (loading artık kullanılıyor ✅) */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 dark:bg-[#0f172a]/60 backdrop-blur-sm rounded-3xl animate-in fade-in duration-300">
            <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
              {t('loading')}
            </span>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 20, right: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              opacity={0.05}
            />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 10, fontWeight: '900', fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              width={100}
            />

            <Tooltip<number, string>
              cursor={{ fill: 'rgba(16,185,129,0.05)' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '16px',
                border: 'none',
              }}
              itemStyle={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#10b981',
              }}
              formatter={(value) => `${(value ?? 0).toLocaleString()} ₺`}
            />

            <Bar
              dataKey="revenue"
              name={t('revenue') || 'Ciro'}
              radius={[0, 12, 12, 0]}
              barSize={28}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#10b981' : '#10b98160'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* VERİ YOKSA */}
        {!loading && data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-full border border-dashed border-slate-200 dark:border-white/10">
              {t('no_data_found') || 'Veri Bulunamadı'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
