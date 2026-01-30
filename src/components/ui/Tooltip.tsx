import type { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

export const Tooltip = ({ children, text }: TooltipProps) => {
  return (
    <div className="group relative flex flex-col items-center">
      {children}

      {/* 🚀 TOOLTIP ETİKETİ: Üzerine gelince (group-hover) görünür */}
      <div className="absolute top-full mt-2 flex flex-col items-center hidden group-hover:flex animate-in fade-in zoom-in duration-200 z-50">
        {/* Küçük ok işareti */}
        <div className="w-3 h-3 bg-slate-800 dark:bg-purple-600 rotate-45 -mb-1.5" />

        {/* Metin kutusu */}
        <div className="bg-slate-800 dark:bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
          {text}
        </div>
      </div>
    </div>
  );
};
