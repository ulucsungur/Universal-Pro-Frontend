import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Truck,
  CheckCircle,
  Info,
  Star,
  XCircle,
  AlertTriangle,
  MapPin,
} from 'lucide-react';
import type { Order } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';

export default function MyOrdersPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isTr = i18n.language.startsWith('tr');

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get<Order[]>(
        'http://localhost:5000/api/orders/my-orders',
      );
      setOrders(res.data);
    } catch (err) {
      console.error('Sipariş çekme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, fetchOrders]);

  const cancelOrder = async (id: number) => {
    if (!window.confirm(t('confirm_cancel'))) return;
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}/cancel`, {
        reason: 'buyer',
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const sortedOrders = useMemo(() => {
    const statusWeight: Record<string, number> = {
      paid: 1,
      shipped: 2,
      delivered: 3,
      cancelled: 4,
      returned: 5,
    };
    return [...orders].sort(
      (a, b) => (statusWeight[a.status] || 99) - (statusWeight[b.status] || 99),
    );
  }, [orders]);

  const getStatusInfo = (order: Order) => {
    const createdDate = new Date(order.createdAt);
    const diffDays = Math.floor(
      (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const isLate = order.status === 'paid' && diffDays >= 3;

    switch (order.status) {
      case 'paid':
        return {
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          icon: <Package size={14} />,
          text: t('status_preparing'),
          late: isLate,
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
      case 'cancelled':
        return {
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          icon: <XCircle size={14} />,
          text: t('status_cancelled'),
        };
      default:
        return {
          color: 'text-slate-500',
          bg: 'bg-slate-500/10',
          icon: <Info size={14} />,
          text: order.status,
        };
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center italic font-black text-slate-500 uppercase tracking-widest">
        {t('loading')}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-20">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white border-l-8 border-purple-600 pl-6 animate-in slide-in-from-left duration-500">
          {t('my_orders')}
        </h1>

        <div className="grid gap-6">
          {sortedOrders.map((order) => {
            const status = getStatusInfo(order);
            const isCancelled = order.status === 'cancelled';
            // const isBuyerCancelled = order.canceledBy === 'buyer';

            return (
              <div
                key={order.id}
                className={`bg-white dark:bg-[#0f172a] p-8 rounded-[40px] border transition-all flex flex-col gap-6 shadow-xl ${isCancelled ? 'opacity-50 grayscale border-red-500/20' : 'border-slate-100 dark:border-white/5'}`}
              >
                {status.late && (
                  <div className="flex items-center gap-2 text-red-500 font-black text-[10px] animate-pulse uppercase tracking-widest">
                    <AlertTriangle size={14} /> {t('late_shipment_warning')}
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex gap-6 items-center">
                    <img
                      src={order.listing?.imageUrls?.[0]}
                      className="w-20 h-20 rounded-3xl object-cover"
                      alt="Product"
                    />
                    <div>
                      <h3 className="text-xl font-black dark:text-white uppercase italic">
                        {isTr ? order.listing?.titleTr : order.listing?.titleEn}
                      </h3>
                      <p className="text-purple-600 font-black mt-1">
                        {Number(order.totalPrice).toLocaleString(
                          isTr ? 'tr-TR' : 'en-US',
                        )}{' '}
                        ₺
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${status.bg} ${status.color}`}
                  >
                    {status.icon} {status.text}
                  </div>
                </div>

                {isCancelled && (
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-center">
                    <p className="text-red-500 font-black text-[10px] uppercase tracking-widest">
                      {/* 🚀 ALICI EKRANI MANTIĞI */}
                      {order.canceledBy === 'buyer'
                        ? t('cancelled_by_you')
                        : t('cancelled_by_other_seller')}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold mt-1">
                      {t('refund_notice')}
                    </p>
                  </div>
                )}

                {!isCancelled && order.address && (
                  <div className="flex items-center gap-2 text-slate-400 border-t border-slate-50 dark:border-white/5 pt-4">
                    <MapPin size={12} className="text-red-500" />
                    <span className="text-[9px] font-black uppercase">
                      Teslimat Adresi: {order.address.title}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-50 dark:border-white/5">
                  {order.status === 'paid' && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-[9px] font-black text-red-500 hover:bg-red-500 hover:text-white p-2 px-6 rounded-xl border border-red-500/20 uppercase active:scale-95 transition-all cursor-pointer"
                    >
                      <XCircle size={14} /> {t('cancel_order')}
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <div className="flex items-center gap-1 group cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className="text-slate-200 dark:text-slate-700 hover:text-amber-500 hover:fill-amber-500 transition-all"
                        />
                      ))}
                      <span className="text-[9px] font-black ml-3 text-purple-600 uppercase underline">
                        {t('how_was_product')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
