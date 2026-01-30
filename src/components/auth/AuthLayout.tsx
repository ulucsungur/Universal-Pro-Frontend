import type { ReactNode } from 'react';

export const AuthLayout = ({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) => {
  return (
    // 🚀 FIXED: bg-[#020617] silindi. Artık arka plan sayfanın kendisine bağlı.
    <div className="w-full flex items-center justify-center p-4">
      {/* 🚀 KUTU RENGİ: bg-white (Gündüz) / dark:bg-[#0f172a] (Gece) */}
      <div className="w-full max-w-2xl space-y-8 bg-white dark:bg-[#0f172a] p-8 md:p-12 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl transition-colors duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">
            {title}
          </h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
