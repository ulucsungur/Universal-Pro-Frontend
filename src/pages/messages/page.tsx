import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { MessageSquare, User, Package, Loader2, Send } from 'lucide-react';
import type { Message } from '../../types/auth';
import { MessageModal } from '../../components/listing/MessageModal';
import { useAuth } from '../../hooks/useAuth';

export default function MyMessagesPage() {
  const { t, i18n } = useTranslation();
  const { refreshUnreadCount } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  const isTr = i18n.language.startsWith('tr');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const endpoint = activeTab === 'inbox' ? 'inbox' : 'sent';
    try {
      const res = await axios.get<Message[]>(
        `http://localhost:5000/api/messages/${endpoint}`,
      );
      setMessages(res.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // 🚀 OKUNDU YAPMA FONKSİYONU
  const markAsRead = async (msgId: number, currentStatus: string) => {
    if (activeTab === 'inbox' && currentStatus === 'false') {
      try {
        await axios.patch(`http://localhost:5000/api/messages/${msgId}/read`);

        // 1. Yerel listeyi güncelle
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, isRead: 'true' } : m)),
        );

        // 🚀 2. MERKEZİ SAYIYI GÜNCELLE (Navbar'daki kırmızı nokta anında değişir)
        refreshUnreadCount();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleReplyAction = (e: React.MouseEvent, msg: Message) => {
    e.stopPropagation(); // 🚀 Butona basınca arkadaki 'markAsRead' tetiklenmesin
    setSelectedMsg(msg);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* TAB SEÇİCİ */}
        <div className="flex gap-4 p-1.5 bg-white dark:bg-[#0f172a] w-fit rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'inbox' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-purple-600 hover:bg-white/5'}`}
          >
            {t('inbox')}
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer ${activeTab === 'sent' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-purple-600 hover:bg-white/5'}`}
          >
            {t('sent_messages')}
          </button>
        </div>

        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white border-l-8 border-purple-600 pl-6">
          {activeTab === 'inbox' ? t('inbox_title') : t('sent_messages')}
        </h1>

        <div className="grid gap-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="animate-spin text-purple-600" size={32} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {t('loading')}
              </span>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => {
              const listingTitle = isTr
                ? msg.listing?.titleTr || msg.listing?.title
                : msg.listing?.titleEn || msg.listing?.title;

              const isUnread = msg.isRead === 'false' && activeTab === 'inbox';

              return (
                <div
                  key={msg.id}
                  onClick={() => markAsRead(msg.id, msg.isRead)}
                  className={`group bg-white dark:bg-[#0f172a] p-6 rounded-4XLborder transition-all flex items-center gap-6 cursor-pointer ${
                    isUnread
                      ? 'border-purple-600 shadow-2xl shadow-purple-500/10 ring-2 ring-purple-600/20 translate-x-2'
                      : 'border-slate-200 dark:border-white/5 opacity-80 hover:opacity-100 hover:translate-x-1'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isUnread ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-[#020617] text-slate-400 group-hover:text-purple-400'}`}
                  >
                    {activeTab === 'inbox' ? (
                      <User size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                  </div>

                  <div className="grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${isUnread ? 'text-purple-600' : 'text-slate-400'}`}
                      >
                        {activeTab === 'inbox' ? t('sender') : t('to')}:
                      </span>
                      <span
                        className={`text-xs font-black dark:text-white uppercase ${isUnread ? 'scale-105 transition-transform' : ''}`}
                      >
                        {activeTab === 'inbox'
                          ? msg.sender?.fullName
                          : msg.receiver?.fullName}
                      </span>
                      {isUnread && (
                        <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full ml-2 animate-bounce shadow-lg">
                          {t('is_new')}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${isUnread ? 'font-black text-slate-900 dark:text-white' : 'font-medium text-slate-500'}`}
                    >
                      {msg.content}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-slate-400">
                      <Package size={12} />
                      <span className="uppercase tracking-tighter truncate max-w-62.5 italic">
                        {listingTitle}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[9px] font-bold text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </p>
                    {activeTab === 'inbox' && (
                      <button
                        onClick={(e) => handleReplyAction(e, msg)}
                        className="mt-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-xl text-purple-600 text-[9px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-sm active:scale-90"
                      >
                        {t('reply')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-32 text-center opacity-20 flex flex-col items-center gap-4">
              <MessageSquare size={64} />
              <p className="font-black uppercase tracking-widest text-sm">
                {t('no_messages')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REPLY MODAL */}
      {selectedMsg && (
        <MessageModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMsg(null);
            fetchMessages();
          }}
          listingId={selectedMsg.listingId}
          receiverId={selectedMsg.senderId}
          listingTitle={
            isTr
              ? selectedMsg.listing?.titleTr || selectedMsg.listing?.title || ''
              : selectedMsg.listing?.titleEn || selectedMsg.listing?.title || ''
          }
        />
      )}
    </div>
  );
}
