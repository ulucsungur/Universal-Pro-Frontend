import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import type { Order } from '../../types/auth';
import { Package, Truck, CheckCircle, Info } from 'lucide-react';

export default function MyOrdersPage() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true); // 🚀 Eklendi

  // 🚀 TS FIX: isTr artık fiyat formatında kullanılıyor
  const isTr = i18n.language.startsWith('tr');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/orders/my-orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Sipariş çekme hatası:', err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          icon: <Package size={14} />,
          text: t('status_paid'),
        };
      case 'shipped':
        return {
          color: 'text-amber-500',
          bg: 'bg-amber-500/10',
          icon: <Truck size={14} />,
          text: t('status_shipped'),
        };
      case 'delivered':
        return {
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          icon: <CheckCircle size={14} />,
          text: t('status_delivered'),
        };
      default:
        return {
          color: 'text-slate-500',
          bg: 'bg-slate-500/10',
          icon: <Package size={14} />,
          text: status,
        };
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center text-slate-500 font-black uppercase tracking-widest">
        {t('loading')}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20 transition-colors duration-500">
      <div className="max-w-200 mx-auto space-y-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
          {t('my_orders')}
        </h1>

        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => {
              const status = getStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl flex gap-6 items-center animate-in slide-in-from-bottom-2"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {order.listing?.imageUrls && (
                      <img
                        src={order.listing.imageUrls[0]}
                        className="w-full h-full object-cover"
                        alt="Product"
                      />
                    )}
                  </div>

                  <div className="grow">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {t('order_id')}: #{order.id}
                    </p>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase truncate max-w-xs">
                      {order.listing?.title}
                    </h3>
                    {/* 🚀 isTr burada kullanılarak hata bitirildi */}
                    <p className="text-purple-600 font-black text-sm mt-1">
                      {Number(order.totalPrice).toLocaleString(
                        isTr ? 'tr-TR' : 'en-US',
                      )}{' '}
                      ₺
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${status.bg} ${status.color}`}
                  >
                    {status.icon}
                    {status.text}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
              <Info size={48} />
              <p className="font-black uppercase tracking-widest text-xs">
                Henüz bir siparişiniz bulunmuyor
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
