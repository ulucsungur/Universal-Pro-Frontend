import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { Camera, Send, Link as LinkIcon } from 'lucide-react';
import { AuthLayout } from '../../../components/auth/AuthLayout';

export default function AddBannerPage() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image) return alert('Lütfen bir kampanya görseli seçin!');

    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/banners', data);
      alert('Kampanya başarıyla yayına alındı!');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Yükleme sırasında hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="KAMPANYA" subtitle="Amazon Stili Hero Yönetimi">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GÖRSEL SEÇİMİ */}
        <div className="aspect-21/9 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 overflow-hidden relative flex items-center justify-center hover:border-purple-500 transition-all">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Önizleme"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Camera size={32} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Görsel Seç (1920x600 önerilir)
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

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Başlık (TR)"
            onChange={(e) =>
              setFormData({ ...formData, titleTr: e.target.value })
            }
            className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-sm"
            required
          />
          <input
            placeholder="Title (EN)"
            onChange={(e) =>
              setFormData({ ...formData, titleEn: e.target.value })
            }
            className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-sm"
            required
          />
        </div>

        <div className="relative">
          <LinkIcon
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            placeholder="Tıklanınca Gidilecek Link (Örn: /category/vehicle)"
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3"
        >
          <Send size={16} />
          {isSubmitting ? 'UÇAĞA YÜKLENİYOR...' : 'KAMPANYAYI BAŞLAT'}
        </button>
      </form>
    </AuthLayout>
  );
}
