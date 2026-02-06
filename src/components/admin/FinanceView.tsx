import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, Package, Activity } from 'lucide-react';
import type { AdminGlobalStats } from '../../types/admin';

// 🚀 HACİM HESAPLAYICI (Balon Boyutları)
interface DotProps {
  cx?: number;
  cy?: number;
  value?: number;
  stroke?: string;
}

const CustomDot = (props: DotProps) => {
  const { cx, cy, value, stroke } = props;
  if (!value || cx === undefined || cy === undefined) return null;

  // 🚀 KAREKÖK ALGORİTMASI: Küçük ve büyük rakamlar arasındaki farkı belirginleştirir
  // 176 ₺ -> ~7px yarıçap | 5648 ₺ -> ~17px yarıçap
  const radius = 4 + Math.sqrt(value) / 5;
  const limitedRadius = Math.min(radius, 25); // Maksimum 25px ile sınırladık

  return (
    <circle
      cx={cx}
      cy={cy}
      r={limitedRadius}
      fill={stroke}
      stroke="white"
      strokeWidth={2}
      className="drop-shadow-[0_0_10px_rgba(0,0,0,0.3)] animate-pulse"
    />
  );
};

export const FinanceView = ({ stats }: { stats: AdminGlobalStats | null }) => {
  const { t } = useTranslation();

  // 🚀 HOOK SIRALAMASI FİX (En Üstte)
  const categories = useMemo(() => {
    const data = stats?.financeData;
    if (!Array.isArray(data) || data.length === 0) return [];
    return Object.keys(data[0]).filter((key: string) => key !== 'name');
  }, [stats?.financeData]);

  if (!stats) return null;

  const colors = ['#10b981', '#3b82f6', '#9333ea', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KART 1: CİRO */}
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
          <div className="p-3 bg-purple-600/10 text-purple-600 rounded-2xl w-fit mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t('total_revenue_global')}
          </p>
          <h3 className="text-3xl font-black italic text-slate-900 dark:text-white mt-1">
            {Number(stats.totalRevenue || 0).toLocaleString()} ₺
          </h3>
        </div>

        {/* KART 2: KULLANICILAR */}
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
          <div className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl w-fit mb-4">
            <Users size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t('total_users')}
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalUsers}
          </h3>
        </div>

        {/* KART 3: İLANLAR */}
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
          <div className="p-3 bg-amber-600/10 text-amber-600 rounded-2xl w-fit mb-4">
            <Package size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t('total_listings')}
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {stats.totalListings}
          </h3>
        </div>

        {/* KART 4: SİSTEM SAĞLIĞI (Hata Çözüldü ✅) */}
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
          <div className="p-3 bg-red-600/10 text-red-600 rounded-2xl w-fit mb-4">
            <Activity size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t('system_health')}
          </p>
          <div className="flex items-baseline gap-2">
            <h3
              className={`text-3xl font-black mt-1 ${stats.health.status === 'Healthy' ? 'text-green-500' : 'text-red-500'}`}
            >
              {stats.health.score}%
            </h3>
            <p className="text-[10px] font-bold text-slate-400 opacity-50">
              (ODR: %{stats.health.odr})
            </p>
          </div>
        </div>
      </div>

      {/* HACİMSEL GRAFİK ALANI */}
      <div className="bg-white dark:bg-[#0f172a] p-10 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl h-150">
        <div className="mb-10">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-600 italic">
            Hacimsel Kategori Bazlı Satış Grafiği
          </h3>
          <p className="text-[9px] text-slate-400 font-bold mt-1">
            NOKTA BÜYÜKLÜKLERİ İLGİLİ AYIN CİRO HACMİNİ TEMSİL ETMEKTEDİR
          </p>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart
            data={stats.financeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#888888"
              opacity={0.1}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '24px',
                border: 'none',
                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
              }}
              itemStyle={{
                fontSize: '13px',
                fontWeight: '900',
                textTransform: 'uppercase',
                padding: '4px 0',
              }}
              labelStyle={{
                color: '#64748b',
                marginBottom: '8px',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                paddingTop: '40px',
                fontSize: '11px',
                fontWeight: '900',
              }}
            />

            {categories.map((cat: string, index: number) => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={colors[index % colors.length]}
                strokeWidth={5}
                dot={<CustomDot />}
                activeDot={{ r: 12, strokeWidth: 0 }}
                name={cat.toUpperCase()}
                animationDuration={2500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
