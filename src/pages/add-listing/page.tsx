import { useState, useEffect, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react'; // 🚀 ChangeEvent artık kullanılıyor
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  X,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  RotateCcw,
  Tag,
  MapPin,
  Search,
  Loader2,
  Globe,
  Info,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useAuth } from '../../hooks/useAuth';
import type { Category } from '../../types/auth';

// 1. ÖZELLİK ŞABLONLARI
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
  electronic: ['Marka', 'Model', 'Garanti Durumu', 'Kullanım Durumu'],
};

// 2. HARİTA YARDIMCILARI
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

function LocationMarker({
  setCoords,
}: {
  setCoords: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setCoords(e.latlng.lat, e.latlng.lng);
    },
  });
  return position === null ? null : <Marker position={position} />;
}

export default function AddListingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTr = i18n.language.startsWith('tr');

  // --- STATE'LER ---
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectionPath, setSelectionPath] = useState<Category[]>([]);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [location, setLocation] = useState({
    lat: 41.0082,
    lng: 28.9784,
    country: 'Türkiye',
    city: '',
    district: '',
    postCode: '',
    neighborhood: '',
  });

  const [formData, setFormData] = useState({
    titleTr: '',
    titleEn: '',
    descriptionTr: '',
    descriptionEn: '',
    price: '',
    currency: 'TRY',
    type: 'sale',
    isDaily: 'false',
    stock: '1',
    isShippable: 'true',
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/categories')
      .then((res) => setAllCategories(res.data));
  }, []);

  // --- FONKSİYONLAR ---
  const getActiveTemplate = useCallback(() => {
    if (selectionPath.length === 0) return null;
    const rootSlug = selectionPath[0].slug;
    return SPEC_TEMPLATES[rootSlug] || null;
  }, [selectionPath]);

  // 🚀 ARTIK TANIMLI: Resim Seçme Fonksiyonu
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = [...images, ...selectedFiles].slice(0, 5);
      setImages(newImages);
      setPreviews(newImages.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const searchOnMap = async () => {
    if (!location.city || !location.district) {
      return alert('Lütfen en azından İl ve İlçe bilgilerini giriniz.');
    }

    setGeoLoading(true);
    // Sorgu metnini hazırlayalım
    const query = `${location.neighborhood} ${location.district} ${location.city} ${location.country}`;

    try {
      // 🚀 ARTIK KENDİ BACKEND'İMİZE SORUYORUZ
      const res = await axios.get(
        `http://localhost:5000/api/geocoding?q=${encodeURIComponent(query)}`,
      );

      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setLocation((prev) => ({
          ...prev,
          lat: parseFloat(lat),
          lng: parseFloat(lon),
        }));
      } else {
        alert(t('location_not_found') || 'Konum bulunamadı.');
      }
    } catch (err) {
      console.error('Geocoding Proxy Hatası:', err);
      alert('Konum aranırken sunucuda bir hata oluştu.');
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Giriş yapmalısınız!');
    if (selectionPath.length === 0) return alert(t('select_category_warning'));

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append(
      'categoryId',
      String(selectionPath[selectionPath.length - 1].id),
    );
    data.append('specs', JSON.stringify(specs));

    if (formData.isShippable === 'false') {
      data.append('latitude', String(location.lat));
      data.append('longitude', String(location.lng));
      data.append('country', location.country);
      data.append('city', location.city);
      data.append('district', location.district);
      data.append('postCode', location.postCode);
      data.append('addressText', location.neighborhood);
    }

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

  const currentOptions = allCategories.filter(
    (c) =>
      c.parentId ===
      (selectionPath.length > 0
        ? selectionPath[selectionPath.length - 1].id
        : null),
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-350 mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-12 border-b border-slate-200 dark:border-white/5 pb-8">
          <div className="p-4 bg-purple-600 rounded-2xl shadow-lg text-white">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
              {t('new_listing_title')}
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 italic flex items-center gap-2">
              <Globe size={12} className="text-purple-500" /> PRO MARKETPLACE
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* SOL KOLON: GÖRSELLER */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 italic">
                {t('image_mgmt')}
              </h3>
              <div className="aspect-16/10 rounded-3xl bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 overflow-hidden relative flex items-center justify-center">
                {previews[0] ? (
                  <img
                    src={previews[0]}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera
                    size={40}
                    className="text-slate-300 dark:text-slate-800"
                  />
                )}
              </div>
              <div className="grid grid-cols-5 gap-3 mt-6">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 relative group"
                  >
                    <img src={url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 text-white shadow-lg cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center cursor-pointer hover:border-purple-500 bg-white/5 transition-all">
                    <Camera size={18} className="text-slate-400" />
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

          {/* SAĞ KOLON: FORM */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-[#0f172a] p-10 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl space-y-8">
              {/* KATEGORİ SEÇİMİ */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-purple-600 italic tracking-[0.2em]">
                    Kategori Seçimi
                  </label>
                  {selectionPath.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectionPath([]);
                        setSpecs({});
                      }}
                      className="text-[9px] font-black text-slate-400 hover:text-red-500 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <RotateCcw size={10} /> SIFIRLA
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/5 min-h-[60px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Market
                  </span>
                  {selectionPath.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <ChevronRight size={12} className="text-slate-300" />
                      <span className="text-[10px] font-black text-purple-600 uppercase tracking-wider">
                        {isTr ? cat.titleTr : cat.titleEn}
                      </span>
                    </div>
                  ))}
                </div>
                {currentOptions.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentOptions.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectionPath([...selectionPath, cat]);
                          setSpecs({});
                        }}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-purple-600 transition-all text-center cursor-pointer"
                      >
                        <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 group-hover:text-purple-600">
                          {isTr ? cat.titleTr : cat.titleEn}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  selectionPath.length > 0 && (
                    <div className="flex items-center gap-2 text-green-500 bg-green-500/5 p-4 rounded-2xl border border-green-500/20">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Onaylandı
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* TİCARET TİPLERİ */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'sale' })}
                  className={`p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.type === 'sale' ? 'border-purple-600 bg-purple-600/5 text-purple-600' : 'border-slate-200 dark:border-white/5 text-slate-400'}`}
                >
                  {t('sale')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'rent' })}
                  className={`p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.type === 'rent' ? 'border-blue-600 bg-blue-600/5 text-blue-600' : 'border-slate-200 dark:border-white/5 text-slate-400'}`}
                >
                  {t('rent')}
                </button>
              </div>

              {/* KARGO VE KONUM */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                      <Info size={14} className="text-purple-600" /> Online
                      Satış ve Kargo
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                      {t('shippable_desc')}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isShippable === 'true'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isShippable: e.target.checked ? 'true' : 'false',
                      })
                    }
                    className="w-6 h-6 rounded-lg accent-purple-600 cursor-pointer"
                  />
                </div>

                {formData.isShippable === 'false' && (
                  <div className="space-y-6 bg-slate-50 dark:bg-[#020617] p-8 rounded-3xl border border-blue-500/20 animate-in zoom-in duration-300">
                    <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 italic flex items-center gap-2">
                      <MapPin
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      {t('location_info')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder={t('country')}
                        value={location.country}
                        onChange={(e) =>
                          setLocation({ ...location, country: e.target.value })
                        }
                        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-xs dark:text-white"
                      />
                      <input
                        placeholder={t('city')}
                        value={location.city}
                        onChange={(e) =>
                          setLocation({ ...location, city: e.target.value })
                        }
                        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-xs dark:text-white"
                      />
                      <input
                        placeholder={t('district')}
                        value={location.district}
                        onChange={(e) =>
                          setLocation({ ...location, district: e.target.value })
                        }
                        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-xs dark:text-white"
                      />
                      <input
                        placeholder={t('post_code')}
                        value={location.postCode}
                        onChange={(e) =>
                          setLocation({ ...location, postCode: e.target.value })
                        }
                        className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-xs dark:text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={searchOnMap}
                      disabled={geoLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                    >
                      {geoLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Search size={16} />
                      )}
                      {t('location_search_btn')}
                    </button>
                    <div className="h-64 w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 z-10 relative">
                      <MapContainer
                        center={[location.lat, location.lng]}
                        zoom={10}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <ChangeView center={[location.lat, location.lng]} />
                        <LocationMarker
                          setCoords={(lat, lng) =>
                            setLocation((prev) => ({ ...prev, lat, lng }))
                          }
                        />
                      </MapContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* SPECS */}
              {getActiveTemplate() && (
                <div className="grid grid-cols-2 gap-4 p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-purple-500/10 animate-in zoom-in">
                  <div className="col-span-2 flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className="text-purple-400" />
                    <h3 className="text-[10px] font-black uppercase text-purple-400">
                      Teknik Bilgiler
                    </h3>
                  </div>
                  {getActiveTemplate()?.map((field) => (
                    <div key={field} className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 italic">
                        {field}
                      </label>
                      <input
                        placeholder="..."
                        onChange={(e) =>
                          setSpecs({ ...specs, [field]: e.target.value })
                        }
                        className="w-full bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-3 rounded-xl text-xs outline-none focus:border-purple-600 text-slate-900 dark:text-white transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* BAŞLIK VE FİYAT */}
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder={t('listing_title_tr')}
                    onChange={(e) =>
                      setFormData({ ...formData, titleTr: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-sm text-slate-900 dark:text-white"
                    required
                  />
                  <input
                    placeholder={t('listing_title_en')}
                    onChange={(e) =>
                      setFormData({ ...formData, titleEn: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-sm text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div className="relative">
                  <Tag
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder={t('price')}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl outline-none text-xl font-black text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || selectionPath.length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 py-6 rounded-3xl font-black uppercase text-white shadow-xl transition-all active:scale-95 disabled:opacity-30"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="animate-spin" size={16} />{' '}
                    {t('loading')}{' '}
                  </div>
                ) : (
                  t('publish_btn')
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
