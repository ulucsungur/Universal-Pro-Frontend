import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  X,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  RotateCcw,
} from 'lucide-react';
//import { AuthLayout } from '../../components/auth/AuthLayout';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../types/auth';

// 🚀 HANGİ ANA KATEGORİDE HANGİ KUTUCUKLAR AÇILACAK?
const SPEC_TEMPLATES: Record<string, string[]> = {
  vehicle: [
    'Marka',
    'Seri',
    'Model',
    'Yıl',
    'KM',
    'Renk',
    'Yakıt Tipi',
    'Vites',
  ],
  property: [
    'Konut Tipi',
    'Oda Sayısı',
    'Bina Yaşı',
    'Bulunduğu Kat',
    'Isınma Tipi',
  ],
};

export default function AddListingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isTr = i18n.language.startsWith('tr');

  // --- STATE YÖNETİMİ ---
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectionPath, setSelectionPath] = useState<Category[]>([]); // Seçilen hiyerarşi yolu
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titleTr: '',
    titleEn: '',
    descriptionTr: '',
    descriptionEn: '',
    price: '',
    currency: 'TRY',
  });

  // 1. Tüm kategorileri çekelim (Hiyerarşiyi kurmak için hepsi lazım)
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/categories') // topOnly=true DEĞİL, hepsi!
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.error('Kategoriler yüklenemedi', err));
  }, []);

  // 2. Mevcut derinlikteki seçenekleri bul
  const currentParentId =
    selectionPath.length > 0
      ? selectionPath[selectionPath.length - 1].id
      : null;

  const currentOptions = allCategories.filter(
    (c) => c.parentId === currentParentId,
  );

  // 3. Kategori Seçme ve Derine İnme Mantığı
  const handleCategorySelect = (cat: Category) => {
    setSelectionPath((prev) => [...prev, cat]);
    setSpecs({}); // Her seçimde özellikleri sıfırla ki doğru şablon gelsin
  };

  const resetSelection = () => {
    setSelectionPath([]);
    setSpecs({});
  };

  // 4. Teknik Özellik Şablonunu Belirle (En üst ataya bakarak)
  const getActiveTemplate = () => {
    if (selectionPath.length === 0) return null;
    const rootCategory = selectionPath[0]; // İlk seçilen (Vasıta/Emlak)
    return SPEC_TEMPLATES[rootCategory.slug] || null;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles].slice(0, 5);
      setImages(newImages);
      setPreviews(newImages.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectionPath.length === 0)
      return alert('Lütfen en az bir kategori seçin!');

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));

    // 🚀 EN ÖNEMLİ NOKTA: En son seçilen (en derindeki) kategori ID'sini gönderiyoruz
    const finalCategoryId = selectionPath[selectionPath.length - 1].id;
    data.append('categoryId', String(finalCategoryId));

    data.append('specs', JSON.stringify(specs));
    images.forEach((img) => data.append('images', img));

    try {
      await axios.post('http://localhost:5000/api/listings', data);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 lg:p-20">
      <div className="max-w-350 mx-auto">
        <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8">
          <div className="p-4 bg-purple-600 rounded-2xl shadow-lg shadow-purple-600/20">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {t('new_listing_title')}
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
              Marketplace / Dynamic Category Wizard
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* SOL: GÖRSEL YÖNETİMİ */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0f172a] p-8 rounded-4xl border border-white/5 shadow-2xl">
              <div className="aspect-16/10 rounded-3xl bg-white/5 border border-dashed border-white/10 overflow-hidden relative flex items-center justify-center group">
                {previews[0] ? (
                  <img
                    src={previews[0]}
                    className="w-full h-full object-cover"
                    alt="Main"
                  />
                ) : (
                  <Camera size={40} className="text-slate-800" />
                )}
              </div>
              <div className="grid grid-cols-5 gap-3 mt-6">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-white/5 relative group"
                  >
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(images.filter((_, idx) => idx !== i));
                        setPreviews(previews.filter((_, idx) => idx !== i));
                      }}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-purple-500 bg-white/5 transition-all">
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
            </div>
          </div>

          {/* SAĞ: KADEMELİ SEÇİM VE FORM */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#0f172a] p-10 rounded-4xl border border-white/5 space-y-8 shadow-2xl">
              {/* 🚀 KADEMELİ KATEGORİ SİHİRBAZI */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-purple-500 italic tracking-[0.2em]">
                    Kategori Seçimi
                  </label>
                  {selectionPath.length > 0 && (
                    <button
                      type="button"
                      onClick={resetSelection}
                      className="text-[9px] font-bold text-slate-500 hover:text-white flex items-center gap-1 transition-all"
                    >
                      <RotateCcw size={10} /> SIFIRLA
                    </button>
                  )}
                </div>

                {/* Seçim Yolu (Breadcrumbs) */}
                <div className="flex flex-wrap items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/5 min-h-[50px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Market
                  </span>
                  {selectionPath.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <ChevronRight size={12} className="text-slate-700" />
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider">
                        {isTr ? cat.titleTr : cat.titleEn}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mevcut Alt Seçenekler */}
                {currentOptions.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {currentOptions.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className="p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-purple-600 hover:bg-purple-600/10 transition-all text-center group"
                      >
                        <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white tracking-widest">
                          {isTr ? cat.titleTr : cat.titleEn}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : selectionPath.length > 0 ? (
                  <div className="flex items-center gap-2 text-green-500 bg-green-500/5 p-4 rounded-2xl border border-green-500/20">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Kategori Tamamlandı
                    </span>
                  </div>
                ) : null}
              </div>

              {/* DİNAMİK TEKNİK ALANLAR */}
              {getActiveTemplate() && (
                <div className="grid grid-cols-2 gap-4 p-8 bg-white/5 rounded-3xl border border-purple-500/10 animate-in zoom-in duration-300">
                  {getActiveTemplate()?.map((field) => (
                    <div key={field} className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 ml-1 uppercase">
                        {field}
                      </label>
                      <input
                        placeholder="..."
                        onChange={(e) =>
                          setSpecs({ ...specs, [field]: e.target.value })
                        }
                        className="w-full bg-[#020617] border border-white/10 p-4 rounded-xl text-xs outline-none focus:border-purple-500 transition-all text-white"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* DİL BAZLI BAŞLIK VE AÇIKLAMA */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    placeholder="İlan Başlığı (TR)"
                    onChange={(e) =>
                      setFormData({ ...formData, titleTr: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-sm text-white"
                    required
                  />
                  <input
                    placeholder="Ad Title (EN)"
                    onChange={(e) =>
                      setFormData({ ...formData, titleEn: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-600 text-sm text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    placeholder="Açıklama (TR)"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionTr: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none resize-none text-sm text-white"
                    rows={3}
                  />
                  <textarea
                    placeholder="Description (EN)"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionEn: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none resize-none text-sm text-white"
                    rows={3}
                  />
                </div>
              </div>

              {/* FİYAT */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <input
                  type="number"
                  placeholder="0.00"
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-purple-600 font-bold text-lg text-white"
                  required
                />
                <select
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="bg-white/5 border border-white/10 p-5 rounded-3xl outline-none cursor-pointer text-white"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || selectionPath.length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading ? 'VERİLER MÜHÜRLENİYOR...' : t('publish_btn')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
