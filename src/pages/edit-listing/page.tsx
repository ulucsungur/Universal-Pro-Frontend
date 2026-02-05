import { useState, useEffect, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  X,
  ChevronRight,
  LayoutGrid,
  RotateCcw,
  Tag,
  MapPin,
  Search,
  Loader2,
  Save,
  CheckCircle2,
  Globe,
  Camera,
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
import type { Category, Listing } from '../../types/auth';

// 🚀 1. ÖZELLİK ŞABLONLARI
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

// 🚀 2. HARİTA İKON YAPILANDIRMASI (L kullanımı ✅)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

// 🚀 3. TIKLAYARAK KONUM SEÇİCİ (LocationMarker kullanımı ✅)
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

export default function EditListingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // 🚀 user kullanımı ✅
  const isTr = i18n.language.startsWith('tr');

  // --- STATE'LER ---
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectionPath, setSelectionPath] = useState<Category[]>([]);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [location, setLocation] = useState({
    lat: 41.0082,
    lng: 28.9784,
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
    type: 'sale' as 'sale' | 'rent',
    isDaily: 'false',
    isShippable: 'true',
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [catRes, listRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get(`http://localhost:5000/api/listings/${id}`),
        ]);
        const l: Listing = listRes.data;
        setAllCategories(catRes.data);
        setFormData({
          titleTr: l.titleTr || '',
          titleEn: l.titleEn || '',
          descriptionTr: l.descriptionTr || '',
          descriptionEn: l.descriptionEn || '',
          price: String(l.price),
          currency: l.currency,
          type: l.type,
          isDaily: l.isDaily,
          isShippable: l.isShippable,
        });
        setSpecs((l.specs as Record<string, string>) || {});
        setPreviews(l.imageUrls || []);
        if (l.latitude)
          setLocation((prev) => ({
            ...prev,
            lat: Number(l.latitude),
            lng: Number(l.longitude),
            neighborhood: l.addressText || '',
            city: l.city || '',
            district: l.district || '',
            postCode: l.postCode || '',
          }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, [id]);

  const handleCategorySelect = (cat: Category) => {
    setSelectionPath((prev) => [...prev, cat]);
    setSpecs({});
  };

  const getActiveTemplate = useCallback(() => {
    if (selectionPath.length === 0) return null;
    const rootSlug = selectionPath[0].slug;
    return SPEC_TEMPLATES[rootSlug] || null;
  }, [selectionPath]);

  // 🚀 ChangeEvent kullanımı ✅
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...selectedFiles]);
      setPreviews((prev) => [
        ...prev,
        ...selectedFiles.map((f) => URL.createObjectURL(f)),
      ]);
    }
  };

  const searchOnMap = async () => {
    if (!location.city || !location.district)
      return alert('İl ve İlçe giriniz.');
    setGeoLoading(true);
    const query = `${location.neighborhood} ${location.district} ${location.city} Turkey`;
    try {
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
      }
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    console.log('🚀 Kaydet butonuna basıldı!');
    setIsSubmitting(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    data.append('specs', JSON.stringify(specs));
    data.append('latitude', String(location.lat));
    data.append('longitude', String(location.lng));
    data.append('addressText', location.neighborhood);
    data.append('postCode', location.postCode);
    data.append('city', location.city);
    data.append('district', location.district);
    images.forEach((img) => data.append('images', img));

    try {
      await axios.patch(`http://localhost:5000/api/listings/${id}`, data);
      navigate(`/listing/${id}`);
    } catch (err) {
      console.error(err);
      alert('Hata!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentOptions = allCategories.filter(
    (c) =>
      c.parentId ===
      (selectionPath.length > 0
        ? selectionPath[selectionPath.length - 1].id
        : null),
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-350 mx-auto">
        {/* HEADER: LayoutGrid kullanıldı ✅ */}
        <div className="flex items-center gap-4 mb-12 border-b border-slate-200 dark:border-white/5 pb-8">
          <div className="p-4 bg-amber-500 rounded-2xl shadow-lg text-white shadow-amber-500/20">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase italic text-slate-900 dark:text-white">
              {t('edit_listing_title')}
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase mt-1 italic flex items-center gap-2">
              <Globe size={12} className="text-amber-500" /> {user?.fullName} /
              REVISION MODE
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          {/* SOL: GÖRSELLER */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 italic">
                {t('image_mgmt')}
              </h3>
              <div className="aspect-16/10 rounded-3xl overflow-hidden relative border border-slate-100 dark:border-white/5">
                <img
                  src={previews[0]}
                  className="w-full h-full object-cover"
                  alt="Main"
                />
              </div>
              <div className="grid grid-cols-5 gap-3 mt-6">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 relative group"
                  >
                    <img src={url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviews(previews.filter((_, idx) => idx !== i));
                        setImages(images.filter((_, idx) => idx !== i));
                      }}
                      className="absolute top-1 right-1 bg-red-600 p-1 rounded-md opacity-0 group-hover:opacity-100 text-white shadow-lg cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
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
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white dark:bg-[#0f172a] p-10 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl space-y-8">
              {/* KATEGORİ: ChevronRight kullanıldı ✅ */}
              <div className="space-y-4">
                <div className="flex justify-between items-center font-black uppercase text-[10px] text-purple-600">
                  Kategori Yönetimi{' '}
                  <RotateCcw
                    size={12}
                    onClick={() => setSelectionPath([])}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Market
                  </span>
                  {selectionPath.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <ChevronRight size={12} className="text-slate-300" />
                      <span className="text-[10px] font-black text-purple-400 uppercase">
                        {isTr ? cat.titleTr : cat.titleEn}
                      </span>
                    </div>
                  ))}
                </div>
                {currentOptions.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentOptions.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-purple-600 transition-all text-center cursor-pointer"
                      >
                        <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 group-hover:text-purple-600">
                          {isTr ? cat.titleTr : cat.titleEn}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {selectionPath.length > 0 && currentOptions.length === 0 && (
                  <div className="flex items-center gap-2 text-green-500 bg-green-500/5 p-4 rounded-2xl border border-green-500/20">
                    <CheckCircle2 size={16} className="text-green-500" />{' '}
                    {/* CheckCircle2 kullanıldı ✅ */}
                    <span className="text-[10px] font-black uppercase">
                      Mühürlendi
                    </span>
                  </div>
                )}
              </div>

              {/* SPECS: getActiveTemplate kullanıldı ✅ */}
              {getActiveTemplate() && (
                <div className="grid grid-cols-2 gap-4 p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-purple-500/10">
                  {getActiveTemplate()?.map((field) => (
                    <div key={field} className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 italic">
                        {field}
                      </label>
                      <input
                        value={specs[field] || ''}
                        onChange={(e) =>
                          setSpecs({ ...specs, [field]: e.target.value })
                        }
                        className="w-full bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-3 rounded-xl text-xs outline-none focus:border-purple-600 text-slate-900 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* KONUM: MapPin ve LocationMarker kullanıldı ✅ */}
              {formData.isShippable === 'false' && (
                <div className="space-y-6 bg-slate-50 dark:bg-[#020617] p-8 rounded-3xl border border-blue-500/20">
                  <h3 className="text-xs font-black uppercase text-blue-400 italic flex items-center gap-2">
                    <MapPin size={14} /> {t('location_info')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <input
                    placeholder={t('post_code')}
                    value={location.postCode}
                    onChange={(e) =>
                      setLocation({ ...location, postCode: e.target.value })
                    }
                    className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-xs dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={searchOnMap}
                    disabled={geoLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[10px] flex items-center justify-center gap-3 transition-all"
                  >
                    {geoLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Search size={16} />
                    )}{' '}
                    {t('location_search_btn')}
                  </button>
                  <div className="h-64 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 relative z-10">
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

              {/* AÇIKLAMA: Info kullanıldı ✅ */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 opacity-50">
                  <Info size={14} className="text-purple-500" />
                  <span className="text-[9px] font-black uppercase">
                    {t('description')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <textarea
                    value={formData.descriptionTr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionTr: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-sm dark:text-white h-32 resize-none"
                    placeholder={t('desc_tr')}
                  />
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionEn: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-sm dark:text-white h-32 resize-none"
                    placeholder={t('desc_en')}
                  />
                </div>
              </div>

              {/* FİYAT: Tag kullanıldı ✅ */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="relative">
                  <Tag
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 pl-12 rounded-2xl outline-none font-black text-xl dark:text-white"
                    required
                  />
                </div>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-2xl outline-none text-sm dark:text-white font-bold"
                >
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 py-6 rounded-3xl font-black uppercase text-white shadow-xl transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}{' '}
                {t('update_btn')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
