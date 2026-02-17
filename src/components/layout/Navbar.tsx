import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import {
  LogOut,
  Package,
  BadgeDollarSign,
  MapPin,
  LayoutDashboard,
  Settings,
  Globe,
  Moon,
  Sun,
  PlusCircle,
  Plus,
  Image as ImageIcon,
  User as UserIcon,
  ChevronDown,
  MessageSquare,
  CalendarDays,
  ShoppingCart,
  Heart,
  LayoutGrid,
  BookOpenCheck,
  PenTool,
} from 'lucide-react';
import { SubNavbar } from './SubNavbar';
import { Sidedrawer } from './Sidedrawer';
import { Tooltip } from '../ui/Tooltip';

export const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // 🚀 MERKEZİ VERİLER (unreadCount artık buradan tek kanalla geliyor)
  const { user, logout, unreadCount, cartCount, favorites } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const isAuthorized = user?.role === 'admin' || user?.role === 'agent';

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('tr') ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <>
      <header className="h-20 border-b border-white/5 flex items-center px-6 md:px-10 justify-between sticky top-0 bg-[#020617] z-50">
        <Link
          to="/"
          className="text-xl font-black italic uppercase tracking-tighter text-white no-underline shrink-0"
        >
          UNIVERSAL<span className="text-purple-600">MARKET</span>
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-4">
            {/* FAVORİLER (Kalp İkonu Kullanıldı ✅) */}
            <Link
              to="/favorites"
              className="relative p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-red-500 transition-all no-underline"
            >
              <Heart
                size={18}
                fill={favorites.length > 0 ? 'currentColor' : 'none'}
                className={favorites.length > 0 ? 'text-red-500' : ''}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* SEPET */}
            <Link
              to="/cart"
              className="relative p-2.5 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-purple-500 transition-all no-underline"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#020617] animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleLanguage}
              className="text-[10px] font-black uppercase text-white/40 hover:text-white transition-all px-3 py-2 border border-white/5 rounded-xl cursor-pointer"
            >
              <Globe size={12} /> {i18n.language.startsWith('tr') ? 'EN' : 'TR'}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-white/40 hover:text-purple-500 transition-all cursor-pointer"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {isAuthorized && (
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                <Tooltip text={t('addcategory') || 'Kategori Ekle'}>
                  <Link
                    to="/admin/add-category"
                    className="p-2 hover:bg-white/10 text-blue-400 rounded-xl transition-all"
                  >
                    <PlusCircle size={18} />
                  </Link>
                </Tooltip>
                <Tooltip text={t('add_listing') || 'İlan Ver'}>
                  <Link
                    to="/add-listing"
                    className="p-2 hover:bg-white/10 text-purple-500 rounded-xl transition-all border-x border-white/5"
                  >
                    <Plus size={18} />
                  </Link>
                </Tooltip>
                <Tooltip text="ADD BANNER">
                  <Link
                    to="/admin/add-banner"
                    className="p-2 hover:bg-white/10 text-amber-500 rounded-xl transition-all"
                  >
                    <ImageIcon size={18} />
                  </Link>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-2xl text-white transition-all cursor-pointer"
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
                      <UserIcon size={14} className="text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-[#020617] rounded-full" />
                </div>
                <div className="hidden lg:block text-left leading-none">
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-25">
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
              {isAccountOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsAccountOpen(false)}
                  />
                  <div className="absolute top-14 right-0 w-64 bg-[#0f172a] border border-white/5 rounded-3xl shadow-2xl p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                    {/* KULLANICI BİLGİSİ */}
                    <div className="p-4 border-b border-white/5 mb-2">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-1 italic tracking-widest">
                        {t('logged_in_as') || 'Giriş Yapıldı'}
                      </p>
                      <p className="text-xs font-bold text-white truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      {/* PANELİM (ADMIN) */}
                      {isAuthorized && (
                        <Link
                          to="/dashboard"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all uppercase tracking-widest no-underline"
                        >
                          <LayoutDashboard size={16} />
                          {t('nav_dashboard') || 'Panelim (Admin)'}
                        </Link>
                      )}

                      {/* SİPARİŞLERİM */}
                      <Link
                        to="/orders"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                      >
                        <Package size={16} className="text-blue-500" />
                        {t('nav_my_orders') || 'Siparişlerim'}
                      </Link>

                      {isAuthorized && (
                        <>
                          {/* SATIŞLARIM */}
                          <Link
                            to="/sales"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                          >
                            <BadgeDollarSign
                              size={16}
                              className="text-green-500"
                            />
                            {t('nav_my_sales') || 'Satışlarım (Gelen)'}
                          </Link>

                          {/* KİRALAMALARIM */}
                          <Link
                            to="/bookings"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                          >
                            <CalendarDays
                              size={16}
                              className="text-purple-500"
                            />
                            {t('my_bookings') || 'Kiralamalarım'}
                          </Link>

                          {/* İLANLARIMI YÖNET */}
                          <Link
                            to="/my-listings"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                          >
                            <LayoutGrid size={16} className="text-indigo-500" />
                            {t('manage_my_listings') || 'İlanlarımı Yönet'}
                          </Link>

                          {/* YENİ İLAN EKLE */}
                          <Link
                            to="/add-listing"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                          >
                            <PlusCircle
                              size={16}
                              className="text-emerald-500"
                            />
                            {t('add_new_listing_menu') || 'Yeni İlan Ekle'}
                          </Link>

                          {/* YENİ BLOG EKLE */}
                          <Link
                            to="/admin/add-blog"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                          >
                            <PenTool size={16} className="text-pink-500" />
                            {t('add_blog_menu') || 'Yeni Blog Ekle'}
                          </Link>

                          {/* BLOGLARIMI YÖNET */}
                          <Link
                            to="/admin/my-blogs"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                          >
                            <BookOpenCheck
                              size={16}
                              className="text-orange-500"
                            />
                            {t('manage_my_blogs') || 'Bloglarımı Yönet'}
                          </Link>

                          <div className="h-px bg-white/5 my-2 mx-4" />
                        </>
                      )}

                      {/* MESAJLARIM */}
                      <Link
                        to="/messages"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare
                            size={16}
                            className="text-purple-400"
                          />
                          {t('nav_my_messages') || 'Mesajlarım'}
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse shadow-lg">
                            {unreadCount}
                          </span>
                        )}
                      </Link>

                      {/* ADRESLERİM */}
                      <Link
                        to="/profile/addresses"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest no-underline"
                      >
                        <MapPin size={16} className="text-red-400" />
                        {t('nav_addresses') || 'Adreslerim'}
                      </Link>

                      <div className="h-px bg-white/5 my-2" />

                      {/* AYARLAR */}
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-left uppercase tracking-widest border-none cursor-pointer">
                        <Settings size={16} />
                        {t('nav_profile_settings') || 'Profil Ayarları'}
                      </button>

                      {/* ÇIKIŞ YAP */}
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-xl mt-1 border-t border-white/5 uppercase tracking-widest cursor-pointer"
                      >
                        <LogOut size={16} />
                        {t('logout') || 'Çıkış Yap'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2.5 rounded-full bg-transparent text-white hover:bg-white hover:text-black transition-all"
            >
              {t('login')}
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
