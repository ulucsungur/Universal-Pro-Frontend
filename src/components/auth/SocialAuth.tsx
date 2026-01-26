import { Github } from 'lucide-react';

export const SocialAuth = () => {
  const handleSocialLogin = (provider: 'github' | 'google') => {
    // Backend'e yönlendiriyoruz. Kontrol %100 Backend'de.
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => handleSocialLogin('google')}
        className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-2xl transition-all font-bold text-xs uppercase"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          className="w-4 h-4"
          alt="Google"
        />
        Google
      </button>
      <button
        onClick={() => handleSocialLogin('github')}
        className="flex items-center justify-center gap-2 p-3 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-2xl transition-all font-bold text-xs uppercase"
      >
        <Github size={18} />
        GitHub
      </button>
    </div>
  );
};
