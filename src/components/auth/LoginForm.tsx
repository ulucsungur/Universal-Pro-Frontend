import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      window.location.href = '/'; // Başarılıysa ana sayfaya
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-red-500 text-xs font-bold text-center italic">
          {error}
        </p>
      )}
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">
          E-Posta
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-4 bg-slate-800 border border-white/5 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none transition-all"
          placeholder="eposta@adresiniz.com"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">
          Şifre
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 bg-slate-800 border border-white/5 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none transition-all"
          placeholder="••••••••"
        />
      </div>
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-600/20 transition-all active:scale-95 uppercase text-xs tracking-widest">
        Giriş Yap
      </button>
    </form>
  );
};
