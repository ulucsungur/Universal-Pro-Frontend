import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ImageOff, Loader2, MapPin } from 'lucide-react';
import type { Listing } from '../../types/auth';
import { useTranslation } from 'react-i18next';
import { SpecsTable } from '../../components/listing/SpecsTable';
import { SellerCard } from '../../components/listing/SellerCard';
import { BookingCalendar } from '../../components/listing/BookingCalendar'; // 🚀 Geri geldi!
import { MessageModal } from '../../components/listing/MessageModal';
import { ListingMap } from '../../components/listing/ListingMap';
import { useAuth } from '../../hooks/useAuth';
import { Edit3, Heart, ShoppingCart } from 'lucide-react';

export default function ListingDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, favorites, refreshFavorites, refreshCart } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'location' | 'specs'>(
    'details',
  );

  const isTr = i18n.language.startsWith('tr');
  const isFavorite = favorites.includes(Number(id));

  const handleToggleFavorite = async () => {
    if (!user) return alert('Lütfen giriş yapın');
    try {
      await axios.post('http://localhost:5000/api/favorites/toggle', {
        listingId: Number(id),
      });
      await refreshFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async () => {
    if (!user) return alert('Lütfen giriş yapın');
    try {
      await axios.post('http://localhost:5000/api/cart', {
        listingId: Number(id),
        quantity: 1,
      });
      await refreshCart(); // Navbar'daki sayı anında güncellenir
      alert('Ürün sepete eklendi!');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/listings/${id}`)
        .then((res) => {
          setListing(res.data);
          if (res.data.imageUrls && res.data.imageUrls.length > 0) {
            setActiveImage(res.data.imageUrls[0]);
          }
        })
        .catch((err) => console.error('Detay hatası:', err));
    }
  }, [id]);

  // 🚀 SAHİPLİK KONTROLÜ
  const isOwner = user && listing && user.id === listing.sellerId;

  const handleBuyNow = () => {
    if (!user) {
      alert(t('login_required') || 'Lütfen önce giriş yapın');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${listing?.id}`);
  };

  if (!listing)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-purple-500" size={40} />
        <p className="text-slate-500 font-black uppercase tracking-widest">
          {t('loading')}
        </p>
      </div>
    );

  const displayTitle = isTr
    ? listing.titleTr || listing.title
    : listing.titleEn || listing.title;
  const displayDescription = isTr
    ? listing.descriptionTr || listing.description
    : listing.descriptionEn || listing.description;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-350 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-700">
        {/* SOL KOLON: GALERİ VE SEKMELİ İÇERİK */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-6">
            <div className="aspect-16/10 bg-white dark:bg-[#0f172a] rounded-4xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl relative">
              {activeImage ? (
                <img
                  src={activeImage}
                  className="w-full h-full object-cover transition-all duration-700"
                  alt={displayTitle}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                  <ImageOff size={48} className="mb-2 opacity-20" />
                  <span className="text-xs font-bold uppercase opacity-20">
                    {t('noimage')}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-4">
              {listing.imageUrls?.map((url, i) => (
                <div
                  key={url}
                  onClick={() => setActiveImage(url)}
                  className={`aspect-square rounded-2xl border-2 cursor-pointer overflow-hidden transition-all ${activeImage === url ? 'border-purple-500 scale-95 shadow-lg' : 'border-slate-200 dark:border-white/5 hover:border-purple-400'}`}
                >
                  <img
                    src={url}
                    className="w-full h-full object-cover"
                    alt={`Resim ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* TAB NAVİGASYONU */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-white/5">
            {(['details', 'location', 'specs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-b-2 ${activeTab === tab ? 'border-purple-600 text-purple-600 bg-purple-600/5' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                {t(`tab_${tab}`)}
              </button>
            ))}
          </div>

          {/* SEKMELİ PANEL */}
          <div className="bg-white dark:bg-[#0f172a] p-10 rounded-b-4xl rounded-tr-4xl border border-slate-200 dark:border-white/5 shadow-xl min-h-112.5">
            {activeTab === 'details' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-6">
                <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] underline decoration-2 underline-offset-8 italic">
                  {t('description_title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                  {displayDescription}
                </p>
              </div>
            )}
            {activeTab === 'location' && (
              <div className="animate-in fade-in zoom-in duration-500 h-full">
                {listing.latitude && listing.longitude ? (
                  <div className="space-y-6">
                    <ListingMap
                      lat={Number(listing.latitude)}
                      lng={Number(listing.longitude)}
                      title={displayTitle}
                    />
                    <div className="flex items-center gap-3 text-slate-500 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                      <MapPin size={18} className="text-red-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {listing.addressText || t('address_not_provided')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 opacity-20 text-slate-500">
                    <MapPin size={64} />
                    <p className="font-black mt-4 uppercase tracking-widest">
                      {t('address_not_provided')}
                    </p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'specs' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-8 italic">
                  {t('tab_specs')}
                </h3>
                <SpecsTable
                  specs={listing.specs}
                  listingId={listing.id}
                  date={listing.createdAt}
                />
              </div>
            )}
          </div>
        </div>

        {/* SAĞ KOLON: TİCARİ BÖLÜM */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4 mb-8">
            <div className="flex gap-2">
              <span className="bg-purple-600/10 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border border-purple-600/20 italic">
                {t('listing_detail')}
              </span>
              <span
                className={`${listing.type === 'sale' ? 'bg-emerald-500' : 'bg-blue-600'} text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase shadow-lg`}
              >
                {listing.type === 'sale' ? t('for_sale') : t('for_rent')}
              </span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-tight text-slate-900 dark:text-white">
              {displayTitle}
            </h1>
          </div>

          {/* 🚀 🚀 🚀 TİCARİ MANTIK KULESİ 🚀 🚀 🚀 */}
          {isOwner ? (
            /* 1. DURUM: İLAN SİZİNSE */
            <div className="bg-slate-100 dark:bg-white/5 p-8 rounded-4xl border border-slate-200 dark:border-white/5 text-center shadow-inner">
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">
                BU İLAN SİZE AİT
              </p>
              {isOwner && (
                <Link
                  to={`/listing/${listing.id}/edit`}
                  className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/20 uppercase text-[10px] tracking-widest no-underline mb-4"
                >
                  <Edit3 size={16} />
                  İlanı Düzenle
                </Link>
              )}
              <p className="text-[40px] font-black text-slate-300 dark:text-slate-600 mt-2 italic">
                {Number(listing.price).toLocaleString()} ₺
              </p>
            </div>
          ) : listing.type === 'rent' && listing.isDaily === 'true' ? (
            /* 2. DURUM: GÜNLÜK KİRALIK (Takvim Modu) */
            <BookingCalendar
              listingId={listing.id}
              dailyPrice={Number(listing.price)}
              currency={listing.currency}
            />
          ) : (
            /* 3. DURUM: STANDART SATIŞ/KİRALAMA */
            <div className="bg-white dark:bg-[#0f172a] p-8 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl space-y-6">
              <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/5 pb-6">
                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                  {t('price')}
                </span>
                <span className="text-4xl font-black text-slate-900 dark:text-white italic">
                  {Number(listing.price).toLocaleString(
                    isTr ? 'tr-TR' : 'en-US',
                  )}
                  <span className="text-purple-600 text-xl ml-2">
                    {listing.currency}
                  </span>
                </span>
              </div>

              {listing.type === 'sale' && listing.isShippable === 'true' ? (
                <div className="flex gap-4 mt-6">
                  {/* SEPETE EKLE */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <ShoppingCart size={16} />
                  </button>
                  {/* FAVORİYE EKLE */}
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-4 rounded-2xl border transition-all ${
                      isFavorite
                        ? 'bg-red-500/10 border-red-500 text-red-500'
                        : 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-400'
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                  {/* HEMEN AL */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-[10px] cursor-pointer"
                  >
                    {t('buy_now_btn')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsMsgOpen(true)}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-5 rounded-2xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 uppercase tracking-widest text-[10px] cursor-pointer"
                >
                  {t('contact_seller')}
                </button>
              )}
            </div>
          )}

          {/* SATICI KARTI */}
          <SellerCard
            seller={listing.seller}
            onMessageClick={() => {
              if (isOwner) {
                alert('Bu ilan size ait!');
              } else {
                setIsMsgOpen(true);
              }
            }}
          />
        </div>
      </div>

      <MessageModal
        isOpen={isMsgOpen}
        onClose={() => setIsMsgOpen(false)}
        listingId={listing.id}
        receiverId={listing.sellerId!}
        listingTitle={displayTitle}
      />
    </div>
  );
}
