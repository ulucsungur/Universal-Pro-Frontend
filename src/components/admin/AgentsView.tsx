import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  Clock,
  PieChart as PieIcon,
  Loader2,
  TrendingUp,
  Award,
  FileText,
} from 'lucide-react';
import { AgentComparison } from './AgentComparison';
import { AgentRevenueChart } from './AgentRevenueChart';

// --- TİPLEMELER ---
interface AgentMetricDetail {
  count: number;
  score: number | string;
}
interface AgentPerformanceItem {
  agent: { id: number; fullName: string; avatarUrl?: string | null };
  metrics: {
    odr: AgentMetricDetail;
    lsr: AgentMetricDetail;
    cr: AgentMetricDetail;
  };
  gps: number;
  totalRevenue: number;
}
interface RentalStat {
  name: string;
  value: number;
  fill: string;
}
interface WorkloadEntry {
  month: string;
  [agentName: string]: string | number;
}

export const AgentsView = () => {
  const { t } = useTranslation();
  const [performanceData, setPerformanceData] = useState<
    AgentPerformanceItem[]
  >([]);
  const [workload, setWorkload] = useState<WorkloadEntry[]>([]);
  const [rentalData, setRentalData] = useState<RentalStat[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚀 DİNAMİK ANAHTAR BULUCU (Acente isimlerini yakalar)
  const agentKeys = useMemo(() => {
    const keys = new Set<string>();
    workload.forEach((row) => {
      Object.keys(row).forEach((k) => {
        if (k !== 'month') keys.add(k);
      });
    });
    return Array.from(keys);
  }, [workload]);

  const barColors = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const fetchAllData = useCallback(async () => {
    try {
      const [perfRes, workRes, rentRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/agents-performance'),
        axios.get('http://localhost:5000/api/admin/workload'),
        axios.get('http://localhost:5000/api/admin/rental-analysis'),
      ]);
      setPerformanceData(perfRes.data);
      setWorkload(workRes.data);
      setRentalData(rentRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="space-y-12">
      <div className="flex justify-end">
        <button className="hidden">
          <FileText />
        </button>
      </div>{' '}
      {/* Unused fix */}
      <AgentComparison data={performanceData} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[40px] shadow-2xl min-h-112.5">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="text-purple-500" size={20} />
            <h3 className="text-sm font-black uppercase italic dark:text-white">
              {t('agent_workload')}
            </h3>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.1}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fontWeight: 'bold' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '16px',
                  }}
                />
                <Legend iconType="circle" />
                {agentKeys.map((name, index) => (
                  <Bar
                    key={name}
                    dataKey={name}
                    fill={barColors[index % barColors.length]}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[40px] shadow-2xl min-h-112.5">
          <div className="flex items-center gap-3 mb-8">
            <PieIcon className="text-amber-500" size={20} />
            <h3 className="text-sm font-black uppercase italic dark:text-white">
              {t('rental_analysis')}
            </h3>
          </div>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={rentalData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {rentalData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* ciro */}
      <AgentRevenueChart />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceData.map((item) => (
          <div
            key={item.agent.id}
            className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl shadow-xl flex items-center gap-4 hover:scale-105 transition-all"
          >
            <img
              src={
                item.agent.avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(item.agent.fullName)}`
              }
              className="w-12 h-12 rounded-xl object-cover"
              alt=""
            />
            <div>
              <h4 className="text-xs font-black uppercase dark:text-white">
                {item.agent.fullName}
              </h4>
              <p className="text-[9px] font-bold text-slate-400">
                SKOR: %{Number(item.gps).toFixed(1)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={10} className="text-green-500" />
                <span className="text-[10px] font-black text-green-500">
                  {item.totalRevenue} ₺
                </span>
              </div>
              <div className="hidden">
                <Award />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { AgentComparison } from '../admin/AgentComparison';
// import { Loader2, TrendingUp, Award } from 'lucide-react';
// import type { AgentPerformance } from '../../types/admin';

// export const AgentsView = () => {
//   const [data, setData] = useState<AgentPerformance[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/api/admin/agents-performance')
//       .then((res) => setData(res.data))
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return (
//       <div className="py-20 flex justify-center">
//         <Loader2 className="animate-spin text-purple-600" />
//       </div>
//     );

//   return (
//     <div className="space-y-12 animate-in fade-in duration-700">
//       <AgentComparison data={data} />

//       {/* EN İYİ ACENTELER LİSTESİ */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {data
//           .sort((a, b) => b.gps - a.gps)
//           .map((item) => (
//             <div
//               key={item.agent.id}
//               className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl flex items-center gap-6"
//             >
//               <div className="relative">
//                 <img
//                   src={item.agent.avatarUrl || ''}
//                   className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500"
//                 />
//                 {item.gps > 98 && (
//                   <div className="absolute -top-2 -right-2 bg-amber-500 p-1 rounded-lg text-white">
//                     <Award size={14} />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <h4 className="font-black uppercase text-sm dark:text-white">
//                   {item.agent.fullName}
//                 </h4>
//                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
//                   Skor: <span className="text-purple-600">%{item.gps}</span>
//                 </p>
//                 <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1 flex items-center gap-1">
//                   <TrendingUp size={10} /> {item.totalRevenue.toLocaleString()}{' '}
//                   ₺
//                 </p>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };
