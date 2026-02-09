import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  UserCog,
  Ban,
  UserPlus,
  Search,
  ShieldAlert,
  UserMinus,
} from 'lucide-react';
import axios from 'axios';
import type { User } from '../../types/admin';

interface RBACViewProps {
  users: User[];
  refresh: () => void;
}

export const RBACView = ({ users, refresh }: RBACViewProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  // 🚀 ARAMA MOTORU: İsim veya Email üzerinden anlık filtreleme
  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const updateRole = async (userId: number, role: string) => {
    if (!window.confirm(t('confirm_role_change'))) return;
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role },
      );
      refresh(); // 🚀 Telsizle ana sayfaya "veriyi yenile" diyoruz
    } catch (err) {
      console.error('Yetki hatası:', err);
      alert('İşlem başarısız.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* 🚀 ÜST ARAMA BARI */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder={t('search_user')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-purple-600 text-sm transition-all shadow-lg"
        />
      </div>

      {/* 🚀 KULLANICI TABLOSU */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCog className="text-purple-600" />
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">
              {t('user_management')}
            </h2>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filteredUsers.length} Toplam Kayıt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-[#020617] text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-8 font-black">Kullanıcı Bilgileri</th>
                <th className="p-8 font-black">Mevcut Yetki</th>
                <th className="p-8 font-black text-right">Erişim Kontrolü</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="p-8 flex items-center gap-4">
                    <img
                      src={
                        u.avatarUrl?.startsWith('http')
                          ? u.avatarUrl
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=6366f1&color=fff&bold=true`
                      }
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-sm"
                      alt="avatar"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=6366f1&color=fff`;
                      }}
                    />
                    <div>
                      <p className="font-black text-slate-900 dark:text-white uppercase italic tracking-tight">
                        {u.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold">
                        {u.email}
                      </p>
                    </div>
                  </td>
                  <td className="p-8">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                        u.role === 'admin'
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                          : u.role === 'agent'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : u.role === 'banned'
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {t(`role_${u.role}`)}
                    </span>
                  </td>
                  <td className="p-8 flex justify-end gap-3">
                    {/* AKSİYONLAR */}
                    {u.role === 'user' && (
                      <button
                        onClick={() => updateRole(u.id, 'agent')}
                        className="p-3 bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl transition-all active:scale-90"
                        title={t('action_make_agent')}
                      >
                        <UserPlus size={18} />
                      </button>
                    )}

                    {u.role === 'agent' && (
                      <button
                        onClick={() => updateRole(u.id, 'user')}
                        className="p-3 bg-amber-600/10 text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl transition-all"
                        title="Yetkiyi Geri Al"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}

                    {u.role !== 'admin' && u.role !== 'banned' && (
                      <button
                        onClick={() => updateRole(u.id, 'banned')}
                        className="p-3 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all"
                        title={t('action_ban')}
                      >
                        <Ban size={18} />
                      </button>
                    )}

                    {u.role === 'banned' && (
                      <button
                        onClick={() => updateRole(u.id, 'user')}
                        className="p-3 bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white rounded-2xl transition-all"
                        title={t('action_unban')}
                      >
                        <ShieldCheck size={18} />
                      </button>
                    )}

                    {u.role === 'admin' && (
                      <ShieldAlert
                        size={18}
                        className="text-slate-200 dark:text-slate-800 m-3"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
