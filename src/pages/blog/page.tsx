import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  User,
  ChevronRight,
  Lock,
  BookOpen,
  Loader2,
  Clock,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { Blog, Category } from '../../types/auth';

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const isTr = i18n.language.startsWith('tr');

  // 🚀 KELİME YAPIŞMASI FİX: Paragrafları ve satır başlarını boşluğa çevirir
  const stripHtmlForPreview = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html
      .replace(/<p>/g, ' ')
      .replace(/<\/p>/g, ' ')
      .replace(/<br\s*\/?>/g, ' ');
    const text = tmp.textContent || tmp.innerText || '';
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  const fetchData = useCallback(async () => {
    try {
      const [bRes, cRes] = await Promise.all([
        axios.get<Blog[]>('http://localhost:5000/api/blogs'),
        axios.get<Category[]>(
          'http://localhost:5000/api/categories?topOnly=true',
        ),
      ]);
      setBlogs(bRes.data);
      setCategories(cRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const visibleBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const isAuthorized =
        b.isPrivate === 'false' ||
        user?.role === 'admin' ||
        user?.role === 'agent';
      const matchesCat = selectedCat ? b.categoryId === selectedCat : true;
      return isAuthorized && matchesCat;
    });
  }, [blogs, selectedCat, user]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-350 mx-auto">
        {/* 🚀 ANA YAPI: GRID YERİNE FLEX KULLANARAK ÇAKIŞMAYI BİTİRDİK */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* SOL TARAF: BLOG LİSTESİ (Esnek Alan) */}
          <div className="flex-1 w-full space-y-12">
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white border-l-8 border-purple-600 pl-6">
              {t('platform_blog_title') || 'PLATFORM BLOG'}
            </h1>

            <div className="flex flex-col gap-8">
              {visibleBlogs.map((blog) => (
                <Link
                  to={`/blog/${blog.id}`}
                  key={blog.id}
                  className="group bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all no-underline flex flex-col md:flex-row gap-8"
                >
                  {/* RESİM */}
                  <div className="w-full md:w-64 h-48 shrink-0 rounded-4xl overflow-hidden bg-slate-100 dark:bg-white/5">
                    <img
                      src={
                        blog.imageUrl ||
                        'https://placehold.co/600x400/0f172a/9333ea?text=Blog'
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt=""
                    />
                  </div>

                  {/* İÇERİK */}
                  <div className="flex flex-col justify-between py-2 grow overflow-hidden">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-purple-600/10 text-purple-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">
                          {isTr
                            ? blog.category?.titleTr
                            : blog.category?.titleEn}
                        </span>
                        {blog.isPrivate === 'true' && (
                          <span title={t('private_content')}>
                            <Lock size={12} className="text-amber-500" />
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic leading-tight group-hover:text-purple-500 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium line-clamp-3 wrap-break-word">
                        {stripHtmlForPreview(blog.content)}
                      </p>
                    </div>

                    {/* ALT BİLGİ */}
                    <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-slate-50 dark:border-white/5 text-[10px] font-bold text-slate-400 uppercase">
                      <span className="flex items-center gap-1">
                        <User size={14} className="text-purple-500" />{' '}
                        {blog.author?.fullName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-blue-500" />{' '}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock
                          size={14}
                          className="text-slate-400 opacity-60"
                        />{' '}
                        {new Date(blog.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {visibleBlogs.length === 0 && (
                <div className="p-20 text-center bg-white dark:bg-[#0f172a] rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                  <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500 font-black uppercase italic">
                    Bu kategoride henüz yazı bulunmuyor.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 🚀 SAĞ TARAF: KATEGORİ SİDEBAR (Sabit Genişlik ve Sticky) */}
          <aside className="w-full lg:w-95 shrink-0 lg:sticky lg:top-32">
            <div className="bg-white dark:bg-[#0f172a] p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-600/10 rounded-lg">
                  <BookOpen size={20} className="text-purple-600" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white italic">
                  {t('blog_categories') || 'BLOG CATEGORIES'}
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCat(null)}
                  className={`w-full text-left p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-none cursor-pointer ${!selectedCat ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/30 translate-x-2' : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-white/10'}`}
                >
                  {t('all_posts') || 'ALL POSTS'}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-none cursor-pointer ${selectedCat === cat.id ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/30 translate-x-2' : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:bg-white/10 group'}`}
                  >
                    {isTr ? cat.titleTr : cat.titleEn}
                    <ChevronRight
                      size={14}
                      className={
                        selectedCat === cat.id
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100 transition-all'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
