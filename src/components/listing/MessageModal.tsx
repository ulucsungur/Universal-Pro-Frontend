import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: number;
  receiverId: number;
  listingTitle: string;
}

export const MessageModal = ({
  isOpen,
  onClose,
  listingId,
  receiverId,
  listingTitle,
}: MessageModalProps) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/messages', {
        listingId,
        receiverId,
        content,
      });
      setSent(true);
      setTimeout(() => {
        onClose();
        setSent(false);
        setContent('');
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Mesaj iletilemedi.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0f172a] rounded-[40px] border border-white/10 p-10 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-all cursor-pointer"
        >
          <X size={20} />
        </button>

        {sent ? (
          <div className="py-10 text-center space-y-4 animate-in zoom-in">
            <CheckCircle2 size={60} className="mx-auto text-green-500" />
            <h2 className="text-2xl font-black text-white italic uppercase">
              {t('message_sent_success')}
            </h2>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-white italic uppercase mb-2">
              {t('send_message_title')}
            </h2>
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
              {listingTitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('message_placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm outline-none focus:border-purple-600 h-40 resize-none transition-all"
              />
              <button
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-50 cursor-pointer transition-all active:scale-95"
              >
                <Send size={16} /> {loading ? '...' : t('send_message')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
