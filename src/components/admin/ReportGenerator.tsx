import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as htmlToImage from 'html-to-image';
//import { useTranslation } from 'react-i18next';
import type { AdminGlobalStats } from '../../types/admin';

interface ReportGeneratorProps {
  stats: AdminGlobalStats | null;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export const ReportGenerator = ({
  stats,
  contentRef,
}: ReportGeneratorProps) => {
  //const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // 🚀 Karakter Temizleme Yardımcısı (jsPDF Türkçe karakter hatasını bitirir)
  const safeText = (text: string) => {
    return text
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'I')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C');
  };

  const generatePDF = async (): Promise<void> => {
    if (!contentRef.current || !stats) return;
    setIsExporting(true);

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const date = new Date().toLocaleDateString();
      const pageWidth = doc.internal.pageSize.getWidth();

      // 1. Kurumsal Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(147, 51, 234);
      doc.text('UNIVERSAL MARKET PRO', 15, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(safeText(`KURUMSAL ANALIZ RAPORU | ${date}`), 15, 28);
      doc.line(15, 32, pageWidth - 15, 32);

      // 2. Özet Tablo (Türkçe Karakterleri Arındırdık)
      autoTable(doc, {
        startY: 40,
        head: [[safeText('Metrik Tanimi'), safeText('Deger')]],
        body: [
          [
            safeText('Toplam Platform Cirosu'),
            `${Number(stats.totalRevenue || 0).toLocaleString()} TL`,
          ],
          [safeText('Toplam Kullanici Sayisi'), stats.totalUsers.toString()],
          [safeText('Aktif Ilan Sayisi'), stats.totalListings.toString()],
          [safeText('Sistem Saglik Skoru'), `%${stats.health?.score || 0}`],
        ],
        headStyles: { fillColor: [147, 51, 234] },
        styles: { font: 'helvetica', fontSize: 10 },
        theme: 'striped',
      });

      // 🚀 3. KRİTİK: Grafiklerin yüklenmesi için 1 saniye bekletiyoruz (Animasyon Fix)
      // Animasyonların bitmesi için kısa bir es veriyoruz
      await new Promise((resolve) => setTimeout(resolve, 800));

      const dataUrl = await htmlToImage.toJpeg(contentRef.current, {
        quality: 1.0,
        backgroundColor: '#ffffff',
        pixelRatio: 2, // 🚀 Çözünürlüğü 2 katına çıkardık
      });

      // 4. Grafik Sayfası
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(147, 51, 234);
      doc.text(safeText('GRAFIKSEL ANALIZLER'), 15, 20);

      const imgWidth = pageWidth - 20;
      const imgHeight = 220; // 🚀 Sayfayı daha fazla kaplaması için boyutu artırdık

      doc.addImage(dataUrl, 'JPEG', 10, 30, imgWidth, imgHeight);

      doc.save(`MarketPro_Rapor_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF Rapor Hatası:', err);
      alert(
        'Hata oluştu. Lütfen grafiklerin ekranda görünür olduğundan emin olun.',
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isExporting}
      className="w-full bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
    >
      {isExporting ? (
        <>
          <Loader2 className="animate-spin" size={14} />{' '}
          {safeText('HAZIRLANIYOR')}
        </>
      ) : (
        <>
          <FileDown size={16} /> {safeText('KURUMSAL RAPOR AL')}
        </>
      )}
    </button>
  );
};
