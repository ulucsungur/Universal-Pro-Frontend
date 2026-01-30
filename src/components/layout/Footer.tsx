import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  ShieldCheck,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0f172a] border-t border-white/5 pt-20 pb-10 mt-20">
      <div className="max-w-350 mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* LOGO VE MİSYON */}
          <div className="space-y-6">
            <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
              UNIVERSAL<span className="text-purple-600">MARKET</span>
            </span>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Dünyanın en güvenli ve hızlı ilan platformu. Vasıta, emlak ve
              teknoloji dünyasında yeni nesil alışveriş deneyimi.
            </p>
            <div className="flex gap-4">
              {/* Not: Marka ikonları deprecation uyarısı verebilir, çalışmaya engel değildir. */}
              <Facebook
                size={18}
                className="text-slate-500 hover:text-white cursor-pointer transition-all"
              />
              <Twitter
                size={18}
                className="text-slate-500 hover:text-white cursor-pointer transition-all"
              />
              <Instagram
                size={18}
                className="text-slate-500 hover:text-white cursor-pointer transition-all"
              />
              <Linkedin
                size={18}
                className="text-slate-500 hover:text-white cursor-pointer transition-all"
              />
            </div>
          </div>

          {/* KATEGORİLER */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">
              Popüler Kategoriler
            </h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium list-none p-0">
              <li className="hover:text-purple-500 cursor-pointer transition-all">
                Vasıta
              </li>
              <li className="hover:text-purple-500 cursor-pointer transition-all">
                Emlak
              </li>
              <li className="hover:text-purple-500 cursor-pointer transition-all">
                Elektronik
              </li>
              <li className="hover:text-purple-500 cursor-pointer transition-all">
                Moda & Aksesuar
              </li>
            </ul>
          </div>

          {/* KURUMSAL */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">
              Kurumsal
            </h4>
            <ul className="space-y-4 text-sm text-slate-400 font-medium list-none p-0">
              <li className="hover:text-purple-500 cursor-pointer transition-all">
                Hakkımızda
              </li>
              <li className="hover:text-purple-500 cursor-pointer transition-all">
                Kullanım Koşulları
              </li>
              <li className="hover:text-purple-500 cursor-pointer transition-all">
                Güvenli Alışveriş
              </li>
              <li className="hover:text-purple-500 cursor-pointer transition-all">
                İletişim
              </li>
            </ul>
          </div>

          {/* GÜVENLİK MERKEZİ */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white italic">
              Güvenlik Merkezi
            </h4>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-3 text-green-500">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  SSL Korumalı
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase">
                Tüm işlemleriniz 256-bit şifreleme ile mühürlenmektedir.
              </p>
            </div>
          </div>
        </div>

        {/* ALT ŞERİT */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            © 2026 Universal Market Pro. Built by Google Standards.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-white transition-all">
              <Globe size={14} /> Türkçe (TR)
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              ₺ TRY
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
