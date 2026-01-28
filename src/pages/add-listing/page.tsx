import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, X, LayoutGrid, Info, Tag } from 'lucide-react';

export default function AddListingPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles].slice(0, 5);
      setImages(newImages);
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('currency', currency);
    images.forEach((img) => formData.append('images', img));

    try {
      await axios.post('http://localhost:5000/api/listings', formData);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('İlan yayınlanırken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 lg:p-20">
      {/* 🚀 Container Genişletildi: max-w-350 (1400px) */}
      <div className="max-w-350 mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/20">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Yeni <span className="text-purple-600">İlan Yayınla</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
              Marketplace / İlan Yönetimi
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* SOL KOLON: GÖRSELLER (Lg: 5 Kolon) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#0f172a] p-8 rounded-4xl border border-white/5 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Camera size={18} className="text-purple-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">
                  Görsel Yönetimi
                </h3>
              </div>

              {/* ANA GÖRSEL ÖNİZLEME */}
              <div className="aspect-16/10 rounded-3xl bg-white/5 border border-dashed border-white/10 overflow-hidden relative flex items-center justify-center group">
                {previews[0] ? (
                  <img
                    src={previews[0]}
                    className="w-full h-full object-cover"
                    alt="Ana Görsel"
                  />
                ) : (
                  <p className="text-slate-600 text-xs font-bold uppercase italic">
                    Ana Görsel Henüz Seçilmedi
                  </p>
                )}
              </div>

              {/* THUMBNAILS GRİD */}
              <div className="grid grid-cols-4 gap-3">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl border border-white/10 overflow-hidden relative group"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="Önizleme"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-all bg-white/5">
                    <Camera size={18} className="text-slate-600" />
                    <input
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <p className="text-[10px] text-slate-500 italic leading-relaxed text-center">
                İpucu: İlk seçtiğiniz resim ilanınızın kapak görseli olacaktır.
              </p>
            </div>
          </div>

          {/* SAĞ KOLON: BİLGİLER (Lg: 7 Kolon) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#0f172a] p-10 rounded-4xl border border-white/5 shadow-2xl space-y-8">
              {/* BAŞLIK VE AÇIKLAMA */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                    <Info size={12} /> İlan Başlığı
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Örn: Sahibinden Tertemiz Araba..."
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-purple-600 outline-none text-base transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                    Açıklama
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    placeholder="Ürününüzün tüm detaylarını buraya yazın..."
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-purple-600 outline-none text-base resize-none transition-all"
                  />
                </div>
              </div>

              {/* FİYAT ALANI */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                    <Tag size={12} /> Satış Fiyatı
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-purple-600 outline-none text-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic ml-2">
                    Para Birimi
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none h-full appearance-none cursor-pointer"
                  >
                    <option value="TRY">TRY (₺)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              {/* YAYINLA BUTONU */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all transform active:scale-95 shadow-xl shadow-purple-600/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Uçağa Yükleniyor...' : 'İlanı Resmen Yayınla'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
