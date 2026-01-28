import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // Hata yakalamak için

import { AuthLayout } from '../../components/auth/AuthLayout';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post<{ message: string }>(
        'http://localhost:5000/api/auth/register',
        { fullName, email, password },
      ); // Type ekledik
      navigate('/login?message=registered');
    } catch (err: unknown) {
      // 🚀 Hatayı yakaladık ve tipini belirttik
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.error || 'Kayıt sırasında bir hata oluştu.',
        );
      } else {
        setError('Bilinmeyen bir hata oluştu.'); // Bilinmeyen durumlara karşı
      }
    }
  };

  return (
    <AuthLayout title="KAYIT OL" subtitle="Evrensel Pazara Katıl">
      {/*  Sosyal Giriş Butonları  */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black">
          <span className="bg-[#0f172a] px-4 text-slate-500 tracking-widest">
            Veya E-Posta ile
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-red-500 text-xs font-bold text-center italic">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">
            Tam İsim
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full p-4 bg-slate-800 border border-white/5 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none transition-all text-white"
            placeholder="Örn: John Doe"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">
            E-Posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 bg-slate-800 border border-white/5 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none transition-all text-white"
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
            className="w-full p-4 bg-slate-800 border border-white/5 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none transition-all text-white"
            placeholder="••••••••"
          />
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 uppercase text-xs tracking-widest">
          Hesap Oluştur
        </button>
      </form>

      <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6">
        Zaten hesabın var mı?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Giriş Yap
        </Link>
      </p>
    </AuthLayout>
  );
}
