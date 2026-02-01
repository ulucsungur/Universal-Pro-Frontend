import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
// 🚀 TS Fix: Sadece 'tip' olanları 'type' ile ayırdık
import type { DateRange } from 'react-day-picker';
// 🚀 TS Fix: Kullanılmayan format ve addDays sildik
import { differenceInDays } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import 'react-day-picker/dist/style.css';

// 🚀 API'den gelecek verinin tipini tanımladık (any hatasını bitirir)
interface BookedDateResponse {
  startDate: string;
  endDate: string;
}

interface BookingCalendarProps {
  listingId: number;
  dailyPrice: number;
  currency: string;
}

export const BookingCalendar = ({
  listingId,
  dailyPrice,
  currency,
}: BookingCalendarProps) => {
  const { t, i18n } = useTranslation();
  const [range, setRange] = useState<DateRange | undefined>();
  const [bookedDates, setBookedDates] = useState<{ from: Date; to: Date }[]>(
    [],
  );

  const isTr = i18n.language.startsWith('tr');
  const dateLocale = isTr ? tr : enUS;

  useEffect(() => {
    // 🚀 TS Fix: axios.get<T> ile gelen verinin tipini belirttik
    axios
      .get<BookedDateResponse[]>(
        `http://localhost:5000/api/listings/${listingId}/booked-dates`,
      )
      .then((res) => {
        const dates = res.data.map((b) => ({
          from: new Date(b.startDate),
          to: new Date(b.endDate),
        }));
        setBookedDates(dates);
      })
      .catch((err) => console.error('Booked dates load error:', err));
  }, [listingId]);

  // Fiyat Hesapla
  const days =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
  const totalPrice = days * dailyPrice;

  return (
    <div className="bg-white dark:bg-[#0f172a] p-6 rounded-4xl border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 transition-colors duration-500">
      <div className="flex flex-col items-center">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={setRange}
          locale={dateLocale}
          disabled={bookedDates}
          fromDate={new Date()}
          className="border-none text-slate-900 dark:text-white"
        />
      </div>

      {range?.from && range?.to && (
        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between text-[10px] font-black border-t border-slate-100 dark:border-white/5 pt-6">
            <span className="text-slate-500 uppercase tracking-widest">
              {t('total_days')}
            </span>
            <span className="text-purple-600">
              {days} {isTr ? 'GÜN' : 'DAYS'}
            </span>
          </div>
          <div className="flex justify-between items-end pb-2">
            <span className="text-slate-500 font-black uppercase text-[9px] tracking-widest">
              {t('total_price')}
            </span>
            <span className="text-3xl font-black text-slate-900 dark:text-white italic">
              {totalPrice.toLocaleString(isTr ? 'tr-TR' : 'en-US')}
              <span className="text-purple-600 text-sm ml-2">{currency}</span>
            </span>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-purple-600/20 uppercase tracking-[0.2em] text-[10px] active:scale-95 cursor-pointer">
            {t('rent_now')}
          </button>
        </div>
      )}
    </div>
  );
};
