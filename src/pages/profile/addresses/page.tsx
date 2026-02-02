import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Plus, Trash2, Home, Briefcase, X } from 'lucide-react'; // 🚀 MapPin eklendi
import { useTranslation } from 'react-i18next';
import type { Address } from '../../../types/auth';

export default function MyAddressesPage() {
  const { t } = useTranslation(); // 🚀 t artık kullanılıyor
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    title: '',
    fullName: '',
    phone: '',
    city: '',
    district: '',
    postCode: '',
    addressDetail: '',
  });

  const fetchAddresses = () => {
    axios
      .get('http://localhost:5000/api/addresses')
      .then((res) => setAddresses(res.data));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/addresses', newAddr);
      setShowForm(false);
      setNewAddr({
        title: '',
        fullName: '',
        phone: '',
        city: '',
        district: '',
        postCode: '',
        addressDetail: '',
      });
      fetchAddresses();
      alert(t('address_saved_success'));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20 transition-colors duration-500">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* BAŞLIK ALANI */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
              <MapPin size={24} /> {/* 🚀 MapPin artık kullanılıyor */}
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
              {t('address_book')}
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 cursor-pointer active:scale-95"
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? t('cancel') : t('add_new_address')}
          </button>
        </div>

        {/* YENİ ADRES FORMU */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl space-y-4 animate-in zoom-in duration-300"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder={t('address_title_hint')}
                value={newAddr.title}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, title: e.target.value })
                }
                required
                className="bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/10 outline-none dark:text-white text-sm focus:border-purple-500 transition-all"
              />
              <input
                placeholder={t('full_name_label')}
                value={newAddr.fullName}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, fullName: e.target.value })
                }
                required
                className="bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/10 outline-none dark:text-white text-sm focus:border-purple-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder={t('phone_label')}
                value={newAddr.phone}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, phone: e.target.value })
                }
                required
                className="w-full bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/10 outline-none dark:text-white text-sm focus:border-purple-500 transition-all"
              />
              <input
                placeholder={t('post_code')}
                value={newAddr.postCode}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, postCode: e.target.value })
                }
                required
                className="w-full bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/10 outline-none dark:text-white text-sm focus:border-purple-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Şehir"
                value={newAddr.city}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, city: e.target.value })
                }
                required
                className="bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/10 outline-none dark:text-white text-sm focus:border-purple-500 transition-all"
              />
              <input
                placeholder="İlçe"
                value={newAddr.district}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, district: e.target.value })
                }
                required
                className="bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/10 outline-none dark:text-white text-sm focus:border-purple-500 transition-all"
              />
            </div>
            <textarea
              placeholder="Tam Adres Detayı"
              value={newAddr.addressDetail}
              onChange={(e) =>
                setNewAddr({ ...newAddr, addressDetail: e.target.value })
              }
              required
              className="w-full bg-slate-50 dark:bg-[#020617] p-4 rounded-2xl border border-slate-200 dark:border-white/10 outline-none dark:text-white text-sm h-32 resize-none focus:border-purple-500 transition-all"
            />
            <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-3xl uppercase text-[10px] tracking-[0.3em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all">
              {t('save_address')}
            </button>
          </form>
        )}

        {/* LİSTELEME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-lg group relative transition-all hover:shadow-2xl hover:border-purple-500/20"
            >
              <div className="flex items-start gap-4">
                <div className="p-4 bg-purple-600/10 rounded-2xl text-purple-600">
                  {addr.title.toLowerCase().includes('iş') ? (
                    <Briefcase size={22} />
                  ) : (
                    <Home size={22} />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-sm text-slate-900 dark:text-white italic tracking-tighter">
                    {addr.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    {addr.fullName}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    {addr.addressDetail}
                  </p>
                  <div className="pt-2 flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-[#020617] px-2 py-1 rounded-lg text-[9px] font-black text-purple-600 uppercase">
                      {addr.district} / {addr.city}
                    </span>
                  </div>
                </div>
              </div>
              <button className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-red-500 hover:scale-125 transition-all cursor-pointer">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {addresses.length === 0 && !showForm && (
          <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
            <MapPin size={48} />
            <p className="font-black uppercase tracking-widest text-xs">
              Henüz bir adres eklemediniz
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
