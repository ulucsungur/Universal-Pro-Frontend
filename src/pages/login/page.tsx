import { AuthLayout } from '../../components/auth/AuthLayout';
import { SocialAuth } from '../../components/auth/SocialAuth';
import { LoginForm } from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <AuthLayout title="GİRİŞ YAP" subtitle="Universal Market Pro">
      <SocialAuth />
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black">
          <span className="bg-[#0f172a] px-4 text-slate-500 tracking-widest">
            Veya E-Posta
          </span>
        </div>
      </div>
      <LoginForm />
      <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6">
        Hesabın yok mu?{' '}
        <Link to="/register" className="text-purple-600 hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </AuthLayout>
  );
}
