import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { CalendarDays, MapPin, Loader2, Info, ArrowRight } from 'lucide-react'; // 🚀 Hepsi artık kullanılıyor
import { format, differenceInDays } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
// 🚀 1. ADIM: Merkezi 'Booking' tipini içeri alalım (any hatasını bitirir)
import type { Booking } from '../../types/auth';

export default function MyBookingsPage() {
  const { t, i18n } = useTranslation();

  // 🚀 2. ADIM: any[] yerine Booking[] mühürlendi
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    axios
      .get<Booking[]>('http://localhost:5000/api/bookings/my-bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error('Rezervasyonlar çekilemedi:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white border-l-8 border-blue-600 pl-6 animate-in slide-in-from-left duration-500">
          {t('my_bookings')}
        </h1>

        <div className="grid gap-6">
          {bookings.length > 0 ? (
            bookings.map((book) => {
              const days = differenceInDays(
                new Date(book.endDate),
                new Date(book.startDate),
              );

              return (
                <div
                  key={book.id}
                  className="bg-white dark:bg-[#0f172a] p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-2xl flex flex-col md:flex-row gap-8 items-center group transition-all hover:border-blue-500/20 animate-in fade-in slide-in-from-bottom-4"
                >
                  {/* ÜRÜN RESMİ */}
                  <div className="w-full md:w-48 h-32 rounded-3xl overflow-hidden shadow-lg shrink-0">
                    {book.listing?.imageUrls &&
                    book.listing.imageUrls.length > 0 ? (
                      <img
                        src={book.listing.imageUrls[0]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt="Rental"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Info size={20} className="text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* REZERVASYON DETAYI */}
                  <div className="grow space-y-3 text-center md:text-left w-full">
                    <div>
                      <span className="bg-blue-600/10 text-blue-600 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                        {t('booking_id')}: #{book.id}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic mt-1 leading-tight">
                        {isTr
                          ? book.listing?.titleTr || book.listing?.title
                          : book.listing?.titleEn || book.listing?.title}
                      </h3>

                      {/* 🚀 3. ADIM: MapPin artık burada aktif görevde! (Adres bilgisini gösterir) */}
                      <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-slate-400">
                        <MapPin size={12} className="text-red-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-xs">
                          {book.listing?.addressText || 'Konum Belirtilmemiş'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#020617] px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                        <CalendarDays size={14} className="text-blue-500" />
                        <span>
                          {format(new Date(book.startDate), 'dd MMM yyyy', {
                            locale: isTr ? tr : enUS,
                          })}
                        </span>
                        <ArrowRight size={12} className="opacity-30" />
                        <span>
                          {format(new Date(book.endDate), 'dd MMM yyyy', {
                            locale: isTr ? tr : enUS,
                          })}
                        </span>
                      </div>
                      <span className="text-purple-600 uppercase tracking-widest font-black text-[10px]">
                        {days} {t('nights')}
                      </span>
                    </div>
                  </div>

                  {/* FİYAT VE DURUM */}
                  <div className="text-center md:text-right space-y-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-white/5 pt-4 md:pt-0 md:pl-8">
                    <p className="text-2xl font-black text-slate-900 dark:text-white italic">
                      {Number(book.totalPrice).toLocaleString(
                        isTr ? 'tr-TR' : 'en-US',
                      )}{' '}
                      ₺
                    </p>
                    <div className="bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                      {book.status === 'confirmed'
                        ? 'ONAYLANDI'
                        : 'İPTAL EDİLDİ'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* 🚀 4. ADIM: Info artık boş durum mesajında kullanılıyor! */
            <div className="py-40 text-center opacity-20 flex flex-col items-center gap-4 animate-pulse">
              <Info size={64} />
              <p className="font-black uppercase tracking-[0.4em] text-sm">
                {t('no_messages')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
