import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertCircle, Activity } from 'lucide-react';
import type { PerformanceData } from '../../types/auth'; // 🚀 Merkezi tipi kullandık

interface MetricRowProps {
  label: string;
  score: number;
  weight: string;
}

// 🚀 Alt bileşeni 't' kullanarak dilleştirdik
const MetricRow = ({ label, score, weight }: MetricRowProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-100 dark:border-white/5 last:border-0">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-[9px] text-slate-400 font-bold italic opacity-60">
          {t('weight')}: %{weight}
        </p>
      </div>
      <div
        className={`text-sm font-black ${score >= 99 ? 'text-green-500' : 'text-amber-500'}`}
      >
        {score.toFixed(1)}%
      </div>
    </div>
  );
};

export const PerformanceCard = ({ data }: { data: PerformanceData }) => {
  const { t } = useTranslation();
  const isHealthy = data.gps >= 98; // 🚀 Amazon standardı %98 ve üstü sağlıklıdır

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-purple-500/5 animate-in zoom-in">
      {/* BAŞLIK ALANI */}
      <div
        className={`p-8 ${isHealthy ? 'bg-green-500' : 'bg-amber-500'} text-white flex justify-between items-center transition-colors duration-1000`}
      >
        <div className="space-y-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
            {t('account_health')}
          </h2>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-black italic">
              {data.gps.toFixed(2)}
            </span>
            <span className="text-xs font-bold opacity-60">/ 100</span>
          </div>
        </div>
        {isHealthy ? (
          <ShieldCheck size={44} className="opacity-40" />
        ) : (
          <AlertCircle size={44} className="opacity-40" />
        )}
      </div>

      {/* METRİK LİSTESİ */}
      <div className="p-8 space-y-2">
        <MetricRow
          label={t('odr_label')}
          score={data.metrics.odr.score}
          weight="40"
        />
        <MetricRow
          label={t('lsr_label')}
          score={data.metrics.lsr.score}
          weight="20"
        />
        <MetricRow
          label={t('cr_label')}
          score={data.metrics.cr.score}
          weight="25"
        />

        {/* ALT BİLGİ */}
        <div className="pt-6 flex items-center gap-3 text-slate-400">
          <div className="p-2 bg-slate-50 dark:bg-[#020617] rounded-lg">
            <Activity size={14} className="text-purple-600 animate-pulse" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
            {t('analysis_30_days')}
          </span>
        </div>
      </div>
    </div>
  );
};
