import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, Send, Link as LinkIcon, Type } from 'lucide-react';
import { AuthLayout } from '../../../components/auth/AuthLayout';
import { useTranslation } from 'react-i18next';

export default function AddBannerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    titleTr: '',
    titleEn: '',
    subtitleTr: '',
    subtitleEn: '',
    link: '',
    order: '0',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image) return alert(t('select_img_msg'));

    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/banners', data);
      alert(t('success') || 'Kampanya Yayında!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-20 transition-colors duration-500 bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
      <AuthLayout
        title={t('admin_banner_title')}
        subtitle={t('admin_banner_subtitle')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GÖRSEL SEÇME ALANI */}
          <div className="space-y-2">
            <div className="aspect-21/9 rounded-4xl bg-slate-100 dark:bg-[#020617] border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative flex items-center justify-center hover:border-purple-500 transition-all group">
              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="Banner Preview"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Camera
                    size={32}
                    className="text-slate-400 dark:text-slate-700"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {t('select_banner_msg')}
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

          {/* BAŞLIKLAR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-purple-600 ml-2 italic">
                {t('banner_name_tr')}
              </label>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, titleTr: e.target.value })
                }
                required
                className="w-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-purple-600 ml-2 italic">
                {t('banner_name_en')}
              </label>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
                required
                className="w-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          {/* ALT BAŞLIKLAR VE LİNK */}
          <div className="space-y-4">
            <div className="relative">
              <Type
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder={t('subtitle_label')}
                onChange={(e) =>
                  setFormData({ ...formData, subtitleTr: e.target.value })
                }
                className="w-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-purple-600 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div className="relative">
              <LinkIcon
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder={t('link_label')}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full bg-slate-100 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-purple-600 text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] text-white shadow-xl transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
          >
            <Send size={16} />
            {isSubmitting ? t('loading') : t('create_banner_btn')}
          </button>
        </form>
      </AuthLayout>
    </div>
  );
}
