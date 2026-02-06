import { useEffect, useState } from 'react';
import axios from 'axios';
import { AgentComparison } from '../admin/AgentComparison';
import { Loader2, TrendingUp, Award } from 'lucide-react';
import type { AgentPerformance } from '../../types/admin';

export const AgentsView = () => {
  const [data, setData] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/agents-performance')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-purple-600" />
      </div>
    );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <AgentComparison data={data} />

      {/* EN İYİ ACENTELER LİSTESİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data
          .sort((a, b) => b.gps - a.gps)
          .map((item) => (
            <div
              key={item.agent.id}
              className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl flex items-center gap-6"
            >
              <div className="relative">
                <img
                  src={item.agent.avatarUrl || ''}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500"
                />
                {item.gps > 98 && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 p-1 rounded-lg text-white">
                    <Award size={14} />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-black uppercase text-sm dark:text-white">
                  {item.agent.fullName}
                </h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Skor: <span className="text-purple-600">%{item.gps}</span>
                </p>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                  <TrendingUp size={10} /> {item.totalRevenue.toLocaleString()}{' '}
                  ₺
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
