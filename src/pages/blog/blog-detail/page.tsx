// frontend/src/pages/blog-detail/page.tsx

import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  User,
  ArrowLeft,
  Loader2,
  Clock,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import type { Blog } from '../../../types/auth';
import DOMPurify from 'dompurify';
import { useAuth } from '../../../hooks/useAuth';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const hasIncremented = useRef(false);

  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const res = await axios.get<Blog>(
          `http://localhost:5000/api/blogs/${id}`,
        );
        const fetchedBlog = res.data;
        setBlog(fetchedBlog);

        // 🚀 SAYAÇ MANTIĞI BURADA BAŞLIYOR
        if (!hasIncremented.current) {
          hasIncremented.current = true; // StrictMode çift çalışmayı engeller

          const viewedKey = `v_b_${id}`;
          const alreadyViewed = localStorage.getItem(viewedKey);

          // 1. Eğer yazar DEĞİLSEN
          // 2. Ve bu tarayıcıda daha önce SAYILMAMIŞSA
          const isAuthor = user?.id === fetchedBlog.authorId;

          if (!isAuthor && !alreadyViewed) {
            console.log('📈 Gerçek okuma saptandı, sayaç artırılıyor...');
            await axios.post(`http://localhost:5000/api/blogs/${id}/view`);
            localStorage.setItem(viewedKey, 'true');
          } else {
            console.log(
              '🛡️ Sayaç pas geçildi (Sebep: Yazar veya zaten okundu)',
            );
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, user?.id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-[#020617]">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">
          {t('blog_not_found') || 'YAZI BULUNAMADI'}
        </h2>
        <Link
          to="/blogs"
          className="mt-6 text-purple-600 font-bold hover:underline uppercase text-xs tracking-widest no-underline"
        >
          {t('back_to_blogs') || 'BLOG LİSTESİNE DÖN'}
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-20 transition-colors duration-500">
      {/* 🚀 HERO BÖLÜMÜ: Dev Görsel ve Başlık */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={blog.imageUrl || 'https://via.placeholder.com/1920x1080'}
          className="w-full h-full object-cover"
          alt={blog.title}
        />
        {/* Görsel Üzeri Karartma (Overlay) */}
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-[#020617]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full py-20">
          <div className="max-w-5xl mx-auto px-6 space-y-8">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-all no-underline text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <ArrowLeft size={16} className="text-purple-500" />{' '}
              {t('back_to_blogs') || 'GERİ DÖN'}
            </Link>

            <div className="space-y-4">
              <span className="px-4 py-1.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xl shadow-purple-600/20">
                {isTr ? blog.category?.titleTr : blog.category?.titleEn}
              </span>
              <h1 className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.95]">
                {blog.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-white/60 text-[11px] font-black uppercase tracking-widest pt-4 border-t border-white/10 w-fit">
              <div className="flex items-center gap-2">
                <User size={16} className="text-purple-400" />{' '}
                {blog.author?.fullName}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />{' '}
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-400" />{' '}
                {new Date(blog.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 İÇERİK BÖLÜMÜ */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        <div className="bg-white dark:bg-[#0f172a] p-8 md:p-20 rounded-[4rem] shadow-3xl border border-slate-100 dark:border-white/5">
          {/* RichText İçeriği (Hatasız ve Güvenli) */}
          <div
            className="prose prose-lg dark:prose-invert prose-purple max-w-full text-slate-600 dark:text-slate-300 leading-relaxed font-medium wrap-break-word overflow-hidden"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content),
            }}
          />

          {/* 🚀 ALT BİLGİ VE ETİKETLER */}
          <div className="mt-20 pt-10 border-t border-slate-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/10 text-slate-400">
              <Tag size={14} className="text-purple-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isTr ? blog.category?.titleTr : blog.category?.titleEn}
              </span>
            </div>

            <div className="flex items-center gap-3 italic text-[10px] text-slate-500 uppercase font-bold bg-slate-50 dark:bg-white/5 px-6 py-3 rounded-2xl">
              <ShieldCheck size={14} className="text-blue-500" />
              {t('last_update') || 'SON DÜZENLEME'}:{' '}
              {new Date(blog.updatedAt).toLocaleString()} -{' '}
              {blog.author?.fullName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
