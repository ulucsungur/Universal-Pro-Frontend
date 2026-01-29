import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, PlusCircle, Globe } from 'lucide-react'; // Globe ikonu ekledik
import { SubNavbar } from './SubNavbar';
import { useTranslation } from 'react-i18next'; // 🚀 i18n hook'u
import { Sidedrawer } from './SideDrawer';
import { useState } from 'react';

export const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation(); // 🚀 Çeviri ve dil kontrolü

  const isAuthorized = user?.role === 'admin' || user?.role === 'agent';

  // 🚀 Dil değiştirme fonksiyonu
  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('tr') ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <>
      <header className="h-20 border-b border-white/5 flex items-center px-10 justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-50">
        <Link
          to="/"
          className="text-xl font-black italic uppercase tracking-tighter text-white no-underline"
        >
          UNIVERSAL<span className="text-purple-600">MARKET</span>
        </Link>

        <div className="flex items-center gap-6">
          {/* 🚀 1. DİL SEÇİCİ (Her zaman görünür) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all border border-white/10 px-3 py-2 rounded-xl cursor-pointer"
          >
            <Globe size={12} />
            {i18n.language.startsWith('tr') ? 'EN' : 'TR'}
          </button>

          {/* 🚀 2. İLAN VER BUTONU */}
          {isAuthorized && (
            <Link
              to="/add-listing"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 no-underline"
            >
              <PlusCircle size={16} />
              {t('add_listing')} {/* 🚀 Çeviriden geliyor */}
            </Link>
          )}

          {/* 🚀 3. KULLANICI ALANI */}
          {user ? (
            <div className="flex items-center gap-6 border-l border-white/10 pl-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                  {user.fullName}
                </span>
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    className="w-8 h-8 rounded-full border border-purple-600 object-cover"
                    alt="profil"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-all cursor-pointer"
              >
                <LogOut size={14} />
                {t('logout')} {/* 🚀 Çeviriden geliyor */}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all text-white no-underline"
            >
              {t('login')} {/* 🚀 Çeviriden geliyor */}
            </Link>
          )}
        </div>
      </header>

      <SubNavbar onOpenDrawer={() => setIsDrawerOpen(true)} />
      <Sidedrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
