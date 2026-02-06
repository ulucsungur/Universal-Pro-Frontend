import { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types/auth';

export const RevenueChart = ({ sales }: { sales: Order[] }) => {
  const { t, i18n } = useTranslation();

  const chartData = useMemo(() => {
    const dailyMap = new Map<string, number>();
    const currentLang = i18n.language.startsWith('tr') ? 'tr-TR' : 'en-US';

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString(currentLang, {
        day: 'numeric',
        month: 'short',
      });
      dailyMap.set(key, 0);
    }

    sales.forEach((sale) => {
      if (sale.status !== 'cancelled') {
        const key = new Date(sale.createdAt).toLocaleDateString(currentLang, {
          day: 'numeric',
          month: 'short',
        });
        if (dailyMap.has(key)) {
          dailyMap.set(key, dailyMap.get(key)! + Number(sale.totalPrice));
        }
      }
    });

    return Array.from(dailyMap).map(([name, total]) => ({ name, total }));
  }, [sales, i18n.language]);

  return (
    <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl h-100 w-full animate-in fade-in duration-1000">
      <div className="mb-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-600 italic">
          {t('revenue_chart_title')}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
          {t('last_7_days')}
        </p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888888' }}
            dy={10}
          />
          <YAxis hide={true} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            }}
            itemStyle={{
              color: '#a855f7',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
            labelStyle={{
              color: '#64748b',
              marginBottom: '4px',
              fontSize: '10px',
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#9333ea"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorTotal)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
