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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617]">
      <div className="w-full max-w-md space-y-8 bg-[#0f172a] p-10 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
            {title}
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
