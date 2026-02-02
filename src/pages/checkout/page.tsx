import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  MapPin,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { Listing, Address } from '../../types/auth';

export default function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isTr = i18n.language.startsWith('tr');

  const [listing, setListing] = useState<Listing | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // 🚀 ÖDEME STATE'LERİ
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listRes, addrRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/listings/${id}`),
          axios.get(`http://localhost:5000/api/addresses`),
        ]);
        setListing(listRes.data);
        setAddresses(addrRes.data);
        if (addrRes.data.length > 0) setSelectedAddressId(addrRes.data[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 🚀 VALIDASYON MOTORU (Senior Manager Standartı)
  const isPaymentValid = useMemo(() => {
    const { name, number, expiry, cvv } = cardData;

    // 1. İsim kontrolü (En az 5 karakter)
    const nameValid = name.trim().length >= 5;

    // 2. Kart numarası (16 hane olmalı - boşluksuz)
    const numberValid = number.replace(/\s/g, '').length === 16;

    // 3. SKT (AA/YY formatı ve mantıksal kontrol)
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([2-9][5-9])$/;
    const expiryValid = expiryRegex.test(expiry);

    // 4. CVV (Tam 3 hane olmalı)
    const cvvValid = /^\d{3}$/.test(cvv);

    return nameValid && numberValid && expiryValid && cvvValid;
  }, [cardData]);

  // Buton Aktiflik Kontrolü
  const canOrder = selectedAddressId !== null && isPaymentValid && !isOrdering;

  const handleCompleteOrder = async () => {
    if (!canOrder) return;
    setIsOrdering(true);

    try {
      await axios.post('http://localhost:5000/api/orders', {
        listingId: listing?.id,
        addressId: selectedAddressId,
        quantity: quantity,
      });
      alert(t('order_success'));
      navigate('/orders');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        alert(err.response?.data?.error || 'İşlem reddedildi.');
      }
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading || !listing)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  const subTotal = Number(listing.price) * quantity;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 transition-colors duration-500">
      <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
            {t('checkout_title')}
          </h1>

          {/* ADRES SEÇİMİ */}
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                <MapPin size={18} /> {t('shipping_address')}
              </h2>
              <Link
                to="/profile/addresses"
                className="text-[10px] font-black text-blue-500 hover:underline uppercase no-underline tracking-widest"
              >
                <Plus size={12} className="inline mr-1" />{' '}
                {t('add_address_btn')}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-purple-600 bg-purple-600/5' : 'border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#020617]'}`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-black text-xs uppercase mb-1 dark:text-white">
                      {addr.title}
                    </p>
                    {selectedAddressId === addr.id && (
                      <CheckCircle2 size={14} className="text-purple-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {addr.addressDetail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 🚀 GELİŞMİŞ ÖDEME FORMU */}
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-purple-600 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
              <CreditCard size={18} /> {t('payment_method')}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    {t('card_holder')}
                  </label>
                  <input
                    value={cardData.name}
                    onChange={(e) =>
                      setCardData({ ...cardData, name: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#020617] p-4 rounded-xl border border-slate-200 dark:border-white/10 outline-none text-sm dark:text-white uppercase font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    {t('card_number')}
                  </label>
                  <input
                    maxLength={16}
                    value={cardData.number}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        number: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder="1234 5678 9012 3456"
                    className="w-full bg-slate-50 dark:bg-[#020617] p-4 rounded-xl border border-slate-200 dark:border-white/10 outline-none text-sm dark:text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    AA / YY
                  </label>
                  <input
                    maxLength={5}
                    value={cardData.expiry}
                    placeholder="05/28"
                    onChange={(e) =>
                      setCardData({ ...cardData, expiry: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-[#020617] p-4 rounded-xl border border-slate-200 dark:border-white/10 outline-none text-sm dark:text-white text-center font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    CVV
                  </label>
                  <input
                    maxLength={3}
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cvv: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder="123"
                    className="w-full bg-slate-50 dark:bg-[#020617] p-4 rounded-xl border border-slate-200 dark:border-white/10 outline-none text-sm dark:text-white text-center font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: ÖZET */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl sticky top-32 space-y-8">
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-400">
              {t('order_summary')}
            </h2>

            <div className="flex gap-4 border-b border-slate-100 dark:border-white/5 pb-8">
              <img
                src={listing.imageUrls?.[0]}
                className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                alt="Product"
              />
              <div className="space-y-2">
                <p className="text-xs font-black uppercase text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {isTr ? listing.titleTr : listing.titleEn}
                </p>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#020617] w-fit p-1 rounded-lg border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-purple-600 transition-all cursor-pointer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-[10px] font-black w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-purple-600 transition-all cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 uppercase">
                  {t('subtotal')} ({quantity})
                </span>
                <span className="dark:text-white font-black">
                  {subTotal.toLocaleString()} ₺
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold text-green-500 items-center">
                <span className="flex items-center gap-2 uppercase tracking-widest italic text-[9px]">
                  <Truck size={14} /> {t('free_shipping')}
                </span>
                <span className="font-black text-[10px]">0,00 ₺</span>
              </div>
              <div className="flex justify-between items-end pt-6 border-t-2 border-slate-100 dark:border-white/10">
                <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">
                  {t('total_price')}
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white italic">
                  {subTotal.toLocaleString(isTr ? 'tr-TR' : 'en-US')}{' '}
                  <span className="text-purple-600 text-sm italic">₺</span>
                </span>
              </div>
            </div>

            {/* 🚀 VALIDASYON UYARISI */}
            {!isPaymentValid && cardData.name !== '' && (
              <div className="flex items-center gap-2 text-amber-500 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 animate-in fade-in">
                <AlertCircle size={14} />
                <span className="text-[9px] font-bold uppercase">
                  Lütfen kart bilgilerini kontrol edin
                </span>
              </div>
            )}

            <button
              onClick={handleCompleteOrder}
              disabled={!canOrder}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-3xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[10px] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isOrdering ? (
                <>
                  {' '}
                  <Loader2 className="animate-spin" size={16} />{' '}
                  {t('processing')}{' '}
                </>
              ) : (
                <>
                  {' '}
                  <ShieldCheck size={18} /> {t('complete_order')}{' '}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🚀 Helper Component (Eksik ikon hatası için)
const CheckCircle2 = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
