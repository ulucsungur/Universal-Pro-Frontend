import { useEffect, useState, useMemo } from 'react';
import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from 'react-router-dom';
import axios from 'axios';
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
  Users,
  CalendarDays,
} from 'lucide-react';
import type { Listing, Address, CartItem } from '../../types/auth';
import { differenceInDays } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';

export default function CheckoutPage() {
  const { id } = useParams<{ id?: string }>(); // ID artık opsiyonel (?)
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isTr = i18n.language.startsWith('tr');

  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');
  const isRental = !!(fromDate && toDate);

  // --- STATE'LER ---
  const [listing, setListing] = useState<Listing | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const { refreshCart } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Adresleri her zaman çek
        const addrRes = await axios.get(`http://localhost:5000/api/addresses`);
        setAddresses(addrRes.data);
        if (!isRental && addrRes.data.length > 0)
          setSelectedAddressId(addrRes.data[0].id);

        if (id) {
          // 2a. Tekli Ürün Modu
          const listRes = await axios.get(
            `http://localhost:5000/api/listings/${id}`,
          );
          setListing(listRes.data);
        } else {
          // 2b. Sepet Modu
          const cartRes = await axios.get<CartItem[]>(
            `http://localhost:5000/api/cart`,
          );
          setCartItems(cartRes.data);
        }
      } catch (err) {
        console.error('Veri çekme hatası:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isRental]);

  // --- FORMATLAYICILAR ---
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = v.match(/.{1,4}/g);
    return parts ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  // --- VALIDASYON VE HESAPLAMA ---
  const isPaymentValid = useMemo(() => {
    const cleanNumber = cardData.number.replace(/\s/g, '');
    const cleanExpiry = cardData.expiry.replace(/\s/g, '');
    const nameOk = cardData.name.trim().length >= 5;
    const numberOk = cleanNumber.length === 16;
    const expiryOk = /^(0[1-9]|1[0-2])\/([2-9][0-9])$/.test(cleanExpiry);
    const cvvOk = cardData.cvv.length === 3;
    return nameOk && numberOk && expiryOk && cvvOk;
  }, [cardData]);

  const days = useMemo(() => {
    if (isRental && fromDate && toDate)
      return differenceInDays(new Date(toDate), new Date(fromDate));
    return 0;
  }, [isRental, fromDate, toDate]);

  const totalPrice = useMemo(() => {
    if (id && listing) {
      return isRental
        ? Number(listing.price) * days
        : Number(listing.price) * quantity;
    }
    return cartItems.reduce(
      (acc, item) => acc + Number(item.listing?.price || 0) * item.quantity,
      0,
    );
  }, [id, listing, quantity, isRental, days, cartItems]);

  const canOrder =
    isPaymentValid &&
    (isRental ? true : selectedAddressId !== null) &&
    !isOrdering;

  const handleCompleteOrder = async () => {
    if (!canOrder) return;
    setIsOrdering(true);
    try {
      if (isRental) {
        await axios.post('http://localhost:5000/api/bookings', {
          listingId: listing?.id,
          startDate: fromDate,
          endDate: toDate,
          totalPrice: totalPrice,
          guests: quantity,
        });
      } else if (id) {
        await axios.post('http://localhost:5000/api/orders', {
          listingId: listing?.id,
          addressId: selectedAddressId,
          quantity: quantity,
          totalPrice: totalPrice,
        });
      } else {
        // Sepeti Öde
        await axios.post('http://localhost:5000/api/orders/checkout-cart', {
          addressId: selectedAddressId,
        });
      }

      await refreshCart();
      alert(t('order_success'));
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('İşlem başarısız.');
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading || (id && !listing))
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 transition-colors duration-500 text-slate-900 dark:text-white">
      <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* SOL KOLON: ADRES VE ÖDEME */}
        <div className="lg:col-span-8 space-y-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">
            {t('checkout_title')}
          </h1>

          {!isRental && (
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
                    <p className="font-black text-xs uppercase mb-1">
                      {addr.title}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {addr.addressDetail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-xl space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-purple-600 flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
              <CreditCard size={18} /> {t('payment_method')}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={cardData.name}
                  onChange={(e) =>
                    setCardData({ ...cardData, name: e.target.value })
                  }
                  placeholder={t('card_holder')}
                  className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-xl outline-none text-sm font-bold uppercase"
                />
                <input
                  maxLength={19}
                  value={cardData.number}
                  onChange={(e) =>
                    setCardData({
                      ...cardData,
                      number: formatCardNumber(e.target.value),
                    })
                  }
                  placeholder="4912 0591 7951 2352"
                  className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-xl outline-none text-sm font-mono"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input
                  maxLength={5}
                  value={cardData.expiry}
                  placeholder="MM/YY"
                  onChange={(e) =>
                    setCardData({
                      ...cardData,
                      expiry: formatExpiry(e.target.value),
                    })
                  }
                  className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-xl outline-none text-sm text-center font-bold"
                />
                <input
                  maxLength={3}
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData({
                      ...cardData,
                      cvv: e.target.value.replace(/[^0-9]/g, ''),
                    })
                  }
                  placeholder="CVV"
                  className="bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-white/10 p-4 rounded-xl outline-none text-sm text-center font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: SİPARİŞ ÖZETİ */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl sticky top-32 space-y-8">
            <h2 className="font-black uppercase tracking-widest text-xs text-slate-400">
              {t('order_summary')}
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
              {id && listing ? (
                <div className="flex gap-4 border-b border-slate-100 dark:border-white/5 pb-8">
                  <img
                    src={listing.imageUrls?.[0]}
                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  />
                  <div className="space-y-2 grow">
                    <p className="text-xs font-black uppercase line-clamp-2 leading-tight">
                      {isTr ? listing.titleTr : listing.titleEn}
                    </p>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#020617] w-fit p-1 rounded-lg border border-slate-200 dark:border-white/10">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 hover:text-purple-600 cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-[10px] font-black w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-1 hover:text-purple-600 cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b border-slate-100 dark:border-white/5 pb-4"
                  >
                    <img
                      src={item.listing?.imageUrls?.[0]}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="grow">
                      <p className="text-[10px] font-black uppercase line-clamp-1">
                        {isTr ? item.listing?.titleTr : item.listing?.titleEn}
                      </p>
                      <p className="text-[10px] text-purple-600 font-bold">
                        {item.quantity} Adet x {item.listing?.price} ₺
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 font-bold text-xs">
              <div className="flex justify-between uppercase text-slate-500">
                <span>
                  {isRental
                    ? t('total_days')
                    : id
                      ? t('quantity')
                      : 'Toplam Ürün'}
                </span>
                <span className="text-slate-900 dark:text-white flex items-center gap-2">
                  {isRental ? `${days} GÜN` : id ? quantity : cartItems.length}
                  {isRental && <Users size={14} className="text-purple-500" />}
                </span>
              </div>
              {!isRental && (
                <div className="flex justify-between text-green-500 items-center uppercase italic text-[9px]">
                  <span className="flex items-center gap-2">
                    <Truck size={14} /> {t('free_shipping')}
                  </span>
                  <span>0,00 ₺</span>
                </div>
              )}
              {isRental && (
                <div className="flex justify-between text-purple-600 items-center uppercase italic text-[9px]">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={14} /> {fromDate} / {toDate}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-end pt-6 border-t-2 border-slate-100 dark:border-white/10">
                <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">
                  {t('total_price')}
                </span>
                <span className="text-3xl font-black italic">
                  {totalPrice.toLocaleString(isTr ? 'tr-TR' : 'en-US')}{' '}
                  <span className="text-purple-600 text-sm">₺</span>
                </span>
              </div>
            </div>

            {!isPaymentValid && cardData.name !== '' && (
              <div className="flex items-center gap-2 text-amber-500 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                <AlertCircle size={14} />
                <span className="text-[9px] font-bold uppercase text-amber-600">
                  Kart Bilgilerini Kontrol Edin
                </span>
              </div>
            )}

            <button
              onClick={handleCompleteOrder}
              disabled={!canOrder}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-3xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[10px] disabled:opacity-20 flex items-center justify-center gap-3"
            >
              {isOrdering ? (
                <>
                  <Loader2 className="animate-spin" size={16} />{' '}
                  {t('processing')}
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> {t('complete_order')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
