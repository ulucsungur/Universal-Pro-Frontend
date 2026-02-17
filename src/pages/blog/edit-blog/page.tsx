import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import {
  Save,
  LayoutGrid,
  Loader2,
  ArrowLeft,
  Camera,
  Globe,
  Lock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Blog, Category } from '../../../types/auth';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPrivate, setIsPrivate] = useState('false');
  const [preview, setPreview] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          axios.get<Blog>(`http://localhost:5000/api/blogs/${id}`),
          axios.get<Category[]>(
            'http://localhost:5000/api/categories?topOnly=true',
          ),
        ]);

        setTitle(blogRes.data.title);
        setContent(blogRes.data.content);
        setCategoryId(blogRes.data.categoryId?.toString() || '');
        setIsPrivate(blogRes.data.isPrivate);
        setPreview(blogRes.data.imageUrl || '');
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categoryId);
    formData.append('isPrivate', isPrivate);
    if (image) formData.append('image', image);

    try {
      await axios.patch(`http://localhost:5000/api/blogs/${id}`, formData);
      // 🚀 REDIRECT FİX: Doğru rotaya yönlendirme mühürlendi
      navigate('/admin/my-blogs');
    } catch (err) {
      console.error(err);
      alert('Hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 mb-8 hover:text-purple-600 transition-all uppercase text-[10px] font-black tracking-widest border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} /> {t('back')}
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-amber-500 rounded-2xl shadow-lg text-white">
            <LayoutGrid size={24} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            {t('edit_blog_title') || 'YAZIYI DÜZENLE'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
            <div className="aspect-video rounded-3xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative flex items-center justify-center group cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Blog Preview"
                />
              ) : (
                <Camera size={40} className="text-slate-300" />
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 🚀 DARK MODE FİX: text-slate-900 dark:text-white eklendi */}
            <input
              placeholder="Yazı Başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 p-5 rounded-2xl outline-none text-slate-900 dark:text-white font-bold focus:border-purple-600 transition-all"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 p-5 rounded-2xl outline-none text-slate-900 dark:text-white font-bold focus:border-purple-600 transition-all"
            >
              <option value="">{t('select_category')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titleTr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsPrivate('false')}
              className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${isPrivate === 'false' ? 'border-purple-600 bg-purple-600/5 text-purple-600' : 'border-slate-100 dark:border-white/5 text-slate-400'}`}
            >
              <Globe size={14} /> {t('public_blog')}
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate('true')}
              className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${isPrivate === 'true' ? 'border-amber-500 bg-amber-500/5 text-amber-500' : 'border-slate-100 dark:border-white/5 text-slate-400'}`}
            >
              <Lock size={14} /> {t('private_blog')}
            </button>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-2xl min-h-[400px]">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-[300px] text-slate-900"
            />
          </div>

          <button
            disabled={saving}
            className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl text-white font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
          >
            {saving ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Save size={18} /> {t('save_changes')}
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';
// import axios from 'axios';
// import {
//   Save,
//   LayoutGrid,
//   Loader2,
//   ArrowLeft,
//   Camera,
//   Globe,
//   Lock,
// } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
// import type { Blog, Category } from '../../../types/auth';

// export default function EditBlogPage() {
//   const { id } = useParams<{ id: string }>();
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   // State'ler
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [categoryId, setCategoryId] = useState('');
//   const [isPrivate, setIsPrivate] = useState('false');
//   const [preview, setPreview] = useState('');
//   const [image, setImage] = useState<File | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const modules = {
//     toolbar: [
//       [{ header: [1, 2, 3, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ list: 'ordered' }, { list: 'bullet' }],
//       ['link', 'clean'],
//     ],
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [blogRes, catRes] = await Promise.all([
//           axios.get<Blog>(`http://localhost:5000/api/blogs/${id}`),
//           axios.get<Category[]>(
//             'http://localhost:5000/api/categories?topOnly=true',
//           ),
//         ]);

//         setTitle(blogRes.data.title);
//         setContent(blogRes.data.content);
//         setCategoryId(blogRes.data.categoryId?.toString() || '');
//         setIsPrivate(blogRes.data.isPrivate);
//         setPreview(blogRes.data.imageUrl || '');
//         setCategories(catRes.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('content', content);
//     formData.append('categoryId', categoryId);
//     formData.append('isPrivate', isPrivate);
//     if (image) formData.append('image', image);

//     try {
//       await axios.patch(`http://localhost:5000/api/blogs/${id}`, formData);
//       navigate('/admin/manage-blogs');
//     } catch (err) {
//       console.error(err);
//       alert('Hata oluştu');
//     } finally {
//       setSaving(false);
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
//       <div className="max-w-4xl mx-auto">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-slate-500 mb-8 hover:text-purple-600 transition-all uppercase text-[10px] font-black tracking-widest border-none bg-transparent cursor-pointer"
//         >
//           <ArrowLeft size={16} /> {t('back')}
//         </button>

//         <div className="flex items-center gap-4 mb-12">
//           <div className="p-4 bg-amber-500 rounded-2xl shadow-lg text-white">
//             <LayoutGrid size={24} />
//           </div>
//           <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic">
//             {t('edit_blog_title') || 'YAZIYI DÜZENLE'}
//           </h1>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* GÖRSEL */}
//           <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
//             <div className="aspect-video rounded-3xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative flex items-center justify-center group cursor-pointer">
//               {preview ? (
//                 <img src={preview} className="w-full h-full object-cover" />
//               ) : (
//                 <Camera size={40} className="text-slate-300" />
//               )}
//               <input
//                 type="file"
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) {
//                     setImage(file);
//                     setPreview(URL.createObjectURL(file));
//                   }
//                 }}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               placeholder="Başlık"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 p-5 rounded-2xl outline-none text-white font-bold"
//             />
//             <select
//               value={categoryId}
//               onChange={(e) => setCategoryId(e.target.value)}
//               className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 p-5 rounded-2xl outline-none text-white font-bold"
//             >
//               <option value="">Kategori Seçin</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.titleTr}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex gap-4">
//             <button
//               type="button"
//               onClick={() => setIsPrivate('false')}
//               className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase transition-all ${isPrivate === 'false' ? 'border-purple-600 bg-purple-600/5 text-purple-600' : 'border-slate-100 dark:border-white/5 text-slate-400'}`}
//             >
//               <Globe size={14} /> Herkese Açık
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsPrivate('true')}
//               className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase transition-all ${isPrivate === 'true' ? 'border-amber-500 bg-amber-500/5 text-amber-500' : 'border-slate-100 dark:border-white/5 text-slate-400'}`}
//             >
//               <Lock size={14} /> Sadece Admin/Agent
//             </button>
//           </div>

//           <div className="bg-white p-4 rounded-3xl shadow-2xl min-h-100">
//             <ReactQuill
//               theme="snow"
//               value={content}
//               onChange={setContent}
//               modules={modules}
//               className="h-75 text-slate-900"
//             />
//           </div>

//           <button
//             disabled={saving}
//             className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl text-white font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
//           >
//             {saving ? (
//               <Loader2 className="animate-spin mx-auto" />
//             ) : (
//               <div className="flex items-center justify-center gap-2">
//                 <Save size={18} />{' '}
//                 {t('save_changes') || 'DEĞİŞİKLİKLERİ KAYDET'}
//               </div>
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
// );
//}
