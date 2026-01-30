import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LogOut,
  PlusCircle,
  Globe,
  User,
  ChevronDown,
  LayoutDashboard,
  Plus,
  Image as ImageIcon,
} from 'lucide-react';
import { SubNavbar } from './SubNavbar';
import { useTranslation } from 'react-i18next';
import { Sidedrawer } from './Sidedrawer';

export const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false); // 🚀 Dropdown kontrolü
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const isAuthorized = user?.role === 'admin' || user?.role === 'agent';

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('tr') ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <>
      <header className="h-20 border-b border-white/5 flex items-center px-6 md:px-10 justify-between sticky top-0 bg-[#020617]/95 backdrop-blur-xl z-50">
        {/* 1. LOGO ALANI */}
        <Link
          to="/"
          className="text-xl font-black italic uppercase tracking-tighter text-white no-underline shrink-0"
        >
          UNIVERSAL<span className="text-purple-600">MARKET</span>
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          {/* 2. AKSİYON GRUBU (DİL + ADMIN İŞLEMLERİ) */}
          <div className="flex items-center gap-2">
            {/* DİL SEÇİCİ */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40 hover:text-white transition-all px-3 py-2 border border-white/5 rounded-xl cursor-pointer"
            >
              <Globe size={12} />
              <span className="hidden sm:inline">
                {i18n.language.startsWith('tr') ? 'EN' : 'TR'}
              </span>
            </button>

            {/* ADMIN HIZLI ERİŞİM (İkonik ve Şık) */}
            {isAuthorized && (
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                <Link
                  to="/admin/add-category"
                  title={t('addcategory')}
                  className="p-2 hover:bg-white/10 text-blue-400 rounded-xl transition-all"
                >
                  <PlusCircle size={18} />
                </Link>
                <Link
                  to="/add-listing"
                  title={t('add_listing')}
                  className="p-2 hover:bg-white/10 text-purple-500 rounded-xl transition-all border-x border-white/5"
                >
                  <Plus size={18} />
                </Link>
                <Link
                  to="/admin/add-banner"
                  title="Add Banner"
                  className="p-2 hover:bg-white/10 text-amber-500 rounded-xl transition-all"
                >
                  <ImageIcon size={18} />
                </Link>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

          {/* 3. KULLANICI / HESAP ALANI (Dropdown Yapısı) */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      className="w-8 h-8 rounded-full border border-purple-600 object-cover"
                      alt="profil"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#020617] rounded-full" />
                </div>

                <div className="hidden lg:block text-left leading-none">
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-[100px]">
                    {user.fullName}
                  </p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">
                    {user.role}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-600 transition-transform duration-300 ${isAccountOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* 🚀 PRO DROPDOWN MENU */}
              {isAccountOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsAccountOpen(false)}
                  />
                  <div className="absolute top-14 right-0 w-52 bg-[#0f172a] border border-white/5 rounded-2xl shadow-2xl p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-white/5 mb-1">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        Hesap Yönetimi
                      </p>
                      <p className="text-[11px] font-bold text-white truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                    >
                      <LayoutDashboard size={14} className="text-purple-500" />
                      {t('adminPanel') || 'Panelim'}
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsAccountOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-widest mt-1 border-t border-white/5"
                    >
                      <LogOut size={14} />
                      {t('logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all text-white no-underline shadow-xl shadow-black/20"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </header>

      {/* ALT BİLEŞENLER */}
      <SubNavbar onOpenDrawer={() => setIsDrawerOpen(true)} />
      <Sidedrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
