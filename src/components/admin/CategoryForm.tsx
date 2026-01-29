import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react'; // Kullanılmayanlar silindi
import type { Category } from '../../types/auth';

export const CategoryForm = () => {
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
      .catch((err) => console.error('Kategori yükleme hatası:', err));
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
      alert('Kategori Başarıyla Oluşturuldu!');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          value={titleTr}
          onChange={(e) => setTitleTr(e.target.value)}
          required
          placeholder="Kategori Adı (TR)"
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-purple-600 outline-none text-sm"
        />
        <input
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          required
          placeholder="Category Name (EN)"
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-purple-600 outline-none text-sm"
        />
      </div>

      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
        placeholder="URL Linki (örn: vasita-otomobil)"
        className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-purple-600 outline-none text-sm"
      />

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-500 ml-2 italic">
          Bağlı Olduğu Üst Kategori
        </label>
        <select
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-sm text-slate-300"
        >
          <option value="">Üst Kategori Yok (Ana Kategori)</option>
          {mainCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.titleTr}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-500 ml-2 italic">
          Kategori Görseli
        </label>
        <div className="aspect-16/9 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 overflow-hidden relative flex items-center justify-center hover:border-purple-500 transition-all">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="Önizleme"
            />
          ) : (
            <Camera size={32} className="text-slate-700" />
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
        className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl disabled:opacity-50 transition-all active:scale-95"
      >
        {isSubmitting ? 'YÜKLENİYOR...' : 'KATEGORİYİ RESMEN OLUŞTUR'}
      </button>
    </form>
  );
};
