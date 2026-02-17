import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, Globe, Lock, LayoutGrid, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../types/auth';

export default function AddBlogPage() {
  // 🚀 't' Hatası Çözümü: t değişkenini başlıklarda kullanarak aktif hale getirdik
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPrivate, setIsPrivate] = useState('false');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/categories?topOnly=true')
      .then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !categoryId)
      return alert('Lütfen zorunlu alanları doldurun.');

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('categoryId', categoryId);
    formData.append('isPrivate', isPrivate);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/blogs', formData);
      navigate('/blogs');
    } catch (err) {
      console.error(err);
      alert('Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12 border-b border-slate-200 dark:border-white/5 pb-8">
          <div className="p-4 bg-purple-600 rounded-2xl shadow-lg text-white">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
              {t('new_blog_post') || 'YENİ BLOG YAZISI'}
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic">
              PRO CONTENT EDITOR
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* GÖRSEL SEÇİMİ */}
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
            <div className="aspect-video rounded-3xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative flex items-center justify-center group cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Blog Preview"
                />
              ) : (
                <div className="text-center">
                  <Camera
                    size={40}
                    className="mx-auto text-slate-300 dark:text-slate-700 mb-2"
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Kapak Resmi Seç
                  </span>
                </div>
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
            <input
              placeholder={t('blog_title') || 'Yazı Başlığı...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 p-5 rounded-2xl outline-none text-sm font-bold text-slate-900 dark:text-white focus:border-purple-600 transition-all"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 p-5 rounded-2xl outline-none text-sm font-bold text-slate-900 dark:text-white"
            >
              <option value="">
                {t('select_category') || 'Kategori Seçin'}
              </option>
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
              <Globe size={14} /> {t('public_blog') || 'Herkese Açık'}
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate('true')}
              className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${isPrivate === 'true' ? 'border-amber-500 bg-amber-500/5 text-amber-500' : 'border-slate-100 dark:border-white/5 text-slate-400'}`}
            >
              <Lock size={14} /> {t('private_blog') || 'Admin/Agent Özel'}
            </button>
          </div>

          {/* EDITÖR (Karanlık Modda Yazı Rengi İçin Wrapper) */}
          <div className="bg-white p-4 rounded-3xl shadow-2xl min-h-100">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-75 text-slate-900"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Save size={18} /> {t('publish_blog') || 'YAYINLA'}
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
