import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import type { AgentPerformance } from '../../types/admin';
import { Info } from 'lucide-react'; // 🚀 İkon eklendi

export const AgentComparison = ({ data }: { data: AgentPerformance[] }) => {
  const { t } = useTranslation();

  const chartData = data.map((item) => ({
    name: item.agent.fullName,
    ODR: item.metrics.odr.score,
    LSR: item.metrics.lsr.score,
    CR: item.metrics.cr.score,
  }));

  return (
    <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl animate-in fade-in">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-purple-600 italic">
            {t('agent_performance_comparison') ||
              'ACENTE PERFORMANS KIYASLAMASI'}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            {t('metrics_analysis') || 'HATA ORANLARINA GÖRE ANALİZ'}
          </p>
        </div>
        <div className="p-3 bg-purple-600/10 rounded-2xl text-purple-600">
          <Info size={18} />
        </div>
      </div>

      <div className="h-87.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
            <YAxis domain={[0, 100]} hide />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '16px',
                border: 'none',
              }}
              itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontSize: '10px',
                fontWeight: 'bold',
                paddingTop: '20px',
              }}
            />
            <Bar
              dataKey="ODR"
              fill="#a855f7"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="LSR"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="CR"
              fill="#ef4444"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🚀 METRİK AÇIKLAMA PANELİ (GÖREV TAMAMLANDI ✅) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              ODR
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
            {t('odr_desc')}
          </p>
        </div>

        <div className="space-y-2 border-x border-slate-100 dark:border-white/5 px-0 md:px-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              LSR
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
            {t('lsr_desc')}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              CR
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
            {t('cr_desc')}
          </p>
        </div>
      </div>
    </div>
  );
};
