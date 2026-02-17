import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Edit3,
  Trash2,
  Eye,
  Plus,
  BookOpen,
  Lock,
  Globe,
  Loader2,
  BarChart2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Blog } from '../../../types/auth';

export default function ManageBlogsPage() {
  const { t, i18n } = useTranslation();
  const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const isTr = i18n.language.startsWith('tr');

  const fetchMyBlogs = useCallback(async () => {
    try {
      const res = await axios.get<Blog[]>('http://localhost:5000/api/my-blogs');
      setMyBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyBlogs();
  }, [fetchMyBlogs]);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        t('confirm_delete') || 'Bu yazıyı silmek istiyor musunuz?',
      )
    )
      return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      setMyBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-10">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
              {t('manage_my_blogs') || 'BLOGLARIMI YÖNET'}
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 italic flex items-center gap-2">
              <BookOpen size={14} className="text-purple-600" />{' '}
              {myBlogs.length} {t('total_posts') || 'İÇERİK YAYINDA'}
            </p>
          </div>
          <Link
            to="/admin/add-blog"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl shadow-purple-500/20 no-underline transition-all active:scale-95"
          >
            <Plus size={18} /> {t('add_blog_menu') || 'YENİ YAZI EKLE'}
          </Link>
        </div>

        {/* BLOG LİSTESİ */}
        <div className="grid gap-6">
          {myBlogs.length === 0 ? (
            <div className="bg-white dark:bg-[#0f172a] p-20 rounded-[40px] text-center border border-dashed border-slate-200 dark:border-white/10">
              <p className="text-slate-500 font-black uppercase tracking-widest italic">
                Henüz bir yazı yayınlamadınız.
              </p>
            </div>
          ) : (
            myBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white dark:bg-[#0f172a] p-6 rounded-4xl border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all group"
              >
                {/* GÖRSEL */}
                <div className="w-full md:w-32 h-32 shrink-0 rounded-3xl overflow-hidden shadow-lg relative">
                  <img
                    src={blog.imageUrl || 'https://placehold.co/400'}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link to={`/blog/${blog.id}`} className="text-white">
                      <Eye size={24} />
                    </Link>
                  </div>
                </div>

                {/* BİLGİLER */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className="bg-purple-600/10 text-purple-600 text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">
                      {isTr ? blog.category?.titleTr : blog.category?.titleEn}
                    </span>
                    {blog.isPrivate === 'true' ? (
                      <Lock size={12} className="text-amber-500" />
                    ) : (
                      <Globe size={12} className="text-blue-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-black dark:text-white uppercase italic leading-tight group-hover:text-purple-500 transition-colors line-clamp-1">
                    {blog.title}
                  </h3>

                  {/* OKUNMA SAYISI ROZETİ */}
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                      <BarChart2 size={12} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-500">
                        {blog.viewCount || 0} {t('reads') || 'OKUNMA'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AKSİYONLAR */}
                <div className="flex gap-2">
                  <Link
                    to={`/admin/edit-blog/${blog.id}`}
                    className="p-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="p-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer border-none"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// // frontend/src/pages/blog/manage-blog/page.tsx

// import { useEffect, useState, useCallback } from 'react';
// import axios from 'axios';
// import { useTranslation } from 'react-i18next';
// import {
//   Edit3,
//   Trash2,
//   Eye,
//   Plus,
//   BookOpen,
//   Lock,
//   Globe,
//   Loader2,
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import type { Blog } from '../../../types/auth';

// export default function ManageBlogsPage() {
//   const { t, i18n } = useTranslation();
//   const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const isTr = i18n.language.startsWith('tr');

//   const fetchMyBlogs = useCallback(async () => {
//     try {
//       const res = await axios.get<Blog[]>('http://localhost:5000/api/blogs');
//       // Filtreleme: Sadece benim yazdıklarım (veya backend'de /api/my-blogs rotası da açılabilir)
//       // Şimdilik gelen listeden authorId eşleşmesi yapıyoruz
//       setMyBlogs(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMyBlogs();
//   }, [fetchMyBlogs]);

//   const handleDelete = async (id: number) => {
//     if (
//       !window.confirm(
//         t('confirm_delete') || 'Bu yazıyı silmek istediğinize emin misiniz?',
//       )
//     )
//       return;
//     try {
//       await axios.delete(`http://localhost:5000/api/blogs/${id}`);
//       setMyBlogs((prev) => prev.filter((b) => b.id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#020617]">
//         <Loader2 className="animate-spin text-purple-600" size={40} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20">
//       <div className="max-w-6xl mx-auto space-y-10">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 dark:border-white/5 pb-10">
//           <div>
//             <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
//               {t('manage_my_blogs') || 'BLOG YÖNETİMİ'}
//             </h1>
//             <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 italic flex items-center gap-2">
//               <BookOpen size={14} className="text-purple-600" /> TOPLAM{' '}
//               {myBlogs.length} İÇERİK
//             </p>
//           </div>
//           <Link
//             to="/admin/add-blog"
//             className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl no-underline transition-all active:scale-95"
//           >
//             <Plus size={18} /> {t('new_blog_post') || 'YENİ YAZI EKLE'}
//           </Link>
//         </div>

//         <div className="grid gap-6">
//           {myBlogs.length === 0 ? (
//             <div className="bg-white dark:bg-[#0f172a] p-20 rounded-[40px] text-center border border-dashed border-slate-200 dark:border-white/10">
//               <p className="text-slate-500 font-black uppercase tracking-widest italic">
//                 Henüz yazı yayınlamadınız.
//               </p>
//             </div>
//           ) : (
//             myBlogs.map((blog) => (
//               <div
//                 key={blog.id}
//                 className="bg-white dark:bg-[#0f172a] p-6 rounded-4xl border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-all group"
//               >
//                 <div className="w-full md:w-32 h-32 shrink-0 rounded-3xl overflow-hidden shadow-lg">
//                   <img
//                     src={
//                       blog.imageUrl ||
//                       'https://placehold.co/400x400/0f172a/purple?text=Blog'
//                     }
//                     className="w-full h-full object-cover"
//                     alt=""
//                   />
//                 </div>

//                 <div className="flex-1 space-y-2 text-center md:text-left">
//                   <div className="flex items-center justify-center md:justify-start gap-3">
//                     <span className="bg-purple-600/10 text-purple-600 text-[8px] font-black px-2 py-1 rounded uppercase">
//                       {isTr ? blog.category?.titleTr : blog.category?.titleEn}
//                     </span>
//                     {blog.isPrivate === 'true' ? (
//                       <Lock size={12} className="text-amber-500" />
//                     ) : (
//                       <Globe size={12} className="text-blue-500" />
//                     )}
//                   </div>
//                   <h3 className="text-lg font-black dark:text-white uppercase italic leading-tight group-hover:text-purple-600 transition-colors">
//                     {blog.title}
//                   </h3>
//                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider italic">
//                     {new Date(blog.createdAt).toLocaleDateString()} tarihinde
//                     yayınlandı
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   <Link
//                     to={`/blog/${blog.id}`}
//                     className="p-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
//                   >
//                     <Eye size={18} />
//                   </Link>
//                   <Link
//                     to={`/admin/edit-blog/${blog.id}`}
//                     className="p-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-sm"
//                   >
//                     <Edit3 size={18} />
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(blog.id)}
//                     className="p-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer border-none"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
