import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-white/5 flex items-center px-10 justify-between sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-50">
      <Link
        to="/"
        className="text-xl font-black italic uppercase tracking-tighter text-white no-underline"
      >
        UNIVERSAL<span className="text-purple-600">MARKET</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase text-purple-400">
            {user.fullName}
          </span>
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              className="w-8 h-8 rounded-full border border-purple-600 object-cover"
              alt="profil"
              referrerPolicy="no-referrer" // 👈 BU SATIRI EKLE (Google resimleri için ŞART)
            />
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="text-[10px] font-black uppercase tracking-widest border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all text-white no-underline"
        >
          Giriş Yap
        </Link>
      )}
    </header>
  );
};
