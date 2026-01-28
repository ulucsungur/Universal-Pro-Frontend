import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, PlusCircle } from 'lucide-react'; // PlusCircle ikonu eklendi
import { SubNavbar } from './SubNavbar';

export const Navbar = () => {
  const { user, logout } = useAuth();

  // 🚀 YETKİ KONTROLÜ: Sadece admin ve agent olanlar görebilir
  const isAuthorized = user?.role === 'admin' || user?.role === 'agent';

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
          {/* 🚀 İLAN VER BUTONU (SADECE YETKİLİLERE) */}
          {isAuthorized && (
            <Link
              to="/add-listing"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95 no-underline"
            >
              <PlusCircle size={16} />
              İlan Ver
            </Link>
          )}

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
                Çıkış
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all text-white no-underline"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </header>

      <SubNavbar />
    </>
  );
};
