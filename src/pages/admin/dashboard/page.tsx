import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Loader2,
  LayoutDashboard,
  Wallet,
  Users2,
  BarChart3,
} from 'lucide-react';
import { FinanceView } from '../../../components/admin/FinanceView';
import { AgentsView } from '../../../components/admin/AgentsView';
import { RBACView } from '../../../components/admin/RBACView';
import type { AdminGlobalStats, User } from '../../../types/admin';
import { useRef } from 'react';
import { ReportGenerator } from '../../../components/admin/ReportGenerator';

export default function AdminDashboardPage() {
  const reportAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'finance' | 'agents' | 'rbac'>(
    'finance',
  );
  const [stats, setStats] = useState<AdminGlobalStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // 🚀 ADRES KONTROLÜ: Tam URL kullanarak hatayı bitiriyoruz
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats'),
        axios.get('http://localhost:5000/api/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsersList(usersRes.data);
    } catch (err) {
      console.error('Kule Veri Hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // 🚀 Hata bitti: Bağımlılık eklendi

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] p-8 space-y-4 hidden lg:block border-r border-white/5">
        <div className="flex items-center gap-3 text-purple-500 mb-12">
          <LayoutDashboard size={24} />
          <span className="font-black italic uppercase tracking-tighter text-xl text-white">
            KULE
          </span>
        </div>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('finance')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase transition-all cursor-pointer ${activeTab === 'finance' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
          >
            <Wallet size={16} /> {t('finance') || 'FİNANS'}
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase transition-all cursor-pointer ${activeTab === 'agents' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart3 size={16} /> {t('agents') || 'ACENTELER'}
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-[10px] font-black uppercase transition-all cursor-pointer ${activeTab === 'rbac' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}
          >
            <Users2 size={16} /> {t('rbac') || 'YETKİLER'}
          </button>
          <ReportGenerator stats={stats} contentRef={reportAreaRef} />
        </nav>
      </aside>

      {/* DİNAMİK ALAN */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto no-scrollbar">
        <div ref={reportAreaRef} className="space-y-12">
          {activeTab === 'finance' && <FinanceView stats={stats} />}
          {activeTab === 'agents' && <AgentsView />}
        </div>
        {activeTab === 'rbac' && (
          <RBACView users={usersList} refresh={fetchData} />
        )}
      </main>
    </div>
  );
}
