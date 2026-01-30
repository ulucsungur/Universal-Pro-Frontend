import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../types/auth';

export const CategoryForm = () => {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language.startsWith('tr');

  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get<Category[]>('http://localhost:5000/api/categories?topOnly=true')
      .then((res) => setMainCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('titleTr', titleTr);
    formData.append('titleEn', titleEn);
    formData.append('slug', slug);
    if (parentId) formData.append('parentId', parentId);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/categories', formData);
      alert(t('success') || 'Başarılı!');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* BAŞLIKLAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-purple-600 italic ml-2">
            {t('cat_name_tr')}
          </label>
          <input
            value={titleTr}
            onChange={(e) => setTitleTr(e.target.value)}
            required
            className="w-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-slate-900 dark:text-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-purple-600 italic ml-2">
            {t('cat_name_en')}
          </label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            required
            className="w-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-slate-900 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* SLUG VE ÜST KATEGORİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 italic ml-2">
            {t('slug_label')}
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-slate-900 dark:text-white transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 italic ml-2">
            {t('parent_label')}
          </label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none cursor-pointer text-slate-900 dark:text-white font-bold"
          >
            <option value="">{t('main_cat_option')}</option>
            {mainCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {isTr ? cat.titleTr : cat.titleEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GÖRSEL SEÇME */}
      <div className="space-y-2">
        <div className="aspect-21/9 rounded-4xl bg-slate-100 dark:bg-[#020617] border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative flex items-center justify-center hover:border-purple-500 transition-all group">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Önizleme"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Camera
                size={32}
                className="text-slate-400 dark:text-slate-700"
              />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('select_img_msg')}
              </span>
            </div>
          )}
          <input
            type="file"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] text-white shadow-xl transition-all active:scale-95 disabled:opacity-30"
      >
        {isSubmitting ? t('loading') : t('create_cat_btn')}
      </button>
    </form>
  );
};
