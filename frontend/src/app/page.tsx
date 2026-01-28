"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { X, Loader2, ArrowRight, Clock, RefreshCcw, Calendar, Globe, Sun, Moon, History } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import clsx from "clsx";

const translations = {
  en: {
    tagline: "Balance • Strength • Control",
    bookBtn: "Book a Session",
    historyBtn: "History",
    resetBtn: "Reset System",
    quote: '"Physical fitness is the first requisite of happiness."',
    recentActivity: "Recent Activity",
    yourBookings: "Your Bookings",
    sessionHistory: "Recent session history",
    noBookings: "No bookings found",
    bookFirst: "Book your first session",
    resetConfirm: "Reset all system data?",
    resetComplete: "System reset complete.",
    resetError: "Error resetting.",
    viewHistory: "View History",
    historyTitle: "Booking History",
    stepDate: "Date",
    stepTime: "Time",
    stepRoom: "Studio"
  },
  id: {
    tagline: "Keseimbangan • Kekuatan • Kontrol",
    bookBtn: "Pesan Sesi",
    historyBtn: "Riwayat",
    resetBtn: "Reset Sistem",
    quote: '"Kebugaran fisik adalah syarat utama kebahagiaan."',
    recentActivity: "Aktivitas Terbaru",
    yourBookings: "Pesanan Anda",
    sessionHistory: "Riwayat sesi terbaru",
    noBookings: "Tidak ada pesanan",
    bookFirst: "Pesan sesi pertama Anda",
    resetConfirm: "Reset semua data sistem?",
    resetComplete: "Reset sistem selesai.",
    resetError: "Gagal melakukan reset.",
    viewHistory: "Lihat Riwayat",
    historyTitle: "Riwayat Pemesanan",
    stepDate: "Tanggal",
    stepTime: "Waktu",
    stepRoom: "Studio"
  }
};

export default function Home() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{date: string, time: string, studio: string}[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('lang') as 'en' | 'id';
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'id' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = translations[lang];

  const fetchHistory = () => {
    setLoadingHistory(true);
    fetch('https://larithmic-sina-nondigestible.ngrok-free.dev/api/bookings', { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then(res => res.json())
      .then(data => {
        setHistory(data || []);
        setLoadingHistory(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingHistory(false);
      });
  };

  const handleReset = async () => {
    if (!confirm(t.resetConfirm)) return;
    setResetting(true);
    try {
      await fetch('https://larithmic-sina-nondigestible.ngrok-free.dev/api/reset', { method: 'POST', headers: { 'ngrok-skip-browser-warning': 'true' } });
      setHistory([]);
      alert(t.resetComplete);
    } catch {
      alert(t.resetError);
    } finally {
      setResetting(false);
    }
  };

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      router.push('/book');
    }, 300);
  };

  return (
    <div className={clsx(
        "relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-theme text-theme transition-all duration-300",
        isExiting ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
    )}>
      
      <main className="w-full max-w-md z-10 flex flex-col items-center text-center">
        
        {/* Controls (Integrated) */}
        <div className="mb-12 flex gap-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-card-theme border border-theme rounded-full text-muted-theme hover:text-theme transition-all shadow-sm"
          >
            {mounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1 bg-card-theme border border-theme rounded-full text-[10px] font-bold text-muted-theme hover:text-theme transition-all shadow-sm uppercase tracking-widest"
          >
            <Globe className="w-3 h-3" />
            <span>{lang === 'en' ? 'English' : 'Indonesia'}</span>
          </button>
        </div>

        {/* Logo / Brand */}
        <div className="mb-8 space-y-2 group cursor-default animate-zoom-in">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter transition-all duration-500 group-hover:tracking-normal">
              diro<span className="font-light opacity-50">pilates</span>
            </h1>
            <p className="text-sm md:text-base text-muted-theme font-medium tracking-wide uppercase opacity-80 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t.tagline}
            </p>
        </div>

        {/* Primary Action */}
        <div className="w-full space-y-4 mt-8 animate-slide-up" style={{ animationDelay: '600ms' }}>
          <Link 
            href="/book"
            onClick={handleBookClick}
            className="group relative w-full h-14 flex items-center justify-center gap-3 bg-accent text-white rounded-2xl text-lg font-medium transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/10 hover:shadow-accent/20"
          >
            <span>{t.bookBtn}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setShowHistory(true); fetchHistory(); }}
              className="h-12 flex items-center justify-center gap-2 bg-card-theme border border-theme text-muted-theme rounded-xl text-sm font-medium hover:text-theme hover:bg-theme hover:border-accent/30 transition-all shadow-sm"
            >
              <Clock className="w-4 h-4" />
              {t.historyBtn}
            </button>
            <button 
              onClick={handleReset}
              disabled={resetting}
              className="h-12 flex items-center justify-center gap-2 bg-card-theme border border-theme text-muted-theme rounded-xl text-sm font-medium hover:border-red-500/30 hover:text-red-600 hover:bg-red-50/10 transition-all shadow-sm disabled:opacity-50"
            >
              {resetting ? <Loader2 className="w-4 h-4 animate-spin"/> : <RefreshCcw className="w-4 h-4 transition-transform hover:rotate-180 duration-500" />}
              {t.resetBtn}
            </button>
          </div>
        </div>

        {/* Footer/Quote */}
        <div className="mt-16 opacity-30">
           <p className="text-xs font-serif italic">
             {t.quote}
           </p>
        </div>
      </main>

      {/* Elegant History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
            <div className="w-full sm:max-w-md bg-card-theme sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-10 duration-300">
                
                {/* Modal Header */}
                <div className="p-6 pb-4 flex justify-between items-center border-b border-theme">
                    <div>
                        <h3 className="font-bold text-lg">{t.yourBookings}</h3>
                        <p className="text-xs text-muted-theme">{t.sessionHistory}</p>
                    </div>
                    <button 
                        onClick={() => setShowHistory(false)} 
                        className="bg-theme p-2 rounded-full hover:bg-theme/80 transition-colors text-muted-theme"
                    >
                      <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Modal Content */}
                <div className="overflow-y-auto p-4 flex-1 bg-theme/30">
                    {loadingHistory ? (
                      <div className="flex justify-center py-16"><Loader2 className="animate-spin w-6 h-6 text-muted-theme/30"/></div>
                    ) : history.length === 0 ? (
                        <div className="py-16 text-center">
                            <Calendar className="w-12 h-12 text-muted-theme/20 mx-auto mb-3" />
                            <p className="text-muted-theme text-sm">{t.noBookings}</p>
                            <button onClick={() => { setShowHistory(false); }} className="mt-4 text-xs font-medium underline underline-offset-4">
                                {t.bookFirst}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((h, i) => (
                                <div key={i} className="bg-card-theme p-4 rounded-2xl border border-theme shadow-sm flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-theme text-theme border border-theme flex items-center justify-center text-[10px] font-bold">
                                            {h.studio.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{h.date}</div>
                                            <div className="text-xs text-muted-theme">{h.time || 'Unknown Time'} • {h.studio || 'Unknown Studio'}</div>
                                        </div>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}